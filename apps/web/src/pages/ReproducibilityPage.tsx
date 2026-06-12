import { useState } from 'react'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { InferenceProgress } from '@/components/ui/InferenceProgress'

export default function ReproducibilityPage() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState<Record<string, unknown> | null>(null)

  async function validate() {
    setRunning(true)
    setReport(null)
    const phases = ['Scanning dependencies…', 'Verifying assets…', 'Checking experimental validity…', 'Generating report…']
    for (let i = 0; i < phases.length; i++) {
      setProgress(Math.round(((i + 1) / phases.length) * 100))
      await new Promise((r) => setTimeout(r, 2000))
    }
    const result = await api.validateRepro() as { report: Record<string, unknown> }
    setReport(result.report)
    setRunning(false)
  }

  return (
    <div>
      <PageHeader title="Reproducibility Validation" description="Verify code, datasets, and paper reproducibility." />
      <button type="button" onClick={validate} disabled={running} className="rounded bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50">
        {running ? 'Validating…' : 'Run reproducibility check'}
      </button>
      {running && <InferenceProgress phase="Analyzing reproducibility bundle…" progress={progress} model="repro-validator" />}
      {report && (
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="mb-4 font-serif text-2xl">Score: {String(report.reproducibility_score)}/100</p>
          <p className="mb-2 text-sm text-zinc-400">Validity: {String(report.experimental_validity)}</p>
          <p className="mb-4 text-sm text-zinc-400">
            Dependencies consistent: {report.dependency_consistency ? 'Yes' : 'No'}
          </p>
          <h4 className="mb-2 font-mono text-xs uppercase text-zinc-500">Missing assets</h4>
          <ul className="mb-4 list-disc pl-5 text-sm text-amber-400">
            {(report.missing_assets as string[])?.map((a) => <li key={a}>{a}</li>)}
          </ul>
          <h4 className="mb-2 font-mono text-xs uppercase text-zinc-500">Recommendations</h4>
          <ul className="list-disc pl-5 text-sm text-zinc-300">
            {(report.recommendations as string[])?.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
