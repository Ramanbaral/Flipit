from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models

from router import listings, bids, auctions


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
# HEALTH CHECK
# -------------------------
@app.get("/")
def home():
    return {"message": "Flipit API running"}