from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.schemas import JobResponse, TextRequest
from app.services.jobs import create_job
from app.services.dispatch import dispatch_task

router = APIRouter(prefix="/v1/analysis", tags=["Semantic Analysis"])


@router.post("/semantic", response_model=JobResponse, status_code=202)
def semantic_analysis(
    body: TextRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    job = create_job(db, "semantic_analysis", {"text": body.text}, user.id)
    dispatch_task("semantic_analysis", str(job.id))
    return JobResponse(job_id=job.id, status="pending", progress=0)
