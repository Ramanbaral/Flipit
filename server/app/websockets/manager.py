from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, listing_id: str, websocket: WebSocket):
        await websocket.accept()

        if listing_id not in self.active_connections:
            self.active_connections[listing_id] = []

        self.active_connections[listing_id].append(websocket)

    def disconnect(self, listing_id: str, websocket: WebSocket):
        self.active_connections[listing_id].remove(websocket)

    async def broadcast(self, listing_id: str, message: dict):
        if listing_id not in self.active_connections:
            return

        for ws in self.active_connections[listing_id]:
            await ws.send_json(message)


manager = ConnectionManager()