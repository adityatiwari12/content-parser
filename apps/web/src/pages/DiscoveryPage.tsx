import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { copyText, downloadText, runMockAction } from '@/lib/actions'
import { useProjectStore } from '@/stores/project'
import { useWorkspaceStore } from '@/stores/workspace'
import type { Paper } from '@axiom/shared'

const filters = ['Hybrid search', 'Sort by influence', 'Latest papers', 'Open access', 'Include datasets', 'Citation graph']

function bibtex(p: Paper) {
  return `@article{${p.id},\n  title={${p.title}},\n  author={${p.authors.join(' and ')}},\n  year={${p.published_at.slice(0, 4)}},\n  doi={${p.doi}},\n  url={${p.pdf_url}}\n}`
}

function summarizePaper(p: Paper) {
  return `${p.title} argues that ${p.abstract.replace(/\.$/, '')}. It is useful for research planning because it connects ${p.authors[0]} and collaborators' work at ${p.institution} with current questions around methods, benchmarks, and source-grounded evaluation.`
}

export default function DiscoveryPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [q, setQ] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>(['Latest papers', 'Open access'])
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null)
  const [citationTrace, setCitationTrace] = useState<Paper | null>(null)
  const [similarFor, setSimilarFor] = useState<Paper | null>(null)
  const [similarPapers, setSimilarPapers] = useState<Paper[]>([])
  const selectedPaperIds = useProjectStore((s) => s.selectedPaperIds)
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const setActiveProject = useProjectStore((s) => s.setActiveProject)
  const togglePaper = useProjectStore((s) => s.togglePaper)
  const addCitation = useWorkspaceStore((s) => s.addCitation)
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: api.listProjects })
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['search', q],
    queryFn: () => api.searchPapers(q),
  })

  const papers = [...((data || []) as Paper[])]
    .filter((p) => {
      if (!q.trim() || activeFilters.includes('Hybrid search')) return true
      const exactScope = [p.title, p.authors.join(' '), p.institution].join(' ').toLowerCase()
      return exactScope.includes(q.trim().toLowerCase())
    })
    .filter((p) => activeFilters.includes('Open access') ? Boolean(p.pdf_url) : true)
    .sort((a, b) => {
      if (activeFilters.includes('Sort by influence')) return b.citation_count - a.citation_count
      if (activeFilters.includes('Latest papers')) return b.published_at.localeCompare(a.published_at)
      return 0
    })

  const selectedPapers = papers.filter((p) => selectedPaperIds.includes(p.id))

  function toggleFilter(filter: string) {
    setActiveFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter])
    runMockAction(currentFilterVerb(filter), filter)
  }

  function currentFilterVerb(filter: string) {
    return activeFilters.includes(filter) ? 'Filter removed' : 'Filter applied'
  }

  async function ensureProject() {
    const existing = (projects as Array<{ id: string; name: string }>).find((project) => project.id === activeProjectId)
      || (projects as Array<{ id: string; name: string }>)[0]
    if (existing) {
      setActiveProject(existing.id)
      return existing.id
    }
    const project = await api.createProject('Discovery Research Project', 'Workspace created from Research Discovery.')
    const id = String((project as { id: string }).id)
    setActiveProject(id)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    return id
  }

  async function addPaperToProject(p: Paper) {
    const projectId = await ensureProject()
    if (!selectedPaperIds.includes(p.id)) togglePaper(p.id)
    addCitation(projectId, {
      title: p.title,
      authors: p.authors.join(', '),
      year: p.published_at.slice(0, 4),
      doi: p.doi,
      url: p.pdf_url,
      description: summarizePaper(p),
    })
    runMockAction('Added to project', `${p.title} saved as a citation with description.`)
    navigate('/workspace')
  }

  function buildSimilarPapers(p: Paper) {
    const terms = new Set(
      [p.title, p.abstract]
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((term) => term.length > 5),
    )
    return ([...((data || []) as Paper[])] as Paper[])
      .filter((candidate) => candidate.id !== p.id)
      .map((candidate) => {
        const text = [candidate.title, candidate.abstract, candidate.institution, candidate.source].join(' ').toLowerCase()
        const score = [...terms].filter((term) => text.includes(term)).length
        return { candidate, score }
      })
      .sort((a, b) => b.score - a.score || b.candidate.citation_count - a.candidate.citation_count)
      .slice(0, 5)
      .map(({ candidate }) => candidate)
  }

  function handleAction(action: string, p: Paper) {
    if (action === 'Add to project') {
      void addPaperToProject(p)
      return
    }
    if (action === 'Summarize') {
      setExpandedSummary(expandedSummary === p.id ? null : p.id)
      runMockAction('Paper summarized', p.title)
      return
    }
    if (action === 'Find similar') {
      setSimilarFor(p)
      setSimilarPapers(buildSimilarPapers(p))
      runMockAction('Similar papers found', `Showing papers related to ${p.title}.`)
      return
    }
    if (action === 'Trace citations') {
      setCitationTrace(p)
      runMockAction('Citation trace opened', `${p.citation_count.toLocaleString()} citations connected to ${p.title}.`)
      return
    }
    if (action === 'Export BibTeX') {
      downloadText(`${p.id}.bib`, bibtex(p))
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Module 01" title="Research Discovery" description="Semantic search across arXiv, Semantic Scholar, OpenAlex, and PubMed." />
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                activeFilters.includes(filter)
                  ? 'border-zinc-200 bg-zinc-100 text-zinc-950'
                  : 'border-zinc-700 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refetch()}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm"
            placeholder="Search papers, authors, topics, datasets…"
          />
          <button type="button" onClick={() => refetch()} className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 sm:w-auto">
            Search
          </button>
          <button type="button" onClick={() => { setQ(''); void refetch(); runMockAction('Latest papers loaded', 'Showing recent research across the mock corpus.') }} className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300">
            Latest
          </button>
        </div>
      </section>
      {isFetching && <Skeleton className="mb-4 h-24 w-full" />}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              {papers.length} latest papers
            </p>
            <button
              onClick={() => downloadText('discovery-set.bib', selectedPapers.length ? selectedPapers.map(bibtex).join('\n\n') : papers.slice(0, 8).map(bibtex).join('\n\n'))}
              className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400"
            >
              Export discovery set
            </button>
          </div>
          {papers.map((p) => (
            <article key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-600">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-500">{p.source}</span>
                <span className="font-mono text-xs text-zinc-500">{p.published_at}</span>
                <span className="rounded bg-blue-950/40 px-2 py-0.5 font-mono text-[10px] text-blue-400">
                  Influence {(p.citation_count / 1000).toFixed(1)}
                </span>
                {activeFilters.includes('Include datasets') && ['paper-008', 'paper-014', 'paper-016', 'paper-018'].includes(p.id) && (
                  <span className="rounded bg-green-950/40 px-2 py-0.5 font-mono text-[10px] text-green-400">dataset linked</span>
                )}
                {activeFilters.includes('Citation graph') && (
                  <span className="rounded bg-amber-950/40 px-2 py-0.5 font-mono text-[10px] text-amber-400">graph ready</span>
                )}
              </div>
              <h3 className="font-medium text-zinc-100">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">{p.abstract}</p>
              {expandedSummary === p.id && (
                <div className="mt-4 rounded-xl border border-blue-900/40 bg-blue-950/10 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-blue-400">AI summary</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{summarizePaper(p)}</p>
                  <button onClick={() => copyText(summarizePaper(p), 'Summary copied')} className="mt-3 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">
                    Copy summary
                  </button>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-zinc-500">
                <span>{p.authors.join(', ')}</span>
                <span>{p.institution}</span>
                <span>{p.citation_count.toLocaleString()} citations</span>
                <a
                  href={`https://doi.org/${p.doi.replace(/^10\.48550\/arXiv\./, '10.48550/arXiv.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400/80 hover:text-blue-300"
                >
                  DOI: {p.doi}
                </a>
                <a href={p.pdf_url} target="_blank" rel="noreferrer" className="text-blue-400/80 hover:text-blue-300">
                  PDF link
                </a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Add to project', 'Summarize', 'Find similar', 'Trace citations', 'Export BibTeX'].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleAction(action, p)}
                    className={`rounded-lg border px-3 py-2 text-xs hover:bg-zinc-800 ${
                      action === 'Add to project' && selectedPaperIds.includes(p.id)
                        ? 'border-green-700 bg-green-950/30 text-green-300'
                        : 'border-zinc-700 text-zinc-300'
                    }`}
                  >
                    {action === 'Add to project' && selectedPaperIds.includes(p.id) ? 'Selected' : action}
                  </button>
                ))}
              </div>
            </article>
          ))}
          {similarFor && (
            <section className="rounded-2xl border border-blue-900/40 bg-blue-950/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-blue-400">Similar papers</p>
                  <h2 className="mt-1 font-serif text-3xl">Related to {similarFor.title}</h2>
                </div>
                <button onClick={() => { setSimilarFor(null); setSimilarPapers([]) }} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">
                  Close
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {similarPapers.map((paper) => (
                  <article key={paper.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="font-medium text-zinc-100">{paper.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{paper.abstract}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={paper.pdf_url} target="_blank" rel="noreferrer" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Open PDF</a>
                      <button onClick={() => void addPaperToProject(paper)} className="rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-950">Add to project</button>
                      <button onClick={() => setExpandedSummary(paper.id)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Summarize</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Discovery Set</h2>
            {[
              `Selected papers: ${selectedPaperIds.length}`,
              `Visible papers: ${papers.length}`,
              `Open PDFs: ${papers.filter((p) => p.pdf_url).length}`,
              `Sources: ${new Set(papers.map((p) => p.source)).size}`,
              ...(activeFilters.includes('Include datasets') ? [`Linked datasets: ${papers.filter((p) => ['paper-008', 'paper-014', 'paper-016', 'paper-018'].includes(p.id)).length}`] : []),
            ].map((item) => (
              <div key={item} className="mt-3 rounded-lg bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-400">
                {item}
              </div>
            ))}
            <button
              onClick={() => selectedPapers.length ? navigate('/literature-review') : runMockAction('Select papers first', 'Add papers to your project before generating a review.')}
              className="mt-4 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950"
            >
              Generate review from selected
            </button>
          </div>
          {citationTrace && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="font-serif text-2xl">Citation Trace</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{citationTrace.title}</p>
              {[
                'Found foundational transformer lineage',
                'Detected adjacent RAG and agent evaluation papers',
                'Recommended adding one reproducibility citation',
              ].map((item) => (
                <div key={item} className="mt-3 rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-400">{item}</div>
              ))}
              <button onClick={() => navigate('/graph')} className="mt-4 w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300">
                Open graph view
              </button>
            </div>
          )}
          {activeFilters.includes('Citation graph') && !citationTrace && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="font-serif text-2xl">Citation Graph</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Citation graph mode is active. Use “Trace citations” on any paper to inspect its local research lineage.
              </p>
              <button onClick={() => navigate('/graph')} className="mt-4 w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300">
                Open full graph
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Actions</h2>
            {[
              ['Create alert', () => runMockAction('Alert created', q ? `Watching “${q}”.` : 'Watching latest AI research.')],
              ['Copy search link', () => copyText(`${location.origin}/discovery?q=${encodeURIComponent(q)}`, 'Search link copied')],
              ['Open Copilot', () => { localStorage.setItem('axiom-copilot-draft', `Analyze these discovery results for ${q || 'latest AI research'}.`); navigate('/copilot') }],
            ].map(([label, action]) => (
              <button key={label as string} onClick={action as () => void} className="mt-2 block w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-950">
                {label as string}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Suggested Queries</h2>
            {['retrieval augmented generation', 'AI agents evaluation', 'scientific discovery automation', 'long-context RAG', 'state space models'].map((query) => (
              <button key={query} onClick={() => { setQ(query); runMockAction('Suggested query loaded', query) }} className="mt-2 block w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-950">
                {query}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
