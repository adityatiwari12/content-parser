function AiResultBanner({ confidence, label = 'Inference complete' }) {
  return (
    <div className="result-banner">
      <div className="result-banner__indicator" aria-hidden="true" />
      <div className="result-banner__content">
        <strong>{label}</strong>
        <span>Model confidence: {confidence}%</span>
      </div>
      <code className="result-banner__tag">verified</code>
    </div>
  )
}

export default AiResultBanner
