import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="panel">
      <h1>Advanced Research Content Suite</h1>
      <p className="lead">
        Build academic documents, parse structure quality, and run plagiarism-style similarity checks from one clean dashboard.
      </p>
      <div className="feature-grid">
        <article className="feature-card">
          <h2>Research Generator</h2>
          <p>Create full research-paper sections from a single topic with formal academic language.</p>
          <Link to="/generator">Open Generator</Link>
        </article>
        <article className="feature-card">
          <h2>Content Parser</h2>
          <p>Analyze word count, sentence structure, reading time, and extracted key research terms.</p>
          <Link to="/parser">Open Parser</Link>
        </article>
        <article className="feature-card">
          <h2>Plagiarism Check</h2>
          <p>Mimics a Wuilbott-like check by scanning sentence similarity and matching source snippets.</p>
          <Link to="/plagiarism-check">Open Plag Check</Link>
        </article>
      </div>
    </section>
  )
}

export default HomePage
