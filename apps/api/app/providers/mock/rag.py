from app.providers.mock.papers import FIXTURE_PAPERS
from app.schemas import SourceAttribution


class MockRAGPipeline:
    async def retrieve(self, query: str, top_k: int = 5) -> list[SourceAttribution]:
        return [
            SourceAttribution(
                id=p.id,
                title=p.title,
                doi=p.doi,
                confidence=0.85 - i * 0.05,
            )
            for i, p in enumerate(FIXTURE_PAPERS[:top_k])
        ]

    async def answer(self, query: str, context_paper_ids: list[str] | None = None) -> dict:
        sources = await self.retrieve(query)
        return {
            "answer": f"Based on retrieved literature, {query} is an active research area with established methodological frameworks.",
            "sources": [s.model_dump() for s in sources],
            "confidence": 0.89,
        }
