import type { AgentTraceStep, JobResponse, SourceAttribution } from '@axiom/shared'
import {
  gapAnalysis,
  generatePaper,
  literatureReview,
  parseContent,
  peerReview,
  runPlagiarismCheck,
} from './engine'
import { MOCK_SOURCES } from './data'

export type JobType =
  | 'writing'
  | 'semantic_analysis'
  | 'compliance'
  | 'literature_review'
  | 'gap_analysis'
  | 'peer_review'

const PHASES: Record<JobType, string[]> = {
  writing: [
    'Normalizing input tokens…',
    'Retrieving domain knowledge embeddings…',
    'Running autoregressive synthesis…',
    'Calibrating academic register…',
    'Validating section coherence…',
  ],
  semantic_analysis: [
    'Segmenting into semantic units…',
    'Computing token frequency distributions…',
    'Extracting embedding-based key phrases…',
    'Scoring readability & complexity…',
    'Aggregating linguistic metrics…',
  ],
  compliance: [
    'Encoding document into vector space…',
    'Querying cross-corpus index (2.4M docs)…',
    'Computing cosine similarity per sentence…',
    'Tracing provenance & source attribution…',
    'Classifying risk level…',
  ],
  literature_review: [
    'Searching academic corpora…',
    'Clustering thematic groups…',
    'Identifying consensus findings…',
    'Detecting contradictory evidence…',
    'Drafting literature review…',
  ],
  gap_analysis: [
    'Indexing publication corpus…',
    'Mapping research landscape…',
    'Detecting underexplored areas…',
    'Ranking opportunities…',
    'Computing confidence scores…',
  ],
  peer_review: [
    'Parsing manuscript structure…',
    'Evaluating novelty…',
    'Assessing methodology…',
    'Reviewing citations…',
    'Generating review report…',
  ],
}

const DURATION: Record<JobType, [number, number]> = {
  writing: [30000, 45000],
  semantic_analysis: [30000, 40000],
  compliance: [30000, 40000],
  literature_review: [30000, 40000],
  gap_analysis: [30000, 40000],
  peer_review: [30000, 40000],
}

function randomBetween(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1))
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function buildTrace(jobType: JobType): AgentTraceStep[] {
  const agents: Record<JobType, string[]> = {
    writing: ['coordinator', 'literature_agent', 'writing_agent', 'citation_agent'],
    semantic_analysis: ['coordinator', 'statistics_agent'],
    compliance: ['coordinator', 'citation_agent', 'reviewer_agent'],
    literature_review: ['coordinator', 'literature_agent', 'review_agent', 'citation_agent'],
    gap_analysis: ['coordinator', 'literature_agent', 'gap_agent', 'statistics_agent'],
    peer_review: ['coordinator', 'reviewer_agent', 'methodology_agent', 'citation_agent'],
  }
  return agents[jobType].map((agent) => ({
    agent,
    action: `Executed ${agent.replace(/_/g, ' ')}`,
    duration_ms: randomBetween(800, 3000),
  }))
}

function computeResult(jobType: JobType, input: Record<string, unknown>): Record<string, unknown> {
  switch (jobType) {
    case 'writing':
      return { paper: generatePaper(String(input.topic || '')) }
    case 'semantic_analysis':
      return { metrics: parseContent(String(input.text || '')) }
    case 'compliance':
      return { report: runPlagiarismCheck(String(input.text || '')) }
    case 'literature_review':
      return literatureReview(String(input.topic || ''))
    case 'gap_analysis':
      return gapAnalysis(String(input.topic || ''))
    case 'peer_review':
      return peerReview(String(input.text || ''))
    default:
      return {}
  }
}

export async function simulateJob(
  jobType: JobType,
  input: Record<string, unknown>,
  onProgress?: (progress: number, phase: string) => void,
): Promise<JobResponse> {
  const phases = PHASES[jobType]
  const [minD, maxD] = DURATION[jobType]
  const targetDuration = randomBetween(minD, maxD)
  const phaseMs = targetDuration / phases.length
  const start = Date.now()

  for (let i = 0; i < phases.length; i++) {
    const progress = Math.round(((i + 0.35) / phases.length) * 100)
    onProgress?.(progress, phases[i])
    await delay(phaseMs * (0.88 + Math.random() * 0.24))
    onProgress?.(Math.round(((i + 1) / phases.length) * 100), phases[i])
  }

  const elapsed = Date.now() - start
  if (elapsed < targetDuration) await delay(targetDuration - elapsed)

  onProgress?.(100, 'Complete')

  const confidence = randomBetween(88, 98) / 100
  return {
    job_id: crypto.randomUUID(),
    status: 'completed',
    progress: 100,
    phase: 'Complete',
    result: computeResult(jobType, input),
    agent_trace: buildTrace(jobType),
    sources: MOCK_SOURCES as SourceAttribution[],
    confidence,
  }
}
