from models import Listing
from sqlalchemy.orm import Session


def create_listing(db: Session, data, user_id: str):
    listing = Listing(
        user_id=user_id,
        title=data.title,
        description=data.description,
        type=data.type,
        price=data.price,
        start_price=data.start_price,
        end_time=data.end_time,
        current_price=data.price if data.type == "FIXED" else data.start_price
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def get_listings(db: Session):
    return db.query(Listing).all()


def get_listing(db: Session, listing_id):
    return db.query(Listing).filter(Listing.id == listing_id).first()


def delete_listing(db: Session, listing_id, user_id: str):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.user_id == user_id
    ).first()

    if listing:
        db.delete(listing)
        db.commit()

    return listing