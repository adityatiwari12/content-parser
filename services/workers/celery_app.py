import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "apps", "api"))

from celery import Celery

from app.config import settings

celery_app = Celery(
    "axiom_lab",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["services.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)
