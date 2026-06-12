import { motion } from 'framer-motion'

interface Props {
  phase?: string | null
  progress: number
  model?: string
}

export function InferenceProgress({ phase, progress, model = 'axiom-model' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6">
        <div className="mb-4 flex justify-between font-mono text-xs text-zinc-500">
          <span className="text-blue-400">{model}</span>
          <span>Inference in progress</span>
        </div>
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-sm text-zinc-200">{phase || 'Initializing…'}</p>
        <p className="mt-1 font-mono text-xs text-zinc-500">{progress}%</p>
      </div>
    </motion.div>
  )
}
