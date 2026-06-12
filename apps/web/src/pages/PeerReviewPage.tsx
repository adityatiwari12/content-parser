import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobRunner } from '@/components/ui/JobRunner'
import { downloadText, runMockAction } from '@/lib/actions'

export default function PeerReviewPage() {
  const [text, setText] = useState(
    'This manuscript proposes a retrieval-augmented research assistant for scientific literature discovery. The system integrates semantic search, citation verification, and multi-agent review workflows to improve reproducibility and reduce unsupported claims.',
  )
  const reviewModes = ['Journal review', 'Conference rebuttal', 'Methods audit', 'Citation audit', 'Ethics screen']
  const criteria = ['Novelty', 'Methodology', 'Evidence', 'Writing', 'Citations', 'Reproducibility']

  return (
    <div className="space-y-5">
      <PageHeader title="AI Peer Reviewer" description="Novelty, methodology, and publication readiness scores." />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {reviewModes.map((mode) => (
              <button key={mode} onClick={() => runMockAction('Review mode selected', mode)} className="rounded-lg border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-100">
                {mode}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={13}
            placeholder="Paste manuscript text…"
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-6"
          />
          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            {criteria.map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                <input type="checkbox" defaultChecked className="accent-blue-500" />
                {item}
              </label>
            ))}
          </div>
          <JobRunner
            jobType="peer_review"
            model="reviewer-agent"
            runLabel="Submit for journal-style review"
            getInput={() => ({ text })}
            validate={() => (!text.trim() ? 'Paste manuscript text to review.' : null)}
          >
            {(job) => {
              const scores = job.result?.scores as Record<string, number> | undefined
              return (
                <div>
                  {scores && (
                    <div className="mb-4 grid gap-2 sm:grid-cols-5">
                      {Object.entries(scores).map(([k, v]) => (
                        <div key={k} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                          <p className="font-serif text-2xl">{v}</p>
                          <p className="font-mono text-[10px] uppercase text-zinc-500">{k.replace(/_/g, ' ')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">
                    <p className="mb-2 text-amber-400">Recommendation: {String(job.result?.recommendation)}</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
                      {(job.result?.comments as string[])?.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Create rebuttal outline', 'Generate revision checklist', 'Export review PDF', 'Send to collaborators'].map((action) => (
                      <button
                        key={action}
                        onClick={() =>
                          action === 'Export review PDF'
                            ? downloadText('peer-review-report.pdf.txt', JSON.stringify(job.result, null, 2))
                            : runMockAction(action, `${action} generated from reviewer report.`)
                        }
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )
            }}
          </JobRunner>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Review Protocol</h2>
            {['Double-anonymous style', 'Journal reviewer tone', 'Citation verification required', 'Methodology-first scoring'].map((item) => (
              <div key={item} className="mt-3 rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Reviewer Benchmarks</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Mock comparison against NeurIPS, Nature Methods, CHI, and ACL review patterns.
            </p>
            <button onClick={() => runMockAction('Benchmark pack loaded', 'NeurIPS, Nature Methods, CHI, and ACL criteria loaded.')} className="mt-4 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950">
              Load benchmark pack
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
