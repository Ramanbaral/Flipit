from datetime import datetime

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logger import logger
from app.models import (
    Listing,
    Bid,
    Order,
    OrderStatus,
    ListingType,
)
from app.websockets.manager import manager


async def close_expired_auctions(db: AsyncSession):
    """
    Automatically closes expired auction listings.

    Steps:
    1. Find expired auctions
    2. Find highest bidder
    3. Create Order (if bids exist)
    4. Mark listing inactive
    5. Broadcast websocket event
    """

    now = datetime.utcnow()

    result = await db.execute(
        select(Listing).where(
            Listing.type == ListingType.AUCTION,
            Listing.is_active == True,
            Listing.end_time <= now,
        )
    )

    expired_auctions = result.scalars().all()

    if not expired_auctions:
        return

    logger.info(
        f"Found {len(expired_auctions)} expired auctions."
    )

    for listing in expired_auctions:

        try:

            logger.info(
                f"Closing auction {listing.id}"
            )

            highest_bid_result = await db.execute(
                select(Bid)
                .where(Bid.listing_id == listing.id)
                .order_by(desc(Bid.amount))
            )

            highest_bid = highest_bid_result.scalars().first()

            listing.is_active = False

            if highest_bid:

                logger.info(
                    f"Winner: {highest_bid.user_id}"
                )

                order = Order(
                    listing_id=listing.id,
                    buyer_id=highest_bid.user_id,
                    seller_id=listing.seller_id,
                    final_price=highest_bid.amount,
                    status=OrderStatus.PENDING,
                )

                db.add(order)

            else:

                logger.info(
                    f"Auction {listing.id} ended with no bids."
                )

            await db.commit()

            await manager.broadcast(
                str(listing.id),
                {
                    "event": "auction_closed",
                    "listing_id": str(listing.id),
                    "has_winner": highest_bid is not None,
                    "final_price": (
                        float(highest_bid.amount)
                        if highest_bid
                        else None
                    ),
                },
            )

            logger.info(
                f"Auction {listing.id} closed successfully."
            )

        except Exception as e:

            await db.rollback()

            logger.exception(e)