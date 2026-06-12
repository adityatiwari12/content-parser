import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobRunner } from '@/components/ui/JobRunner'
import { downloadText, runMockAction } from '@/lib/actions'

export default function LiteratureReviewPage() {
  const [topic, setTopic] = useState('AI research assistants for scientific discovery')
  const scope = ['Last 5 years', 'High citation only', 'Include contradictions', 'Open challenges', 'Methods focus']

  return (
    <div className="space-y-5">
      <PageHeader title="Literature Review Generator" description="Publishable literature review drafts with citations." />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Research topic" className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
          <div className="mb-5 flex flex-wrap gap-2">
            {scope.map((item) => (
              <button key={item} onClick={() => runMockAction('Review scope updated', item)} className="rounded-lg border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-100">
                {item}
              </button>
            ))}
          </div>
          <JobRunner
            jobType="literature_review"
            model="review-agent"
            runLabel="Generate literature review"
            getInput={() => ({ topic })}
            validate={() => (!topic.trim() ? 'Enter a research topic.' : null)}
          >
            {(job) => (
              <div className="space-y-4 text-sm text-zinc-300">
                <div className="grid gap-2 md:grid-cols-4">
                  {['Landscape', 'Themes', 'Consensus', 'Challenges'].map((label, index) => (
                    <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                      <p className="font-serif text-2xl">{[2400, 4, 7, 3][index]}</p>
                      <p className="font-mono text-[10px] uppercase text-zinc-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 leading-6">{String(job.result?.landscape ?? '')}</p>
                <div className="flex flex-wrap gap-2">
                  {(job.result?.key_themes as string[])?.map((theme) => (
                    <span key={theme} className="rounded-full border border-zinc-700 px-3 py-1 font-mono text-xs text-blue-400">{theme}</span>
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <strong className="text-zinc-200">Consensus</strong>
                    <p className="mt-2 text-zinc-400">{String(job.result?.consensus)}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <strong className="text-zinc-200">Contradictions</strong>
                    <p className="mt-2 text-zinc-400">{String(job.result?.contradictions)}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 leading-relaxed">
                  <h4 className="mb-2 font-serif text-2xl text-zinc-200">Publishable Draft</h4>
                  {String(job.result?.draft ?? '')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Insert citations', 'Convert to introduction', 'Create evidence table', 'Export Markdown'].map((action) => (
                    <button
                      key={action}
                      onClick={() =>
                        action === 'Export Markdown'
                          ? downloadText('literature-review.md', String(job.result?.draft ?? ''))
                          : runMockAction(action, `${action} completed for literature review.`)
                      }
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </JobRunner>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Evidence Matrix</h2>
            {['Influential papers: 12', 'Consensus clusters: 4', 'Contradictions: 2', 'Open challenges: 5'].map((item) => (
              <div key={item} className="mt-3 rounded-lg bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-400">{item}</div>
            ))}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Review Outline</h2>
            {['Landscape', 'Key Themes', 'Methods', 'Contradictions', 'Opportunities'].map((item) => (
              <div key={item} className="mt-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400">{item}</div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
