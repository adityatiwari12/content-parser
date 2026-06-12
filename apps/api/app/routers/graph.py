from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user
from app.providers import graph_store

router = APIRouter(prefix="/v1/graph", tags=["Knowledge Graph"])


@router.get("/nodes")
async def get_nodes(type: str | None = None, limit: int = 50, _user=Depends(get_current_user)):
    return await graph_store.get_nodes(type, limit)


@router.get("/edges")
async def get_edges(limit: int = 50, _user=Depends(get_current_user)):
    return await graph_store.get_edges(limit)


@router.get("/clusters")
async def get_clusters(_user=Depends(get_current_user)):
    return await graph_store.get_clusters()
