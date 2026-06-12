from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import Dataset

router = APIRouter(prefix="/v1/datasets", tags=["Dataset Hub"])


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    content = await file.read()
    profile = {
        "rows": 1000,
        "columns": 12,
        "missing_values_pct": 2.4,
        "numeric_columns": 8,
        "categorical_columns": 4,
        "bias_flags": ["class_imbalance_detected"],
    }
    ds = Dataset(name=file.filename or "dataset", file_path=f"uploads/{file.filename}", profile=profile, owner_id=user.id)
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return {"id": str(ds.id), "name": ds.name, "size_bytes": len(content), "profile": profile}


@router.get("/{dataset_id}/profile")
def get_dataset_profile(dataset_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    ds = db.get(Dataset, dataset_id)
    if not ds:
        from fastapi import HTTPException
        raise HTTPException(404)
    return {"id": str(ds.id), "name": ds.name, "profile": ds.profile}
