from datetime import datetime, UTC

from fastapi import HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Bid,
    Listing,
    ListingType,
    Order,
    OrderStatus,
)


# ==========================================================
# CLOSE AUCTION
# ==========================================================

async def close_auction(
    db: AsyncSession,
    listing_id,
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
            detail="Listing is not an auction.",
        )

    if not listing.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction has already been closed.",
        )

    # ------------------------------------------------------
    # NEW: Prevent early closing
    # ------------------------------------------------------
    if (
        listing.end_time
        and datetime.now(UTC)
        < listing.end_time.replace(tzinfo=UTC)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Auction has not ended yet.",
        )

    result = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )

    highest_bid = result.scalars().first()

    listing.is_active = False

    # ------------------------------------------------------
    # No bids
    # ------------------------------------------------------
    if not highest_bid:

        try:
            await db.commit()

        except Exception:
            await db.rollback()
            raise

        return {
            "message": "Auction closed successfully. No bids were placed."
        }

    order = Order(
        listing_id=listing.id,
        buyer_id=highest_bid.user_id,
        seller_id=listing.seller_id,
        final_price=highest_bid.amount,
        status=OrderStatus.COMPLETED,
    )

    try:

        db.add(order)

        listing.current_price = highest_bid.amount

        await db.commit()
        await db.refresh(order)

    except Exception:
        await db.rollback()
        raise

    return {
    "success": True,
    "message": "Auction closed successfully.",
    "winner": str(highest_bid.user_id),
    "final_price": highest_bid.amount,
    "order_id": str(order.id),
}