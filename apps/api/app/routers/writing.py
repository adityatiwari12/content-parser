from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.middleware.billing import check_usage_limit
from app.models import Manuscript, ManuscriptSection
from app.schemas import JobResponse, ManuscriptCreate, ManuscriptOut, WritingGenerateRequest
from app.services.jobs import create_job
from app.services.dispatch import dispatch_task

router = APIRouter(prefix="/v1/manuscripts", tags=["Writing Studio"])


@router.get("", response_model=list[ManuscriptOut])
def list_manuscripts(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(Manuscript).filter(Manuscript.owner_id == user.id).all()
    return [_to_out(m) for m in items]


@router.post("", response_model=ManuscriptOut)
def create_manuscript(body: ManuscriptCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = Manuscript(title=body.title, topic=body.topic, project_id=body.project_id, owner_id=user.id)
    db.add(m)
    db.commit()
    db.refresh(m)
    return _to_out(m)


@router.get("/{manuscript_id}", response_model=ManuscriptOut)
def get_manuscript(manuscript_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = db.get(Manuscript, manuscript_id)
    if not m:
        raise HTTPException(404)
    return _to_out(m)


@router.post("/generate", response_model=JobResponse, status_code=202)
def generate_manuscript(
    body: WritingGenerateRequest,
    db: Session = Depends(get_db),
    user=Depends(check_usage_limit("generation")),
):
    job = create_job(db, "writing", {"topic": body.topic}, user.id)
    dispatch_task("writing", str(job.id))
    return JobResponse(job_id=job.id, status="pending", progress=0)


def _to_out(m: Manuscript) -> ManuscriptOut:
    return ManuscriptOut(
        id=m.id,
        title=m.title,
        topic=m.topic,
        sections=[{"type": s.section_type, "content": s.content} for s in (m.sections or [])],
    )
