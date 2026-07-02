from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models import Listing


# ==========================================================
# CONTENT BASED RECOMMENDATION (KEEP SIMPLE)
# ==========================================================

async def get_similar_listings(db: AsyncSession, listing_id, limit: int = 5):

    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )

    base = result.scalar_one_or_none()

    if not base:
        raise HTTPException(404, "Listing not found")

    keywords = [
        w for w in base.title.split() if len(w) > 2
    ]

    query = select(Listing).where(
        Listing.id != base.id,
        Listing.is_active == True,
        Listing.category_id == base.category_id,
        Listing.type == base.type,
    )

    if base.condition:
        query = query.where(Listing.condition == base.condition)

    if keywords:
        query = query.where(
            or_(*[Listing.title.ilike(f"%{k}%") for k in keywords])
        )

    query = query.order_by(
        func.abs(Listing.current_price - base.current_price)
    ).limit(limit)

    result = await db.execute(query)

    return result.scalars().all()