import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import (
    analysis,
    billing,
    citations,
    collaboration,
    compliance,
    copilot,
    datasets,
    discovery,
    experiments,
    gaps,
    graph,
    jobs,
    literature,
    reproducibility,
    reviews,
    trends,
    writing,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Axiom Lab 2.0 — Enterprise Research Intelligence Platform",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.cors_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(discovery.router)
app.include_router(literature.router)
app.include_router(gaps.router)
app.include_router(copilot.router)
app.include_router(citations.router)
app.include_router(writing.router)
app.include_router(reviews.router)
app.include_router(graph.router)
app.include_router(trends.router)
app.include_router(collaboration.router)
app.include_router(datasets.router)
app.include_router(experiments.router)
app.include_router(reproducibility.router)
app.include_router(compliance.router)
app.include_router(analysis.router)
app.include_router(billing.router)
app.include_router(jobs.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": settings.app_version}


@app.get("/v1/me")
def me():
    return {"id": "dev", "email": "researcher@axiom.lab", "name": "Dev Researcher", "role": "researcher"}
