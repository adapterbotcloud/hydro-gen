"""
Document model
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column
import enum

from app.core.database import Base


class DocumentType(str, enum.Enum):
    LEGISLACAO = "Legislação"
    RELATORIO = "Relatório"
    REGULACAO = "Regulação"
    DADOS = "Dados"
    ESTUDO = "Estudo"
    OUTROS = "Outros"


class Document(Base):
    __tablename__ = "documents"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500))
    type: Mapped[DocumentType] = mapped_column(Enum(DocumentType), default=DocumentType.OUTROS)
    source: Mapped[str] = mapped_column(String(255))  # Ex: ANEEL, IPECE, Governo do Ceará
    url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    
    # Content
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_hash: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)  # SHA256
    
    # Metadata
    date: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # Ex: 2024
    author: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Processing status
    chunk_count: Mapped[int] = mapped_column(Integer, default=0)
    is_indexed: Mapped[bool] = mapped_column(default=False)
    
    # Timestamps
    indexed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
