"""
Query model - stores chat interactions
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Float, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Query(Base):
    __tablename__ = "queries"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    
    # Query content
    question: Mapped[str] = mapped_column(Text)
    response: Mapped[str] = mapped_column(Text)
    
    # Sources used (JSON array of document references)
    sources: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Metrics
    response_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Feedback
    feedback_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)  # 1-5
    feedback_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship(back_populates="queries")
