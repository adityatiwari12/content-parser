import { Link } from 'react-router-dom'

const pipelineStages = [
  {
    step: '01',
    title: 'Input normalization',
    detail: 'Raw text or topic prompts are tokenized, normalized for Unicode and whitespace, and segmented into processing units aligned to model context windows.',
    tech: ['BPE tokenization', '128k context', 'UTF-8 normalization'],
  },
  {
    step: '02',
    title: 'Embedding & retrieval',
    detail: 'Dense vector representations are computed and matched against indexed corpora. Retrieved passages ground generation and similarity scoring.',
    tech: ['768-dim embeddings', 'FAISS index', 'cosine retrieval'],
  },
  {
    step: '03',
    title: 'Model inference',
    detail: 'Specialized models run in parallel across the inference cluster. Each module is optimized for its task — synthesis, parsing, or provenance detection.',
    tech: ['multi-head attention', 'temperature 0.3', 'beam search'],
  },
  {
    step: '04',
    title: 'Structured output',
    detail: 'Results are validated, scored for confidence, and returned in structured schemas — sections, metrics, or provenance traces with source attribution.',
    tech: ['JSON schema', 'confidence scoring', 'audit log'],
  },
]

const models = [
  {
    id: 'axiom-writer-v2',
    name: 'Document Synthesis',
    route: '/generator',
    description: 'Autoregressive transformer fine-tuned on peer-reviewed corpora. Produces IMRaD-structured manuscripts with calibrated academic register.',
    params: '7B parameters',
    context: '128k tokens',
    latency: '30–45s',
  },
  {
    id: 'semantic-net-7b',
    name: 'Semantic Analysis',
    route: '/parser',
    description: 'Encoder model for linguistic decomposition — token statistics, readability indices, and unsupervised key-phrase extraction via embedding clustering.',
    params: '7B parameters',
    context: '32k tokens',
    latency: '30–40s',
  },
  {
    id: 'trace-scan-xl',
    name: 'Provenance Scan',
    route: '/plagiarism-check',
    description: 'Bi-encoder similarity engine indexed against 2.4M scholarly documents. Sentence-level matching with provenance chains and risk classification.',
    params: '1.2B parameters',
    context: '64k tokens',
    latency: '30–40s',
  },
]

const architectureFlow = [
  { label: 'Researcher input', type: 'input' },
  { label: 'Tokenizer', type: 'process' },
  { label: 'Embedding layer', type: 'process' },
  { label: 'Task router', type: 'router' },
  { label: 'Writer', type: 'model' },
  { label: 'Parser', type: 'model' },
  { label: 'Scanner', type: 'model' },
  { label: 'Structured report', type: 'output' },
]

function HowItWorksPage() {
  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <p className="eyebrow">Architecture & methodology</p>
        <h1>How Axiom Lab works</h1>
        <p className="page-hero__lead">
          A unified inference pipeline designed for research teams who need rigorous document synthesis,
          semantic analysis, and provenance verification — with full transparency into each processing stage.
        </p>
      </header>

      <section className="section">
        <h2 className="section__title">System architecture</h2>
        <p className="section__desc">
          All modules share a common preprocessing layer before routing to specialized models.
          Results are scored, logged, and returned with confidence metrics.
        </p>
        <div className="arch-diagram">
          {architectureFlow.map((node, i) => (
            <div key={node.label} className="arch-diagram__group">
              <div className={`arch-node arch-node--${node.type}`}>
                <span className="arch-node__label">{node.label}</span>
              </div>
              {i < architectureFlow.length - 1 && (
                <span className="arch-diagram__arrow" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Processing pipeline</h2>
        <div className="pipeline-timeline">
          {pipelineStages.map((stage) => (
            <article key={stage.step} className="pipeline-stage">
              <div className="pipeline-stage__marker">
                <span className="pipeline-stage__step">{stage.step}</span>
              </div>
              <div className="pipeline-stage__body">
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
                <div className="pipeline-stage__tech">
                  {stage.tech.map((t) => (
                    <code key={t}>{t}</code>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Model specifications</h2>
        <div className="model-spec-grid">
          {models.map((model) => (
            <article key={model.id} className="model-spec-card">
              <header className="model-spec-card__header">
                <code className="model-spec-card__id">{model.id}</code>
                <h3>{model.name}</h3>
              </header>
              <p>{model.description}</p>
              <dl className="model-spec-card__stats">
                <div><dt>Parameters</dt><dd>{model.params}</dd></div>
                <div><dt>Context</dt><dd>{model.context}</dd></div>
                <div><dt>Median latency</dt><dd>{model.latency}</dd></div>
              </dl>
              <Link to={model.route} className="text-link">
                Open module →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--inset">
        <h2 className="section__title">Research workflow</h2>
        <ol className="workflow-list">
          <li>
            <strong>Define your research objective</strong>
            <span>Enter a topic for synthesis, paste a manuscript for analysis, or submit text for provenance scanning.</span>
          </li>
          <li>
            <strong>Monitor inference stages</strong>
            <span>Each request traverses the full pipeline with real-time phase reporting, token throughput, and progress telemetry.</span>
          </li>
          <li>
            <strong>Review structured output</strong>
            <span>Results include confidence scores, section breakdowns, linguistic metrics, or provenance traces with source attribution.</span>
          </li>
          <li>
            <strong>Iterate and refine</strong>
            <span>Re-run with adjusted inputs. All modules are stateless — each invocation is an independent inference pass.</span>
          </li>
        </ol>
        <div className="section__actions">
          <Link to="/generator" className="btn btn--primary">Begin document synthesis</Link>
          <Link to="/" className="btn btn--ghost">Return to overview</Link>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksPage
