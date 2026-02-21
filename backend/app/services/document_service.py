"""
Document Service - handles document ingestion and management
"""
import hashlib
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.models.document import Document, DocumentType
from app.services.rag_service import rag_service


class DocumentService:
    """Service for document management and ingestion"""
    
    @staticmethod
    def compute_hash(content: str) -> str:
        """Compute SHA256 hash of content"""
        return hashlib.sha256(content.encode()).hexdigest()
    
    @staticmethod
    async def create_document(
        db: AsyncSession,
        title: str,
        content: str,
        source: str,
        doc_type: DocumentType,
        url: Optional[str] = None,
        date: Optional[str] = None,
        author: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Document:
        """Create and index a new document"""
        
        content_hash = DocumentService.compute_hash(content)
        
        # Check if document already exists
        existing = await db.execute(
            select(Document).where(Document.content_hash == content_hash)
        )
        if existing.scalar_one_or_none():
            raise ValueError("Documento já existe na base de dados")
        
        # Create document record
        document = Document(
            title=title,
            content=content,
            content_hash=content_hash,
            source=source,
            type=doc_type,
            url=url,
            date=date,
            author=author,
            description=description,
        )
        
        db.add(document)
        await db.commit()
        await db.refresh(document)
        
        # Index in vector database
        chunk_count = await rag_service.index_document(
            doc_id=document.id,
            title=title,
            content=content,
            source=source,
            doc_type=doc_type.value,
            date=date,
        )
        
        # Update document with indexing info
        document.chunk_count = chunk_count
        document.is_indexed = True
        document.indexed_at = datetime.utcnow()
        await db.commit()
        
        return document
    
    @staticmethod
    async def get_all_documents(
        db: AsyncSession,
        doc_type: Optional[DocumentType] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Document]:
        """Get all documents with optional filtering"""
        
        query = select(Document)
        
        if doc_type:
            query = query.where(Document.type == doc_type)
        
        if search:
            query = query.where(Document.title.ilike(f"%{search}%"))
        
        query = query.offset(skip).limit(limit).order_by(Document.created_at.desc())
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def get_document(db: AsyncSession, doc_id: int) -> Optional[Document]:
        """Get a specific document by ID"""
        result = await db.execute(select(Document).where(Document.id == doc_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def delete_document(db: AsyncSession, doc_id: int) -> bool:
        """Delete a document and its vectors"""
        document = await DocumentService.get_document(db, doc_id)
        if not document:
            return False
        
        # Delete from vector database
        await rag_service.delete_document(doc_id)
        
        # Delete from database
        await db.delete(document)
        await db.commit()
        
        return True
    
    @staticmethod
    async def get_stats(db: AsyncSession) -> dict:
        """Get document statistics"""
        result = await db.execute(select(Document))
        documents = result.scalars().all()
        
        total = len(documents)
        indexed = sum(1 for d in documents if d.is_indexed)
        total_chunks = sum(d.chunk_count for d in documents)
        
        # Count by type
        by_type = {}
        for doc in documents:
            t = doc.type.value if doc.type else "Outros"
            by_type[t] = by_type.get(t, 0) + 1
        
        return {
            "total_documents": total,
            "indexed_documents": indexed,
            "total_chunks": total_chunks,
            "by_type": by_type,
        }
