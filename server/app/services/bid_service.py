from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from models import Listing, Bid


async def create_bid(db: AsyncSession, listing_id, user_id, amount):
    res = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = res.scalar_one_or_none()

    if not listing:
        raise ValueError("Listing not found")

    if not listing.is_active:
        raise ValueError("Inactive listing")

    if str(listing.seller_id) == str(user_id):
        raise ValueError("Seller cannot bid")

    res = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )

    highest = res.scalars().first()

    if highest and amount <= highest.amount:
        raise ValueError("Bid too low")

    bid = Bid(
        listing_id=listing_id,
        user_id=user_id,
        amount=amount,
    )

    db.add(bid)

    listing.current_price = amount

    await db.commit()
    await db.refresh(bid)

    return bid


async def get_bids(db: AsyncSession, listing_id):
    res = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )
    return res.scalars().all()


async def get_highest_bid(db: AsyncSession, listing_id):
    res = await db.execute(
        select(Bid)
        .where(Bid.listing_id == listing_id)
        .order_by(desc(Bid.amount))
    )
    return res.scalars().first()