import { useCallback, useRef, useState } from 'react'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomBetween(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export function useAiProcess() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [tokenCount, setTokenCount] = useState(0)
  const tokenTimer = useRef(null)

  const run = useCallback(async (config, work) => {
    const {
      phases = ['Processing…'],
      minDuration = 30000,
      maxDuration,
      model = 'NeuralCore-v3',
    } = config

    const upper = maxDuration ?? minDuration
    const targetDuration = upper > minDuration
      ? randomBetween(minDuration, upper)
      : minDuration

    setIsProcessing(true)
    setPhaseIndex(0)
    setProgress(0)
    setTokenCount(0)

    const start = Date.now()
    const phaseDuration = targetDuration / phases.length

    tokenTimer.current = setInterval(() => {
      setTokenCount((prev) => prev + Math.floor(Math.random() * 120) + 25)
    }, 200)

    for (let i = 0; i < phases.length; i++) {
      setPhaseIndex(i)
      setProgress(Math.round(((i + 0.35) / phases.length) * 100))
      await delay(phaseDuration * (0.88 + Math.random() * 0.24))
      setProgress(Math.round(((i + 1) / phases.length) * 100))
    }

    const result = typeof work === 'function' ? work() : work

    const elapsed = Date.now() - start
    if (elapsed < targetDuration) {
      await delay(targetDuration - elapsed)
    }

    clearInterval(tokenTimer.current)
    setProgress(100)
    await delay(500)
    setIsProcessing(false)
    return result
  }, [])

  return { isProcessing, phaseIndex, progress, tokenCount, run }
}
