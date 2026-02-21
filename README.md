# Hydro Gen 🌊⚡

Plataforma de IA para consulta sobre Hidrogênio Verde no Ceará.

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND (Next.js)                       │
│  ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌────────┐  │
│  │Assistente│ │  Simulação   │ │Dashboard │ │  Docs  │  │
│  └────┬─────┘ └──────┬───────┘ └────┬─────┘ └───┬────┘  │
└───────┼──────────────┼──────────────┼───────────┼───────┘
        │              │              │           │
────────┼──────────────┼──────────────┼───────────┼────────
                    API Gateway (FastAPI)
────────┼──────────────┼──────────────┼───────────┼────────
        │              │              │           │
┌───────┼──────────────┼──────────────┼───────────┼───────┐
│       ▼              ▼              ▼           ▼       │
│  ┌─────────┐   ┌──────────┐  ┌──────────┐ ┌──────────┐  │
│  │   RAG   │   │Simulation│  │Analytics │ │ Document │  │
│  │ Engine  │   │  Engine  │  │ Service  │ │ Service  │  │
│  └────┬────┘   └────┬─────┘  └────┬─────┘ └────┬─────┘  │
│       │             │             │            │        │
│  ┌────┴─────────────┴─────────────┴────────────┴────┐   │
│  │          Qdrant (Vector DB)                      │   │
│  │          PostgreSQL (dados estruturados)         │   │
│  │          Redis (cache)                           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** FastAPI (Python 3.11+)
- **RAG:** LangChain + OpenAI GPT-4o
- **Vector DB:** Qdrant
- **Database:** PostgreSQL 16
- **Cache:** Redis

## Quick Start

```bash
# Subir infraestrutura
docker compose up -d

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Estrutura

```
hydro-gen/
├── frontend/          # Next.js app
├── backend/           # FastAPI app
├── docs/              # Documentação adicional
├── docker-compose.yml # Infraestrutura
└── README.md
```

## Licença

Propriedade de Germanno Teles - Programa Centelha Ceará
