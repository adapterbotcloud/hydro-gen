"""
RAG Service - Core AI functionality
Retrieval Augmented Generation for H2V queries
"""
import time
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import ChatPromptTemplate

from app.core.config import settings


class RAGService:
    """Service for RAG-based question answering about H2V in Ceará"""
    
    SYSTEM_PROMPT = """Você é o assistente virtual do Hydro Gen, uma plataforma especializada em 
Hidrogênio Verde (H2V) no Ceará. Seu papel é responder perguntas sobre legislação, 
dados socioeconômicos, ambientais e regulatórios relacionados ao H2V no estado.

REGRAS IMPORTANTES:
1. Use EXCLUSIVAMENTE as informações fornecidas no contexto abaixo
2. Se a informação não estiver no contexto, diga claramente que não possui dados sobre o assunto
3. Sempre cite as fontes das informações quando disponíveis
4. Seja objetivo e técnico, mas acessível
5. Quando relevante, mencione números, datas e referências específicas

CONTEXTO DOS DOCUMENTOS:
{context}

Responda à pergunta do usuário de forma fundamentada, citando as fontes."""

    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
        )
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.3,
        )
        self.qdrant = QdrantClient(url=settings.QDRANT_URL)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
        # Ensure collection exists
        self._init_collection()
    
    def _init_collection(self):
        """Initialize Qdrant collection if not exists"""
        try:
            collections = self.qdrant.get_collections()
            collection_names = [c.name for c in collections.collections]
            
            if settings.QDRANT_COLLECTION not in collection_names:
                self.qdrant.create_collection(
                    collection_name=settings.QDRANT_COLLECTION,
                    vectors_config=VectorParams(
                        size=1536,  # OpenAI embedding dimension
                        distance=Distance.COSINE
                    )
                )
        except Exception as e:
            print(f"Warning: Could not initialize Qdrant collection: {e}")
    
    async def index_document(
        self,
        doc_id: int,
        title: str,
        content: str,
        source: str,
        doc_type: str,
        date: Optional[str] = None
    ) -> int:
        """
        Index a document into the vector database
        Returns: number of chunks indexed
        """
        # Split into chunks
        chunks = self.text_splitter.split_text(content)
        
        if not chunks:
            return 0
        
        # Generate embeddings
        embeddings = self.embeddings.embed_documents(chunks)
        
        # Create points for Qdrant
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point = PointStruct(
                id=doc_id * 10000 + i,  # Unique ID per chunk
                vector=embedding,
                payload={
                    "document_id": doc_id,
                    "chunk_index": i,
                    "title": title,
                    "source": source,
                    "type": doc_type,
                    "date": date,
                    "content": chunk,
                }
            )
            points.append(point)
        
        # Upsert to Qdrant
        self.qdrant.upsert(
            collection_name=settings.QDRANT_COLLECTION,
            points=points
        )
        
        return len(chunks)
    
    async def search(self, query: str, top_k: int = None) -> List[Dict[str, Any]]:
        """
        Semantic search in the document base
        """
        top_k = top_k or settings.TOP_K_RESULTS
        
        # Generate query embedding
        query_embedding = self.embeddings.embed_query(query)
        
        # Search in Qdrant
        results = self.qdrant.search(
            collection_name=settings.QDRANT_COLLECTION,
            query_vector=query_embedding,
            limit=top_k
        )
        
        # Format results
        formatted = []
        for result in results:
            formatted.append({
                "content": result.payload.get("content", ""),
                "title": result.payload.get("title", ""),
                "source": result.payload.get("source", ""),
                "type": result.payload.get("type", ""),
                "date": result.payload.get("date", ""),
                "score": result.score,
                "document_id": result.payload.get("document_id"),
            })
        
        return formatted
    
    async def answer(self, question: str) -> Dict[str, Any]:
        """
        Answer a question using RAG
        """
        start_time = time.time()
        
        # Search for relevant context
        search_results = await self.search(question)
        
        if not search_results:
            return {
                "response": "Desculpe, não encontrei informações relevantes na base de dados sobre esse assunto. Por favor, reformule sua pergunta ou consulte diretamente as fontes oficiais.",
                "sources": [],
                "response_time_ms": int((time.time() - start_time) * 1000),
            }
        
        # Build context from search results
        context_parts = []
        sources = []
        seen_sources = set()
        
        for result in search_results:
            context_parts.append(f"[{result['title']}]\n{result['content']}")
            
            source_key = f"{result['title']}|{result['source']}"
            if source_key not in seen_sources:
                sources.append({
                    "title": result["title"],
                    "source": result["source"],
                    "type": result["type"],
                    "date": result["date"],
                })
                seen_sources.add(source_key)
        
        context = "\n\n---\n\n".join(context_parts)
        
        # Create prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.SYSTEM_PROMPT),
            ("human", "{question}")
        ])
        
        # Generate response
        chain = prompt | self.llm
        response = await chain.ainvoke({
            "context": context,
            "question": question
        })
        
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        return {
            "response": response.content,
            "sources": sources,
            "response_time_ms": elapsed_ms,
        }
    
    async def delete_document(self, doc_id: int):
        """Delete all chunks of a document from the vector database"""
        # Delete points with matching document_id
        self.qdrant.delete(
            collection_name=settings.QDRANT_COLLECTION,
            points_selector={
                "filter": {
                    "must": [
                        {"key": "document_id", "match": {"value": doc_id}}
                    ]
                }
            }
        )
    
    def get_stats(self) -> Dict[str, Any]:
        """Get collection statistics"""
        try:
            info = self.qdrant.get_collection(settings.QDRANT_COLLECTION)
            return {
                "total_vectors": info.points_count,
                "status": info.status.value,
            }
        except Exception:
            return {"total_vectors": 0, "status": "unknown"}


# Singleton instance
rag_service = RAGService()
