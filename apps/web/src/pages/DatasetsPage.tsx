import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { api } from '@/lib/api'

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState(() => api.listDatasets())
  const [uploading, setUploading] = useState(false)

  function handleUpload(file: File) {
    setUploading(true)
    setTimeout(() => {
      const ds = api.uploadDataset(file.name)
      setDatasets(api.listDatasets())
      setUploading(false)
      void ds
    }, 1500)
  }

  return (
    <div>
      <PageHeader title="Dataset Intelligence Hub" description="Upload datasets for profiling, bias detection, and statistical reports." />
      <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${uploading ? 'border-blue-500 bg-blue-950/20' : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500'}`}>
        <span className="text-zinc-400">{uploading ? 'Profiling dataset…' : 'Drop CSV / JSON or click to upload'}</span>
        <input type="file" className="hidden" accept=".csv,.json,.parquet" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
      </label>

      {datasets.length > 0 && (
        <div className="mt-8 space-y-4">
          {datasets.map((ds) => (
            <article key={ds.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="font-medium">{ds.name}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                <div className="rounded bg-zinc-800 p-2 text-center">
                  <p className="font-serif text-lg">{ds.profile.rows}</p>
                  <p className="font-mono text-[10px] text-zinc-500">rows</p>
                </div>
                <div className="rounded bg-zinc-800 p-2 text-center">
                  <p className="font-serif text-lg">{ds.profile.columns}</p>
                  <p className="font-mono text-[10px] text-zinc-500">columns</p>
                </div>
                <div className="rounded bg-zinc-800 p-2 text-center">
                  <p className="font-serif text-lg">{ds.profile.missing_values_pct}%</p>
                  <p className="font-mono text-[10px] text-zinc-500">missing</p>
                </div>
                <div className="rounded bg-zinc-800 p-2 text-center">
                  <p className="font-serif text-lg">{ds.profile.bias_flags.length}</p>
                  <p className="font-mono text-[10px] text-zinc-500">bias flags</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {ds.profile.bias_flags.map((f) => (
                  <span key={f} className="rounded bg-amber-950/40 px-2 py-0.5 font-mono text-xs text-amber-400">{f}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
