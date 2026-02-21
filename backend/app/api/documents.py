"""
Documents API - document management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query as QueryParam
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
import PyPDF2
import io

from app.core.database import get_db
from app.services.document_service import DocumentService
from app.models.document import DocumentType


router = APIRouter()


class DocumentCreate(BaseModel):
    title: str
    content: str
    source: str
    type: str = "Outros"
    url: Optional[str] = None
    date: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None


class DocumentResponse(BaseModel):
    id: int
    title: str
    type: str
    source: str
    url: Optional[str]
    date: Optional[str]
    chunk_count: int
    is_indexed: bool
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
    total: int


class StatsResponse(BaseModel):
    total_documents: int
    indexed_documents: int
    total_chunks: int
    by_type: dict


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    type: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List all documents with optional filtering"""
    
    doc_type = None
    if type and type != "Todos":
        try:
            doc_type = DocumentType(type)
        except ValueError:
            pass
    
    documents = await DocumentService.get_all_documents(
        db, doc_type=doc_type, search=search, skip=skip, limit=limit
    )
    
    return DocumentListResponse(
        documents=[
            DocumentResponse(
                id=d.id,
                title=d.title,
                type=d.type.value if d.type else "Outros",
                source=d.source,
                url=d.url,
                date=d.date,
                chunk_count=d.chunk_count,
                is_indexed=d.is_indexed,
            )
            for d in documents
        ],
        total=len(documents),
    )


@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Get document statistics"""
    stats = await DocumentService.get_stats(db)
    return StatsResponse(**stats)


@router.get("/{doc_id}")
async def get_document(
    doc_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific document by ID"""
    document = await DocumentService.get_document(db, doc_id)
    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    return {
        "id": document.id,
        "title": document.title,
        "type": document.type.value if document.type else "Outros",
        "source": document.source,
        "url": document.url,
        "date": document.date,
        "author": document.author,
        "description": document.description,
        "content": document.content[:2000] + "..." if len(document.content or "") > 2000 else document.content,
        "chunk_count": document.chunk_count,
        "is_indexed": document.is_indexed,
        "indexed_at": document.indexed_at,
        "created_at": document.created_at,
    }


@router.post("", response_model=DocumentResponse)
async def create_document(
    document: DocumentCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create and index a new document"""
    
    try:
        doc_type = DocumentType(document.type)
    except ValueError:
        doc_type = DocumentType.OUTROS
    
    try:
        doc = await DocumentService.create_document(
            db=db,
            title=document.title,
            content=document.content,
            source=document.source,
            doc_type=doc_type,
            url=document.url,
            date=document.date,
            author=document.author,
            description=document.description,
        )
        
        return DocumentResponse(
            id=doc.id,
            title=doc.title,
            type=doc.type.value,
            source=doc.source,
            url=doc.url,
            date=doc.date,
            chunk_count=doc.chunk_count,
            is_indexed=doc.is_indexed,
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    source: str = "Upload",
    type: str = "Outros",
    date: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Upload and index a PDF document"""
    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são aceitos")
    
    # Extract text from PDF
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar PDF: {str(e)}")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Não foi possível extrair texto do PDF")
    
    # Create document
    try:
        doc_type = DocumentType(type)
    except ValueError:
        doc_type = DocumentType.OUTROS
    
    try:
        doc = await DocumentService.create_document(
            db=db,
            title=title or file.filename,
            content=text,
            source=source,
            doc_type=doc_type,
            date=date,
        )
        
        return {
            "id": doc.id,
            "title": doc.title,
            "chunk_count": doc.chunk_count,
            "message": f"Documento indexado com sucesso ({doc.chunk_count} chunks)"
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a document and its vectors"""
    success = await DocumentService.delete_document(db, doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    return {"status": "ok", "message": "Documento removido com sucesso"}
