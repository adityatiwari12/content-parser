import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobRunner } from '@/components/ui/JobRunner'
import { downloadText, runMockAction } from '@/lib/actions'
import { useProjectStore } from '@/stores/project'

type Opportunity = {
  area: string
  confidence: number
  rank: number
}

type DatasetRecommendation = {
  name: string
  description: string
  url: string
  best_for: string
  access: string
}

const methodSuggestions = [
  {
    title: 'Systematic mapping review',
    detail: 'Screen 150-300 recent papers, code contribution types, datasets, evaluation protocol, and stated limitations.',
    outputs: ['PRISMA-style search log', 'evidence matrix', 'gap taxonomy'],
  },
  {
    title: 'Benchmark scarcity audit',
    detail: 'Compare existing benchmarks against target research questions and identify tasks with missing public evaluation data.',
    outputs: ['benchmark inventory', 'missing-task table', 'evaluation rubric'],
  },
  {
    title: 'Expert Delphi study',
    detail: 'Run two rounds of expert review to validate whether the proposed gap is novel, useful, and feasible.',
    outputs: ['expert protocol', 'consensus notes', 'threats to validity'],
  },
]

function proposalMarkdown(topic: string, opportunity: Opportunity) {
  return `# Research Proposal: ${opportunity.area}

## Background
${topic} is developing quickly, but the literature indicates that ${opportunity.area.toLowerCase()} remains insufficiently studied.

## Research Question
How can researchers rigorously investigate ${opportunity.area.toLowerCase()} while preserving reproducibility, source quality, and evaluation validity?

## Proposed Contribution
This project will produce a structured literature map, identify missing datasets or benchmarks, and define an evaluation protocol for future empirical work.

## Method
1. Conduct a systematic mapping review.
2. Build an evidence matrix of papers, datasets, methods, and limitations.
3. Audit benchmark availability and evaluation gaps.
4. Validate the opportunity with expert review.

## Expected Outcome
A publication-ready research agenda with dataset recommendations, methodological protocol, and reproducibility checklist.
`
}

