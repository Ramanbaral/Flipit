from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services import auction_service as service

router = APIRouter(
    prefix="/auction",
    tags=["Auction"],
)


# ==========================================================
# CLOSE AUCTION
# ==========================================================

@router.post(
    "/{listing_id}/close",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Close an auction",
    description="""
Close an active auction manually.

When an auction is closed:

- The auction becomes inactive.
- The highest bidder (if any) is declared the winner.
- An order is created for the winning bid.
- The winning bid becomes the final sale price.

If no bids exist, the auction simply closes without creating an order.
""",
    responses={
        200: {
            "description": "Auction closed successfully"
        },
        400: {
            "description": "Auction cannot be closed"
        },
        404: {
            "description": "Listing not found"
        },
    },
)
async def close_auction(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.close_auction(
        db,
        listing_id,
    )