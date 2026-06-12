import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { JobRunner } from '@/components/ui/JobRunner'
import { downloadText, runMockAction } from '@/lib/actions'
import { downloadPaperPdf, paperWordCount } from '@/lib/paperPdf'

const SECTION_LABELS: Record<string, string> = {
  title: 'Title',
  authors: 'Authors',
  abstract: 'Abstract',
  keywords: 'Keywords',
  introduction: 'Introduction',
  literatureReview: 'Literature Review',
  conceptualFramework: 'Conceptual Framework',
  methodology: 'Methodology',
  evaluationPlan: 'Evaluation Plan',
  expectedResults: 'Expected Results',
  resultsDiscussion: 'Results and Discussion',
  discussion: 'Discussion',
  limitations: 'Limitations',
  conclusion: 'Conclusion',
  references: 'References',
}

const SECTION_ORDER = [
  'abstract',
  'keywords',
  'introduction',
  'literatureReview',
  'conceptualFramework',
  'methodology',
  'evaluationPlan',
  'expectedResults',
  'resultsDiscussion',
  'discussion',
  'limitations',
  'conclusion',
  'references',
]

export default function WritingPage() {
  const [topic, setTopic] = useState('Transformer architectures for climate risk modeling')
  const sections = ['Title', 'Abstract', 'Introduction', 'Literature Review', 'Framework', 'Methodology', 'Evaluation', 'Results', 'Discussion', 'Limitations', 'Conclusion', 'References']
  const presets = ['Systematic review', 'Empirical study', 'Position paper', 'Grant proposal']

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Writing Studio" title="Document Synthesis" description="IMRaD manuscript generation via axiom-writer-v2." />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => runMockAction('Preset applied', `${preset} structure selected.`)}
                className="rounded-lg border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-100"
              >
                {preset}
              </button>
            ))}
          </div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-zinc-500">Research topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Transformer architectures for climate risk modeling"
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm"
          />
          <div className="mb-5 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
            {['Tone: Academic', 'Depth: Journal', 'Citations: Required', 'Format: IMRaD'].map((item) => (
              <button key={item} onClick={() => runMockAction('Writing option toggled', item)} className="bg-zinc-950 px-3 py-3 text-left font-mono text-[11px] text-zinc-400 hover:bg-zinc-900">
                {item}
              </button>
            ))}
          </div>
          <JobRunner
            jobType="writing"
            model="axiom-writer-v2"
            runLabel="Run full synthesis"
            getInput={() => ({ topic })}
            validate={() => (!topic.trim() ? 'Enter a research topic.' : null)}
          >
            {(job) => {
              const paper = job.result?.paper as Record<string, string> | undefined
              if (!paper) return null
              const wordCount = paperWordCount(paper)
              return (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Generated manuscript</p>
                        <h2 className="mt-2 font-serif text-3xl leading-tight text-zinc-100">{paper.title}</h2>
                        <p className="mt-2 text-sm text-zinc-500">{paper.authors}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          ['Words', wordCount.toLocaleString()],
                          ['Sections', SECTION_ORDER.filter((key) => paper[key]).length],
                          ['Style', 'Journal'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg border border-zinc-800 px-3 py-2">
                            <p className="font-serif text-xl text-zinc-100">{value}</p>
                            <p className="font-mono text-[9px] uppercase text-zinc-600">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Insert citations', 'Improve clarity', 'Expand methodology', 'Download PDF', 'Export .docx', 'Generate abstract variants'].map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          if (action === 'Export .docx') {
                            downloadText('axiom-manuscript.docx.txt', Object.entries(paper).map(([k, v]) => `${SECTION_LABELS[k] || k}\n${v}`).join('\n\n'))
                          } else if (action === 'Download PDF') {
                            downloadPaperPdf(paper, 'axiom-lab-research-paper.pdf')
                            runMockAction('PDF downloaded', 'Professional research paper template exported.')
                          } else {
                            runMockAction(action, `${action} completed for current manuscript.`)
                          }
                        }}
                        className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                  <article className="rounded-2xl border border-zinc-800 bg-[#f8f8f5] p-5 text-[#101010] shadow-2xl md:p-8">
                    <header className="border-b border-black/10 pb-6 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5F6368]">Axiom Lab Research Manuscript</p>
                      <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl">{paper.title}</h1>
                      <p className="mt-4 text-sm text-[#5F6368]">{paper.authors}</p>
                    </header>
                    {SECTION_ORDER.filter((key) => paper[key]).map((key, index) => (
                      <section key={key} className="border-b border-black/10 py-6 last:border-b-0">
                        <h3 className="font-serif text-2xl text-[#1A365D]">
                          {key === 'abstract' || key === 'keywords' || key === 'references' ? SECTION_LABELS[key] : `${index - 1}. ${SECTION_LABELS[key]}`}
                        </h3>
                        <div className={`mt-3 space-y-4 text-sm leading-7 ${key === 'abstract' ? 'font-medium text-[#303030]' : 'text-[#2f2f2f]'}`}>
                          {paper[key].split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex} className={key === 'references' ? 'pl-6 -indent-6 font-mono text-xs leading-6 text-[#3d3d3d]' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </section>
                    ))}
                  </article>
                  {Object.entries(paper).filter(([k]) => !['title', 'authors', ...SECTION_ORDER].includes(k)).map(([k, v]) => (
                    <section key={k} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <h3 className="mb-2 border-b border-zinc-800 pb-2 font-serif text-xl capitalize">{SECTION_LABELS[k] || k}</h3>
                      <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
                        {v.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                      </div>
                    </section>
                  ))}
                </div>
              )
            }}
          </JobRunner>
        </section>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Manuscript Map</h2>
            <div className="mt-4 space-y-2">
              {sections.map((section, index) => (
                <div key={section} className="flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-2">
                  <span className="text-sm">{section}</span>
                  <span className="font-mono text-[10px] text-zinc-600">{index < 3 ? 'ready' : 'pending'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h2 className="font-serif text-2xl">Writing Checks</h2>
            {['Academic tone', 'Citation density', 'Technical depth', 'Reproducibility language'].map((check, index) => (
              <div key={check} className="mt-3">
                <div className="flex justify-between font-mono text-xs text-zinc-500">
                  <span>{check}</span>
                  <span>{82 - index * 6}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-blue-500/70" style={{ width: `${82 - index * 6}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
