# Deployment

## Local (Docker Compose)

```bash
cd infra/docker
docker compose up
```

Services: api (8000), postgres (5432), redis (6379), qdrant (6333), neo4j (7474/7687), opensearch (9200), minio (9000)

## Frontend

```bash
npm install
npm run dev --workspace=apps/web
```

Vite proxies `/api` → `http://localhost:8000`

## Vercel

- Root Directory: `apps/web`
- Environment: `VITE_API_URL=https://your-api.example.com`

## API (production options)

- Railway / Fly.io / AWS ECS with `infra/docker/Dockerfile.api`
- Set `DATABASE_URL`, `REDIS_URL`, `CELERY_BROKER_URL`

## Kubernetes

Stub manifests in `infra/k8s/` for Phase 2 hardening.
