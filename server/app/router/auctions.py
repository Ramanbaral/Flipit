from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.database import get_db
from app.services import auction_service as service

router = APIRouter(prefix="/auction", tags=["Auction"])


@router.post(
    "/{listing_id}/close",
    response_model=dict,
)
async def close_auction(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.close_auction(
        db,
        listing_id,
    )