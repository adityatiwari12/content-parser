import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageHeader } from '@/components/ui/PageHeader'
import { SourceAttributionList } from '@/components/ui/SourceAttribution'
import { runMockAction } from '@/lib/actions'
import type { SourceAttribution } from '@axiom/shared'

const promptChips = [
  'Compare these studies',
  'Find contradictions',
  'Suggest experiment design',
  'Explain methodology',
  'Generate hypotheses',
  'Create citation-backed summary',
]

const modes = ['Literature Q&A', 'Methodology Design', 'Gap Discovery', 'Reviewer Mode']

const selectedPapers = [
  ['Attention Is All You Need', '98k citations'],
  ['RAG for Knowledge-Intensive NLP', '8.9k citations'],
  ['Language Models are Few-Shot Learners', '45k citations'],
]

export default function CopilotPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(modes[0])
  const [reasoningStage, setReasoningStage] = useState('')
  const [sessionId] = useState(() => crypto.randomUUID())
  const [messages, setMessages] = useState<Array<{ role: string; content: string; sources?: SourceAttribution[]; confidence?: number; provider?: string; model?: string }>>([
    { role: 'assistant', content: 'I\'m your research copilot. Ask me about papers, methodologies, or research gaps — I\'ll ground every answer in retrieved sources.', confidence: 1 },
  ])

  useEffect(() => {
    const draft = localStorage.getItem('axiom-copilot-draft')
    if (draft) {
      setInput(draft)
      localStorage.removeItem('axiom-copilot-draft')
    }
  }, [])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: userMsg }])
    setLoading(true)
    for (const stage of ['Retrieving selected papers…', 'Checking citation graph…', 'Synthesizing grounded answer…']) {
      setReasoningStage(stage)
      await new Promise((r) => setTimeout(r, 900))
    }
    const data = await api.copilotMessage(sessionId, userMsg)
    setMessages((m) => [
      ...m,
      {
        role: 'assistant',
        content: `[${mode}] ${data.answer}`,
        sources: data.sources as SourceAttribution[],
        confidence: data.confidence,
        provider: typeof data.provider === 'string' ? data.provider : 'mock',
        model: typeof data.model === 'string' ? data.model : undefined,
      },
    ])
    setLoading(false)
    setReasoningStage('')
  }

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-5 xl:h-[calc(100vh-8rem)] xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="flex min-h-0 flex-col">
      <PageHeader title="AI Research Copilot" description="RAG-powered assistant with source attribution." />
        <div className="mb-4 flex flex-wrap gap-2">
          {modes.map((item) => (
            <button
              key={item}
              onClick={() => { setMode(item); runMockAction('Copilot mode selected', item) }}
              className={`rounded-lg px-3 py-2 font-mono text-xs ${
                mode === item ? 'bg-zinc-100 text-zinc-950' : 'border border-zinc-700 text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => { setInput(chip); runMockAction('Prompt loaded', chip) }}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
            >
              {chip}
            </button>
          ))}
        </div>
      <div className="flex-1 space-y-4 overflow-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === 'user' ? 'bg-blue-900/40 text-zinc-100' : 'bg-zinc-800 text-zinc-200'}`}>
              {m.content}
            </div>
            {m.confidence != null && m.role === 'assistant' && m.confidence < 1 && (
              <p className="mt-1 font-mono text-[10px] text-zinc-500">Confidence: {(m.confidence * 100).toFixed(0)}%</p>
            )}
            {m.role === 'assistant' && m.provider && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-green-500">
                provider: {m.provider}{m.model ? ` · ${m.model}` : ''}
              </p>
            )}
            {m.sources && <SourceAttributionList sources={m.sources} />}
          </div>
        ))}
        {loading && (
          <div className="rounded-2xl border border-blue-900/40 bg-blue-950/10 p-4">
            <p className="font-mono text-xs text-blue-400 animate-pulse">{reasoningStage}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {['retrieve', 'verify', 'synthesize'].map((step) => (
                <div key={step} className="rounded bg-zinc-950 px-3 py-2 font-mono text-[10px] uppercase text-zinc-500">
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Ask about your research…"
        />
        <button type="button" onClick={send} disabled={loading} className="rounded bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50">Send</button>
      </div>
      </section>
      <aside className="min-h-0 space-y-4 xl:block">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="font-serif text-2xl">Selected Corpus</h2>
          <div className="mt-4 space-y-3">
            {selectedPapers.map(([title, citations]) => (
              <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-sm text-zinc-200">{title}</p>
                <p className="mt-1 font-mono text-[10px] text-zinc-600">{citations} · source verified</p>
              </div>
            ))}
          </div>
          <button onClick={() => runMockAction('Paper picker opened', 'Mock corpus selector loaded 12 recommended papers.')} className="mt-4 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950">Add papers</button>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="font-serif text-2xl">Answer Controls</h2>
          {['No uncited claims', 'Show contradictions', 'Prefer recent papers', 'Include methods'].map((control) => (
            <label key={control} className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
              <input type="checkbox" defaultChecked className="accent-blue-500" />
              {control}
            </label>
          ))}
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="font-serif text-2xl">Session Trace</h2>
          {['RAG context: 3 papers', 'Citation graph: enabled', 'Hallucination guard: strict', 'Export: Markdown / BibTeX'].map((trace) => (
            <p key={trace} className="mt-2 font-mono text-xs text-zinc-500">{trace}</p>
          ))}
        </div>
      </aside>
    </div>
  )
}
