"""
Analytics API - usage metrics and monitoring
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.document import Document
from app.models.query import Query
from app.models.simulation import Simulation
from app.services.rag_service import rag_service


router = APIRouter()


@router.get("")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """
    Get system analytics and metrics.
    """
    # Document stats
    doc_result = await db.execute(select(Document))
    documents = doc_result.scalars().all()
    total_docs = len(documents)
    total_chunks = sum(d.chunk_count for d in documents)
    
    # Query stats
    query_result = await db.execute(select(Query))
    queries = query_result.scalars().all()
    total_queries = len(queries)
    
    # Queries in last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_queries = [q for q in queries if q.created_at > week_ago]
    
    # Average response time
    response_times = [q.response_time_ms for q in queries if q.response_time_ms]
    avg_response_time = sum(response_times) / len(response_times) if response_times else 0
    
    # Feedback stats
    feedback_scores = [q.feedback_score for q in queries if q.feedback_score]
    avg_satisfaction = sum(feedback_scores) / len(feedback_scores) if feedback_scores else 0
    
    # Simulation stats
    sim_result = await db.execute(select(Simulation))
    simulations = sim_result.scalars().all()
    
    # Vector DB stats
    vector_stats = rag_service.get_stats()
    
    # Sources by type
    sources = {}
    for doc in documents:
        t = doc.type.value if doc.type else "Outros"
        sources[t] = sources.get(t, 0) + 1
    
    return {
        "documents": {
            "total": total_docs,
            "chunks": total_chunks,
            "by_type": sources,
        },
        "queries": {
            "total": total_queries,
            "last_7_days": len(recent_queries),
            "avg_response_time_ms": round(avg_response_time),
        },
        "simulations": {
            "total": len(simulations),
        },
        "satisfaction": {
            "average_score": round(avg_satisfaction, 1),
            "total_feedback": len(feedback_scores),
        },
        "vector_db": vector_stats,
        "system": {
            "status": "online",
            "uptime_percent": 99.7,  # Placeholder
        }
    }


@router.get("/recent-queries")
async def get_recent_queries(
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Get recent queries"""
    result = await db.execute(
        select(Query)
        .order_by(Query.created_at.desc())
        .limit(limit)
    )
    queries = result.scalars().all()
    
    return {
        "queries": [
            {
                "id": q.id,
                "question": q.question[:100] + "..." if len(q.question) > 100 else q.question,
                "response_time_ms": q.response_time_ms,
                "feedback_score": q.feedback_score,
                "created_at": q.created_at.isoformat(),
            }
            for q in queries
        ]
    }


@router.get("/performance")
async def get_performance(db: AsyncSession = Depends(get_db)):
    """Get performance metrics"""
    result = await db.execute(select(Query))
    queries = result.scalars().all()
    
    # Response time analysis
    response_times = [q.response_time_ms for q in queries if q.response_time_ms]
    
    if response_times:
        avg_time = sum(response_times) / len(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        p95 = sorted(response_times)[int(len(response_times) * 0.95)] if len(response_times) > 1 else avg_time
    else:
        avg_time = min_time = max_time = p95 = 0
    
    # Feedback analysis
    feedback_scores = [q.feedback_score for q in queries if q.feedback_score]
    
    return {
        "response_time": {
            "average_ms": round(avg_time),
            "min_ms": min_time,
            "max_ms": max_time,
            "p95_ms": p95,
            "target_ms": 5000,
            "meets_target": avg_time < 5000,
        },
        "satisfaction": {
            "average": round(sum(feedback_scores) / len(feedback_scores), 1) if feedback_scores else 0,
            "target": 4.0,
            "meets_target": (sum(feedback_scores) / len(feedback_scores) if feedback_scores else 0) >= 4.0,
        },
        "total_queries": len(queries),
    }
