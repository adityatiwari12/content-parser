export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">{eyebrow}</p>}
      <h1 className="font-serif text-3xl font-medium text-zinc-100">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-zinc-400">{description}</p>}
    </header>
  )
}
