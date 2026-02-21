"""
Hydro Gen - API Backend
Plataforma de IA para consulta sobre Hidrogênio Verde no Ceará
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import chat, documents, simulation, analytics, auth
from app.core.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="Hydro Gen API",
    description="API para consulta de dados sobre Hidrogênio Verde no Ceará via RAG",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(chat.router, prefix="/api/chat", tags=["Assistente RAG"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documentos"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulação"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])


@app.get("/")
async def root():
    return {
        "name": "Hydro Gen API",
        "version": "0.1.0",
        "status": "online",
        "description": "Plataforma de IA para H2V no Ceará"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
