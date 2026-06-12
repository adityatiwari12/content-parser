from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import Experiment, ExperimentRun

router = APIRouter(prefix="/v1/experiments", tags=["Experiments"])


@router.get("")
def list_experiments(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(Experiment).filter(Experiment.owner_id == user.id).all()
    return [{"id": str(e.id), "name": e.name, "description": e.description} for e in items]


@router.post("")
def create_experiment(
    name: str,
    description: str = "",
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    e = Experiment(name=name, description=description, owner_id=user.id)
    db.add(e)
    db.commit()
    db.refresh(e)
    return {"id": str(e.id), "name": e.name}


@router.post("/{experiment_id}/runs")
def create_run(
    experiment_id: UUID,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if not db.get(Experiment, experiment_id):
        raise HTTPException(404)
    run = ExperimentRun(
        experiment_id=experiment_id,
        metrics={"accuracy": 0.94, "f1": 0.91, "loss": 0.12},
        hyperparameters={"lr": 0.001, "batch_size": 32, "epochs": 100},
    )
    db.add(run)
    db.commit()
    return {"id": str(run.id), "metrics": run.metrics, "hyperparameters": run.hyperparameters}
