import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobRunner } from '@/components/ui/JobRunner'

const starter = `Artificial intelligence has transformed educational systems by improving personalization, feedback speed, and administrative efficiency. However, implementation quality is highly dependent on policy design, infrastructure readiness, and educator training.`

export default function AnalysisPage() {
  const [text, setText] = useState(starter)

  return (
    <div>
      <PageHeader eyebrow="Semantic Analysis" title="Semantic Analysis" description="Linguistic decomposition via semantic-net-7b." />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mb-4 w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-sm" />
      <JobRunner jobType="semantic_analysis" model="semantic-net-7b" runLabel="Run analysis" getInput={() => ({ text })}>
        {(job) => {
          const m = job.result?.metrics as Record<string, unknown> | undefined
          if (!m) return null
          return (
            <>
              <div className="grid gap-px overflow-hidden rounded border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
                {Object.entries(m).filter(([k]) => k !== 'keyPhrases').map(([k, v]) => (
                  <div key={k} className="bg-zinc-900 p-3">
                    <p className="font-serif text-xl">{String(v)}</p>
                    <p className="font-mono text-[10px] uppercase text-zinc-500">{k}</p>
                  </div>
                ))}
              </div>
              {Array.isArray(m.keyPhrases) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(m.keyPhrases as string[]).map((p) => (
                    <code key={p} className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-blue-400">{p}</code>
                  ))}
                </div>
              )}
            </>
          )
        }}
      </JobRunner>
    </div>
  )
}
