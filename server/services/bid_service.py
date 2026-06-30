from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Listing, Bid
from datetime import datetime

# For Step 7c
from ws_manager import manager


async def create_bid(
    db: Session,
    listing_id: str,
    user_id: str,
    amount: float
):
    # Find listing
    listing = (
        db.query(Listing)
        .filter(Listing.id == listing_id)
        .first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.type != "AUCTION":
        raise HTTPException(status_code=400, detail="Not an auction listing")

    if not listing.is_active:
        raise HTTPException(status_code=400, detail="Auction closed")

    # Highest bid
    highest = (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )

    if highest and amount <= highest.amount:
        raise HTTPException(
            status_code=400,
            detail="Bid must be higher than current highest bid"
        )

    # Create bid
    bid = Bid(
        listing_id=listing_id,
        user_id=user_id,
        amount=amount,
        created_at=datetime.utcnow()
    )

    listing.current_price = amount

    db.add(bid)
    db.commit()
    db.refresh(bid)

    # Broadcast to connected clients
    await manager.broadcast(
        listing_id,
        {
            "type": "NEW_BID",
            "listing_id": listing_id,
            "user_id": user_id,
            "amount": float(bid.amount)
        }
    )

    return bid


def get_bids(db: Session, listing_id: str):
    return (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.created_at.desc())
        .all()
    )


def get_highest_bid(db: Session, listing_id: str):
    return (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )