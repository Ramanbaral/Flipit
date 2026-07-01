from sqlalchemy import select, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession

from models import Listing
import schemas


async def create_listing(db: AsyncSession, data: schemas.ListingCreate):
    listing = Listing(**data.model_dump())

    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    return listing


async def get_listing(db: AsyncSession, listing_id):
    res = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = res.scalar_one_or_none()

    if not listing:
        raise ValueError("Listing not found")

    return listing


async def get_listings(db: AsyncSession, search=None):
    query = select(Listing)

    if search:
        query = query.where(
            or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%"),
            )
        )

    res = await db.execute(query)
    return res.scalars().all()


async def delete_listing(db: AsyncSession, listing_id):
    res = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = res.scalar_one_or_none()

    if not listing:
        raise ValueError("Listing not found")

    await db.delete(listing)
    await db.commit()

    return {"message": "deleted"}