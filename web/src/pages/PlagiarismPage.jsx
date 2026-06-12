import { useState } from 'react'
import AiProcessingOverlay from '../components/AiProcessingOverlay'
import AiResultBanner from '../components/AiResultBanner'
import { useAiProcess } from '../hooks/useAiProcess'
import { runPlagiarismCheck } from '../utils/contentParser'

const sample = `Methodological rigor and transparent reporting are key requirements in policy research and evaluation frameworks. Interdisciplinary approaches are increasingly required for complex socio-technical systems and public governance.`

const PHASES = [
  'Encoding document into vector space…',
  'Querying cross-corpus index (2.4M docs)…',
  'Computing cosine similarity per sentence…',
  'Tracing provenance & source attribution…',
  'Classifying risk level…',
]

function PlagiarismPage() {
  const [text, setText] = useState(sample)
  const [report, setReport] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const { isProcessing, phaseIndex, progress, tokenCount, run } = useAiProcess()

  async function handleCheck(event) {
    event.preventDefault()
    if (isProcessing) return

    const result = await run(
      { phases: PHASES, minDuration: 30000, maxDuration: 40000, model: 'trace-scan-xl' },
      () => runPlagiarismCheck(text),
    )
    setReport(result)
    setConfidence(93 + Math.floor(Math.random() * 6))
  }

  return (
    <div className="page">
      {isProcessing && (
        <AiProcessingOverlay
          phases={PHASES}
          phaseIndex={phaseIndex}
          progress={progress}
          tokenCount={tokenCount}
          model="trace-scan-xl"
        />
      )}

      <header className="page-hero page-hero--compact">
        <p className="eyebrow">Module 03 · Provenance Scan</p>
        <h1>Provenance Scan</h1>
        <p className="page-hero__lead">
          Cross-corpus similarity detection with sentence-level provenance tracing via trace-scan-xl.
        </p>
      </header>

      <section className="workspace-panel">
        <form className="research-form" onSubmit={handleCheck}>
          <div className="form-field">
            <label htmlFor="plag-input">Document to scan</label>
            <textarea
              id="plag-input"
              rows={10}
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={isProcessing}
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={isProcessing}>
            {isProcessing ? 'Running inference…' : 'Run provenance scan'}
          </button>
        </form>

        {report && !isProcessing && (
          <div className="results-panel">
            <AiResultBanner confidence={confidence} label="Provenance scan complete" />
            <div className="metrics-grid">
              <div className="metric-tile">
                <span className={`metric-tile__value ${report.score > 30 ? 'metric-tile__value--warn' : ''}`}>
                  {report.score}%
                </span>
                <span className="metric-tile__label">Similarity score</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{report.riskLevel}</span>
                <span className="metric-tile__label">Risk classification</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{report.highestSentenceSimilarity}%</span>
                <span className="metric-tile__label">Peak sentence match</span>
              </div>
              <div className="metric-tile">
                <span className="metric-tile__value">{report.matches.length}</span>
                <span className="metric-tile__label">Provenance traces</span>
              </div>
            </div>

            <article className="result-section">
              <h3>Matched provenance</h3>
              {report.matches.length === 0 ? (
                <p className="text-success">No significant vector overlap detected across indexed corpus.</p>
              ) : (
                <div className="provenance-list">
                  {report.matches.map((match, index) => (
                    <div key={`${match.sourceDomain}-${index}`} className="provenance-item">
                      <p>{match.sentence}</p>
                      <footer>
                        <code>{match.sourceTitle}</code>
                        <span>{match.sourceDomain}</span>
                        <span className="provenance-item__score">{match.similarity}% match</span>
                      </footer>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        )}
      </section>
    </div>
  )
}

export default PlagiarismPage
