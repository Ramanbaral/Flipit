from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas import BidCreate, BidResponse
from app.services import bid_service

router = APIRouter(
    prefix="/bids",
    tags=["Bids"],
)


# ==========================================================
# CREATE BID
# ==========================================================

@router.post(
    "",
    response_model=BidResponse,
    status_code=201,
)
async def create_bid(
    data: BidCreate,
    db: AsyncSession = Depends(get_db),
):
    return await bid_service.create_bid(
        db,
        data.listing_id,
        data.user_id,
        data.amount,
    )


# ==========================================================
# GET ALL BIDS FOR A LISTING
# ==========================================================

@router.get(
    "/{listing_id}",
    response_model=list[BidResponse],
)
async def get_bids(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await bid_service.get_bids(
        db,
        listing_id,
    )


# ==========================================================
# GET HIGHEST BID
# ==========================================================

@router.get(
    "/{listing_id}/highest",
    response_model=BidResponse,
)
async def get_highest_bid(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await bid_service.get_highest_bid(
        db,
        listing_id,
    )