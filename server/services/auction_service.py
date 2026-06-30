from sqlalchemy.orm import Session
from models import Listing, Bid, Order


def close_auction(db: Session, listing_id: str):

    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise Exception("Listing not found")

    if listing.type != "AUCTION":
        raise Exception("Not auction listing")

    highest_bid = (
        db.query(Bid)
        .filter(Bid.listing_id == listing_id)
        .order_by(Bid.amount.desc())
        .first()
    )

    if not highest_bid:
        raise Exception("No bids found")

    order = Order(
        listing_id=listing_id,
        buyer_id=highest_bid.user_id,
        seller_id=listing.seller_id,
        final_price=highest_bid.amount,
        status="COMPLETED"
    )

    listing.is_active = False

    db.add(order)
    db.commit()
    db.refresh(order)

    return order