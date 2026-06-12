# Axiom Lab 2.0 — System Design

## Overview

Axiom Lab 2.0 is an enterprise research intelligence platform built as a monorepo with a React 19 TypeScript frontend and FastAPI backend.

## Components

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Framer Motion, React Query, Zustand |
| API | FastAPI, Pydantic, WebSockets |
| Workers | Celery, Redis |
| Database | PostgreSQL, Alembic |
| Vector | Qdrant (mock in Phase 1) |
| Graph | Neo4j (mock in Phase 1) |
| Search | OpenSearch (mock in Phase 1) |
| Storage | MinIO / S3-compatible |
| Agents | LangGraph-style coordinator with 8 specialized agents |

## Request Flow

1. Client submits request to FastAPI (`/v1/*`)
2. Long-running jobs create `async_jobs` record and dispatch to Celery (or background thread fallback)
3. Worker runs multi-agent workflow via `services/agents/coordinator.py`
4. Progress updates written to PostgreSQL; client polls `/v1/jobs/{id}`
5. Results include `sources`, `confidence`, and `agent_trace` for explainability

## Provider Abstraction

All external services implement provider interfaces in `apps/api/app/providers/`. Phase 1 uses mock providers; Phase 2 swaps in OpenAlex, Semantic Scholar, arXiv, and LLM APIs without changing routers.

## Deployment

- **Frontend:** Vercel (`apps/web`)
- **Backend:** Docker Compose locally; Kubernetes stubs in `infra/k8s/`
