from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID



class ListingCreate(BaseModel):
    seller_id: UUID
    category_id: int
    title: str
    description: str | None = None
    type: str
    price: float | None = None
    start_price: float | None = None
    end_time: datetime | None = None


class ListingOut(ListingCreate):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

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