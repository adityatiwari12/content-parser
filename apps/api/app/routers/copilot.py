from uuid import uuid4

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.middleware.auth import get_current_user
from app.providers import rag
from pydantic import BaseModel

from app.schemas import CopilotSessionCreate


class CopilotMessageBody(BaseModel):
    message: str

router = APIRouter(prefix="/v1/copilot", tags=["AI Copilot"])

sessions: dict[str, list] = {}


@router.post("/sessions")
async def create_session(body: CopilotSessionCreate, _user=Depends(get_current_user)):
    sid = str(uuid4())
    sessions[sid] = []
    return {"session_id": sid, "paper_ids": body.paper_ids}


@router.post("/sessions/{session_id}/message")
async def send_message(session_id: str, body: CopilotMessageBody, _user=Depends(get_current_user)):
    message = body.message
    result = await rag.answer(message)
    if session_id not in sessions:
        sessions[session_id] = []
    sessions[session_id].append({"role": "user", "content": message})
    sessions[session_id].append({"role": "assistant", "content": result["answer"]})
    return result


@router.websocket("/sessions/{session_id}/ws")
async def copilot_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            result = await rag.answer(data)
            await websocket.send_json(result)
    except WebSocketDisconnect:
        pass
