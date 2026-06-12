from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.middleware.billing import check_usage_limit
from app.schemas import JobResponse, TopicRequest
from app.services.jobs import create_job
from app.services.dispatch import dispatch_task

router = APIRouter(prefix="/v1/literature-review", tags=["Literature Review"])


@router.post("/generate", response_model=JobResponse, status_code=202)
def generate_literature_review(
    body: TopicRequest,
    db: Session = Depends(get_db),
    user=Depends(check_usage_limit("generation")),
):
    job = create_job(db, "literature_review", {"topic": body.topic}, user.id)
    dispatch_task("literature_review", str(job.id))
    return JobResponse(job_id=job.id, status="pending", progress=0)
