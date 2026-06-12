import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useThemeStore } from '@/stores/theme'

const fadeIn = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
}

const overload = [
  ['Millions', 'of papers appear faster than any researcher can read.'],
  ['Millions', 'of citations form trails that are difficult to follow.'],
  ['Thousands', 'of datasets remain disconnected from claims.'],
  ['Contradictions', 'emerge quietly across methods, benchmarks, and fields.'],
]

const lifecycle = ['Question', 'Evidence', 'Understanding', 'Hypothesis', 'Experiment', 'Manuscript', 'Publication']

const networkNodes = [
  ['Papers', 'left-[14%] top-[28%]'],
  ['Authors', 'left-[30%] top-[16%]'],
  ['Datasets', 'left-[58%] top-[20%]'],
  ['Topics', 'right-[13%] top-[35%]'],
  ['Institutions', 'left-[20%] bottom-[22%]'],
  ['Citations', 'right-[28%] bottom-[18%]'],
]

const workspaceMoments = [
  ['Discovery', 'The field becomes readable as a landscape of evidence, not a list of links.'],
  ['Reasoning', 'Contradictions, assumptions, methods, and gaps surface through conversation.'],
  ['Writing', 'Manuscripts grow from verified sources, notes, and research intent.'],
  ['Validation', 'Claims remain attached to citations, datasets, and reproducibility checks.'],
  ['Publication', 'The final argument is prepared for peer review, not just exported.'],
]

const trustPrinciples = [
  'Citation verification before confident claims',
  'Source attribution throughout synthesis',
  'Reproducibility artifacts treated as first-class evidence',
  'Peer review readiness built into the writing process',
  'Transparent links between evidence, reasoning, and output',
]

function KnowledgeBackground() {
  const points = [
    [8, 22], [18, 12], [30, 20], [43, 13], [58, 18], [72, 10], [86, 25],
    [14, 48], [28, 40], [46, 50], [63, 42], [80, 55],
    [22, 76], [40, 68], [60, 74], [78, 70],
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.18),transparent_38%),radial-gradient(circle_at_70%_70%,rgba(26,54,93,0.20),transparent_34%)]" />
      <svg className="absolute inset-x-0 top-20 mx-auto h-[70vh] w-[94vw] max-w-7xl opacity-70" viewBox="0 0 100 90">
        {points.map(([x, y], index) => {
          const next = points[(index + 3) % points.length]
          return (
            <motion.line
              key={`${x}-${y}-${index}`}
              x1={x}
              y1={y}
              x2={next[0]}
              y2={next[1]}
              stroke="rgba(180,200,225,0.34)"
              strokeWidth="0.08"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4.4, delay: index * 0.08 }}
            />
          )
        })}
        {points.map(([x, y], index) => (
          <motion.circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={index % 5 === 0 ? 0.75 : 0.38}
            fill={index % 5 === 0 ? '#f8f8f5' : '#8fb6e8'}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: index % 5 === 0 ? 0.75 : 0.45, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3 + index * 0.08 }}
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#070708] to-transparent" />
    </div>
  )
}

