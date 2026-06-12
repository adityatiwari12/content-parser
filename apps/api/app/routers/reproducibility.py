from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user

router = APIRouter(prefix="/v1/repro", tags=["Reproducibility"])


@router.post("/validate")
def validate_reproducibility(_user=Depends(get_current_user)):
    return {
        "job_id": "repro-stub-001",
        "status": "completed",
        "report": {
            "reproducibility_score": 78,
            "dependency_consistency": True,
            "missing_assets": ["requirements-lock.txt"],
            "experimental_validity": "moderate",
            "recommendations": [
                "Pin all dependency versions",
                "Include random seed documentation",
                "Provide dataset checksums",
            ],
        },
    }


@router.get("/{report_id}/report")
def get_repro_report(report_id: str, _user=Depends(get_current_user)):
    return {
        "id": report_id,
        "reproducibility_score": 78,
        "status": "completed",
    }
