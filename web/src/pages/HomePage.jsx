import { Link } from 'react-router-dom'

const capabilities = [
  { area: 'Document Synthesis', model: 'axiom-writer-v2', task: 'IMRaD manuscript generation', status: 'Operational' },
  { area: 'Semantic Analysis', model: 'semantic-net-7b', task: 'Linguistic decomposition & metrics', status: 'Operational' },
  { area: 'Provenance Scan', model: 'trace-scan-xl', task: 'Cross-corpus similarity detection', status: 'Operational' },
  { area: 'Citation Grounding', model: 'axiom-writer-v2', task: 'Retrieval-augmented references', status: 'Preview' },
]

const modules = [
  {
    to: '/generator',
    index: '01',
    title: 'Document Synthesis',
    model: 'axiom-writer-v2',
    description: 'Generate peer-review-ready manuscripts from a research topic. Produces title, abstract, and full IMRaD sections with formal academic register.',
  },
  {
    to: '/parser',
    index: '02',
    title: 'Semantic Analysis',
    model: 'semantic-net-7b',
    description: 'Decompose text into linguistic metrics — token counts, readability indices, sentence structure, and embedding-derived key phrases.',
  },
  {
    to: '/plagiarism-check',
    index: '03',
    title: 'Provenance Scan',
    model: 'trace-scan-xl',
    description: 'Detect cross-corpus similarity with sentence-level provenance tracing, source attribution, and automated risk classification.',
  },
]

function HomePage() {
  return (
    <div className="page">
      <header className="page-hero">
        <p className="eyebrow">Research Intelligence Suite · v2.4.1</p>
        <h1>
          Scholarly AI infrastructure
          <em> for rigorous research workflows</em>
        </h1>
        <p className="page-hero__lead">
          Axiom Lab provides a unified environment for document synthesis, semantic analysis,
          and provenance verification — built for research teams who demand transparency,
          reproducibility, and publication-grade output.
        </p>
        <div className="page-hero__actions">
          <Link to="/how-it-works" className="btn btn--primary">Explore architecture</Link>
          <Link to="/generator" className="btn btn--ghost">Launch synthesis module</Link>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric">
            <span className="hero-metric__value">3</span>
            <span className="hero-metric__label">Specialized models</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric__value">128k</span>
            <span className="hero-metric__label">Max context window</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric__value">2.4M</span>
            <span className="hero-metric__label">Indexed documents</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric__value">30–45s</span>
            <span className="hero-metric__label">Synthesis latency</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">System capabilities</h2>
          <Link to="/how-it-works" className="text-link">View full architecture →</Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Model</th>
                <th>Primary task</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((row) => (
                <tr key={row.area}>
                  <td>{row.area}</td>
                  <td><code>{row.model}</code></td>
                  <td className="text-secondary">{row.task}</td>
                  <td>
                    <span className={`status-badge ${row.status === 'Preview' ? 'status-badge--preview' : ''}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Research modules</h2>
        <div className="module-grid">
          {modules.map((mod) => (
            <article key={mod.to} className="module-card">
              <div className="module-card__index">{mod.index}</div>
              <div className="module-card__body">
                <code className="module-card__model">{mod.model}</code>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <Link to={mod.to} className="text-link">Open module →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--inset">
        <h2 className="section__title">Designed for research rigor</h2>
        <div className="principles-grid">
          <div className="principle">
            <h4>Transparent inference</h4>
            <p>Every request reports processing phases, token throughput, and model confidence — no black-box outputs.</p>
          </div>
          <div className="principle">
            <h4>Structured schemas</h4>
            <p>Results conform to predictable formats: IMRaD sections, metric dashboards, or provenance trace logs.</p>
          </div>
          <div className="principle">
            <h4>Reproducible passes</h4>
            <p>Stateless inference ensures each run is independent. Identical inputs produce consistent, auditable results.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
