from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from core.database import get_db
import services.auction_service as service

router = APIRouter(prefix="/auction", tags=["Auction"])


@router.post("/close/{listing_id}")
async def close(listing_id: UUID, db: AsyncSession = Depends(get_db)):
    return await service.close_auction(db, listing_id)