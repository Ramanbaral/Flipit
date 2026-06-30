from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Listing, Bid
from datetime import datetime


def create_bid(db: Session, listing_id: str, user_id: str, amount: float):

    # ----------------------
    # 1. GET LISTING
    # ----------------------
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # ----------------------
    # 2. VALIDATE AUCTION TYPE
    # ----------------------
    if listing.type != "AUCTION":
        raise HTTPException(status_code=400, detail="Not an auction listing")

    # ----------------------
    # 3. CHECK ACTIVE STATUS
    # ----------------------
    if not listing.is_active:
        raise HTTPException(status_code=400, detail="Auction is closed")

    # ----------------------
    # 4. CHECK END TIME
    # ----------------------
    if listing.end_time and listing.end_time < datetime.utcnow():
        listing.is_active = False
        db.commit()
        raise HTTPException(status_code=400, detail="Auction has ended")

    # ----------------------
    # 5. GET CURRENT HIGHEST BID
    # ----------------------
    highest = (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )

    # ----------------------
    # 6. VALIDATE BID AMOUNT
    # ----------------------
    if highest and amount <= highest.amount:
        raise HTTPException(
            status_code=400,
            detail=f"Bid must be higher than {highest.amount}"
        )

    # ----------------------
    # 7. CREATE BID
    # ----------------------
    bid = Bid(
        listing_id=listing_id,
        user_id=user_id,
        amount=amount,
        created_at=datetime.utcnow()
    )

    db.add(bid)

    # ----------------------
    # 8. UPDATE LISTING PRICE
    # ----------------------
    listing.current_price = amount

    db.commit()
    db.refresh(bid)

    return {
        "message": "Bid placed successfully",
        "bid_id": str(bid.id),
        "amount": bid.amount,
        "current_price": listing.current_price
    }


def get_bids(db: Session, listing_id: str):
    return (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .all()
    )


def get_highest_bid(db: Session, listing_id: str):
    return (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )