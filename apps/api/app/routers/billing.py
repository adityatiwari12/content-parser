from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.middleware.billing import PLAN_LIMITS, get_user_plan
from app.schemas import BillingPlanOut

router = APIRouter(prefix="/v1/billing", tags=["Billing"])


@router.get("/plan", response_model=BillingPlanOut)
def get_plan(db: Session = Depends(get_db), user=Depends(get_current_user)):
    plan = get_user_plan(db, user.id)
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    return BillingPlanOut(
        plan=plan,
        searches_remaining=limits["search"],
        generations_remaining=limits["generation"],
    )


@router.post("/checkout")
def create_checkout(plan: str = "pro", _user=Depends(get_current_user)):
    return {
        "checkout_url": "https://checkout.stripe.com/stub-session",
        "plan": plan,
        "message": "Stripe integration stub — configure STRIPE_SECRET_KEY for production",
    }


@router.post("/webhook")
def stripe_webhook():
    return {"received": True}
