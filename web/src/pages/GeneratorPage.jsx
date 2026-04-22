import { useState } from 'react'
import { generatePaper } from '../utils/paperGenerator'

function GeneratorPage() {
  const [topic, setTopic] = useState('')
  const [paper, setPaper] = useState(null)

  function handleGenerate(event) {
    event.preventDefault()
    const value = topic.trim()
    if (!value) return
    setPaper(generatePaper(value))
  }

  return (
    <section className="panel">
      <h1>Research Generator</h1>
      <form className="stack-form" onSubmit={handleGenerate}>
        <label htmlFor="topic">Research Topic</label>
        <input
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="e.g., AI-driven Climate Risk Modeling"
        />
        <button type="submit">Generate Paper Content</button>
      </form>

      {paper && (
        <div className="output">
          <h2>Title</h2>
          <p>{paper.title}</p>
          <h2>Abstract</h2>
          <p>{paper.abstract}</p>
          <h2>Introduction</h2>
          <p>{paper.introduction}</p>
          <h2>Literature Review</h2>
          <p>{paper.literatureReview}</p>
          <h2>Methodology</h2>
          <p>{paper.methodology}</p>
          <h2>Results &amp; Discussion</h2>
          <p>{paper.resultsDiscussion}</p>
          <h2>Conclusion</h2>
          <p>{paper.conclusion}</p>
        </div>
      )}
    </section>
  )
}

export default GeneratorPage
