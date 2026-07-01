from uuid import UUID
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.websockets.manager import manager
from app.core.logger import logger
from app.models import Listing, Bid, ListingType


# ==========================================================
# CREATE BID
# ==========================================================

async def create_bid(
    db: AsyncSession,
    listing_id: UUID,
    user_id: UUID,
    amount: float,
):
    try:
        result = await db.execute(
            select(Listing).where(Listing.id == listing_id)
        )

        listing = result.scalar_one_or_none()

        if not listing:
            logger.error(f"Bid failed: Listing {listing_id} not found.")

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found.",
            )

        if listing.type != ListingType.AUCTION:
            logger.warning(
                f"User {user_id} attempted to bid on fixed listing {listing_id}."
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bids are only allowed on auction listings.",
            )

        if not listing.is_active:
            logger.warning(
                f"User {user_id} attempted to bid on inactive listing {listing_id}."
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Listing is inactive.",
            )

        if (
            listing.end_time
            and listing.end_time.replace(tzinfo=timezone.utc)
            < datetime.now(timezone.utc)
        ):
            logger.warning(
                f"Bid rejected because auction {listing_id} has ended."
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Auction has already ended.",
            )

        if str(listing.seller_id) == str(user_id):
            logger.warning(
                f"Seller {user_id} attempted to bid on own listing."
            )

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

        minimum_bid = (
            highest_bid.amount
            if highest_bid
            else listing.start_price
        )

        if amount <= minimum_bid:
            logger.warning(
                f"Rejected bid {amount} on listing {listing_id}. "
                f"Current minimum is {minimum_bid}."
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Bid must be greater than {minimum_bid}.",
            )

        bid = Bid(
            listing_id=listing_id,
            user_id=user_id,
            amount=amount,
        )

        db.add(bid)

        listing.current_price = amount

        await db.commit()
        await db.refresh(bid)
        from app.websockets.manager import manager
        
        await manager.broadcast(
 str(listing_id),
    {
        "event": "new_bid",
        "listing_id": str(listing_id),
        "bid_id": str(bid.id),
        "amount": float(bid.amount),
        "current_price": float(listing.current_price),
        "user_id": str(user_id),
    },
)

        logger.info(
            f"User {user_id} placed bid {amount} on listing {listing_id}."
        )

        return bid

    except HTTPException:
        await db.rollback()
        raise

    except Exception as e:
        await db.rollback()

        logger.exception(
            f"Unexpected error while creating bid: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create bid.",
        )


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

    bids = result.scalars().all()

    logger.info(
        f"Retrieved {len(bids)} bids for listing {listing_id}."
    )

    return bids


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

    if highest_bid:
        logger.info(
            f"Highest bid for listing {listing_id}: {highest_bid.amount}"
        )
    else:
        logger.info(
            f"No bids found for listing {listing_id}."
        )

    return highest_bid