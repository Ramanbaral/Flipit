from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models import ListingType, ItemCondition


# ==========================================================
# LISTINGS
# ==========================================================

class ListingCreate(BaseModel):
    seller_id: UUID
    category_id: int

    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)

    quantity: int = Field(default=1, ge=1)

    condition: ItemCondition = ItemCondition.GOOD
    type: ListingType

    price: Optional[float] = Field(default=None, gt=0)
    start_price: Optional[float] = Field(default=None, gt=0)

    end_time: Optional[datetime] = None


class ListingUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)

    category_id: Optional[int] = None
    quantity: Optional[int] = Field(default=None, ge=1)

    condition: Optional[ItemCondition] = None

    price: Optional[float] = Field(default=None, gt=0)
    start_price: Optional[float] = Field(default=None, gt=0)

    end_time: Optional[datetime] = None
    is_active: Optional[bool] = None


class ListingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    seller_id: UUID
    category_id: int

    title: str
    description: Optional[str]

    quantity: int
    condition: ItemCondition
    type: ListingType

    price: Optional[float]
    start_price: Optional[float]
    current_price: Optional[float]

    end_time: Optional[datetime]

    is_active: bool

    created_at: datetime
    updated_at: datetime


class ListingListResponse(BaseModel):
    items: list[ListingOut]
    count: int


# ==========================================================
# BIDS
# ==========================================================

class BidCreate(BaseModel):
    listing_id: UUID
    user_id: UUID
    amount: float = Field(..., gt=0)


class BidResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    listing_id: UUID
    user_id: UUID

    amount: float
    created_at: datetime
    
class MessageResponse(BaseModel):
    success: bool
    message: str    