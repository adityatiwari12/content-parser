import { useEffect, useState } from 'react'

type Toast = {
  id: number
  title: string
  detail?: string
}

const ACTION_EVENT = 'axiom:action'

export function runMockAction(title: string, detail = 'Mock action completed successfully.') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(ACTION_EVENT, { detail: { title, detail } }))
}

export function copyText(text: string, label = 'Copied to clipboard') {
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(text)
  }
  runMockAction(label, text.length > 80 ? `${text.slice(0, 80)}…` : text)
}

export function downloadText(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
  runMockAction('Export ready', `${filename} downloaded.`)
}

export function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    function onAction(event: Event) {
      const custom = event as CustomEvent<{ title: string; detail?: string }>
      const id = Date.now()
      setToasts((items) => [{ id, ...custom.detail }, ...items].slice(0, 3))
      window.setTimeout(() => {
        setToasts((items) => items.filter((item) => item.id !== id))
      }, 3200)
    }

    window.addEventListener(ACTION_EVENT, onAction)
    return () => window.removeEventListener(ACTION_EVENT, onAction)
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-xl border border-zinc-700 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-green-400">{toast.title}</p>
          {toast.detail && <p className="mt-1 text-sm text-zinc-300">{toast.detail}</p>}
        </div>
      ))}
    </div>
  )
}
