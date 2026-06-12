import httpx
from pydantic import BaseModel

from app.config import settings
from app.providers.mock.rag import MockRAGPipeline


class DatasetRecommendation(BaseModel):
    name: str
    description: str
    url: str
    best_for: str
    access: str = "open"


class GroqCopilotPipeline(MockRAGPipeline):
    async def answer(self, query: str, context_paper_ids: list[str] | None = None) -> dict:
        sources = await self.retrieve(query)
        source_context = "\n".join(
            f"- {source.title} (DOI: {source.doi or 'unknown'}, confidence: {source.confidence:.0%})"
            for source in sources
        )
        messages = [
            {
                "role": "system",
                "content": (
                    "You are Axiom Lab's AI Research Copilot for senior researchers. "
                    "Answer in a precise, academic tone. Ground claims in the provided sources, "
                    "flag uncertainty, and suggest concrete next research actions. "
                    "Do not invent citations or paper metadata."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Research question:\n{query}\n\n"
                    f"Available retrieved sources:\n{source_context}\n\n"
                    "Return a concise but useful answer with source-aware reasoning."
                ),
            },
        ]

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.groq_api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.groq_model,
                        "messages": messages,
                        "temperature": 0.25,
                        "max_tokens": 900,
                    },
                )
                response.raise_for_status()
        except httpx.HTTPError:
            return await super().answer(query, context_paper_ids)

        payload = response.json()
        answer = payload.get("choices", [{}])[0].get("message", {}).get("content", "")
        usage = payload.get("usage", {})
        if not answer:
            return await super().answer(query, context_paper_ids)

        return {
            "answer": answer,
            "sources": [source.model_dump() for source in sources],
            "confidence": 0.91,
            "provider": "groq",
            "model": settings.groq_model,
            "usage": usage if isinstance(usage, dict) else {},
        }


def make_copilot_pipeline():
    if settings.groq_api_key:
        return GroqCopilotPipeline()
    return MockRAGPipeline()


def fallback_datasets(topic: str, gap: str) -> list[dict]:
    focus = topic or gap or "AI research"
    return [
        {
            "name": "OpenAlex Works Snapshot",
            "description": f"Large scholarly metadata graph useful for mapping publication gaps around {focus}.",
            "url": "https://docs.openalex.org/download-all-data/openalex-snapshot",
            "best_for": "publication trends, authors, institutions, citation context",
            "access": "open",
        },
        {
            "name": "Semantic Scholar Open Research Corpus",
            "description": f"Paper metadata and abstracts suitable for literature retrieval and research landscape analysis for {focus}.",
            "url": "https://www.semanticscholar.org/product/api",
            "best_for": "paper discovery, abstracts, citation neighborhoods",
            "access": "open API",
        },
        {
            "name": "Papers with Code Datasets",
            "description": f"Benchmark and dataset index for identifying missing evaluation assets related to {focus}.",
            "url": "https://paperswithcode.com/datasets",
            "best_for": "benchmark scarcity, task datasets, method comparison",
            "access": "open",
        },
        {
            "name": "Hugging Face Datasets",
            "description": f"Community dataset catalog for finding candidate corpora and evaluation sets for {focus}.",
            "url": "https://huggingface.co/datasets",
            "best_for": "prototype experiments, text corpora, multimodal datasets",
            "access": "open",
        },
    ]


async def recommend_datasets(topic: str, gap: str) -> list[dict]:
    if not settings.groq_api_key:
        return fallback_datasets(topic, gap)

    messages = [
        {
            "role": "system",
            "content": (
                "You recommend real, accessible research datasets for academic research gaps. "
                "Return only JSON with a top-level key datasets. Each dataset must have "
                "name, description, url, best_for, and access. Prefer reputable sources."
            ),
        },
        {
            "role": "user",
            "content": f"Topic: {topic}\nResearch gap: {gap}\nRecommend 4 datasets or dataset repositories.",
        },
    ]
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.groq_model,
                    "messages": messages,
                    "temperature": 0.2,
                    "max_tokens": 900,
                    "response_format": {"type": "json_object"},
                },
            )
            response.raise_for_status()
    except httpx.HTTPError:
        return fallback_datasets(topic, gap)

    content = response.json().get("choices", [{}])[0].get("message", {}).get("content", "{}")
    try:
        import json

        parsed = json.loads(content)
        datasets = parsed.get("datasets", [])
        return [DatasetRecommendation(**item).model_dump() for item in datasets[:4]]
    except Exception:
        return fallback_datasets(topic, gap)
