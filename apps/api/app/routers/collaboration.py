from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import DiscussionThread, Project, ResearchNote
from app.schemas import NoteCreate, ProjectCreate, ProjectOut

router = APIRouter(prefix="/v1", tags=["Collaboration"])


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db), user=Depends(get_current_user)):
    items = db.query(Project).filter(Project.owner_id == user.id).all()
    return [ProjectOut(id=p.id, name=p.name, description=p.description, created_at=p.created_at) for p in items]


@router.post("/projects", response_model=ProjectOut)
def create_project(
    body: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    p = Project(name=body.name, description=body.description, owner_id=user.id)
    db.add(p)
    db.commit()
    db.refresh(p)
    return ProjectOut(id=p.id, name=p.name, description=p.description, created_at=p.created_at)


@router.get("/projects/{project_id}/notes")
def list_notes(project_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    notes = db.query(ResearchNote).filter(ResearchNote.project_id == project_id).all()
    return [{"id": str(n.id), "title": n.title, "content": n.content} for n in notes]


@router.post("/projects/{project_id}/notes")
def create_note(project_id: UUID, body: NoteCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not db.get(Project, project_id):
        raise HTTPException(404)
    note = ResearchNote(project_id=project_id, title=body.title, content=body.content, author_id=user.id)
    db.add(note)
    db.commit()
    return {"id": str(note.id), "title": note.title}


@router.get("/projects/{project_id}/threads")
def list_threads(project_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    threads = db.query(DiscussionThread).filter(DiscussionThread.project_id == project_id).all()
    return [{"id": str(t.id), "title": t.title, "messages": t.messages or []} for t in threads]
