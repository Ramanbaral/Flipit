from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from models import Listing, Bid, Order, OrderStatus, ListingType


async def close_auction(db: AsyncSession, listing_id):
    res = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = res.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if listing.type != ListingType.AUCTION:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not auction",
        )

    if not listing.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already closed",
        )

    res = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )
    highest = res.scalars().first()

    listing.is_active = False

    if not highest:
        await db.commit()
        return {"message": "closed no bids"}

    order = Order(
        listing_id=listing.id,
        buyer_id=highest.user_id,
        seller_id=listing.seller_id,
        final_price=highest.amount,
        status=OrderStatus.COMPLETED,
    )

    db.add(order)
    listing.current_price = highest.amount

    await db.commit()
    await db.refresh(order)

    return {
        "winner": str(highest.user_id),
        "price": highest.amount,
        "order_id": str(order.id),
    }