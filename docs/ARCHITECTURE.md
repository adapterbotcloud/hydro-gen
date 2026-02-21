# Hydro Gen — Sugestões de Protótipos (Frontend & Backend)

## 1. Visão Geral da Arquitetura

O Hydro Gen é composto por quatro módulos principais que se conectam em uma arquitetura de microsserviços leve, projetada para escalar gradualmente — do protótipo MVP ao produto SaaS completo.

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Next.js)              │
│  ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌────────┐ │
│  │Assistente│ │  Simulação   │ │Dashboard │ │  Base   │ │
│  │  Virtual  │ │de Cenários   │ │Métricas  │ │Documen.│ │
│  └────┬─────┘ └──────┬───────┘ └────┬─────┘ └───┬────┘ │
└───────┼──────────────┼──────────────┼────────────┼──────┘
        │              │              │            │
    ────┼──────────────┼──────────────┼────────────┼────── API Gateway (FastAPI)
        │              │              │            │
┌───────┼──────────────┼──────────────┼────────────┼──────┐
│       ▼              ▼              ▼            ▼      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐  │
│  │RAG Engine│  │Simulation│  │Analytics │ │ Document │  │
│  │(LLM+RAG)│  │  Engine   │  │ Service  │ │ Service  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ └────┬─────┘  │
│       │              │              │            │       │
│  ┌────┴──────────────┴──────────────┴────────────┴────┐  │
│  │              Vector DB (ChromaDB/Qdrant)           │  │
│  │              PostgreSQL (dados estruturados)        │  │
│  │              Redis (cache de respostas)             │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Protótipos Sugeridos — Frontend

### 2.1. Assistente Virtual (Tela Principal)

Este é o coração da plataforma, onde o usuário faz consultas em linguagem natural sobre H2V no Ceará.

**Elementos da interface:**
- Campo de input com placeholder contextual ("Pergunte sobre legislação, investimentos ou dados de H2V...")
- Sugestões rápidas: chips clicáveis com perguntas frequentes para guiar novos usuários
- Área de conversa: mensagens do usuário e respostas do assistente com formatação rica
- Badges de fontes: cada resposta exibe as fontes consultadas como badges clicáveis (ex: "Lei Estadual nº 18.032/2023", "IPECE 2024")
- Indicador de processamento: animação de "Consultando base de dados..." durante a busca RAG
- Disclaimer fixo no rodapé: "Respostas geradas via RAG. Sempre verifique as fontes citadas."

**Fluxo de interação:**
1. Usuário digita pergunta → frontend envia POST para `/api/chat`
2. Backend executa busca semântica na base vetorial
3. Chunks relevantes são enviados ao LLM como contexto
4. Resposta é retornada com citações e links para documentos-fonte
5. Frontend renderiza resposta com formatação e badges de fontes

**Diferencial UX:** A camada gratuita dá acesso a este módulo com limite de consultas/dia. Funciona como vitrine para gestores públicos experimentarem antes de contratar o plano SaaS.

---

### 2.2. Simulação de Cenários (Módulo Premium)

Permite que gestores alterem variáveis e visualizem previsões de impacto antes de tomar decisões.

**Elementos da interface:**
- Painel de parâmetros (lado esquerdo):
  - Slider: Volume de investimento (em milhões de US$)
  - Slider: Capacidade de produção (MW)
  - Seletor: Localização (Pecém, Fortaleza, Interior, outros municípios)
  - Seletor: Fonte de energia primária (Eólica, Solar, Híbrida)
- Painel de resultados (lado direito):
  - Cards de métricas: empregos gerados, impacto no PIB, CO₂ evitado, H₂ produzido, ROI estimado, score de risco
  - Gráfico de barras comparativo por dimensão (econômico, social, ambiental, infraestrutura)
  - Aviso de que resultados são modelos preditivos de apoio à decisão

