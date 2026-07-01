from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websockets.manager import manager
from app.core.logger import logger

router = APIRouter(
    tags=["WebSocket"]
)


@router.websocket("/ws/listings/{listing_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    listing_id: str,
):
    """
    WebSocket endpoint for a listing.

    Clients connect here to receive:
    - new bids
    - auction closed
    - listing updates
    """

    await manager.connect(listing_id, websocket)

    try:

        while True:
            # Wait for any message from client
            # (heartbeat / ping)
            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(
            listing_id,
            websocket,
        )

        logger.info(
            f"Client disconnected from listing {listing_id}"
        )

    except Exception as e:

        manager.disconnect(
            listing_id,
            websocket,
        )

        logger.exception(e)