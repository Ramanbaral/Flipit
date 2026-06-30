from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# -------------------------
# LISTING
# -------------------------
class ListingCreate(BaseModel):
    seller_id: str
    category_id: int
    title: str
    description: Optional[str] = None
    type: str

    # FIXED listing
    price: Optional[float] = None

    # AUCTION listing
    start_price: Optional[float] = None
    end_time: Optional[datetime] = None


class ListingResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    type: str
    price: Optional[float]
    current_price: Optional[float]


# -------------------------
# BID
# -------------------------
class BidCreate(BaseModel):
    listing_id: str
    user_id: str
    amount: float


class BidResponse(BaseModel):
    id: str
    listing_id: str
    user_id: str
    amount: float
    created_at: datetime