**Fluxo técnico:**
1. Usuário ajusta parâmetros → frontend envia POST para `/api/simulation`
2. Backend consulta modelos preditivos treinados com dados históricos (IBGE, IPECE, ANEEL)
3. Resultados são calculados com multiplicadores por localização e fonte de energia
4. Frontend renderiza cards e gráficos com animações de entrada

---

### 2.3. Dashboard de Monitoramento (Módulo Premium)

Painel de métricas de uso e desempenho do sistema para administradores e gestores.

**Elementos da interface:**
- Métricas-chave em destaque: documentos indexados, consultas realizadas, fontes integradas, usuários ativos
- Consultas recentes: lista com query, órgão de origem e timestamp
- Indicadores de desempenho: tempo médio de resposta, precisão de recuperação, satisfação dos usuários, uptime, taxa de alucinação
- Cada métrica com badge de "meta" para comparação visual

**Dados monitorados (alinhados à Resposta 8 do documento):**
- Tempo médio de resposta do assistente
- Precisão das informações (via auditorias)
- Taxa de utilização por perfil de usuário
- Receita recorrente mensal (MRR)
- Custo de aquisição de cliente (CAC)
- Satisfação dos usuários (questionários periódicos)

---

### 2.4. Base Documental (Acesso Público + Premium)

Interface de navegação e busca nos documentos indexados pelo sistema.

**Elementos da interface:**
- Campo de busca textual
- Filtros por tipo: Legislação, Relatório, Regulação, Dados, Estudo
- Lista de documentos com título, tipo (badge colorido), data e score de relevância
- Hover nos cards com destaque visual para indicar interatividade
- Ao clicar: abre detalhes do documento com trechos relevantes destacados

---

## 3. Protótipos Sugeridos — Backend

### 3.1. Arquitetura de Serviços

```
/api
├── /chat              POST  → Motor RAG (consulta + resposta com fontes)
├── /chat/feedback     POST  → Registro de feedback do usuário sobre resposta
├── /simulation        POST  → Motor de simulação de cenários
├── /documents         GET   → Lista documentos com filtros e busca
├── /documents/:id     GET   → Detalhes de documento específico
├── /analytics         GET   → Métricas de uso (autenticado)
├── /auth/login        POST  → Autenticação (órgãos governamentais)
└── /auth/register     POST  → Cadastro de órgão (admin only)
```

### 3.2. Pipeline RAG (Núcleo do Sistema)

Este é o componente mais crítico, descrito nas Respostas 1 e 2 do documento.

**Stack sugerida:**
- **Embedding model:** `sentence-transformers/all-MiniLM-L6-v2` (multilingual) ou modelo fine-tunado para português jurídico
- **Vector DB:** ChromaDB (prototipagem) → Qdrant (produção)
- **LLM:** OpenAI GPT-4o ou modelo open-source como Llama 3 (reduz custo)
- **Framework:** LangChain ou LlamaIndex para orquestração da pipeline
- **Cache:** Redis para respostas a perguntas frequentes (otimização descrita na Resposta 4)

**Pipeline de processamento:**
```
Documento bruto (PDF/HTML/CSV)
    ↓
Extração de texto (PyPDF2, BeautifulSoup, pandas)
    ↓
Chunking (divisão em trechos de ~512 tokens com overlap)
    ↓
Embedding (transformação em vetores semânticos)
    ↓
Indexação no Vector DB (com metadados: fonte, data, tipo)
    ↓
Pronto para busca semântica
```

**Pipeline de consulta:**
```
Pergunta do usuário
    ↓
Embedding da pergunta
    ↓
Busca semântica no Vector DB (top-k chunks mais relevantes)
    ↓
Construção do prompt com contexto + pergunta
    ↓
Envio ao LLM com system prompt especializado
    ↓
Resposta com citações extraídas dos chunks
    ↓
Entrega ao frontend com metadata das fontes
```

### 3.3. Motor de Simulação

**Stack sugerida:**
- Python + scikit-learn para modelos preditivos
- Dados históricos de IBGE, IPECE, ANEEL como base de treinamento
- Modelos de regressão para estimativas de impacto (empregos, PIB, CO₂)
- API FastAPI com endpoint dedicado que recebe parâmetros e retorna previsões

