export interface SourceAttribution {
  id: string
  title: string
  doi?: string
  confidence: number
}

export interface AgentTraceStep {
  agent: string
  action: string
  duration_ms: number
}

export interface JobResponse {
  job_id: string
  status: string
  progress: number
  phase?: string | null
  result?: Record<string, unknown> | null
  error?: string | null
  agent_trace: AgentTraceStep[]
  sources: SourceAttribution[]
  confidence?: number | null
}

export interface Paper {
  id: string
  title: string
  abstract: string
  authors: string[]
  institution: string
  citation_count: number
  published_at: string
  doi: string
  pdf_url: string
  source: string
}
