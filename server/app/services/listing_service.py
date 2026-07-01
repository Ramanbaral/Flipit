from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession

from models import Listing
import schemas


# ==========================================================
# CREATE LISTING
# ==========================================================

async def create_listing(
    db: AsyncSession,
    data: schemas.ListingCreate,
):
    listing = Listing(**data.model_dump())

    db.add(listing)
    await db.commit()
    await db.refresh(listing)

    return listing


# ==========================================================
# GET SINGLE LISTING
# ==========================================================

async def get_listing(
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
            detail="Listing not found",
        )

    return listing


# ==========================================================
# GET ALL LISTINGS
# ==========================================================

async def get_listings(
    db: AsyncSession,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    listing_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: str = "newest",
    limit: int = 10,
    offset: int = 0,
):
    query = select(Listing)

    # Search
    if search:
        query = query.where(
            or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%"),
            )
        )

    # Category filter
    if category_id is not None:
        query = query.where(Listing.category_id == category_id)

    # Listing type filter
    if listing_type:
        query = query.where(Listing.type == listing_type)

    # Price filters
    if min_price is not None:
        query = query.where(Listing.current_price >= min_price)

    if max_price is not None:
        query = query.where(Listing.current_price <= max_price)

    # Sorting
    if sort == "newest":
        query = query.order_by(desc(Listing.created_at))

    elif sort == "oldest":
        query = query.order_by(Listing.created_at)

    elif sort == "price_low":
        query = query.order_by(Listing.current_price.asc())

    elif sort == "price_high":
        query = query.order_by(Listing.current_price.desc())

    # Pagination
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)

    return result.scalars().all()


# ==========================================================
# DELETE LISTING
# ==========================================================

async def delete_listing(
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
            detail="Listing not found",
        )

    await db.delete(listing)
    await db.commit()

    return {
        "message": "Listing deleted successfully"
    }