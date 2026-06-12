from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import AsyncJob, JobStatus
from app.schemas import AgentTraceStep, JobResponse, SourceAttribution


def job_to_response(job: AsyncJob) -> JobResponse:
    sources = []
    trace = []
    confidence = None
    if job.result_data:
        sources = [SourceAttribution(**s) for s in job.result_data.get("sources", [])]
        trace = [AgentTraceStep(**t) for t in job.result_data.get("agent_trace", [])]
        confidence = job.result_data.get("confidence")
    return JobResponse(
        job_id=job.id,
        status=job.status.value,
        progress=job.progress,
        phase=job.phase,
        result=job.result_data,
        error=job.error,
        sources=sources,
        agent_trace=trace,
        confidence=confidence,
    )


def get_job_or_404(db: Session, job_id: UUID) -> AsyncJob:
    job = db.get(AsyncJob, job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job
