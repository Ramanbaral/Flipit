from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager

router = APIRouter()


@router.websocket("/ws/listings/{listing_id}")
async def websocket_endpoint(websocket: WebSocket, listing_id: str):
    await manager.connect(listing_id, websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(listing_id, websocket)