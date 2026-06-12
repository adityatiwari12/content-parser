import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useThemeStore } from '@/stores/theme'

const ecosystem = [
  'arXiv',
  'Semantic Scholar',
  'OpenAlex',
  'Crossref',
  'PubMed',
  'Research Papers',
  'Citations',
  'Datasets',
]

const metrics = [
  ['12M+', 'Papers Indexed'],
  ['500M+', 'Citations Analyzed'],
  ['250K+', 'Research Topics'],
  ['50K+', 'Datasets Connected'],
]

const workflow = [
  'Discover',
  'Analyze',
  'Identify Gaps',
  'Generate Insights',
  'Draft Research',
  'Review',
  'Publish',
]

const agents = [
  ['Literature Agent', 'Finds, clusters, and summarizes relevant scholarly work.', 'Corpus mapping'],
  ['Research Gap Agent', 'Ranks underexplored opportunities with confidence evidence.', 'Opportunity scoring'],
  ['Methodology Agent', 'Recommends study designs, benchmarks, and evaluation methods.', 'Protocol design'],
  ['Citation Agent', 'Formats, validates, and recommends academically sound citations.', 'Integrity checks'],
  ['Peer Review Agent', 'Simulates journal-style review and publication readiness.', 'Reviewer reports'],
  ['Statistical Analysis Agent', 'Checks metrics, variance, missing controls, and claims.', 'Validity review'],
]

const previews = [
  ['Literature review generation', 'Key themes, consensus, contradictions, open challenges.'],
  ['Citation intelligence', 'APA, IEEE, ACM, Harvard, and validation workflows.'],
  ['Knowledge graph exploration', 'Papers, authors, institutions, topics, and datasets.'],
  ['AI peer review', 'Novelty, methodology, citation quality, readiness score.'],
  ['Collaborative research workspace', 'Projects, notes, discussions, and version history.'],
]

const features = [
  'Research Discovery',
  'Literature Intelligence',
  'Research Gap Detection',
  'AI Writing Copilot',
  'Citation Verification',
  'Peer Review Preparation',
  'Knowledge Graph Exploration',
  'Reproducibility Validation',
]

const testimonials = [
  ['Professor of Computational Science', 'Axiom feels less like software and more like a scholarly instrument. It compresses weeks of literature orientation into a rigorous, auditable workflow.'],
  ['PhD Researcher, Biomedical NLP', 'The source attribution changes how I trust AI-assisted writing. Every claim has a trail back to the research graph.'],
  ['University Research Lab Director', 'It gives our team a shared operating system for discovery, writing, review, and reproducibility.'],
]

const fadeIn = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
}

function CitationConstellation() {
  const nodes = [
    [18, 22],
    [32, 16],
    [52, 20],
    [68, 14],
    [78, 30],
    [28, 42],
    [48, 44],
    [64, 52],
    [38, 68],
    [58, 72],
    [76, 66],
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-x-0 top-24 mx-auto h-[58vh] w-[92vw] max-w-6xl opacity-70" viewBox="0 0 100 80">
        <defs>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="0.1" />
          </filter>
        </defs>
        {nodes.slice(0, -1).map((node, index) => {
          const next = nodes[index + 1]
          return (
            <motion.line
              key={`${node[0]}-${next[0]}`}
              x1={node[0]}
              y1={node[1]}
              x2={next[0]}
              y2={next[1]}
              stroke="#1A365D"
              strokeWidth="0.08"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.25 }}
              transition={{ duration: 3.8, delay: index * 0.18, ease: 'easeInOut' }}
            />
          )
        })}
        {nodes.map(([x, y], index) => (
          <motion.g
            key={`${x}-${y}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 + index * 0.12 }}
          >
            <circle cx={x} cy={y} r="0.9" fill="#1A365D" opacity="0.34" filter="url(#softBlur)" />
            <circle cx={x} cy={y} r="0.25" fill="#101010" opacity="0.55" />
          </motion.g>
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-[radial-gradient(ellipse_at_bottom,rgba(26,54,93,0.12),transparent_62%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#F8F8F5] to-transparent" />
    </div>
  )
}

function FloatingEcosystem() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {ecosystem.map((item, index) => {
        const positions = [
          'left-[12%] top-[27%]',
          'left-[28%] top-[16%]',
          'left-[50%] top-[14%]',
          'right-[24%] top-[18%]',
          'right-[11%] top-[31%]',
          'left-[16%] bottom-[27%]',
          'right-[18%] bottom-[25%]',
          'left-[48%] bottom-[18%]',
        ]
        return (
          <motion.div
            key={item}
            className={`absolute ${positions[index]} slow-drift rounded-2xl border border-black/10 bg-white/55 px-4 py-2 text-sm text-[#5F6368] shadow-[0_18px_60px_rgba(16,16,16,0.08)] backdrop-blur-md`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6 + index * 0.1 }}
            style={{ animationDelay: `${index * -1.8}s` }}
          >
            {item}
          </motion.div>
        )
      })}
    </div>
  )
}

