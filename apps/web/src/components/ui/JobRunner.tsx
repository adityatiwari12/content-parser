import { useState } from 'react'
import type { JobResponse } from '@axiom/shared'
import { runClientJob } from '@/lib/api'
import type { JobType } from '@/lib/mock/jobs'
import { InferenceProgress } from './InferenceProgress'
import { SourceAttributionList } from './SourceAttribution'
import { AgentTrace } from './AgentTrace'

interface Props {
  jobType: JobType
  getInput: () => Record<string, unknown>
  model: string
  runLabel?: string
  validate?: () => string | null
  children: (result: JobResponse) => React.ReactNode
}

function formatConfidence(c: number) {
  return (c <= 1 ? c * 100 : c).toFixed(1)
}

export function JobRunner({ jobType, getInput, model, runLabel = 'Run', validate, children }: Props) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<string | null>(null)
  const [result, setResult] = useState<JobResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    const validationError = validate?.()
    if (validationError) {
      setError(validationError)
      return
    }

    setRunning(true)
    setError(null)
    setResult(null)
    setProgress(0)
    setPhase(null)

    try {
      const final = await runClientJob(jobType, getInput(), (p, ph) => {
        setProgress(p)
        setPhase(ph)
      })
      setResult(final)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Job failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={running}
        className="rounded bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
      >
        {running ? 'Running inference…' : runLabel}
      </button>
      {running && <InferenceProgress phase={phase} progress={progress} model={model} />}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {result && (
        <div className="mt-6">
          {result.confidence != null && (
            <div className="mb-4 flex items-center gap-2 rounded border border-green-900/50 bg-green-950/30 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-mono text-xs text-green-400">
                Inference complete · Confidence: {formatConfidence(result.confidence)}%
              </span>
            </div>
          )}
          {children(result)}
          <SourceAttributionList sources={result.sources} />
          <AgentTrace steps={result.agent_trace} />
        </div>
      )}
    </div>
  )
}
