from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import AgentRun
from app.schemas import JobResponse
from app.services.jobs import get_job

router = APIRouter(prefix="/v1/jobs", tags=["Jobs"])


@router.get("/{job_id}", response_model=JobResponse)
def get_job_status(job_id: UUID, db: Session = Depends(get_db), _user=Depends(get_current_user)):
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    trace = db.query(AgentRun).filter(AgentRun.job_id == job_id).first()
    sources = []
    agent_trace = []
    confidence = None
    if trace:
        confidence = trace.confidence
        if trace.sources:
            sources = trace.sources.get("items", [])
        if trace.step_trace:
            agent_trace = trace.step_trace.get("steps", [])
    return JobResponse(
        job_id=job.id,
        status=job.status.value,
        progress=job.progress,
        phase=job.phase,
        result=job.result_data,
        error=job.error,
        sources=sources,
        agent_trace=agent_trace,
        confidence=confidence,
    )
