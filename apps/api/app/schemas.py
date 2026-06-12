from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class SourceAttribution(BaseModel):
    id: str
    title: str
    doi: str | None = None
    confidence: float = 0.0


class AgentTraceStep(BaseModel):
    agent: str
    action: str
    duration_ms: int = 0


class JobResponse(BaseModel):
    job_id: UUID
    status: str
    progress: int = 0
    phase: str | None = None
    result: dict | None = None
    error: str | None = None
    agent_trace: list[AgentTraceStep] = []
    sources: list[SourceAttribution] = []
    confidence: float | None = None


class PaperOut(BaseModel):
    id: str
    title: str
    abstract: str
    authors: list[str]
    institution: str
    citation_count: int
    published_at: str
    doi: str
    pdf_url: str
    source: str


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class TopicRequest(BaseModel):
    topic: str


class TextRequest(BaseModel):
    text: str


class WritingGenerateRequest(BaseModel):
    topic: str
    manuscript_id: UUID | None = None


class CitationFormatRequest(BaseModel):
    style: str = "apa"
    references: list[dict[str, Any]]


class ManuscriptCreate(BaseModel):
    title: str
    topic: str | None = None
    project_id: UUID | None = None


class ManuscriptOut(BaseModel):
    id: UUID
    title: str
    topic: str | None
    sections: list[dict[str, str]] = []


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None


class ProjectOut(BaseModel):
    id: UUID
    name: str
    description: str | None
    created_at: datetime


class NoteCreate(BaseModel):
    title: str
    content: str


class CopilotMessage(BaseModel):
    role: str
    content: str


class CopilotSessionCreate(BaseModel):
    paper_ids: list[str] = []


class BillingPlanOut(BaseModel):
    plan: str
    searches_remaining: int
    generations_remaining: int


class UserOut(BaseModel):
    id: UUID
    email: str
    name: str
    role: str = "researcher"
