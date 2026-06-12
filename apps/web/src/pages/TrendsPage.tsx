import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { downloadText, runMockAction } from '@/lib/actions'

export default function TrendsPage() {
  const topics = useQuery({ queryKey: ['trends-topics'], queryFn: api.trendsTopics })
  const dash = useQuery({ queryKey: ['trends-dash'], queryFn: api.trendsDashboard })

  return (
    <div className="space-y-5">
      <PageHeader title="Trend Intelligence" description="Fastest growing topics, emerging authors, and forecasts." />
      <div className="flex flex-wrap gap-2">
        {['Forecast 12 months', 'Compare institutions', 'Export brief', 'Create alert', 'Watch topic'].map((action) => (
          <button
            key={action}
            onClick={() =>
              action === 'Export brief'
                ? downloadText('trend-brief.md', '# Trend Intelligence Brief\n\nMock forecast exported from Axiom Lab.')
                : runMockAction(action, `${action} configured for active research topics.`)
            }
            className="rounded-lg border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-100"
          >
            {action}
          </button>
        ))}
      </div>
      {topics.isLoading ? <Skeleton className="h-32" /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="mb-4 font-serif text-2xl text-green-400">Fastest Growing Topics</h3>
            {(topics.data as { growing: Array<{ topic: string; growth: number }> })?.growing?.map((t) => (
              <div key={t.topic} className="mb-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex justify-between text-sm">
                  <span>{t.topic}</span>
                  <span className="text-green-500">+{t.growth}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-green-500/70" style={{ width: `${Math.min(t.growth, 100)}%` }} />
                </div>
              </div>
            ))}
          </section>
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="mb-4 font-serif text-2xl text-red-400">Declining Topics</h3>
            {(topics.data as { declining: Array<{ topic: string; growth: number }> })?.declining?.map((t) => (
              <div key={t.topic} className="mb-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex justify-between text-sm">
                  <span>{t.topic}</span>
                  <span className="text-red-400">{t.growth}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-red-500/70" style={{ width: `${Math.abs(t.growth) * 2}%` }} />
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
      {dash.data && (
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            ['Publication Velocity', (dash.data as { publication_velocity: number }).publication_velocity.toLocaleString()],
            ['Citation Velocity', (dash.data as { citation_velocity: number }).citation_velocity.toLocaleString()],
            ['Emerging Authors', ((dash.data as { emerging_authors: string[] }).emerging_authors || []).length],
            ['Emerging Institutions', ((dash.data as { emerging_institutions: string[] }).emerging_institutions || []).length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-serif text-3xl">{value}</p>
              <p className="font-mono text-[10px] uppercase text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
