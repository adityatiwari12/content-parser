# API Design (v1)

Base URL: `http://localhost:8000` (dev) | `VITE_API_URL` (production)

OpenAPI docs: `/docs`

## Modules

| Prefix | Module |
|--------|--------|
| `/v1/discovery` | Research Discovery |
| `/v1/literature-review` | Literature Review Generator |
| `/v1/gaps` | Research Gap Detection |
| `/v1/copilot` | AI Research Copilot |
| `/v1/citations` | Citation Intelligence |
| `/v1/manuscripts` | Academic Writing Studio |
| `/v1/reviews` | AI Peer Reviewer |
| `/v1/graph` | Knowledge Graph |
| `/v1/trends` | Trend Intelligence |
| `/v1/projects` | Collaboration |
| `/v1/datasets` | Dataset Hub |
| `/v1/experiments` | Experiment Tracking |
| `/v1/repro` | Reproducibility |
| `/v1/compliance` | Compliance & Integrity |
| `/v1/analysis` | Semantic Analysis |
| `/v1/billing` | Monetization |
| `/v1/jobs` | Async job status |

## Async Jobs

POST endpoints return `202` with `{ job_id, status: "pending" }`. Poll `GET /v1/jobs/{job_id}` until `status: "completed"`.
