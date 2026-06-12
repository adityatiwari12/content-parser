# Axiom Lab 2.0 — Web Frontend

React 19 + TypeScript + TailwindCSS research platform UI.

## Development

```bash
# From repo root
npm install
npm run dev --workspace=apps/web
```

Requires API at `localhost:8000` (proxied via `/api`) for full functionality.

## Build & Deploy

```bash
npm run build --workspace=apps/web
cd apps/web && npx vercel --prod
```

Set `VITE_API_URL` in Vercel environment variables.

See [root README](../../README.md) for full documentation.
