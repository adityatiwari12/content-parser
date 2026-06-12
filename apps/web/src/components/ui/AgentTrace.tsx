import type { AgentTraceStep } from '@axiom/shared'

export function AgentTrace({ steps }: { steps: AgentTraceStep[] }) {
  if (!steps?.length) return null
  return (
    <details className="mt-4 rounded border border-zinc-800 bg-zinc-900/50 p-3">
      <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-zinc-400">
        Agent trace ({steps.length} steps)
      </summary>
      <ul className="mt-2 space-y-1">
        {steps.map((s, i) => (
          <li key={i} className="font-mono text-xs text-zinc-400">
            <span className="text-blue-400">{s.agent}</span> — {s.action}{' '}
            <span className="text-zinc-600">({s.duration_ms}ms)</span>
          </li>
        ))}
      </ul>
    </details>
  )
}
