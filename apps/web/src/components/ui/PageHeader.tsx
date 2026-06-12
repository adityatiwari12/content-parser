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
    <header className="mb-10">
      {eyebrow && <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>}
      <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-zinc-100 md:text-6xl">{title}</h1>
      {description && <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">{description}</p>}
    </header>
  )
}
