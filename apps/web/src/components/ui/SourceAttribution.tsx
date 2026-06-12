import type { SourceAttribution as Source } from '@axiom/shared'

export function SourceAttributionList({ sources }: { sources: Source[] }) {
  if (!sources?.length) return null
  return (
    <div className="mt-4 border-t border-zinc-800 pt-4">
      <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2">Sources</h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => {
          const body = (
            <>
              {s.title.slice(0, 40)}…
              <span className="text-zinc-500">{(s.confidence * 100).toFixed(0)}%</span>
            </>
          )
          const className = 'inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-blue-400 hover:border-blue-900 hover:text-blue-300'
          return s.doi ? (
            <a key={s.id} href={`https://doi.org/${s.doi}`} target="_blank" rel="noreferrer" className={className} title={s.doi}>
              {body}
            </a>
          ) : (
            <span key={s.id} className={className}>
              {body}
            </span>
          )
        })}
      </div>
    </div>
  )
}
