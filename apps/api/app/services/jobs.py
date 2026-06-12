import random
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.models import AgentRun, AsyncJob, JobStatus


PHASES_BY_TYPE = {
    "writing": [
        "Normalizing input tokens…",
        "Retrieving domain knowledge embeddings…",
        "Running autoregressive synthesis…",
        "Calibrating academic register…",
        "Validating section coherence…",
    ],
    "literature_review": [
        "Searching academic corpora…",
        "Clustering thematic groups…",
        "Identifying consensus findings…",
        "Detecting contradictory evidence…",
        "Drafting literature review…",
    ],
    "gap_analysis": [
        "Indexing publication corpus…",
        "Mapping research landscape…",
        "Detecting underexplored areas…",
        "Ranking opportunities…",
        "Computing confidence scores…",
    ],
    "compliance": [
        "Encoding document into vector space…",
        "Querying cross-corpus index…",
        "Computing sentence similarity…",
        "Tracing provenance…",
        "Classifying risk level…",
    ],
    "semantic_analysis": [
        "Segmenting semantic units…",
        "Computing token distributions…",
        "Extracting key phrases…",
        "Scoring readability…",
        "Aggregating metrics…",
    ],
    "peer_review": [
        "Parsing manuscript structure…",
        "Evaluating novelty…",
        "Assessing methodology…",
        "Reviewing citations…",
        "Generating review report…",
    ],
}


DURATION_RANGES = {
    "writing": (30000, 45000),
    "literature_review": (30000, 40000),
    "gap_analysis": (30000, 40000),
    "compliance": (30000, 40000),
    "semantic_analysis": (30000, 40000),
    "peer_review": (30000, 40000),
}


def create_job(db: Session, job_type: str, input_data: dict, user_id: uuid.UUID | None = None) -> AsyncJob:
    job = AsyncJob(job_type=job_type, input_data=input_data, user_id=user_id, status=JobStatus.pending)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job(db: Session, job_id: uuid.UUID) -> AsyncJob | None:
    return db.get(AsyncJob, job_id)


def update_job_progress(db: Session, job_id: uuid.UUID, progress: int, phase: str | None = None) -> None:
    job = db.get(AsyncJob, job_id)
    if job:
        job.status = JobStatus.running
        job.progress = progress
        job.phase = phase
        db.commit()


def complete_job(db: Session, job_id: uuid.UUID, result: dict, confidence: float, sources: list) -> None:
    job = db.get(AsyncJob, job_id)
    if job:
        job.status = JobStatus.completed
        job.progress = 100
        job.result_data = result
        job.completed_at = datetime.utcnow()
        db.commit()
        trace = AgentRun(
            job_id=job_id,
            workflow_type=job.job_type,
            agent_name="coordinator",
            step_trace={"steps": result.get("agent_trace", [])},
            confidence=confidence,
            sources={"items": sources},
        )
        db.add(trace)
        db.commit()


def fail_job(db: Session, job_id: uuid.UUID, error: str) -> None:
    job = db.get(AsyncJob, job_id)
    if job:
        job.status = JobStatus.failed
        job.error = error
        db.commit()


def random_duration(job_type: str) -> int:
    lo, hi = DURATION_RANGES.get(job_type, (30000, 40000))
    return random.randint(lo, hi)


def get_phases(job_type: str) -> list[str]:
    return PHASES_BY_TYPE.get(job_type, ["Processing…"])
