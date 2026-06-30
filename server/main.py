from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from scheduler import start_scheduler
from ws_manager import manager

import models

from routes import listings, bids, auctions

# -------------------------
# DB INIT (DEV ONLY)
# -------------------------
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# ROUTES
# -------------------------
app.include_router(listings.router)
app.include_router(bids.router)
app.include_router(auctions.router)

# -------------------------
# STARTUP TASKS
# -------------------------
@app.on_event("startup")
def startup_event():
    start_scheduler()

# -------------------------
# WEBSOCKET
# -------------------------
@app.websocket("/ws/listings/{listing_id}")
async def listing_ws(websocket: WebSocket, listing_id: str):
    await manager.connect(listing_id, websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(listing_id, websocket)

# -------------------------
# HEALTH CHECK
# -------------------------
@app.get("/")
def home():
    return {"message": "Flipit API running"}