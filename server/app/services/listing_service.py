from typing import Optional
from uuid import UUID
from sqlalchemy import func
from fastapi import HTTPException, status
from sqlalchemy import select, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app import schemas
from app.core.logger import logger
from app.models import Listing, ListingType


# ==========================================================
# VALIDATE LISTING
# ==========================================================

def validate_listing(data: schemas.ListingCreate):
    """
    Validate listing based on listing type.
    """

    if data.type == ListingType.FIXED:

        if data.price is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fixed listings require a price.",
            )

        if data.start_price is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fixed listings cannot have a start price.",
            )

        if data.end_time is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Fixed listings cannot have an end time.",
            )

    elif data.type == ListingType.AUCTION:

        if data.start_price is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Auction listings require a starting price.",
            )

        if data.end_time is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Auction listings require an end time.",
            )

        if data.price is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Auction listings cannot have a fixed price.",
            )


# ==========================================================
# CREATE LISTING
# ==========================================================

async def create_listing(
    db: AsyncSession,
    data: schemas.ListingCreate,
):
    validate_listing(data)

    logger.info(
        f"Creating new {data.type.value} listing: '{data.title}'"
    )

    listing = Listing(**data.model_dump())

    if listing.type == ListingType.FIXED:
        listing.current_price = listing.price
    else:
        listing.current_price = listing.start_price

    db.add(listing)

    await db.commit()
    await db.refresh(listing)

    logger.info(
        f"Listing {listing.id} created successfully."
    )

    return listing


# ==========================================================
# UPDATE LISTING
# ==========================================================

async def update_listing(
    db: AsyncSession,
    listing_id: UUID,
    data: schemas.ListingUpdate,
):
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        logger.error(
            f"Update failed: Listing {listing_id} not found."
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    logger.info(
        f"Updating listing {listing.id}"
    )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(listing, field, value)

    if listing.type == ListingType.FIXED:
        listing.current_price = listing.price

    await db.commit()
    await db.refresh(listing)

    logger.info(
        f"Listing {listing.id} updated successfully."
    )

    return listing


# ==========================================================
# GET SINGLE LISTING
# ==========================================================

async def get_listing(
    db: AsyncSession,
    listing_id: UUID,
):
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        logger.error(
            f"Listing {listing_id} not found."
        )

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
    listing_type: Optional[ListingType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: str = "newest",
    limit: int = 10,
    offset: int = 0,
):
    query = select(Listing)

    if search:
        query = query.where(
            or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%"),
            )
        )

    if category_id is not None:
        query = query.where(
            Listing.category_id == category_id
        )

    if listing_type:
        query = query.where(
            Listing.type == listing_type
        )

    if min_price is not None:
        query = query.where(
            Listing.current_price >= min_price
        )

    if max_price is not None:
        query = query.where(
            Listing.current_price <= max_price
        )

    if sort == "newest":
        query = query.order_by(desc(Listing.created_at))

    elif sort == "oldest":
        query = query.order_by(Listing.created_at)

    elif sort == "price_low":
        query = query.order_by(Listing.current_price.asc())

    elif sort == "price_high":
        query = query.order_by(Listing.current_price.desc())

    else:
        logger.warning(
            f"Invalid sort option requested: {sort}"
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid sort option.",
        )

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)

    items = result.scalars().all()

    logger.info(
        f"Fetched {len(items)} listings."
    )

    return {
        "items": items,
        "count": len(items),
    }


# ==========================================================
# DELETE LISTING
# ==========================================================

async def delete_listing(
    db: AsyncSession,
    listing_id: UUID,
):
    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        logger.error(
            f"Delete failed: Listing {listing_id} not found."
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    await db.delete(listing)
    await db.commit()

    logger.warning(
        f"Listing {listing.id} deleted."
    )

    return {
        "success": True,
        "message": "Listing deleted successfully.",
    }
    



async def get_similar_listings(
    db: AsyncSession,
    listing_id: UUID,
    limit: int = 5,
):
    """
    Content-Based Recommendation System

    Recommendations are generated using:
    1. Category
    2. Listing Type
    3. Item Condition
    4. Similar Price
    5. Title Keywords
    """

    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found",
        )

    # Extract title keywords
    keywords = [
        word
        for word in listing.title.split()
        if len(word) > 2
    ]

    query = (
        select(Listing)
        .where(
            Listing.id != listing.id,
            Listing.is_active == True,
            Listing.category_id == listing.category_id,
            Listing.type == listing.type,
        )
    )

    # Prefer same condition
    if listing.condition:
        query = query.where(
            Listing.condition == listing.condition
        )

    # Keyword matching
    if keywords:

        keyword_filters = [
            Listing.title.ilike(f"%{word}%")
            for word in keywords
        ]

        query = query.where(
            or_(*keyword_filters)
        )

    # Similar price
    query = query.order_by(
        func.abs(
            Listing.current_price - listing.current_price
        )
    )

    query = query.limit(limit)

    result = await db.execute(query)

    recommendations = result.scalars().all()

    return recommendations