function MiniGraph() {
  return (
    <div className="relative mx-auto mt-16 aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-black/10 bg-white/40 p-8 shadow-[0_40px_120px_rgba(16,16,16,0.08)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(26,54,93,0.08),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(16,16,16,0.05),transparent_30%)]" />
      <svg className="relative h-full w-full" viewBox="0 0 900 500" aria-label="Animated knowledge graph visualization">
        {Array.from({ length: 28 }).map((_, i) => {
          const x = 80 + ((i * 127) % 740)
          const y = 60 + ((i * 83) % 380)
          const tx = 80 + (((i + 5) * 127) % 740)
          const ty = 60 + (((i + 3) * 83) % 380)
          return (
            <motion.line
              key={`edge-${i}`}
              x1={x}
              y1={y}
              x2={tx}
              y2={ty}
              stroke="#1A365D"
              strokeWidth="0.7"
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 0.18, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, delay: i * 0.03 }}
            />
          )
        })}
        {Array.from({ length: 34 }).map((_, i) => {
          const x = 80 + ((i * 127) % 740)
          const y = 60 + ((i * 83) % 380)
          return (
            <motion.circle
              key={`node-${i}`}
              cx={x}
              cy={y}
              r={i % 7 === 0 ? 8 : 4}
              fill={i % 7 === 0 ? '#1A365D' : '#101010'}
              opacity={i % 7 === 0 ? 0.55 : 0.32}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: i % 7 === 0 ? 0.55 : 0.32, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.04 }}
            />
          )
        })}
      </svg>
    </div>
  )
}

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <motion.div {...fadeIn} className="mx-auto max-w-3xl text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-[#1A365D]">{kicker}</p>
      <h2 className="font-serif text-5xl font-medium leading-[0.95] tracking-[-0.03em] text-[#101010] md:text-7xl">
        {title}
      </h2>
      {text && <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5F6368]">{text}</p>}
    </motion.div>
  )
}

