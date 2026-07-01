from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import BidCreate
from app.services import bid_service

router = APIRouter(prefix="/bids", tags=["Bids"])


@router.post("")
async def create_bid(data: BidCreate, db: AsyncSession = Depends(get_db)):
    return await bid_service.create_bid(
        db,
        data.listing_id,
        data.user_id,
        data.amount,
    )