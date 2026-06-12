import uuid
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models import Subscription, UsageEvent, User

PLAN_LIMITS = {
    "free": {"search": 20, "generation": 5},
    "pro": {"search": 10000, "generation": 10000},
    "enterprise": {"search": 100000, "generation": 100000},
}


def get_user_plan(db: Session, user_id: uuid.UUID) -> str:
    sub = db.query(Subscription).filter(Subscription.user_id == user_id, Subscription.active == True).first()
    return sub.plan if sub else "free"


def check_usage_limit(event_type: str):
    def dependency(
        user: Annotated[User, Depends(get_current_user)],
        db: Annotated[Session, Depends(get_db)],
    ) -> User:
        if settings.dev_auth_bypass:
            return user
        plan = get_user_plan(db, user.id)
        limit = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"]).get(event_type, 0)
        since = datetime.utcnow() - timedelta(days=30)
        used = (
            db.query(func.coalesce(func.sum(UsageEvent.quantity), 0))
            .filter(
                UsageEvent.user_id == user.id,
                UsageEvent.event_type == event_type,
                UsageEvent.created_at >= since,
            )
            .scalar()
        )
        if used >= limit:
            raise HTTPException(status_code=402, detail=f"Plan limit reached for {event_type}")
        db.add(UsageEvent(user_id=user.id, event_type=event_type))
        db.commit()
        return user

    return dependency
