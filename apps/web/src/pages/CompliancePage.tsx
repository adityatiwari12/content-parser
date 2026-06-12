import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobRunner } from '@/components/ui/JobRunner'

const sample = `Methodological rigor and transparent reporting are key requirements in policy research and evaluation frameworks. Interdisciplinary approaches are increasingly required for complex socio-technical systems and public governance.`

export default function CompliancePage() {
  const [text, setText] = useState(sample)

  return (
    <div>
      <PageHeader eyebrow="Compliance" title="Provenance Scan" description="Cross-corpus similarity and integrity checks." />
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mb-4 w-full rounded border border-zinc-700 bg-zinc-900 p-3 text-sm" />
      <JobRunner jobType="compliance" model="trace-scan-xl" runLabel="Run provenance scan" getInput={() => ({ text })}>
        {(job) => {
          const r = job.result?.report as Record<string, unknown> | undefined
          if (!r) return null
          return (
            <div>
              <p className="text-lg">
                Similarity: <strong className={Number(r.score) > 30 ? 'text-amber-400' : ''}>{String(r.score)}%</strong>
                {' · '}Risk: <strong>{String(r.riskLevel)}</strong>
                {' · '}Peak match: {String(r.highestSentenceSimilarity)}%
              </p>
              <ul className="mt-4 space-y-2">
                {(r.matches as Array<Record<string, unknown>>)?.map((m, i) => (
                  <li key={i} className="rounded border-l-2 border-amber-500 bg-amber-950/20 p-3 text-sm">
                    <p>{String(m.sentence)}</p>
                    <p className="mt-1 font-mono text-xs text-amber-400/80">
                      {String(m.sourceTitle)} · {String(m.similarity)}% match
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )
        }}
      </JobRunner>
    </div>
  )
}
