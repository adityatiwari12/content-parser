import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { runMockAction } from '@/lib/actions'
import { useProjectStore } from '@/stores/project'

const suggestions = [
  { label: 'Shape my research question', prompt: 'Help me turn my broad research interest into a focused research question.' },
  { label: 'Survey the literature field', to: '/discovery' },
  { label: 'Synthesize what is known', to: '/literature-review' },
  { label: 'Reveal open questions', to: '/gaps' },
  { label: 'Interrogate the method', prompt: 'Help me reason through a rigorous methodology for this project.' },
]

const discoveries = [
  { text: 'New papers may change the framing of your literature review.', to: '/discovery', action: 'Read the landscape' },
  { text: 'A benchmark dataset could strengthen the evidence base for this inquiry.', to: '/datasets', action: 'Inspect dataset' },
  { text: 'A citation thread suggests a stronger theoretical foundation.', to: '/citations', action: 'Review evidence' },
  { text: 'Two methodological traditions disagree on how the problem should be evaluated.', to: '/peer-review', action: 'Examine tension' },
  { text: 'An adjacent research signal is emerging that may become a novel direction.', to: '/gaps', action: 'Open question' },
]

const workflows = [
  { title: 'Read', note: 'Continue the literature field', to: '/literature-review', detail: 'Consensus, contradictions, and open questions are ready to refine.' },
  { title: 'Write', note: 'Return to the manuscript', to: '/writing', detail: 'A research paper draft can grow from your notes and evidence.' },
  { title: 'Review', note: 'Interrogate the argument', to: '/peer-review', detail: 'Use reviewer feedback to strengthen claims and methods.' },
  { title: 'Map', note: 'Follow relationships', to: '/graph', detail: 'Citation links connect adjacent ideas and possible contributions.' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const setActiveProject = useProjectStore((s) => s.setActiveProject)
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: api.listProjects })
  const projectList = projects as Array<{ id: string; name: string; description?: string }>
  const activeProject = projectList.find((project) => project.id === activeProjectId) || projectList[0]
  const hasProjects = Boolean(activeProject)
  const projectName = activeProject?.name || 'Begin with a research question'
  const projectDescription = activeProject?.description || 'Axiom starts with an inquiry, then gathers papers, evidence, notes, methods, and drafts around it.'

  function askCopilot(prompt: string) {
    localStorage.setItem('axiom-copilot-draft', prompt)
    navigate('/copilot')
  }

  async function createProject() {
    const project = await api.createProject('My First Research Project', 'A new research workspace ready for papers, datasets, notes, and drafts.')
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    setActiveProject(String((project as { id?: string }).id || ''))
    runMockAction('Project created', `${String((project as { name?: string }).name || 'New project')} is ready in Workspace.`)
    navigate('/workspace')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-14 pb-12">
      <section className="min-h-[62vh] rounded-[2.5rem] border border-black/10 bg-[#F8F8F5] p-6 text-[#101010] shadow-[0_35px_120px_rgba(16,16,16,0.10)] dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 md:p-10">
        <div className="flex h-full min-h-[54vh] flex-col justify-between">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5F6368] dark:text-zinc-500">
                {hasProjects ? 'Current inquiry' : 'A quiet place to begin'}
              </p>
              <h1 className="mt-6 max-w-3xl font-serif text-6xl font-medium leading-[0.95] tracking-[-0.045em] md:text-8xl">
                {projectName}
              </h1>
            </div>
            <button
              onClick={createProject}
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-[#101010] shadow-sm transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {hasProjects ? 'Create related project' : 'Create first project'}
            </button>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <p className="max-w-2xl text-2xl leading-10 text-[#5F6368] dark:text-zinc-400">
              {hasProjects
                ? projectDescription
                : 'No fake activity, no usage counters, no admin panel. Start with a question and let the research environment unfold around it.'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <button
                onClick={() => hasProjects ? navigate('/literature-review') : createProject()}
                className="rounded-full bg-[#101010] px-7 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950"
              >
                {hasProjects ? 'Continue the inquiry' : 'Begin inquiry'}
              </button>
              <button
                onClick={() => navigate('/workspace')}
                className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-medium text-[#101010] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Open project library
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white/75 p-5 shadow-[0_25px_80px_rgba(16,16,16,0.06)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/80 md:p-7">
        <p className="mb-4 font-serif text-3xl">Reason with the work</p>
        <button
          onClick={() => askCopilot(hasProjects ? `What should I work on next in ${projectName}?` : 'Help me create my first research project.')}
          className="w-full rounded-[1.5rem] border border-black/10 bg-[#F8F8F5] px-6 py-6 text-left text-lg leading-8 text-[#5F6368] transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Ask what changed, what evidence matters, what contradicts the claim, or what to do next...
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item.label}
              onClick={() => item.to ? navigate(item.to) : askCopilot(item.prompt || item.label)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#5F6368] transition-colors hover:text-[#101010] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5F6368] dark:text-zinc-500">
              {hasProjects ? 'Since your last visit' : 'First steps'}
            </p>
            <h2 className="mt-2 font-serif text-5xl tracking-[-0.04em]">
              {hasProjects ? 'What changed recently' : 'Begin the research journey'}
            </h2>
          </div>
          <Link to="/discovery" className="hidden rounded-full bg-white px-4 py-2 text-sm text-[#5F6368] shadow-sm dark:bg-zinc-900 dark:text-zinc-400 md:inline-flex">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {(hasProjects ? discoveries : [
            { text: 'Give the inquiry a home before adding evidence.', to: '/workspace', action: 'Create inquiry' },
            { text: 'Survey the research landscape and collect the strongest sources.', to: '/discovery', action: 'Read landscape' },
            { text: 'Use conversation to narrow a broad interest into a researchable question.', to: '/copilot', action: 'Reason with Copilot' },
          ]).map((item) => (
            <button
              key={item.text}
              onClick={() => navigate(item.to)}
              className="group flex w-full flex-col justify-between gap-3 rounded-3xl border border-black/10 bg-white/65 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:hover:bg-zinc-900 md:flex-row md:items-center"
            >
              <span className="max-w-3xl text-lg leading-7 text-[#303030] dark:text-zinc-200">{item.text}</span>
              <span className="shrink-0 text-sm text-[#1A365D] group-hover:translate-x-1 dark:text-blue-300">{item.action}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5F6368] dark:text-zinc-500">
          {hasProjects ? 'Suggested next moves' : 'Begin with'}
        </p>
        <h2 className="mt-2 font-serif text-5xl tracking-[-0.04em]">
          {hasProjects ? 'Continue the research' : 'A guided first path'}
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(hasProjects ? workflows : [
            { title: 'Orient', note: 'Name the inquiry', to: '/workspace', detail: 'Create a persistent place for evidence and notes.' },
            { title: 'Discover', note: 'Read the field', to: '/discovery', detail: 'Move through papers as a research landscape, not a search dump.' },
            { title: 'Reason', note: 'Ask better questions', to: '/copilot', detail: 'Use conversation to uncover assumptions and contradictions.' },
            { title: 'Synthesize', note: 'Draft when ready', to: '/writing', detail: 'Turn evidence and notes into a publishable argument.' },
          ]).map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group min-h-56 rounded-[1.75rem] border border-black/10 bg-white/70 p-6 shadow-sm transition-all hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:hover:bg-zinc-900"
            >
              <p className="font-serif text-3xl leading-8">{item.title}</p>
              <p className="mt-5 text-sm font-medium text-[#1A365D] dark:text-blue-300">{item.note}</p>
              <p className="mt-8 text-sm leading-6 text-[#5F6368] dark:text-zinc-500">{item.detail}</p>
              <span className="mt-6 inline-flex text-sm text-[#101010] transition-transform group-hover:translate-x-1 dark:text-zinc-200">Open</span>
            </Link>
          ))}
        </div>
      </section>
      </div>
  )
}
