import { useState } from 'react'
import AiProcessingOverlay from '../components/AiProcessingOverlay'
import AiResultBanner from '../components/AiResultBanner'
import { useAiProcess } from '../hooks/useAiProcess'
import { parseContent } from '../utils/contentParser'

const starterText = `Artificial intelligence has transformed educational systems by improving personalization, feedback speed, and administrative efficiency. However, implementation quality is highly dependent on policy design, infrastructure readiness, and educator training.`

const PHASES = [
  'Segmenting into semantic units…',
  'Computing token frequency distributions…',
  'Extracting embedding-based key phrases…',
  'Scoring readability & complexity…',
  'Aggregating linguistic metrics…',
]

function ParserPage() {
  const [input, setInput] = useState(starterText)
  const [metrics, setMetrics] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const { isProcessing, phaseIndex, progress, tokenCount, run } = useAiProcess()

  async function handleParse(event) {
    event.preventDefault()
    if (isProcessing) return

    const result = await run(
      { phases: PHASES, minDuration: 30000, maxDuration: 40000, model: 'semantic-net-7b' },
      () => parseContent(input),
    )
    setMetrics(result)
    setConfidence(88 + Math.floor(Math.random() * 10))
  }

  return (
    <div className="page">
      {isProcessing && (
        <AiProcessingOverlay
          phases={PHASES}
          phaseIndex={phaseIndex}
          progress={progress}
          tokenCount={tokenCount}
          model="semantic-net-7b"
        />
      )}

      <header className="page-hero page-hero--compact">
        <p className="eyebrow">Module 02 · Semantic Analysis</p>
        <h1>Semantic Analysis</h1>
        <p className="page-hero__lead">
          Decompose text into linguistic metrics and embedding-derived key phrases via semantic-net-7b.
        </p>
      </header>

      <section className="workspace-panel">
        <form className="research-form" onSubmit={handleParse}>
          <div className="form-field">
            <label htmlFor="content-input">Input corpus</label>
            <textarea
              id="content-input"
              rows={10}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isProcessing}
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={isProcessing}>
            {isProcessing ? 'Running inference…' : 'Run analysis'}
          </button>
        </form>

        {metrics && !isProcessing && (
          <div className="results-panel">
            <AiResultBanner confidence={confidence} label="Analysis complete" />
            <div className="metrics-grid">
              <div className="metric-tile">
                <span className="metric-tile__value">{metrics.wordCount}</span>
                <span className="metric-tile__label">Tokens</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{metrics.sentenceCount}</span>
                <span className="metric-tile__label">Sentences</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{metrics.paragraphCount}</span>
                <span className="metric-tile__label">Paragraphs</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{metrics.avgWordsPerSentence}</span>
                <span className="metric-tile__label">Avg tokens/sentence</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{metrics.readingTimeMin} min</span>
                <span className="metric-tile__label">Reading time</span>
              </div>
            </div>

            <article className="result-section">
              <h3>Extracted key phrases</h3>
              <div className="phrase-list">
                {metrics.keyPhrases.length === 0 ? (
                  <p className="text-secondary">No significant phrases detected.</p>
                ) : (
                  metrics.keyPhrases.map((phrase) => (
                    <code key={phrase} className="phrase-tag">{phrase}</code>
                  ))
                )}
              </div>
            </article>
          </div>
        )}
      </section>
    </div>
  )
}

export default ParserPage
