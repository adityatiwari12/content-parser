import type { JobResponse, Paper } from '@axiom/shared'
import { MOCK_CLUSTERS, MOCK_GRAPH_EDGES, MOCK_GRAPH_NODES } from './mock/data'
import { copilotAnswer, reproReport } from './mock/engine'
import { simulateJob, type JobType } from './mock/jobs'
import { mockStore } from './mock/store'

const USE_LIVE_API = import.meta.env.VITE_USE_MOCK === 'false' && !!import.meta.env.VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function liveRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  return res.json()
}

async function withFallback<T>(live: () => Promise<T>, mock: () => T | Promise<T>): Promise<T> {
  if (!USE_LIVE_API) return mock()
  try {
    return await live()
  } catch {
    return mock()
  }
}

async function withLiveFirst<T>(live: () => Promise<T>, mock: () => T | Promise<T>): Promise<T> {
  try {
    return await live()
  } catch {
    return mock()
  }
}

export const api = {
  health: () => withFallback(() => liveRequest('/health'), () => ({ status: 'ok' })),

  searchPapers: (q: string) =>
    withFallback(() => liveRequest<Paper[]>(`/v1/discovery/search?q=${encodeURIComponent(q)}`), () => mockStore.searchPapers(q)),

  getJob: (id: string) => liveRequest<JobResponse>(`/v1/jobs/${id}`),

  generateWriting: (topic: string) =>
    withFallback(
      () => liveRequest<JobResponse>('/v1/manuscripts/generate', { method: 'POST', body: JSON.stringify({ topic }) }),
      () => Promise.resolve({ job_id: 'mock', status: 'pending', progress: 0, agent_trace: [], sources: [] }),
    ),

  semanticAnalysis: (text: string) =>
    withFallback(
      () => liveRequest<JobResponse>('/v1/analysis/semantic', { method: 'POST', body: JSON.stringify({ text }) }),
      () => Promise.resolve({ job_id: 'mock', status: 'pending', progress: 0, agent_trace: [], sources: [] }),
    ),

  complianceScan: (text: string) =>
    withFallback(
      () => liveRequest<JobResponse>('/v1/compliance/scan', { method: 'POST', body: JSON.stringify({ text }) }),
      () => Promise.resolve({ job_id: 'mock', status: 'pending', progress: 0, agent_trace: [], sources: [] }),
    ),

  literatureReview: (topic: string) =>
    withFallback(
      () => liveRequest<JobResponse>('/v1/literature-review/generate', { method: 'POST', body: JSON.stringify({ topic }) }),
      () => Promise.resolve({ job_id: 'mock', status: 'pending', progress: 0, agent_trace: [], sources: [] }),
    ),

  gapAnalysis: (topic: string) =>
    withFallback(
      () => liveRequest<JobResponse>('/v1/gaps/analyze', { method: 'POST', body: JSON.stringify({ topic }) }),
      () => Promise.resolve({ job_id: 'mock', status: 'pending', progress: 0, agent_trace: [], sources: [] }),
    ),

  recommendGapDatasets: (topic: string, gap: string) =>
    withLiveFirst(
      () => liveRequest<{ datasets: Array<{ name: string; description: string; url: string; best_for: string; access: string }> }>('/v1/gaps/datasets', {
        method: 'POST',
        body: JSON.stringify({ topic, gap }),
      }),
      () => ({
        datasets: [
          {
            name: 'OpenAlex Works Snapshot',
            description: `Scholarly metadata graph for mapping publication gaps around ${topic}.`,
            url: 'https://docs.openalex.org/download-all-data/openalex-snapshot',
            best_for: 'publication trends, authors, institutions, citation context',
            access: 'open',
          },
          {
            name: 'Semantic Scholar API',
            description: `Paper metadata and abstracts for literature retrieval around ${gap}.`,
            url: 'https://www.semanticscholar.org/product/api',
            best_for: 'paper discovery, abstracts, citation neighborhoods',
            access: 'open API',
          },
          {
            name: 'Papers with Code Datasets',
            description: 'Benchmark index for detecting missing evaluation assets.',
            url: 'https://paperswithcode.com/datasets',
            best_for: 'benchmarks and task datasets',
            access: 'open',
          },
        ],
      }),
    ),

  peerReview: (text: string) =>
    withFallback(
      () => liveRequest<JobResponse>('/v1/reviews/submit', { method: 'POST', body: JSON.stringify({ text }) }),
      () => Promise.resolve({ job_id: 'mock', status: 'pending', progress: 0, agent_trace: [], sources: [] }),
    ),

  graphNodes: (type?: string) =>
    withFallback(
      () => liveRequest<unknown[]>(`/v1/graph/nodes${type ? `?type=${type}` : ''}`),
      () => type ? MOCK_GRAPH_NODES.filter((n) => n.type === type) : MOCK_GRAPH_NODES,
    ),

  graphEdges: () => withFallback(() => liveRequest('/v1/graph/edges'), () => MOCK_GRAPH_EDGES),
  graphClusters: () => withFallback(() => liveRequest('/v1/graph/clusters'), () => MOCK_CLUSTERS),

  trendsTopics: () =>
    withFallback(() => liveRequest('/v1/trends/topics'), () => ({
      growing: [
        { topic: 'Retrieval-Augmented Generation', growth: 142 },
        { topic: 'Multimodal Foundation Models', growth: 98 },
        { topic: 'AI for Scientific Discovery', growth: 87 },
      ],
      declining: [
        { topic: 'Word2Vec Applications', growth: -34 },
        { topic: 'Rule-Based NLP Pipelines', growth: -28 },
      ],
    })),

  trendsDashboard: () =>
    withFallback(() => liveRequest('/v1/trends/dashboard'), () => ({
      emerging_authors: ['Chen, L.', 'Patel, R.', 'Kim, S.'],
      emerging_institutions: ['MIT CSAIL', 'Stanford HAI', 'Mila'],
      publication_velocity: 12400,
      citation_velocity: 892000,
    })),

  listProjects: () => withFallback(() => liveRequest('/v1/projects'), () => mockStore.getProjects()),
  createProject: (name: string, description?: string) =>
    withFallback(
      () => liveRequest('/v1/projects', { method: 'POST', body: JSON.stringify({ name, description }) }),
      () => mockStore.createProject(name, description),
    ),
  deleteProject: (id: string) =>
    withFallback(
      () => liveRequest(`/v1/projects/${id}`, { method: 'DELETE' }),
      () => mockStore.deleteProject(id),
    ),

  billingPlan: () =>
    withFallback(
      () => liveRequest<{ plan: string; searches_remaining: number; generations_remaining: number }>('/v1/billing/plan'),
      () => ({ plan: 'free', searches_remaining: 0, generations_remaining: 0 }),
    ),

  copilotMessage: (_sessionId: string, message: string) =>
    withLiveFirst(
      () => liveRequest(`/v1/copilot/sessions/${_sessionId}/message`, { method: 'POST', body: JSON.stringify({ message }) }),
      () => copilotAnswer(message),
    ),

  createCopilotSession: () =>
    withLiveFirst(
      () => liveRequest<{ session_id: string }>('/v1/copilot/sessions', { method: 'POST', body: JSON.stringify({ paper_ids: [] }) }),
      () => ({ session_id: mockStore.getCopilotSession() }),
    ),

  formatCitations: (style: string, references: Array<Record<string, string>>) =>
    withFallback(
      () => liveRequest('/v1/citations/format', { method: 'POST', body: JSON.stringify({ style, references }) }),
      () => ({
        style,
        citations: references.map((ref, i) => {
          const author = ref.author || 'Unknown'
          const title = ref.title || 'Untitled'
          const year = ref.year || 'n.d.'
          if (style === 'apa') return `${author} (${year}). ${title}.`
          if (style === 'ieee') return `[${i + 1}] ${author}, "${title}," ${year}.`
          return `${author}. ${title}. ${year}.`
        }),
      }),
    ),

  validateRepro: () => withFallback(() => liveRequest('/v1/repro/validate', { method: 'POST' }), () => ({ status: 'completed', report: reproReport() })),

  uploadDataset: (filename: string) => mockStore.uploadDataset(filename),
  listDatasets: () => mockStore.getDatasets(),
  listExperiments: () => mockStore.getExperiments(),
  createExperiment: (name: string, description?: string) => mockStore.createExperiment(name, description),
  addExperimentRun: (id: string) => mockStore.addExperimentRun(id),
}

/** Client-side job simulation — works without backend */
export function runClientJob(
  jobType: JobType,
  input: Record<string, unknown>,
  onProgress?: (progress: number, phase: string) => void,
) {
  return simulateJob(jobType, input, onProgress)
}

export async function pollJob(
  jobId: string,
  onProgress?: (job: JobResponse) => void,
  intervalMs = 2000,
): Promise<JobResponse> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const job = await api.getJob(jobId)
        onProgress?.(job)
        if (job.status === 'completed') resolve(job)
        else if (job.status === 'failed') reject(new Error(job.error || 'Job failed'))
        else setTimeout(poll, intervalMs)
      } catch (e) {
        reject(e)
      }
    }
    poll()
  })
}
