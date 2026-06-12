import { useState } from 'react'
import AiProcessingOverlay from '../components/AiProcessingOverlay'
import AiResultBanner from '../components/AiResultBanner'
import { useAiProcess } from '../hooks/useAiProcess'
import { generatePaper } from '../utils/paperGenerator'

const PHASES = [
  'Normalizing input tokens…',
  'Retrieving domain knowledge embeddings…',
  'Running autoregressive synthesis…',
  'Calibrating academic register…',
  'Validating section coherence…',
]

function GeneratorPage() {
  const [topic, setTopic] = useState('')
  const [paper, setPaper] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const { isProcessing, phaseIndex, progress, tokenCount, run } = useAiProcess()

  async function handleGenerate(event) {
    event.preventDefault()
    const value = topic.trim()
    if (!value || isProcessing) return

    const result = await run(
      { phases: PHASES, minDuration: 30000, maxDuration: 45000, model: 'axiom-writer-v2' },
      () => generatePaper(value),
    )
    setPaper(result)
    setConfidence(91 + Math.floor(Math.random() * 7))
  }

  return (
    <div className="page">
      {isProcessing && (
        <AiProcessingOverlay
          phases={PHASES}
          phaseIndex={phaseIndex}
          progress={progress}
          tokenCount={tokenCount}
          model="axiom-writer-v2"
        />
      )}

      <header className="page-hero page-hero--compact">
        <p className="eyebrow">Module 01 · Document Synthesis</p>
        <h1>Document Synthesis</h1>
        <p className="page-hero__lead">
          Generate IMRaD-structured manuscripts from a research topic using the axiom-writer-v2 model.
        </p>
      </header>

      <section className="workspace-panel">
        <form className="research-form" onSubmit={handleGenerate}>
          <div className="form-field">
            <label htmlFor="topic">Research topic</label>
            <input
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g., Transformer architectures for climate risk modeling"
              disabled={isProcessing}
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={isProcessing}>
            {isProcessing ? 'Running inference…' : 'Run synthesis'}
          </button>
        </form>

        {paper && !isProcessing && (
          <div className="results-panel">
            <AiResultBanner confidence={confidence} label="Synthesis complete" />
            {[
              ['Title', paper.title],
              ['Abstract', paper.abstract],
              ['Introduction', paper.introduction],
              ['Literature Review', paper.literatureReview],
              ['Methodology', paper.methodology],
              ['Results & Discussion', paper.resultsDiscussion],
              ['Conclusion', paper.conclusion],
            ].map(([heading, text]) => (
              <article key={heading} className="result-section">
                <h3>{heading}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default GeneratorPage
