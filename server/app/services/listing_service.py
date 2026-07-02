from typing import Optional
from uuid import UUID
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app import schemas
from app.core.logger import logger
from app.models import Listing, ListingType


# ==========================================================
# VALIDATE LISTING
# ==========================================================

def validate_listing(data: schemas.ListingCreate):

    if data.type == ListingType.FIXED:

        if data.price is None:
            raise HTTPException(400, "Fixed listings require a price.")

        if data.start_price is not None:
            raise HTTPException(400, "Fixed listings cannot have start price.")

        if data.end_time is not None:
            raise HTTPException(400, "Fixed listings cannot have end time.")

    elif data.type == ListingType.AUCTION:

        if data.start_price is None:
            raise HTTPException(400, "Auction requires start price.")

        if data.end_time is None:
            raise HTTPException(400, "Auction requires end time.")

        if data.price is not None:
            raise HTTPException(400, "Auction cannot have fixed price.")


# ==========================================================
# CREATE LISTING
# ==========================================================

async def create_listing(db: AsyncSession, data: schemas.ListingCreate):

    validate_listing(data)

    listing = Listing(**data.model_dump())

    listing.current_price = (
        listing.price if listing.type == ListingType.FIXED
        else listing.start_price
    )

    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    logger.info(f"Listing created: {listing.id}")
    return listing


# ==========================================================
# UPDATE LISTING
# ==========================================================

async def update_listing(db: AsyncSession, listing_id: UUID, data: schemas.ListingUpdate):

    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(404, "Listing not found")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(listing, k, v)

    await db.commit()
    await db.refresh(listing)

    return listing


# ==========================================================
# GET SINGLE LISTING
# ==========================================================

async def get_listing(db: AsyncSession, listing_id: UUID):

    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(404, "Listing not found")

    return listing


# ==========================================================
# GET ALL LISTINGS (SEARCH + FILTER ONLY)
# ==========================================================

async def get_listings(
    db: AsyncSession,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    listing_type: Optional[ListingType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: str = "newest",
    limit: int = 10,
    offset: int = 0,
):

    query = select(Listing).where(Listing.is_active == True)

    if category_id:
        query = query.where(Listing.category_id == category_id)

    if listing_type:
        query = query.where(Listing.type == listing_type)

    if min_price:
        query = query.where(Listing.current_price >= min_price)

    if max_price:
        query = query.where(Listing.current_price <= max_price)

    if sort == "newest":
        query = query.order_by(desc(Listing.created_at))

    elif sort == "price_low":
        query = query.order_by(Listing.current_price.asc())

    elif sort == "price_high":
        query = query.order_by(Listing.current_price.desc())

    elif sort != "oldest":
        raise HTTPException(400, "Invalid sort option")

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()

    return {
        "items": items,
        "count": len(items)
    }


# ==========================================================
# DELETE LISTING
# ==========================================================

async def delete_listing(db: AsyncSession, listing_id: UUID):

    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(404, "Listing not found")

    await db.delete(listing)
    await db.commit()

    return {"success": True}