### 3.4. Coleta e Atualização de Dados

Conforme a Resposta 2 (Etapa 2 do cronograma, meses 3-4):

**Scripts de coleta automatizada:**
- Web scraping de fontes públicas (IBGE, ANEEL, IPECE, INMET, CPTEC)
- APIs públicas quando disponíveis
- Processamento de PDFs de legislação e relatórios oficiais
- Agendamento via cron jobs para atualização periódica

### 3.5. Modelo de Dados (PostgreSQL)

```
users
├── id, name, email, org_id, role, plan_type, created_at

organizations
├── id, name, type (secretaria/prefeitura/empresa), state, city

documents
├── id, title, type, source, date, url, content_hash, indexed_at

queries
├── id, user_id, question, response, sources[], feedback, created_at

simulations
├── id, user_id, params (JSON), results (JSON), created_at

subscriptions
├── id, org_id, plan, price, status, start_date, end_date
```

---

## 4. Modelo de Autenticação e Planos

Alinhado à Resposta 7 (modelo freemium + SaaS):

| Funcionalidade | Gratuito | SaaS (R$ 3-8k/mês) |
|---|---|---|
| Assistente virtual (consultas básicas) | ✅ (limite diário) | ✅ (ilimitado) |
| Fontes citadas nas respostas | ✅ | ✅ |
| Simulação de cenários | ❌ | ✅ |
| Dashboard de monitoramento | ❌ | ✅ |
| Relatórios personalizados | ❌ | ✅ |
| API de integração | ❌ | ✅ |
| Suporte técnico dedicado | ❌ | ✅ |

---

## 5. Stack Tecnológica Recomendada

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | Next.js + React + Tailwind CSS | SSR para SEO, performance, ecossistema rico |
| Backend API | FastAPI (Python) | Async, tipagem, ideal para ML/IA |
| RAG Framework | LangChain ou LlamaIndex | Orquestração de pipeline RAG madura |
| LLM | GPT-4o / Llama 3 | Balanceamento custo vs qualidade |
| Vector DB | ChromaDB → Qdrant | Prototipagem rápida → escala |
| Banco relacional | PostgreSQL | Robusto, open-source |
| Cache | Redis | Respostas frequentes, sessões |
| Infraestrutura | AWS / Google Cloud (híbrida) | Conforme descrito na Resposta 2 |
| Monitoramento | Power BI + dashboards internos | Conforme descrito na Resposta 8 |
| Gestão de código | GitHub | Conforme descrito na Resposta 9 |
| CI/CD | GitHub Actions | Automação de deploys |

---

## 6. Cronograma de Prototipagem (alinhado à Resposta 9)

| Meses | Entrega de protótipo |
|---|---|
| 1-2 | Wireframes e arquitetura definida. Ambiente de dev configurado. |
| 3-4 | Base vetorial com 100+ docs. Scripts de coleta funcionais. |
| 5-7 | **MVP do motor RAG.** Pipeline funcional respondendo 10 perguntas-chave. Precisão >80%. |
| 8-9 | **Protótipo Alfa.** Interface web completa integrada ao motor de IA. Testes internos de usabilidade. |
| 10-12 | **Protótipo Beta.** Validação com 5-10 gestores públicos. Feedback compilado. Ajustes finais. |

---

## 7. Considerações de Segurança e Ética

Conforme as Respostas 4 e 5:

- **Controle de alucinações:** System prompts rigorosos que instruem o LLM a responder apenas com base nos documentos recuperados; quando não houver informação suficiente, indicar claramente.
- **Curadoria de viés:** Fontes diversificadas e auditoria periódica das respostas com gestores.
- **Transparência:** Toda resposta exibe suas fontes, permitindo verificação humana.
- **LGPD:** Dados de uso anonimizados. Termo de consentimento para participantes dos testes.
- **Eficiência energética:** Quantização de modelos e cache de respostas frequentes para reduzir custo computacional.
