import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { copyText, downloadText, runMockAction } from '@/lib/actions'
import {
  citationStyles,
  formatCitations,
  recommendedReferences,
  starterReferences,
  toBibTeX,
  toRIS,
  validateReferences,
  type CitationStyle,
  type Reference,
} from '@/lib/citations'
import { useWorkspaceStore } from '@/stores/workspace'
import { useProjectStore } from '@/stores/project'

const emptyReference = (): Reference => ({
  id: `ref-${Date.now()}`,
  author: '',
  title: '',
  year: '',
  venue: '',
  doi: '',
  url: '',
})

export default function CitationsPage() {
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [references, setReferences] = useState<Reference[]>(starterReferences)
  const [citations, setCitations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [recommendationsOpen, setRecommendationsOpen] = useState(false)
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const addWorkspaceCitation = useWorkspaceStore((s) => s.addCitation)
  const issues = validateReferences(references)
  const verified = references.filter((ref) => ref.doi || ref.url).length

  function updateReference(id: string, field: keyof Reference, value: string) {
    setReferences((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item))
  }

  function addReference(ref = emptyReference()) {
    setReferences((items) => [ref, ...items])
    runMockAction('Reference added', ref.title || 'Blank reference ready.')
  }

  function deleteReference(id: string) {
    setReferences((items) => items.filter((item) => item.id !== id))
    setCitations([])
    runMockAction('Reference deleted', 'Citation list updated.')
  }

  function format() {
    setLoading(true)
    window.setTimeout(() => {
      setCitations(formatCitations(references, style))
      setLoading(false)
      runMockAction('Citations formatted', `${references.length} references formatted in ${style.toUpperCase()}.`)
    }, 350)
  }

  function saveToWorkspace(ref: Reference) {
    if (!activeProjectId) {
      runMockAction('Create a workspace first', 'Open Workspace and create a project before saving citations.')
      return
    }
    addWorkspaceCitation(activeProjectId, {
      title: ref.title,
      authors: ref.author,
      year: ref.year,
      doi: ref.doi,
      url: ref.url,
    })
    runMockAction('Saved to workspace', ref.title)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Citation Intelligence" description="APA, IEEE, MLA, ACM, Harvard, Chicago formatting and validation." />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-5">
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Citation desk</p>
                <h1 className="mt-2 font-serif text-4xl">Format, verify, and export references.</h1>
              </div>
              <button onClick={() => addReference()} className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">Add reference</button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ['References', references.length],
                ['Verified links', verified],
                ['Issues', issues.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-serif text-3xl">{value}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {references.map((ref) => (
              <article key={ref.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={ref.title} onChange={(e) => updateReference(ref.id, 'title', e.target.value)} placeholder="Paper title" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                  <input value={ref.author} onChange={(e) => updateReference(ref.id, 'author', e.target.value)} placeholder="Authors" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                  <input value={ref.venue} onChange={(e) => updateReference(ref.id, 'venue', e.target.value)} placeholder="Venue / journal / archive" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={ref.year} onChange={(e) => updateReference(ref.id, 'year', e.target.value)} placeholder="Year" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                    <input value={ref.doi} onChange={(e) => updateReference(ref.id, 'doi', e.target.value)} placeholder="DOI" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
                  </div>
                  <input value={ref.url} onChange={(e) => updateReference(ref.id, 'url', e.target.value)} placeholder="URL" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:col-span-2" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ref.url && <a href={ref.url} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Open paper</a>}
                  {ref.doi && <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Open DOI</a>}
                  <button onClick={() => saveToWorkspace(ref)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Save to workspace</button>
                  <button onClick={() => copyText(formatCitations([ref], style)[0], 'Citation copied')} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Copy formatted</button>
                  <button onClick={() => deleteReference(ref.id)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside className="space-y-5">
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="font-serif text-3xl">Format</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {citationStyles.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setStyle(s); setCitations([]); runMockAction('Citation style selected', s.toUpperCase()) }}
                  className={`rounded px-3 py-2 font-mono text-xs uppercase ${style === s ? 'bg-zinc-100 text-zinc-900' : 'border border-zinc-700 text-zinc-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button type="button" onClick={format} disabled={loading} className="mt-4 w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 disabled:opacity-50">
              {loading ? 'Formatting...' : 'Format citations'}
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => downloadText('references.bib', toBibTeX(references))} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Export BibTeX</button>
              <button onClick={() => downloadText('references.ris', toRIS(references))} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Export RIS</button>
              <button onClick={() => downloadText('references.txt', formatCitations(references, style).join('\n\n'))} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Export TXT</button>
              <button onClick={() => copyText(formatCitations(references, style).join('\n\n'), 'Bibliography copied')} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Copy all</button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="font-serif text-3xl">Validation</h2>
            <button onClick={() => runMockAction('Citation validation complete', issues.length ? `${issues.length} issue(s) found.` : 'No issues found.')} className="mt-3 w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300">
              Scan citations
            </button>
            <div className="mt-4 space-y-2">
              {!issues.length && <p className="rounded-xl bg-zinc-950 p-3 text-sm text-green-400">All references have required metadata.</p>}
              {issues.map((issue) => (
                <p key={issue.id} className={`rounded-xl bg-zinc-950 p-3 text-sm ${issue.severity === 'error' ? 'text-red-400' : 'text-amber-400'}`}>{issue.message}</p>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-3xl">Recommendations</h2>
              <button onClick={() => { setRecommendationsOpen((open) => !open); runMockAction('Recommendations refreshed', `${recommendedReferences.length} source candidates ready.`) }} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">
                {recommendationsOpen ? 'Hide' : 'Show'}
              </button>
            </div>
            {recommendationsOpen && (
              <div className="mt-4 space-y-3">
                {recommendedReferences.map((ref) => (
                  <article key={ref.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                    <p className="text-sm font-medium text-zinc-100">{ref.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{ref.author.split(',').slice(0, 2).join(', ')} · {ref.year}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => addReference({ ...ref, id: `${ref.id}-${Date.now()}` })} className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">Add</button>
                      <a href={ref.url} target="_blank" rel="noreferrer" className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">Open</a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {citations.length > 0 && (
            <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="font-serif text-3xl">{style.toUpperCase()} output</h2>
              <ul className="mt-4 space-y-2 font-mono text-sm text-zinc-200">
                {citations.map((citation, index) => (
                  <li key={index} className="rounded bg-zinc-950 p-3">
                    <p>{citation}</p>
                    <button onClick={() => copyText(citation)} className="mt-2 rounded border border-zinc-700 px-2 py-1 text-[10px] text-zinc-400">Copy</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </section>
    </div>
  )
}
