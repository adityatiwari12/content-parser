import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { runMockAction } from '@/lib/actions'
import { useProjectStore } from '@/stores/project'

const suggestions = [
  { label: 'Choose a research topic', prompt: 'Help me choose a focused first research project.' },
  { label: 'Find starter papers', to: '/discovery' },
  { label: 'Generate literature review', to: '/literature-review' },
  { label: 'Suggest research gaps', to: '/gaps' },
  { label: 'Explain methodology', prompt: 'Explain how I should design a rigorous research methodology.' },
]

const discoveries = [
  { text: '3 new papers match your research on transformer-based climate risk modeling.', to: '/discovery', action: 'Review papers' },
  { text: 'A benchmark dataset for flood-risk forecasting is now available in your adjacent domain.', to: '/datasets', action: 'Open dataset' },
  { text: 'Citation opportunity detected for retrieval-augmented scientific reasoning.', to: '/citations', action: 'Check citations' },
  { text: 'Methodology conflict identified between graph-based and transformer-based evaluation protocols.', to: '/peer-review', action: 'Inspect conflict' },
  { text: 'Research trend emerging around foundation models for regional climate adaptation.', to: '/gaps', action: 'Explore trend' },
]

const workflows = [
  { title: 'Literature Review', note: 'Continue drafting', to: '/literature-review', detail: 'Consensus and contradictions are ready to refine.' },
  { title: 'Writing Studio', note: 'Resume manuscript', to: '/writing', detail: 'Detailed research paper draft is available.' },
  { title: 'Peer Review', note: 'Feedback available', to: '/peer-review', detail: 'Reviewer comments are ready for the methods section.' },
  { title: 'Knowledge Graph', note: 'New relationships discovered', to: '/graph', detail: 'Citation links connect two adjacent domains.' },
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
  const projectName = activeProject?.name || 'Start your first research project'
  const projectDescription = activeProject?.description || 'Create a workspace, add a research question, then connect papers, datasets, notes, and experiments.'

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
                {hasProjects ? 'Current research desk' : 'Welcome to Axiom Lab'}
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
                : 'No past projects, usage history, billing plan, or fake activity yet. Your research desk starts clean.'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <button
                onClick={() => hasProjects ? navigate('/literature-review') : createProject()}
                className="rounded-full bg-[#101010] px-7 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950"
              >
                {hasProjects ? 'Continue Research' : 'Start Research'}
              </button>
              <button
                onClick={() => navigate('/workspace')}
                className="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-medium text-[#101010] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Open Workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white/75 p-5 shadow-[0_25px_80px_rgba(16,16,16,0.06)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/80 md:p-7">
        <p className="mb-4 font-serif text-3xl">Research Copilot</p>
        <button
          onClick={() => askCopilot(hasProjects ? `What should I work on next in ${projectName}?` : 'Help me create my first research project.')}
          className="w-full rounded-[1.5rem] border border-black/10 bg-[#F8F8F5] px-6 py-6 text-left text-lg leading-8 text-[#5F6368] transition-colors hover:bg-white dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Ask about papers, citations, datasets, methodologies, research gaps, or experiments...
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
              {hasProjects ? 'Recent discoveries' : 'Set up your research desk'}
            </h2>
          </div>
          <Link to="/discovery" className="hidden rounded-full bg-white px-4 py-2 text-sm text-[#5F6368] shadow-sm dark:bg-zinc-900 dark:text-zinc-400 md:inline-flex">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {(hasProjects ? discoveries : [
            { text: 'Create a project to give your research a home.', to: '/workspace', action: 'Create project' },
            { text: 'Search for starter papers and add the strongest sources to your workspace.', to: '/discovery', action: 'Find papers' },
            { text: 'Ask Copilot to narrow a broad topic into researchable questions.', to: '/copilot', action: 'Ask Copilot' },
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
          {hasProjects ? 'Pick up where you left off' : 'Begin with'}
        </p>
        <h2 className="mt-2 font-serif text-5xl tracking-[-0.04em]">
          {hasProjects ? 'Continue working' : 'Starter workflows'}
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(hasProjects ? workflows : [
            { title: 'Discovery', note: 'Find first papers', to: '/discovery', detail: 'Search arXiv, Semantic Scholar-style mock data, and source links.' },
            { title: 'Copilot', note: 'Shape your question', to: '/copilot', detail: 'Turn a broad topic into a focused research direction.' },
            { title: 'Workspace', note: 'Create project', to: '/workspace', detail: 'Make your first persistent research workspace.' },
            { title: 'Writing', note: 'Draft later', to: '/writing', detail: 'Generate a detailed paper after your topic is ready.' },
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