function SectionIntro({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <motion.div {...fadeIn} className="mx-auto max-w-5xl">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-blue-300/70">{kicker}</p>
      <h2 className="mt-5 font-serif text-6xl font-medium leading-[0.92] tracking-[-0.055em] text-[#F8F8F5] md:text-8xl">
        {title}
      </h2>
      {text && <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">{text}</p>}
    </motion.div>
  )
}

function ResearchOverload() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <SectionIntro
        kicker="The problem"
        title="Research now exceeds human attention."
        text="The frontier is no longer limited by curiosity. It is limited by orientation: what to read, which evidence to trust, what contradicts what, and where the next question begins."
      />
      <div className="mx-auto mt-20 grid max-w-6xl gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-4">
        {overload.map(([label, text], index) => (
          <motion.article
            key={label}
            {...fadeIn}
            transition={{ ...fadeIn.transition, delay: index * 0.08 }}
            className="min-h-72 bg-[#0d0d10]/90 p-8"
          >
            <p className="font-serif text-5xl text-white">{label}</p>
            <p className="mt-10 text-lg leading-8 text-white/50">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Paradigm() {
  return (
    <section className="px-6 py-32 md:py-44">
      <motion.div {...fadeIn} className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-blue-300/70">The new paradigm</p>
          <h2 className="mt-5 font-serif text-6xl leading-[0.92] tracking-[-0.055em] text-white md:text-8xl">
            The future researcher will not work alone.
          </h2>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.25)] backdrop-blur">
          <p className="text-2xl leading-10 text-white/72">
            Axiom introduces AI research agents as collaborators in scholarly reasoning. They do not replace the researcher. They keep context, surface uncertainty, connect evidence, and help transform scattered material into a disciplined line of inquiry.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {['Literature', 'Methodology', 'Peer Review'].map((agent) => (
              <div key={agent} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-serif text-2xl text-white">{agent}</p>
                <p className="mt-2 text-sm leading-6 text-white/45">Collaborator</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function Lifecycle() {
  return (
    <section id="lifecycle" className="px-6 py-32 md:py-44">
      <SectionIntro
        kicker="Research lifecycle"
        title="One intelligence layer across the entire scholarly arc."
        text="Axiom connects the movement from first question to publication readiness without forcing researchers into separate tools at every stage."
      />
      <div className="mx-auto mt-20 max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0c0d10] p-6 md:p-10">
          <div className="absolute left-10 right-10 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-blue-200/35 to-transparent md:block" />
          <div className="relative grid gap-4 md:grid-cols-7">
            {lifecycle.map((stage, index) => (
              <motion.div
                key={stage}
                {...fadeIn}
                transition={{ ...fadeIn.transition, delay: index * 0.06 }}
                className="min-h-48 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur"
              >
                <p className="font-mono text-xs text-white/35">0{index + 1}</p>
                <p className="mt-16 font-serif text-3xl leading-8 text-white">{stage}</p>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-7 text-white/45">
            Evidence, context, notes, citations, datasets, and reasoning remain connected as the research matures.
          </p>
        </div>
      </div>
    </section>
  )
}

function IntelligenceNetwork() {
  return (
    <section id="network" className="px-6 py-32 md:py-44">
      <SectionIntro
        kicker="Research intelligence network"
        title="Scientific knowledge as a living system."
        text="Axiom treats research as relationships: papers connected to authors, citations, datasets, institutions, topics, and emerging questions."
      />
      <motion.div {...fadeIn} className="relative mx-auto mt-20 h-[680px] max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#050608] shadow-[0_60px_180px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(96,165,250,0.16),transparent_38%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-75" viewBox="0 0 1200 680">
          {Array.from({ length: 52 }).map((_, index) => {
            const x = 90 + ((index * 211) % 1010)
            const y = 80 + ((index * 127) % 520)
            const tx = 90 + (((index + 9) * 211) % 1010)
            const ty = 80 + (((index + 7) * 127) % 520)
            return (
              <motion.line
                key={`network-edge-${index}`}
                x1={x}
                y1={y}
                x2={tx}
                y2={ty}
                stroke="rgba(180,205,235,0.18)"
                strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.8, delay: index * 0.02 }}
              />
            )
          })}
          {Array.from({ length: 64 }).map((_, index) => {
            const x = 90 + ((index * 211) % 1010)
            const y = 80 + ((index * 127) % 520)
            return (
              <motion.circle
                key={`network-node-${index}`}
                cx={x}
                cy={y}
                r={index % 8 === 0 ? 8 : 3.5}
                fill={index % 8 === 0 ? '#f8f8f5' : '#74a7e7'}
                initial={{ opacity: 0, scale: 0.2 }}
                whileInView={{ opacity: index % 8 === 0 ? 0.82 : 0.42, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.025 }}
              />
            )
          })}
        </svg>
        {networkNodes.map(([label, position]) => (
          <div key={label} className={`absolute ${position} rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-white/70 backdrop-blur-md`}>
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function WorkspaceShowcase() {
  return (
    <section id="workspace" className="px-6 py-32 md:py-44">
      <SectionIntro
        kicker="The workspace"
        title="A research environment, not a feature list."
        text="The workspace is where reading, conversation, citation, writing, and validation become one continuous intellectual process."
      />
      <motion.div {...fadeIn} className="mx-auto mt-20 max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#101114] p-4 shadow-[0_60px_180px_rgba(0,0,0,0.32)]">
        <div className="grid min-h-[620px] gap-4 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.12),transparent_34%),#08090b] p-5 md:grid-cols-[280px_minmax(0,1fr)] md:p-8">
          <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/35">Current inquiry</p>
            <p className="mt-4 font-serif text-3xl leading-8 text-white">Climate Risk Modeling</p>
            <div className="mt-10 space-y-3">
              {workspaceMoments.map(([label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/56">
                  {label}
                </div>
              ))}
            </div>
          </aside>
          <main className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-200/60">Research environment</p>
            <h3 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-white">
              Evidence, reasoning, and synthesis stay in the same room.
            </h3>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {workspaceMoments.map(([label, text]) => (
                <article key={label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="font-serif text-2xl text-white">{label}</p>
                  <p className="mt-3 text-sm leading-7 text-white/45">{text}</p>
                </article>
              ))}
            </div>
          </main>
        </div>
      </motion.div>
    </section>
  )
}

function Trust() {
  return (
    <section className="px-6 py-32 md:py-44">
      <motion.div {...fadeIn} className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-blue-300/70">Trust and integrity</p>
          <h2 className="mt-5 font-serif text-6xl leading-[0.92] tracking-[-0.055em] text-white md:text-8xl">
            Rigor is not a feature. It is the foundation.
          </h2>
        </div>
        <div className="space-y-3">
          {trustPrinciples.map((principle, index) => (
            <motion.div
              key={principle}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: index * 0.06 }}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5"
            >
              <p className="text-xl leading-8 text-white/72">{principle}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 900], [0, 120])
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.35])
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)

  return (
    <div className="min-h-screen overflow-hidden bg-[#070708] text-[#F8F8F5] selection:bg-blue-200/20">
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="flex items-center gap-3 text-white" aria-label="Axiom Lab home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 font-serif text-xl shadow-sm backdrop-blur">
            A
          </span>
          <span className="font-serif text-xl font-medium tracking-tight">Axiom Lab</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/45 md:flex" aria-label="Institution navigation">
          <a href="#lifecycle" className="hover:text-white">Lifecycle</a>
          <a href="#network" className="hover:text-white">Network</a>
          <a href="#workspace" className="hover:text-white">Workspace</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/15"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <Link
            to="/dashboard"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#101010] shadow-[0_16px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5"
          >
            Enter Axiom Lab
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
        <KnowledgeBackground />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mx-auto mb-8 w-fit rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-white/55 backdrop-blur-md"
          >
            The digital front door to a new research institution
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[16vw] font-medium leading-[0.78] tracking-[-0.085em] text-white md:text-[9.5rem]"
          >
            Research is becoming
            <span className="block italic text-blue-100/80">too complex for humans alone.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mx-auto mt-10 max-w-3xl text-balance text-xl leading-9 text-white/58 md:text-2xl md:leading-10"
          >
            Axiom helps researchers discover evidence, identify opportunities, validate findings, and publish with confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/dashboard" className="rounded-full bg-white px-8 py-4 text-sm font-medium text-[#101010] hover:-translate-y-0.5">
              Enter Axiom Lab
            </Link>
            <a href="#network" className="rounded-full border border-white/10 bg-white/10 px-8 py-4 text-sm font-medium text-white/70 backdrop-blur hover:bg-white/15">
              See the knowledge network
            </a>
          </motion.div>
        </motion.div>
      </section>

      <ResearchOverload />
      <Paradigm />
      <Lifecycle />
      <IntelligenceNetwork />
      <WorkspaceShowcase />
      <Trust />

      <section className="flex min-h-screen items-center justify-center px-6 py-32">
        <motion.div {...fadeIn} className="mx-auto max-w-7xl text-center">
          <p className="font-serif text-[18vw] font-medium leading-[0.78] tracking-[-0.085em] text-white md:text-[10rem]">
            Research deserves
            <span className="block italic text-blue-100/75">better tools.</span>
          </p>
          <p className="mx-auto mt-10 max-w-2xl text-xl leading-9 text-white/55">
            Built for researchers who care about evidence, rigor, and discovery.
          </p>
          <Link
            to="/dashboard"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-sm font-medium text-[#101010] hover:-translate-y-0.5"
          >
            Enter Axiom Lab
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
