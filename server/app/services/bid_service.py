from datetime import datetime, UTC
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Bid, Listing, ListingType


# ==========================================================
# CREATE BID
# ==========================================================

async def create_bid(
    db: AsyncSession,
    listing_id: UUID,
    user_id: UUID,
    amount: float,
):
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found.",
        )

    if listing.type != ListingType.AUCTION:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bids are only allowed on auction listings.",
        )

    if not listing.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction is closed.",
        )

    if (
        listing.end_time
        and datetime.now(UTC)
        >= listing.end_time.replace(tzinfo=UTC)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction has already ended.",
        )

    if listing.seller_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seller cannot bid on their own listing.",
        )

    result = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )

    highest_bid = result.scalars().first()

    # ---------------------------------------------
    # Validate bid amount
    # ---------------------------------------------
    if highest_bid:

        if amount <= highest_bid.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bid must be higher than the current highest bid.",
            )

    else:

        if amount < listing.start_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bid must be at least the starting price.",
            )

    bid = Bid(
        listing_id=listing_id,
        user_id=user_id,
        amount=amount,
    )

    try:

        db.add(bid)

        listing.current_price = amount

        await db.commit()
        await db.refresh(bid)

    except Exception:
        await db.rollback()
        raise

    return bid


# ==========================================================
# GET ALL BIDS
# ==========================================================

async def get_bids(
    db: AsyncSession,
    listing_id: UUID,
):
    result = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )

    return result.scalars().all()


# ==========================================================
# GET HIGHEST BID
# ==========================================================

async def get_highest_bid(
    db: AsyncSession,
    listing_id: UUID,
):
    result = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )

    highest_bid = result.scalars().first()

    if not highest_bid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No bids found for this listing.",
        )

    return highest_bid