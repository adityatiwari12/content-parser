# Axiom Lab 2.0 — Enterprise Research Intelligence Platform

End-to-end research operating system for discovery, literature review, writing, analysis, compliance, collaboration, and publication readiness.

**Live demo (frontend):** [https://web-ten-delta-78.vercel.app](https://web-ten-delta-78.vercel.app)

## Architecture

```
content-parser/
├── apps/
│   ├── web/          # React 19 + TypeScript + Tailwind (Vercel)
│   └── api/          # FastAPI + PostgreSQL + Celery
├── packages/
│   └── shared/       # Shared TypeScript types
├── services/
│   ├── workers/      # Celery tasks
│   └── agents/       # Multi-agent coordinator
├── infra/
│   ├── docker/       # Docker Compose full stack
│   └── k8s/          # Kubernetes stubs
└── docs/architecture/
```

## Platform Modules (14)

| Module | Route | API |
|--------|-------|-----|
| Dashboard | `/dashboard` | — |
| Research Discovery | `/discovery` | `/v1/discovery` |
| Literature Review | `/literature-review` | `/v1/literature-review` |
| Research Gaps | `/gaps` | `/v1/gaps` |
| AI Copilot | `/copilot` | `/v1/copilot` |
| Citation Intelligence | `/citations` | `/v1/citations` |
| Writing Studio | `/writing` | `/v1/manuscripts` |
| Peer Review | `/peer-review` | `/v1/reviews` |
| Knowledge Graph | `/graph` | `/v1/graph` |
| Trend Intelligence | `/trends` | `/v1/trends` |
| Collaboration | `/workspace` | `/v1/projects` |
| Dataset Hub | `/datasets` | `/v1/datasets` |
| Experiments | `/experiments` | `/v1/experiments` |
| Reproducibility | `/reproducibility` | `/v1/repro` |
| Compliance | `/compliance` | `/v1/compliance` |
| Semantic Analysis | `/analysis` | `/v1/analysis` |

Legacy routes redirect: `/generator` → `/writing`, `/parser` → `/analysis`, `/plagiarism-check` → `/compliance`

## Quick Start

### Frontend only (fully functional with mock data)

```bash
npm install
npm run dev --workspace=apps/web
```

Open [http://localhost:5173](http://localhost:5173). **All 14 modules work end-to-end in the browser** using client-side mock data and simulated inference (30–45s jobs, source attribution, agent traces). No backend required for demo use, except the AI Copilot will call the local API first when it is running.

To connect a live API later, set `VITE_USE_MOCK=false` and `VITE_API_URL=https://your-api.example.com`.

### Full stack (Docker)

```bash
cd infra/docker
docker compose up
```

API: [http://localhost:8000/docs](http://localhost:8000/docs)

### API locally (without Docker)

```bash
cd apps/api
pip install -r requirements.txt
set PYTHONPATH=../..;..
uvicorn app.main:app --reload --app-dir .
```

Requires PostgreSQL and Redis, or uses sync fallback with SQLite-compatible create_all on startup.

For the AI Copilot Groq integration, set `GROQ_API_KEY` in `apps/api/.env`. Optional: set `GROQ_MODEL`, which defaults to `llama-3.3-70b-versatile`. The Groq key is used only by the backend Copilot route and is never bundled into the frontend.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Framer Motion, TanStack Query, Zustand
- **Backend:** FastAPI, Celery, PostgreSQL, Redis
- **AI:** Multi-agent coordinator (mock providers Phase 1)
- **Data:** Qdrant, Neo4j, OpenSearch, MinIO (Docker Compose)
- **Auth/Billing:** Clerk scaffold, Stripe stubs, plan limits

## Documentation

- [System Design](docs/architecture/system-design.md)
- [Database ERD](docs/architecture/database-erd.md)
- [API Design](docs/architecture/api-design.md)
- [Agents](docs/architecture/agents.md)
- [Deployment](docs/architecture/deployment.md)

## Python CLI (legacy)

```bash
python generate_content.py --topic "AI in Higher Education" --save
```

## Deploy Frontend to Vercel

```bash
cd apps/web
npx vercel --prod
```

Set **Root Directory** to `apps/web` and `VITE_API_URL` to your API host.
