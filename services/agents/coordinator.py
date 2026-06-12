"""LangGraph-style multi-agent coordinator (mock implementations)."""

import random
from typing import Any

from app.services.legacy import generate_paper, parse_content, run_plagiarism_check

AGENTS = [
    "literature_agent",
    "review_agent",
    "gap_agent",
    "methodology_agent",
    "statistics_agent",
    "writing_agent",
    "citation_agent",
    "reviewer_agent",
]


def run_workflow(workflow_type: str, input_data: dict[str, Any]) -> dict[str, Any]:
    trace = _build_trace(workflow_type)
    sources = _mock_sources()

    if workflow_type == "writing":
        topic = input_data.get("topic", "")
        paper = generate_paper(topic)
        sections = [
            {"type": "title", "content": paper["title"]},
            {"type": "abstract", "content": paper["abstract"]},
            {"type": "introduction", "content": paper["introduction"]},
            {"type": "literature_review", "content": paper["literatureReview"]},
            {"type": "methodology", "content": paper["methodology"]},
            {"type": "results_discussion", "content": paper["resultsDiscussion"]},
            {"type": "conclusion", "content": paper["conclusion"]},
        ]
        return {
            "paper": paper,
            "sections": sections,
            "confidence": round(random.uniform(0.91, 0.98), 2),
            "sources": sources,
            "agent_trace": trace,
        }

    if workflow_type == "semantic_analysis":
        metrics = parse_content(input_data.get("text", ""))
        return {
            "metrics": metrics,
            "confidence": round(random.uniform(0.88, 0.97), 2),
            "sources": sources[:2],
            "agent_trace": trace,
        }

    if workflow_type == "compliance":
        report = run_plagiarism_check(input_data.get("text", ""))
        return {
            "report": report,
            "confidence": round(random.uniform(0.93, 0.99), 2),
            "sources": sources,
            "agent_trace": trace,
        }

    if workflow_type == "literature_review":
        topic = input_data.get("topic", "")
        return {
            "landscape": f"Research landscape for {topic} spans 2,400+ indexed publications.",
            "key_themes": ["Methodological rigor", "Interdisciplinary integration", "Reproducibility"],
            "influential_papers": sources,
            "consensus": "Standardized evaluation frameworks are widely adopted.",
            "contradictions": "Debate persists on universal vs. context-specific models.",
            "open_challenges": ["Cross-domain generalization", "Benchmark standardization"],
            "opportunities": ["Hybrid human-AI review pipelines", "Open dataset initiatives"],
            "draft": f"A comprehensive literature review of {topic} reveals...",
            "confidence": round(random.uniform(0.89, 0.96), 2),
            "sources": sources,
            "agent_trace": trace,
        }

    if workflow_type == "gap_analysis":
        topic = input_data.get("topic", "")
        return {
            "opportunities": [
                {"area": f"Underexplored methods in {topic}", "confidence": 0.87, "rank": 1},
                {"area": "Missing cross-lingual benchmarks", "confidence": 0.82, "rank": 2},
                {"area": "Conflicting results in scalability studies", "confidence": 0.79, "rank": 3},
            ],
            "underexplored_areas": ["Long-context evaluation", "Causal inference methods"],
            "missing_datasets": ["Multi-domain research corpus v2"],
            "emerging_topics": ["Agentic research assistants"],
            "confidence": round(random.uniform(0.85, 0.94), 2),
            "sources": sources,
            "agent_trace": trace,
        }

    if workflow_type == "peer_review":
        return {
            "scores": {
                "novelty": 7.2,
                "methodology": 8.1,
                "writing_quality": 7.8,
                "citation_quality": 6.9,
                "publication_readiness": 7.5,
            },
            "comments": [
                "The methodology section would benefit from additional detail on data preprocessing.",
                "Several claims in the introduction lack direct citation support.",
                "Results are clearly presented but statistical significance testing is absent.",
            ],
            "recommendation": "Minor Revision",
            "confidence": round(random.uniform(0.88, 0.95), 2),
            "sources": sources,
            "agent_trace": trace,
        }

    return {"message": "Unknown workflow", "agent_trace": trace}


def _build_trace(workflow_type: str) -> list[dict]:
    agent_map = {
        "writing": ["coordinator", "literature_agent", "writing_agent", "citation_agent"],
        "semantic_analysis": ["coordinator", "statistics_agent"],
        "compliance": ["coordinator", "citation_agent", "reviewer_agent"],
        "literature_review": ["coordinator", "literature_agent", "review_agent", "citation_agent"],
        "gap_analysis": ["coordinator", "literature_agent", "gap_agent", "statistics_agent"],
        "peer_review": ["coordinator", "reviewer_agent", "methodology_agent", "citation_agent"],
    }
    agents = agent_map.get(workflow_type, ["coordinator"])
    return [
        {"agent": a, "action": f"Executed {a.replace('_', ' ')}", "duration_ms": random.randint(800, 3000)}
        for a in agents
    ]


def _mock_sources() -> list[dict]:
    return [
        {"id": "paper-001", "title": "Attention Is All You Need", "doi": "10.48550/arXiv.1706.03762", "confidence": 0.92},
        {"id": "paper-004", "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", "doi": "10.5555/3495724.3496517", "confidence": 0.87},
    ]
