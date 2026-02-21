# Hydro Gen - Deployment

## 🌐 URLs de Produção

| Serviço | URL |
|---------|-----|
| **Frontend** | https://hydro.adapterbot.cloud |
| **Backend API** | https://hydro-api.adapterbot.cloud |
| **API Docs** | https://hydro-api.adapterbot.cloud/docs |

## 🏗️ Infraestrutura

**Servidor:** srv1310208 (mesmo do Quiz Rumo ao Prático)

### Serviços Docker:

| Container | Porta | Descrição |
|-----------|-------|-----------|
| hydro-frontend | 3002 | Next.js App |
| hydro-backend | 8001 | FastAPI |
| hydro-qdrant | 6333 | Vector DB |
| hydro-postgres | 5434 | PostgreSQL |
| hydro-redis | 6380 | Cache |

## 🚀 Deploy

```bash
# No servidor
cd /root/hydro-gen-docker

# Rebuild e restart
docker compose down
docker compose build
docker compose up -d

# Ver logs
docker compose logs -f

# Ver status
docker compose ps
```

## 🔧 Configuração Nginx

O Nginx faz proxy reverso:
- `hydro.adapterbot.cloud` → localhost:3002 (frontend)
- `hydro-api.adapterbot.cloud` → localhost:8001 (backend)

## 📝 Variáveis de Ambiente

Arquivo: `/root/hydro-gen-docker/.env`

```env
POSTGRES_PASSWORD=***
OPENAI_API_KEY=sk-***
NEXT_PUBLIC_API_URL=https://hydro-api.adapterbot.cloud
```

## 🔄 Atualizações

Para atualizar a partir do GitHub:

```bash
cd /root/hydro-gen-docker
git pull origin main
docker compose build
docker compose up -d
```

## 📊 Monitoramento

```bash
# Logs em tempo real
docker compose logs -f backend

# Status dos containers
docker compose ps

# Uso de recursos
docker stats
```
