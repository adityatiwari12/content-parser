# Database Schema (PostgreSQL)

## Identity
- `users` — platform users (Clerk ID in production)
- `organizations` — universities, labs, teams
- `team_members` — user ↔ org with role enum

## Research
- `projects` — collaboration workspaces
- `research_notes`, `discussion_threads` — collaboration artifacts
- `papers` — cached paper metadata from discovery APIs
- `manuscripts`, `manuscript_sections` — writing studio content

## Operations
- `async_jobs` — long-running inference jobs with progress
- `agent_runs` — audit log of multi-agent workflows
- `compliance_reports` — integrity scan results
- `experiments`, `experiment_runs` — ML experiment tracking
- `datasets` — uploaded dataset profiles

## Billing
- `subscriptions`, `usage_events` — plan limits and metering

## Graph (Neo4j)
Edges: `AUTHORED`, `CITES`, `AFFILIATED_WITH`, `TOPIC_OF`, `USES_DATASET`, `PUBLISHED_IN`

PostgreSQL holds canonical records; Neo4j stores relationship graph for visualization.
