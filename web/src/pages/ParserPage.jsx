import { useState } from 'react'
import { parseContent } from '../utils/contentParser'

const starterText = `Artificial intelligence has transformed educational systems by improving personalization, feedback speed, and administrative efficiency. However, implementation quality is highly dependent on policy design, infrastructure readiness, and educator training.`

function ParserPage() {
  const [input, setInput] = useState(starterText)
  const [metrics, setMetrics] = useState(() => parseContent(starterText))

  function handleParse(event) {
    event.preventDefault()
    setMetrics(parseContent(input))
  }

  return (
    <section className="panel">
      <h1>Content Parser</h1>
      <form className="stack-form" onSubmit={handleParse}>
        <label htmlFor="content-input">Paste Content</label>
        <textarea
          id="content-input"
          rows={10}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">Parse Content</button>
      </form>

      <div className="metrics-grid">
        <article className="metric-card"><strong>{metrics.wordCount}</strong><span>Words</span></article>
        <article className="metric-card"><strong>{metrics.sentenceCount}</strong><span>Sentences</span></article>
        <article className="metric-card"><strong>{metrics.paragraphCount}</strong><span>Paragraphs</span></article>
        <article className="metric-card"><strong>{metrics.avgWordsPerSentence}</strong><span>Avg words/sentence</span></article>
        <article className="metric-card"><strong>{metrics.readingTimeMin} min</strong><span>Reading time</span></article>
      </div>

      <div className="output">
        <h2>Key Terms</h2>
        <p>{metrics.keyPhrases.join(', ') || 'No terms detected.'}</p>
      </div>
    </section>
  )
}

export default ParserPage
