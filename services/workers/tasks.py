import os
import sys
import time
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "apps", "api"))

from services.workers.celery_app import celery_app
from services.agents.coordinator import run_workflow

from app.database import SessionLocal
from app.services.jobs import (
    complete_job,
    fail_job,
    get_job,
    get_phases,
    random_duration,
    update_job_progress,
)


def _run_job(job_id: str, job_type: str):
    db = SessionLocal()
    try:
        job = get_job(db, uuid.UUID(job_id))
        if not job:
            return
        phases = get_phases(job_type)
        duration_ms = random_duration(job_type)
        phase_ms = duration_ms / len(phases)
        for i, phase in enumerate(phases):
            progress = int(((i + 1) / len(phases)) * 100)
            update_job_progress(db, uuid.UUID(job_id), progress, phase)
            time.sleep(phase_ms / 1000)
        result = run_workflow(job_type, job.input_data or {})
        complete_job(
            db,
            uuid.UUID(job_id),
            result,
            result.get("confidence", 0.9),
            result.get("sources", []),
        )
    except Exception as e:
        fail_job(db, uuid.UUID(job_id), str(e))
    finally:
        db.close()


@celery_app.task(name="run_writing_job")
def run_writing_job(job_id: str):
    _run_job(job_id, "writing")


@celery_app.task(name="run_semantic_analysis_job")
def run_semantic_analysis_job(job_id: str):
    _run_job(job_id, "semantic_analysis")


@celery_app.task(name="run_compliance_job")
def run_compliance_job(job_id: str):
    _run_job(job_id, "compliance")


@celery_app.task(name="run_literature_review_job")
def run_literature_review_job(job_id: str):
    _run_job(job_id, "literature_review")


@celery_app.task(name="run_gap_analysis_job")
def run_gap_analysis_job(job_id: str):
    _run_job(job_id, "gap_analysis")


@celery_app.task(name="run_peer_review_job")
def run_peer_review_job(job_id: str):
    _run_job(job_id, "peer_review")


def run_job_sync(job_id: str, job_type: str):
    """Fallback when Celery broker unavailable."""
    _run_job(job_id, job_type)
