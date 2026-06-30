from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class ListingType(str, Enum):
    FIXED = "FIXED"
    AUCTION = "AUCTION"


class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: ListingType

    price: Optional[float] = None
    start_price: Optional[float] = None
    end_time: Optional[datetime] = None

    @model_validator(mode="after")
    def validate(self):
        if self.type == ListingType.FIXED:
            if self.price is None:
                raise ValueError("FIXED must have price")
            if self.start_price or self.end_time:
                raise ValueError("FIXED cannot have auction fields")

        if self.type == ListingType.AUCTION:
            if self.start_price is None:
                raise ValueError("AUCTION must have start_price")
            if self.end_time is None:
                raise ValueError("AUCTION must have end_time")
            if self.price:
                raise ValueError("AUCTION cannot have price")

        return self


class ListingResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    type: ListingType

    price: Optional[float]
    start_price: Optional[float]
    current_price: Optional[float]
    end_time: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True