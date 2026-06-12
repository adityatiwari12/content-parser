import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { downloadText, runMockAction } from '@/lib/actions'

export default function GraphPage() {
  const nodes = useQuery({ queryKey: ['graph-nodes'], queryFn: () => api.graphNodes() })
  const edges = useQuery({ queryKey: ['graph-edges'], queryFn: () => api.graphEdges() })
  const clusters = useQuery({ queryKey: ['graph-clusters'], queryFn: () => api.graphClusters() })

  return (
    <div className="space-y-5">
      <PageHeader title="Research Knowledge Graph" description="Papers, authors, institutions, topics, and datasets." />
      <div className="flex flex-wrap gap-2">
        {['Cluster by topic', 'Show citations', 'Filter institutions', 'Path finder', 'Export graph', 'Add paper'].map((action) => (
          <button
            key={action}
            onClick={() =>
              action === 'Export graph'
                ? downloadText('knowledge-graph.json', JSON.stringify({ nodes: nodes.data, edges: edges.data }, null, 2))
                : runMockAction(action, `${action} applied to the research graph.`)
            }
            className="rounded-lg border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-100"
          >
            {action}
          </button>
        ))}
      </div>
      {nodes.isLoading ? <Skeleton className="h-40" /> : (
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(59,130,246,0.12),transparent_35%)]" />
          {(edges.data as Array<{ source: string; target: string; type: string }>)?.map((e, i) => (
            <div key={i} className="absolute h-px origin-left bg-zinc-700/50" style={{ left: `${12 + i * 11}%`, top: `${22 + (i % 5) * 13}%`, width: `${120 + i * 18}px`, transform: `rotate(${(i % 2 ? 18 : -14) + i * 3}deg)` }} />
          ))}
          {(nodes.data as Array<{ id: string; type: string; label: string }>)?.map((n, i) => (
            <div
              key={n.id}
              className="absolute rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-2xl"
              style={{ left: `${12 + (i * 17) % 72}%`, top: `${18 + (i * 23) % 58}%` }}
            >
              <p className="font-mono text-[10px] uppercase text-blue-400">{n.type}</p>
              <p className="max-w-40 truncate text-xs text-zinc-200">{n.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {(clusters.data as Array<{ label: string; size: number }>)?.map((c) => (
          <div key={c.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="font-medium">{c.label}</p>
            <p className="font-mono text-xs text-zinc-500">{c.size} connected nodes</p>
            <button onClick={() => runMockAction('Cluster opened', c.label)} className="mt-3 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">Explore cluster</button>
          </div>
        ))}
      </div>
    </div>
  )
}