export default function GapsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [topic, setTopic] = useState('AI research assistants')
  const [lens, setLens] = useState('Underexplored areas')
  const [proposal, setProposal] = useState<{ opportunity: Opportunity; text: string } | null>(null)
  const [datasets, setDatasets] = useState<DatasetRecommendation[]>([])
  const [datasetFor, setDatasetFor] = useState('')
  const [loadingDatasets, setLoadingDatasets] = useState(false)
  const [methodFor, setMethodFor] = useState<Opportunity | null>(null)
  const setActiveProject = useProjectStore((s) => s.setActiveProject)

  async function findDatasets(opportunity: Opportunity) {
    setLoadingDatasets(true)
    setDatasetFor(opportunity.area)
    const result = await api.recommendGapDatasets(topic, opportunity.area)
    setDatasets(result.datasets)
    setLoadingDatasets(false)
    runMockAction('Datasets recommended', `Found ${result.datasets.length} dataset options for ${opportunity.area}.`)
  }

  async function addToRoadmap(opportunity: Opportunity) {
    const project = await api.createProject(
      `Roadmap: ${opportunity.area}`,
      `Research roadmap created from gap analysis for ${topic}. Confidence ${(opportunity.confidence * 100).toFixed(0)}%.`,
    ) as { id: string; name: string }
    setActiveProject(project.id)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    runMockAction('Roadmap workspace created', project.name)
    navigate('/workspace')
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Research Insights" description="Find research gaps, open proposals, discover datasets, and turn opportunities into workspace roadmaps." />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Research domain" className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
          <div className="mb-5 grid gap-2 sm:grid-cols-4">
            {['Underexplored areas', 'Missing datasets', 'Conflicting results', 'Emerging topics'].map((item) => (
              <button
                key={item}
                onClick={() => { setLens(item); runMockAction('Gap lens selected', item) }}
                className={`rounded-lg border px-3 py-3 text-left font-mono text-xs hover:border-zinc-600 ${
                  lens === item ? 'border-zinc-200 bg-zinc-100 text-zinc-950' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <JobRunner
            jobType="gap_analysis"
            model="gap-agent"
            runLabel="Analyze research gaps"
            getInput={() => ({ topic })}
            validate={() => (!topic.trim() ? 'Enter a research domain.' : null)}
          >
            {(job) => (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {((job.result?.opportunities as Opportunity[]) || []).map((o) => (
                    <li key={String(o.rank)} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-zinc-500">#{String(o.rank)}</span> {o.area}
                        </div>
                        <span className="rounded-full bg-blue-950/40 px-3 py-1 font-mono text-xs text-blue-400">
                          {(o.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-500">
                        Lens: {lens}. This opportunity is suitable for a proposal, dataset search, and methodology planning.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => setProposal({ opportunity: o, text: proposalMarkdown(topic, o) })} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Open proposal</button>
                        <button onClick={() => void findDatasets(o)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Find datasets</button>
                        <button onClick={() => { setMethodFor(o); runMockAction('Methods suggested', o.area) }} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Suggest method</button>
                        <button onClick={() => void addToRoadmap(o)} className="rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-950">Add to roadmap</button>
                      </div>
                    </li>
                  ))}
                </ul>
                {proposal && (
                  <div className="rounded-xl border border-blue-900/40 bg-blue-950/10 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-serif text-2xl">Proposal: {proposal.opportunity.area}</h2>
                      <div className="flex gap-2">
                        <button onClick={() => downloadText('research-proposal.md', proposal.text)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Download</button>
                        <button onClick={() => setProposal(null)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Close</button>
                      </div>
                    </div>
                    <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">{proposal.text}</pre>
                  </div>
                )}
                {methodFor && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                    <h2 className="font-serif text-2xl">Suggested methods for {methodFor.area}</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {methodSuggestions.map((method) => (
                        <article key={method.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                          <p className="font-medium text-zinc-100">{method.title}</p>
                          <p className="mt-2 text-sm leading-6 text-zinc-500">{method.detail}</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {method.outputs.map((output) => <span key={output} className="rounded bg-zinc-950 px-2 py-1 font-mono text-[10px] text-zinc-500">{output}</span>)}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
                {(loadingDatasets || datasets.length > 0) && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                    <h2 className="font-serif text-2xl">Dataset recommendations</h2>
                    <p className="mt-1 text-sm text-zinc-500">{datasetFor}</p>
                    {loadingDatasets ? <p className="mt-4 text-sm text-blue-400">Asking Groq for dataset recommendations...</p> : (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {datasets.map((dataset) => (
                          <article key={dataset.name} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                            <p className="font-medium text-zinc-100">{dataset.name}</p>
                            <p className="mt-2 text-sm leading-6 text-zinc-500">{dataset.description}</p>
                            <p className="mt-2 font-mono text-[10px] uppercase text-zinc-600">{dataset.access} · {dataset.best_for}</p>
                            <a href={dataset.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Open dataset</a>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                  <p><strong className="text-zinc-300">Emerging:</strong> {(job.result?.emerging_topics as string[])?.join(', ')}</p>
                  <p className="mt-2"><strong className="text-zinc-300">Missing datasets:</strong> {(job.result?.missing_datasets as string[])?.join(', ')}</p>
                </div>
              </div>
            )}
          </JobRunner>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Opportunity Filters</h2>
            {['Novelty ≥ 70%', 'Dataset availability', 'Benchmark scarcity', 'Publication velocity high'].map((item) => (
              <label key={item} className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
                <input type="checkbox" defaultChecked className="accent-blue-500" />
                {item}
              </label>
            ))}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Gap Radar</h2>
            {['Benchmarks', 'Datasets', 'Methods', 'Evaluation', 'Theory'].map((item, i) => (
              <div key={item} className="mt-3">
                <div className="flex justify-between font-mono text-xs text-zinc-500"><span>{item}</span><span>{88 - i * 8}%</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-blue-500/70" style={{ width: `${88 - i * 8}%` }} /></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
