import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { api } from '@/lib/api'

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState(() => api.listExperiments())
  const [name, setName] = useState('')

  function create() {
    if (!name.trim()) return
    api.createExperiment(name)
    setExperiments(api.listExperiments())
    setName('')
  }

  function addRun(expId: string) {
    api.addExperimentRun(expId)
    setExperiments(api.listExperiments())
  }

  return (
    <div>
      <PageHeader title="Experiment Tracking" description="Hyperparameters, metrics, and ML experiment dashboards." />
      <div className="mb-6 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Experiment name" className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
        <button type="button" onClick={create} className="rounded bg-zinc-100 px-4 py-2 text-sm text-zinc-900">Create</button>
      </div>
      <div className="space-y-4">
        {experiments.map((exp) => (
          <article key={exp.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{exp.name}</h3>
              <button type="button" onClick={() => addRun(exp.id)} className="rounded border border-zinc-600 px-2 py-1 font-mono text-xs text-zinc-300 hover:bg-zinc-800">
                + Log run
              </button>
            </div>
            {exp.description && <p className="mt-1 text-sm text-zinc-500">{exp.description}</p>}
            {exp.runs?.length > 0 && (
              <div className="mt-3 space-y-2">
                {exp.runs.map((run) => (
                  <div key={run.id} className="flex flex-wrap gap-3 rounded bg-zinc-800 p-3 font-mono text-xs">
                    <span className="text-green-400">acc: {run.metrics.accuracy}</span>
                    <span className="text-blue-400">f1: {run.metrics.f1}</span>
                    <span className="text-red-400">loss: {run.metrics.loss}</span>
                    <span className="text-zinc-500">lr={run.hyperparameters.lr} bs={run.hyperparameters.batch_size}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
