import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useThemeStore } from '@/stores/theme'
import { runMockAction, ToastViewport } from '@/lib/actions'
import { api } from '@/lib/api'
import { useProjectStore } from '@/stores/project'

const navGroups = [
  {
    label: 'Home',
    items: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/workspace', label: 'Workspace' },
    ],
  },
  {
    label: 'Research',
    items: [
      { to: '/discovery', label: 'Discover' },
      { to: '/literature-review', label: 'Literature' },
      { to: '/gaps', label: 'Insights' },
      { to: '/graph', label: 'Knowledge Graph' },
      { to: '/trends', label: 'Trends' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/writing', label: 'Writing' },
      { to: '/citations', label: 'Citations' },
      { to: '/peer-review', label: 'Review' },
    ],
  },
  {
    label: 'Lab',
    items: [
      { to: '/datasets', label: 'Datasets' },
      { to: '/experiments', label: 'Experiments' },
      { to: '/reproducibility', label: 'Reproducibility' },
    ],
  },
  {
    label: 'Integrity',
    items: [
      { to: '/analysis', label: 'Semantic Analysis' },
      { to: '/compliance', label: 'Compliance' },
      { to: '/how-it-works', label: 'How it works' },
    ],
  },
]

const nav = navGroups.flatMap((group) => group.items)

export function AppShell() {
  const navigate = useNavigate()
  const toggle = useThemeStore((s) => s.toggle)
  const theme = useThemeStore((s) => s.theme)
  const activeProjectId = useProjectStore((s) => s.activeProjectId)
  const isLight = theme === 'light'
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: api.listProjects })
  const projectList = projects as Array<{ id: string; name: string; description?: string }>
  const activeProject = projectList.find((project) => project.id === activeProjectId) || projectList[0]

  return (
    <div className={`flex min-h-screen flex-col lg:flex-row ${isLight ? 'bg-[#F8F8F5] text-[#101010]' : 'bg-[#080808] text-zinc-100'}`}>
      <aside className={`hidden max-h-screen w-64 shrink-0 overflow-y-auto border-r px-4 py-5 lg:block ${isLight ? 'border-black/10 bg-[#F3F1EA]' : 'border-white/10 bg-[#0d0d0f]'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className={`flex h-10 w-10 items-center justify-center rounded-2xl font-serif text-xl shadow-sm ${isLight ? 'bg-white text-[#101010]' : 'bg-zinc-900 text-zinc-100'}`}>
            A
          </button>
          <div>
            <p className="font-serif text-xl font-medium tracking-tight">Axiom Lab</p>
            <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isLight ? 'text-black/40' : 'text-zinc-600'}`}>Research workspace</p>
          </div>
        </div>

        <button
          onClick={() => navigate(activeProject ? '/dashboard' : '/workspace')}
          className={`mt-8 w-full rounded-3xl p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5 ${isLight ? 'bg-white text-[#101010]' : 'bg-zinc-950 text-zinc-100'}`}
        >
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${isLight ? 'text-black/40' : 'text-zinc-500'}`}>
            {activeProject ? 'Active project' : 'Start here'}
          </p>
          <p className="mt-2 font-serif text-2xl leading-7">{activeProject?.name || 'Create your first project'}</p>
          <p className={`mt-3 text-sm leading-6 ${isLight ? 'text-black/55' : 'text-zinc-500'}`}>
            {activeProject?.description || 'Begin with a topic, then connect papers, datasets, notes, and experiments.'}
          </p>
          <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs ${isLight ? 'bg-[#F3F1EA] text-black/55' : 'bg-zinc-900 text-zinc-400'}`}>
            {activeProject ? 'Open desk' : 'Set up workspace'}
          </span>
        </button>

        <nav className="mt-8 space-y-3" aria-label="Primary workspace navigation">
          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors ${
                isActive
                  ? isLight ? 'bg-[#101010] text-white' : 'bg-white text-zinc-950'
                  : isLight ? 'text-black/65 hover:bg-white' : 'text-zinc-400 hover:bg-zinc-950 hover:text-zinc-100'
              }`
            }
          >
            <span>AI Copilot</span>
            <span className="font-mono text-[10px]">ask</span>
          </NavLink>

          {navGroups.map((group) => (
            <details key={group.label} open className="group">
              <summary className={`flex cursor-pointer list-none items-center justify-between rounded-2xl px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] ${isLight ? 'text-black/45 hover:bg-white/70' : 'text-zinc-600 hover:bg-zinc-950'}`}>
                {group.label}
                <span className="transition-transform group-open:rotate-90">›</span>
              </summary>
              <div className="mt-1 space-y-1 pl-2">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? isLight ? 'bg-white text-[#101010] shadow-sm' : 'bg-zinc-900 text-white'
                          : isLight ? 'text-black/55 hover:bg-white/70 hover:text-[#101010]' : 'text-zinc-500 hover:bg-zinc-950 hover:text-zinc-200'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </details>
          ))}
        </nav>
      </aside>

      <nav className={`flex gap-2 overflow-x-auto border-b p-3 lg:hidden ${isLight ? 'border-black/10 bg-[#F3F1EA]' : 'border-white/10 bg-zinc-950'}`}>
        <NavLink to="/dashboard" className="shrink-0 rounded-full px-3 py-2 font-serif text-sm">Axiom</NavLink>
        <NavLink to="/copilot" className="shrink-0 rounded-full px-3 py-2 text-sm text-zinc-500 [&.active]:bg-zinc-100 [&.active]:text-zinc-950">Copilot</NavLink>
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} className="shrink-0 rounded-full px-3 py-2 text-sm text-zinc-500 [&.active]:bg-zinc-100 [&.active]:text-zinc-950">
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`flex items-center justify-between gap-3 border-b px-4 py-3 md:px-8 ${isLight ? 'border-black/10 bg-[#F8F8F5]/85' : 'border-white/10 bg-[#080808]/85'} backdrop-blur`}>
          <button
            onClick={() => {
              localStorage.setItem('axiom-copilot-draft', activeProject ? `Help me decide what to work on next in ${activeProject.name}.` : 'Help me choose a first research project to create.')
              navigate('/copilot')
            }}
            className={`hidden min-w-0 max-w-xl flex-1 rounded-full px-5 py-3 text-left text-sm md:block ${isLight ? 'bg-white text-black/45 shadow-sm' : 'bg-zinc-950 text-zinc-500'}`}
          >
            Ask about papers, citations, datasets, methodologies, or research gaps...
          </button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/workspace')}
              className={`rounded-full px-4 py-2 text-sm ${isLight ? 'bg-white text-[#101010] shadow-sm' : 'bg-zinc-900 text-zinc-200'}`}
            >
              New project
            </button>
            <button
              type="button"
              onClick={() => {
                runMockAction(theme === 'dark' ? 'Light mode enabled' : 'Dark mode enabled', 'Theme updated across the workspace.')
                toggle()
              }}
              className={`rounded-full px-4 py-2 text-sm ${isLight ? 'bg-[#101010] text-white' : 'bg-white text-zinc-950'}`}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>
        <main className="orientation-compact min-w-0 flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
  )
}
