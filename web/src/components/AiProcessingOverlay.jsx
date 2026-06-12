function AiProcessingOverlay({ phases, phaseIndex, progress, tokenCount, model }) {
  const currentPhase = phases[phaseIndex] ?? phases[phases.length - 1]

  return (
    <div className="inference-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="inference-overlay__backdrop" />
      <div className="inference-panel">
        <header className="inference-panel__header">
          <code className="inference-panel__model">{model}</code>
          <span className="inference-panel__status">Inference in progress</span>
        </header>

        <div className="inference-scanner" aria-hidden="true">
          <div className="inference-scanner__bar" />
          <div className="inference-scanner__pulse" />
        </div>

        <p className="inference-panel__phase">{currentPhase}</p>

        <div className="inference-progress">
          <div className="inference-progress__track">
            <div className="inference-progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="inference-progress__label">{progress}%</span>
        </div>

        <ul className="inference-phases">
          {phases.map((phase, index) => (
            <li
              key={phase}
              className={`inference-phases__item ${
                index < phaseIndex ? 'inference-phases__item--done' : index === phaseIndex ? 'inference-phases__item--active' : ''
              }`}
            >
              <span className="inference-phases__marker" aria-hidden="true">
                {index < phaseIndex ? '✓' : index === phaseIndex ? '●' : '○'}
              </span>
              {phase}
            </li>
          ))}
        </ul>

        <div className="inference-stats">
          <div className="inference-stat">
            <span className="inference-stat__label">Tokens processed</span>
            <span className="inference-stat__value">{tokenCount.toLocaleString()}</span>
          </div>
          <div className="inference-stat">
            <span className="inference-stat__label">Throughput</span>
            <span className="inference-stat__value inference-stat__value--live">active</span>
          </div>
          <div className="inference-stat">
            <span className="inference-stat__label">Queue depth</span>
            <span className="inference-stat__value">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiProcessingOverlay
