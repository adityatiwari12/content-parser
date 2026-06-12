from app.schemas import PaperOut

FIXTURE_PAPERS = [
    PaperOut(
        id="paper-001",
        title="Attention Is All You Need",
        abstract="The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
        authors=["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
        institution="Google Brain",
        citation_count=98432,
        published_at="2017-06-12",
        doi="10.48550/arXiv.1706.03762",
        pdf_url="https://arxiv.org/pdf/1706.03762",
        source="arxiv",
    ),
    PaperOut(
        id="paper-002",
        title="Language Models are Few-Shot Learners",
        abstract="Recent work has demonstrated substantial gains on many NLP tasks by scaling language models...",
        authors=["Brown, T.", "Mann, B.", "Ryder, N."],
        institution="OpenAI",
        citation_count=45210,
        published_at="2020-05-28",
        doi="10.48550/arXiv.2005.14165",
        pdf_url="https://arxiv.org/pdf/2005.14165",
        source="arxiv",
    ),
    PaperOut(
        id="paper-003",
        title="Semantic Scholar: An Academic Search Engine",
        abstract="We describe a search engine that utilizes semantic features to improve academic literature discovery...",
        authors=["Ammar, W.", "Groeneveld, D.", "Bhagavatula, C."],
        institution="Allen Institute for AI",
        citation_count=1240,
        published_at="2018-11-01",
        doi="10.18653/v1/W18-2501",
        pdf_url="https://aclanthology.org/W18-2501.pdf",
        source="semantic_scholar",
    ),
    PaperOut(
        id="paper-004",
        title="Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        abstract="Large pre-trained language models have been shown to store factual knowledge in their parameters...",
        authors=["Lewis, P.", "Perez, E.", "Piktus, A."],
        institution="Facebook AI Research",
        citation_count=8934,
        published_at="2020-05-22",
        doi="10.5555/3495724.3496517",
        pdf_url="https://arxiv.org/pdf/2005.11401",
        source="openalex",
    ),
]


class MockPaperSearchProvider:
    async def search(self, query: str, limit: int = 10) -> list[PaperOut]:
        q = query.lower()
        results = [p for p in FIXTURE_PAPERS if q in p.title.lower() or q in p.abstract.lower()]
        if not results:
            results = FIXTURE_PAPERS
        return results[:limit]

    async def get_by_id(self, paper_id: str) -> PaperOut | None:
        for p in FIXTURE_PAPERS:
            if p.id == paper_id:
                return p
        return None

    async def similar(self, paper_id: str, limit: int = 5) -> list[PaperOut]:
        return [p for p in FIXTURE_PAPERS if p.id != paper_id][:limit]
