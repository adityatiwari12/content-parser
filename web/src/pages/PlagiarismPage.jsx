import { useState } from 'react'
import { runPlagiarismCheck } from '../utils/contentParser'

const sample = `Methodological rigor and transparent reporting are key requirements in policy research and evaluation frameworks. Interdisciplinary approaches are increasingly required for complex socio-technical systems and public governance.`

function PlagiarismPage() {
  const [text, setText] = useState(sample)
  const [report, setReport] = useState(() => runPlagiarismCheck(sample))

  function handleCheck(event) {
    event.preventDefault()
    setReport(runPlagiarismCheck(text))
  }

  return (
    <section className="panel">
      <h1>Plagiarism Check</h1>
      <p className="lead">Wuilbott-style similarity estimate with matched sentence-source evidence.</p>
      <form className="stack-form" onSubmit={handleCheck}>
        <label htmlFor="plag-input">Text to Analyze</label>
        <textarea
          id="plag-input"
          rows={10}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Run Plagiarism Check</button>
      </form>

      <div className="metrics-grid">
        <article className="metric-card"><strong>{report.score}%</strong><span>Plagiarism score</span></article>
        <article className="metric-card"><strong>{report.riskLevel}</strong><span>Risk level</span></article>
        <article className="metric-card"><strong>{report.highestSentenceSimilarity}%</strong><span>Highest sentence match</span></article>
        <article className="metric-card"><strong>{report.matches.length}</strong><span>Matched traces</span></article>
      </div>

      <div className="output">
        <h2>Matched Sentences</h2>
        {report.matches.length === 0 ? (
          <p>No significant overlap was detected.</p>
        ) : (
          <div className="match-list">
            {report.matches.map((match, index) => (
              <article key={`${match.sourceDomain}-${index}`} className="match-card">
                <p>{match.sentence}</p>
                <small>
                  Source: {match.sourceTitle} ({match.sourceDomain}) | Similarity: {match.similarity}%
                </small>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PlagiarismPage
