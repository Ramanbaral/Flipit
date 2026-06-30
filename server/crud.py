from sqlalchemy.orm import Session
from models import (
    Listing,
    Bid,
    Order,
    ListingType
)

from datetime import datetime


# -------------------------
# CREATE LISTING
# -------------------------
def create_listing(db: Session, data):

    listing = Listing(
        seller_id=data.seller_id,
        category_id=data.category_id,
        title=data.title,
        description=data.description,
        type=data.type,
        price=data.price,
        start_price=data.start_price,
        end_time=data.end_time,
        current_price=data.start_price if data.type == "AUCTION" else data.price
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)

    return listing


# -------------------------
# GET ALL LISTINGS
# -------------------------
def get_listings(db: Session):
    return db.query(Listing).all()


# -------------------------
# GET ONE LISTING
# -------------------------
def get_listing(db: Session, listing_id: str):
    return db.query(Listing).filter(Listing.id == listing_id).first()


# -------------------------
# DELETE LISTING
# -------------------------
def delete_listing(db: Session, listing_id: str):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if listing:
        db.delete(listing)
        db.commit()

    return listing


def create_bid(db: Session, data):

    # 1. Get listing
    listing = db.query(Listing).filter(Listing.id == data.listing_id).first()

    if not listing:
        raise Exception("Listing not found")

    # 2. Check auction type
    if listing.type != "AUCTION":
        raise Exception("Bids allowed only on AUCTION listings")

    # 3. Check active
    if not listing.is_active:
        raise Exception("Listing is not active")

    # 4. Check bid amount
    if data.amount <= listing.current_price:
        raise Exception("Bid must be higher than current price")

    # 5. Create bid
    bid = Bid(
        listing_id=data.listing_id,
        user_id=data.user_id,
        amount=data.amount
    )

    db.add(bid)

    # 6. Update listing price
    listing.current_price = data.amount

    db.commit()
    db.refresh(bid)

    return bid


# -------------------------
# PLACE BID
# -------------------------
def place_bid(db: Session, listing_id: str, user_id: str, amount: float):

    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise Exception("Listing not found")

    if listing.type != "AUCTION":
        raise Exception("Only AUCTION listings allow bids")

    if listing.current_price and amount <= listing.current_price:
        raise Exception("Bid must be higher than current price")

    if listing.start_price and amount < listing.start_price:
        raise Exception("Bid must be >= start price")

    listing.current_price = amount

    bid = Bid(
        listing_id=listing_id,
        user_id=user_id,
        amount=amount,
        created_at=datetime.utcnow()
    )

    db.add(bid)
    db.commit()
    db.refresh(bid)

    return bid


# -------------------------
# GET BIDS
# -------------------------
def get_bids(db: Session, listing_id: str):
    return db.query(Bid).filter(Bid.listing_id == listing_id).all()

def close_auction(db, listing_id):

    # 1. Get listing
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise Exception("Listing not found")

    if listing.type != ListingType.AUCTION:
        raise Exception("Not an auction listing")

    # 2. Get highest bid
    highest_bid = (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )

    if not highest_bid:
        raise Exception("No bids found")

    # 3. Create order
    order = Order(
        listing_id=listing_id,
        buyer_id=highest_bid.user_id,
        seller_id=listing.seller_id,
        final_price=highest_bid.amount,
        status="COMPLETED"
    )

    # 4. Close listing
    listing.is_active = False

    db.add(order)
    db.commit()
    db.refresh(order)

    return order
# -------------------------
# GET HIGHEST BID
# -------------------------
def get_highest_bid(db: Session, listing_id: str):
    return (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )
    
    
    
    