"""
Simulation model - stores scenario simulations
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Integer, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Simulation(Base):
    __tablename__ = "simulations"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    
    # Input parameters (JSON)
    # Example: {"investimento": 500, "localizacao": "Pecém", "fonteEnergia": "Eólica", "capacidade": 200}
    params: Mapped[dict] = mapped_column(JSON)
    
    # Results (JSON)
    # Example: {"empregos": 57000, "pib": 4.8, "co2Reduzido": 1008, ...}
    results: Mapped[dict] = mapped_column(JSON)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship(back_populates="simulations")
