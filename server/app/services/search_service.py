from sqlalchemy import select, or_
from app.models import Listing

async def search_listings(db, search: str):
    query = select(Listing).where(Listing.is_active == True)

    keywords = search.lower().split()

    result = await db.execute(query)
    listings = result.scalars().all()

    ranked = sorted(
        listings,
        key=lambda x: compute_listing_score(x, keywords=keywords),
        reverse=True
    )

    return ranked