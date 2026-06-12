import uuid
from typing import Annotated

from fastapi import Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Role, TeamMember, User

DEV_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def get_current_user(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    x_dev_user_id: Annotated[str | None, Header()] = None,
    authorization: Annotated[str | None, Header()] = None,
) -> User:
    if settings.dev_auth_bypass:
        user = db.get(User, DEV_USER_ID)
        if not user:
            user = User(id=DEV_USER_ID, email="researcher@axiom.lab", name="Dev Researcher")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    if settings.clerk_secret_key and authorization:
        # Clerk JWT validation stub — Phase 2
        pass

    if x_dev_user_id:
        user = db.get(User, uuid.UUID(x_dev_user_id))
        if user:
            return user

    raise HTTPException(status_code=401, detail="Authentication required")


def require_role(*roles: Role):
    def checker(
        user: Annotated[User, Depends(get_current_user)],
        db: Annotated[Session, Depends(get_db)],
    ) -> User:
        member = db.query(TeamMember).filter(TeamMember.user_id == user.id).first()
        if member and member.role in roles:
            return user
        if settings.dev_auth_bypass:
            return user
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    return checker
