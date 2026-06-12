from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.providers.groq import recommend_datasets
from app.schemas import JobResponse, TopicRequest
from app.services.jobs import create_job
from app.services.dispatch import dispatch_task
from pydantic import BaseModel

router = APIRouter(prefix="/v1/gaps", tags=["Research Gaps"])


class DatasetRecommendationRequest(BaseModel):
    topic: str
    gap: str


@router.post("/analyze", response_model=JobResponse, status_code=202)
def analyze_gaps(body: TopicRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    job = create_job(db, "gap_analysis", {"topic": body.topic}, user.id)
    dispatch_task("gap_analysis", str(job.id))
    return JobResponse(job_id=job.id, status="pending", progress=0)


@router.post("/datasets")
async def recommend_gap_datasets(body: DatasetRecommendationRequest, _user=Depends(get_current_user)):
    datasets = await recommend_datasets(body.topic, body.gap)
    return {"datasets": datasets}
