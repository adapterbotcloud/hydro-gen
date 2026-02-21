"""
Chat API - RAG-based assistant endpoint
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.rag_service import rag_service
from app.models.query import Query


router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "Qual a legislação vigente sobre H2V no Ceará?"
            }
        }


class SourceInfo(BaseModel):
    title: str
    source: str
    type: str
    date: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[SourceInfo]
    response_time_ms: int


class FeedbackRequest(BaseModel):
    query_id: int
    score: int  # 1-5
    text: Optional[str] = None


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Send a question to the RAG assistant.
    Returns an answer based on the indexed documents about H2V in Ceará.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Pergunta não pode estar vazia")
    
    # Get answer from RAG service
    result = await rag_service.answer(request.question)
    
    # Save query to database
    query = Query(
        question=request.question,
        response=result["response"],
        sources={"sources": [s for s in result["sources"]]},
        response_time_ms=result["response_time_ms"],
    )
    db.add(query)
    await db.commit()
    
    return ChatResponse(
        response=result["response"],
        sources=[SourceInfo(**s) for s in result["sources"]],
        response_time_ms=result["response_time_ms"],
    )


@router.post("/feedback")
async def submit_feedback(
    request: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Submit feedback for a query response.
    Score: 1 (poor) to 5 (excellent)
    """
    from sqlalchemy import select
    
    result = await db.execute(select(Query).where(Query.id == request.query_id))
    query = result.scalar_one_or_none()
    
    if not query:
        raise HTTPException(status_code=404, detail="Query não encontrada")
    
    query.feedback_score = request.score
    query.feedback_text = request.text
    await db.commit()
    
    return {"status": "ok", "message": "Feedback registrado com sucesso"}


@router.get("/suggestions")
async def get_suggestions():
    """
    Get sample questions to help users get started.
    """
    return {
        "suggestions": [
            "Qual a legislação vigente sobre H2V no Ceará?",
            "Quais os impactos socioeconômicos do hub de Pecém?",
            "Compare cenários de investimento em eólica vs solar para H2V",
            "Dados de empregabilidade na cadeia de energia renovável",
            "Quais incentivos fiscais existem para empresas de H2V?",
            "Qual a capacidade de produção de hidrogênio verde projetada?",
        ]
    }
