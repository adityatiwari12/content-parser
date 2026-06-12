from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.schemas import JobResponse, TextRequest
from app.services.jobs import create_job
from app.services.dispatch import dispatch_task

router = APIRouter(prefix="/v1/compliance", tags=["Compliance"])


@router.post("/scan", response_model=JobResponse, status_code=202)
def compliance_scan(
    body: TextRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    job = create_job(db, "compliance", {"text": body.text}, user.id)
    dispatch_task("compliance", str(job.id))
    return JobResponse(job_id=job.id, status="pending", progress=0)
