from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.middleware.billing import check_usage_limit
from app.providers import paper_search
from app.schemas import PaperOut, SearchRequest

router = APIRouter(prefix="/v1/discovery", tags=["Discovery"])


@router.get("/search", response_model=list[PaperOut])
async def search_papers(
    q: str,
    limit: int = 10,
    _user=Depends(check_usage_limit("search")),
):
    return await paper_search.search(q, limit)


@router.get("/papers/{paper_id}", response_model=PaperOut)
async def get_paper(paper_id: str, _user=Depends(get_current_user)):
    paper = await paper_search.get_by_id(paper_id)
    if not paper:
        from fastapi import HTTPException
        raise HTTPException(404, "Paper not found")
    return paper


@router.get("/papers/{paper_id}/similar", response_model=list[PaperOut])
async def similar_papers(paper_id: str, limit: int = 5, _user=Depends(get_current_user)):
    return await paper_search.similar(paper_id, limit)
