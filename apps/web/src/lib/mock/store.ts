import { MOCK_EXPERIMENTS, MOCK_PAPERS } from './data'
import { datasetProfile } from './engine'

const PROJECTS_KEY = 'axiom-projects'
type MockProject = { id: string; name: string; description?: string; created_at: string }

function loadProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) return JSON.parse(raw) as MockProject[]
  } catch { /* ignore */ }
  return []
}

function saveProjects(projects: MockProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

let projects = loadProjects()
let experiments = [...MOCK_EXPERIMENTS]
let datasets: Array<{ id: string; name: string; profile: ReturnType<typeof datasetProfile> }> = []
let copilotSessionId: string | null = null

export const mockStore = {
  getProjects: () => [...projects],
  createProject: (name: string, description?: string) => {
    const p = { id: `proj-${Date.now()}`, name, description: description || '', created_at: new Date().toISOString() }
    projects = [p, ...projects]
    saveProjects(projects)
    return p
  },
  deleteProject: (id: string) => {
    projects = projects.filter((project) => project.id !== id)
    saveProjects(projects)
    return { ok: true }
  },
  getExperiments: () => [...experiments],
  createExperiment: (name: string, description?: string) => {
    const e = { id: `exp-${Date.now()}`, name, description: description || '', runs: [] as typeof MOCK_EXPERIMENTS[0]['runs'] }
    experiments = [e, ...experiments]
    return e
  },
  addExperimentRun: (experimentId: string) => {
    const exp = experiments.find((e) => e.id === experimentId)
    if (!exp) return null
    const run = {
      id: `run-${Date.now()}`,
      metrics: { accuracy: +(0.85 + Math.random() * 0.1).toFixed(2), f1: +(0.82 + Math.random() * 0.1).toFixed(2), loss: +(0.08 + Math.random() * 0.08).toFixed(2) },
      hyperparameters: { lr: 0.001, batch_size: 32, epochs: 100 },
    }
    exp.runs = [...(exp.runs || []), run]
    return run
  },
  uploadDataset: (filename: string) => {
    const profile = datasetProfile(filename)
    const ds = { id: `ds-${Date.now()}`, name: filename, profile }
    datasets = [ds, ...datasets]
    return ds
  },
  getDatasets: () => [...datasets],
  searchPapers: (q: string) => {
    const query = q.trim().toLowerCase()
    const ranked = [...MOCK_PAPERS].sort((a, b) => b.published_at.localeCompare(a.published_at))
    if (!query) return ranked
    const filtered = ranked.filter((p) => {
      const haystack = [
        p.title,
        p.abstract,
        p.institution,
        p.source,
        p.doi,
        ...p.authors,
      ].join(' ').toLowerCase()
      return haystack.includes(query)
    })
    return filtered.length ? filtered : ranked
  },
  getCopilotSession: () => {
    if (!copilotSessionId) copilotSessionId = crypto.randomUUID()
    return copilotSessionId
  },
}
