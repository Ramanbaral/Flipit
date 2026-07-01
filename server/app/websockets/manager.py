from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List

from app.core.logger import logger


class ConnectionManager:
    def __init__(self):
        # listing_id -> list of connected websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(
        self,
        listing_id: str,
        websocket: WebSocket,
    ):
        """
        Connect a client to a listing room.
        """
        await websocket.accept()

        if listing_id not in self.active_connections:
            self.active_connections[listing_id] = []

        self.active_connections[listing_id].append(websocket)

        logger.info(
            f"WebSocket connected to listing {listing_id}. "
            f"Connections: {len(self.active_connections[listing_id])}"
        )

    def disconnect(
        self,
        listing_id: str,
        websocket: WebSocket,
    ):
        """
        Remove disconnected websocket.
        """
        if listing_id not in self.active_connections:
            return

        if websocket in self.active_connections[listing_id]:
            self.active_connections[listing_id].remove(websocket)

            logger.info(
                f"WebSocket disconnected from listing {listing_id}."
            )

        # Remove empty room
        if len(self.active_connections[listing_id]) == 0:
            del self.active_connections[listing_id]

            logger.info(
                f"Removed empty websocket room for listing {listing_id}."
            )

    async def broadcast(
        self,
        listing_id: str,
        message: dict,
    ):
        """
        Send message to everyone watching this listing.
        """

        if listing_id not in self.active_connections:
            return

        disconnected = []

        for websocket in self.active_connections[listing_id]:
            try:
                await websocket.send_json(message)

            except WebSocketDisconnect:
                disconnected.append(websocket)

            except Exception as e:
                logger.exception(
                    f"Broadcast failed: {e}"
                )
                disconnected.append(websocket)

        # Cleanup dead sockets
        for websocket in disconnected:
            self.disconnect(listing_id, websocket)


manager = ConnectionManager()