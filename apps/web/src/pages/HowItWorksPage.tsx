import { PageHeader } from '@/components/ui/PageHeader'

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeader title="How Axiom Lab works" description="Multi-agent architecture with RAG, provider abstraction, and async job pipeline." />
      <div className="space-y-6 text-sm text-zinc-400">
        <section className="rounded border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-2 font-serif text-lg text-zinc-200">Architecture</h3>
          <p>React 19 frontend → FastAPI gateway → Celery workers → PostgreSQL + Redis + Qdrant + Neo4j + OpenSearch + S3.</p>
        </section>
        <section className="rounded border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-2 font-serif text-lg text-zinc-200">Agents</h3>
          <p>Coordinator orchestrates Literature, Review, Gap, Methodology, Statistics, Writing, Citation, and Reviewer agents via LangGraph.</p>
        </section>
        <section className="rounded border border-zinc-800 bg-zinc-900 p-4">
          <h3 className="mb-2 font-serif text-lg text-zinc-200">Providers</h3>
          <p>Mock providers in Phase 1; swap OpenAlex, Semantic Scholar, arXiv, and LLM providers without changing API contracts.</p>
        </section>
      </div>
    </div>
  )
}