export default function HomePage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 900], [0, 120])
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.35])
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)

  return (
    <div className="axiom-grain min-h-screen overflow-hidden bg-[#F8F8F5] text-[#101010] selection:bg-[#1A365D]/15">
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="flex items-center gap-3 text-[#101010]" aria-label="Axiom Lab home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 font-serif text-xl shadow-sm backdrop-blur">
            A
          </span>
          <span className="font-serif text-xl font-medium tracking-tight">Axiom Lab</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[#5F6368] md:flex" aria-label="Marketing navigation">
          <a href="#network" className="transition-colors hover:text-[#101010]">Research</a>
          <a href="#agents" className="transition-colors hover:text-[#101010]">Workflow</a>
          <a href="#platform" className="transition-colors hover:text-[#101010]">Workspace</a>
          <a href="#testimonials" className="transition-colors hover:text-[#101010]">Proof</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-full border border-black/10 bg-white/55 px-4 py-3 text-sm font-medium text-[#101010] backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <Link
            to="/dashboard"
            className="rounded-full bg-[#101010] px-5 py-3 text-sm font-medium text-white shadow-[0_16px_50px_rgba(16,16,16,0.16)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2"
          >
            Enter Axiom Lab
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-24">
        <CitationConstellation />
        <FloatingEcosystem />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mx-auto mb-7 w-fit rounded-full border border-black/10 bg-white/55 px-5 py-2 text-sm text-[#5F6368] shadow-sm backdrop-blur-md"
          >
            A quieter workspace for serious research teams
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[17vw] font-medium leading-[0.78] tracking-[-0.075em] text-[#101010] sm:text-[7.8rem] md:text-[9.5rem]"
          >
            The Research
            <span className="block italic tracking-[-0.06em] text-[#1A365D]">Operating System</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mx-auto mt-9 max-w-3xl text-balance text-xl leading-8 text-[#5F6368] md:text-2xl md:leading-9"
          >
            Move from question to literature, evidence, manuscript, and review.
            <span className="block text-lg md:text-xl">
              Built for researchers who need clarity, source integrity, and momentum.
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/dashboard" className="rounded-full bg-[#101010] px-7 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">
              Start Researching
            </Link>
            <a href="#platform" className="rounded-full border border-black/10 bg-white/45 px-7 py-4 text-sm font-medium text-[#101010] backdrop-blur transition-transform hover:-translate-y-0.5">
              Explore Platform
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section id="network" className="px-6 py-28 md:py-36">
        <SectionTitle
          kicker="Research Intelligence Network"
          title="A living map of scientific knowledge."
          text="Axiom connects papers, citations, datasets, topics, authors, and institutions into an explorable research graph."
        />
        <MiniGraph />
        <div className="mx-auto mt-12 grid max-w-6xl gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 md:grid-cols-4">
          {metrics.map(([value, label], index) => (
            <motion.div
              key={label}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: index * 0.08 }}
              className="bg-[#F8F8F5]/85 p-8 text-center backdrop-blur"
            >
              <p className="font-serif text-5xl font-medium tracking-tight text-[#101010]">{value}</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-[#5F6368]">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-28">
        <SectionTitle kicker="Research Workflow" title="From question to publication." />
        <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-4 md:flex-row md:items-stretch">
          {workflow.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="group relative flex-1 rounded-3xl border border-black/10 bg-white/35 p-6 backdrop-blur transition-colors hover:bg-white/60"
            >
              <p className="font-mono text-xs text-[#5F6368]">0{index + 1}</p>
              <h3 className="mt-10 font-serif text-3xl font-medium text-[#101010]">{step}</h3>
              {index < workflow.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-black/20 md:block" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section id="agents" className="px-6 py-28">
        <SectionTitle
          kicker="AI Research Agents"
          title="Specialists for every stage of scholarship."
          text="Each agent is designed around academic integrity: source attribution, reproducibility, and explicit confidence."
        />
        <div className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {agents.map(([name, role, capability], index) => (
            <motion.article
              key={name}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: index * 0.06 }}
              className="slow-drift-reverse rounded-[1.75rem] border border-black/10 bg-white/45 p-7 shadow-[0_28px_80px_rgba(16,16,16,0.06)] backdrop-blur"
              style={{ animationDelay: `${index * -2}s` }}
            >
              <div className="mb-8 h-20 rounded-2xl border border-black/10 bg-[radial-gradient(circle_at_30%_30%,rgba(26,54,93,0.14),transparent_45%)]">
                <div className="citation-pulse h-full rounded-2xl bg-[linear-gradient(90deg,transparent,rgba(26,54,93,0.08),transparent)]" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#1A365D]">{capability}</p>
              <h3 className="mt-3 font-serif text-3xl font-medium text-[#101010]">{name}</h3>
              <p className="mt-4 leading-7 text-[#5F6368]">{role}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="platform" className="px-6 py-28">
        <SectionTitle kicker="Platform Preview" title="The workspace behind the institution." />
        <motion.div {...fadeIn} className="mx-auto mt-16 max-w-7xl rounded-[2rem] border border-black/10 bg-[#101010] p-3 shadow-[0_50px_140px_rgba(16,16,16,0.18)]">
          <div className="dark-institute overflow-hidden rounded-[1.4rem] border border-white/10 p-6 md:p-10">
            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-serif text-3xl text-white">Axiom Workspace</p>
                <p className="text-sm text-white/45">Project: AI for scientific discovery</p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-white/55">
                Mock inference active
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">Literature review generation</p>
                <h3 className="mt-4 font-serif text-4xl text-white">Consensus, contradictions, and open questions.</h3>
                <div className="mt-8 space-y-3">
                  {previews.slice(0, 3).map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm text-white/45">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {previews.slice(3).map(([title, desc]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <p className="font-serif text-2xl text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/45">{desc}</p>
                  </div>
                ))}
                <Link to="/dashboard" className="block rounded-3xl bg-white px-6 py-5 text-center text-sm font-medium text-[#101010]">
                  Open working mock platform
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-28">
        <SectionTitle kicker="Why Researchers Choose Axiom Lab" title="Built for rigor, not novelty." />
        <div className="mx-auto mt-16 grid max-w-6xl gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: index * 0.04 }}
              className="group bg-[#F8F8F5]/90 p-7 transition-colors hover:bg-white"
            >
              <p className="font-mono text-xs text-[#5F6368]">0{index + 1}</p>
              <h3 className="mt-12 font-serif text-2xl font-medium leading-tight text-[#101010]">{feature}</h3>
              <div className="mt-6 h-px w-10 bg-[#1A365D]/40 transition-all group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="px-6 py-28">
        <SectionTitle kicker="Journal Excerpts" title="Quiet confidence from research teams." />
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map(([author, quote], index) => (
            <motion.blockquote
              key={author}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: index * 0.08 }}
              className="rounded-[1.75rem] border border-black/10 bg-white/40 p-8 backdrop-blur"
            >
              <p className="font-serif text-2xl leading-8 text-[#101010]">“{quote}”</p>
              <footer className="mt-8 border-t border-black/10 pt-4 font-mono text-xs uppercase tracking-[0.14em] text-[#5F6368]">
                {author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-28">
        <motion.div {...fadeIn} className="mx-auto max-w-6xl text-center">
          <p className="font-serif text-[18vw] font-medium leading-[0.78] tracking-[-0.075em] text-[#101010] md:text-[9rem]">
            Research deserves
            <span className="block italic text-[#1A365D]">better tools.</span>
          </p>
          <p className="mx-auto mt-10 max-w-2xl text-xl leading-8 text-[#5F6368]">
            Built for the next generation of scientific discovery.
          </p>
          <Link
            to="/dashboard"
            className="mt-10 inline-flex rounded-full bg-[#101010] px-8 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Enter Axiom Lab
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
