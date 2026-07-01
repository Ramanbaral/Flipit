from uuid import UUID

from fastapi import APIRouter, Depends, status
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
    status_code=status.HTTP_201_CREATED,
    summary="Place a bid",
    description="""
Place a bid on an auction listing.

Rules enforced by the service:

- Listing must exist
- Listing must be active
- Seller cannot bid on their own listing
- Bid must be higher than the current highest bid
""",
    responses={
        201: {"description": "Bid placed successfully"},
        400: {"description": "Invalid bid"},
        404: {"description": "Listing not found"},
    },
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
# GET ALL BIDS
# ==========================================================

@router.get(
    "/{listing_id}",
    response_model=list[BidResponse],
    summary="Get all bids for a listing",
    description="""
Retrieve every bid placed on a listing.

Results are returned in descending order of bid amount.
""",
    responses={
        200: {"description": "Bids retrieved successfully"},
        404: {"description": "Listing not found"},
    },
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
    summary="Get highest bid",
    description="""
Retrieve the highest bid for a specific auction listing.
""",
    responses={
        200: {"description": "Highest bid retrieved successfully"},
        404: {"description": "No bids found or listing does not exist"},
    },
)
async def get_highest_bid(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await bid_service.get_highest_bid(
        db,
        listing_id,
    )