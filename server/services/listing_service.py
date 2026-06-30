from sqlalchemy.orm import Session
from models import Listing
from sqlalchemy import desc, asc
from sqlalchemy import or_
from sqlalchemy.orm import Session
from fastapi import HTTPException



def create_listing(db: Session, listing_data):
    listing = Listing(**listing_data.dict())
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

def get_listing(db: Session, listing_id: str):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    return listing

def get_listings(
    db: Session,
    search: str = None,
    category_id: int = None,
    listing_type: str = None,
    min_price: float = None,
    max_price: float = None,
    sort: str = "newest",
    limit: int = 10,
    offset: int = 0
):

    query = db.query(Listing)

    # -------------------------
    # SEARCH (title + description)
    # -------------------------
    if search:
        query = query.filter(
            or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%")
            )
        )

    # -------------------------
    # FILTERS
    # -------------------------
    if category_id:
        query = query.filter(Listing.category_id == category_id)

    if listing_type:
        query = query.filter(Listing.type == listing_type)

    if min_price is not None:
        query = query.filter(Listing.current_price >= min_price)

    if max_price is not None:
        query = query.filter(Listing.current_price <= max_price)

    # -------------------------
    # SORTING
    # -------------------------
    if sort == "newest":
        query = query.order_by(desc(Listing.created_at))

    elif sort == "oldest":
        query = query.order_by(asc(Listing.created_at))

    elif sort == "price_low":
        query = query.order_by(asc(Listing.current_price))

    elif sort == "price_high":
        query = query.order_by(desc(Listing.current_price))

    # -------------------------
    # PAGINATION
    # -------------------------
    return query.offset(offset).limit(limit).all()


def delete_listing(db: Session, listing_id: str):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if listing:
        db.delete(listing)
        db.commit()
    return listing