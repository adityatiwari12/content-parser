from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.schemas import CitationFormatRequest

router = APIRouter(prefix="/v1/citations", tags=["Citations"])


@router.post("/format")
def format_citations(body: CitationFormatRequest, _user=Depends(get_current_user)):
    formatted = []
    for i, ref in enumerate(body.references, 1):
        author = ref.get("author", "Unknown")
        title = ref.get("title", "Untitled")
        year = ref.get("year", "n.d.")
        if body.style == "apa":
            formatted.append(f"{author} ({year}). {title}.")
        elif body.style == "ieee":
            formatted.append(f"[{i}] {author}, \"{title},\" {year}.")
        else:
            formatted.append(f"{author}. {title}. {year}.")
    return {"style": body.style, "citations": formatted}


@router.post("/validate")
def validate_citations(body: CitationFormatRequest, _user=Depends(get_current_user)):
    issues = []
    for i, ref in enumerate(body.references):
        if not ref.get("doi") and not ref.get("title"):
            issues.append({"index": i, "issue": "Missing title and DOI"})
    return {"valid": len(issues) == 0, "issues": issues}


@router.post("/recommend")
def recommend_citations(q: str = "", _user=Depends(get_current_user)):
    return {
        "recommendations": [
            {"title": "Attention Is All You Need", "doi": "10.48550/arXiv.1706.03762", "relevance": 0.92},
            {"title": "BERT: Pre-training of Deep Bidirectional Transformers", "doi": "10.18653/v1/N19-1423", "relevance": 0.87},
        ]
    }
