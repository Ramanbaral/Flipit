from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Listing, Bid, Order
from datetime import datetime


def close_expired_auctions():
    db: Session = SessionLocal()

    try:
        # 1. Get expired active auctions
        listings = db.query(Listing).filter(
            Listing.type == "AUCTION",
            Listing.is_active == True,
            Listing.end_time <= datetime.utcnow()
        ).all()

        for listing in listings:

            # 2. Get highest bid
            highest_bid = (
                db.query(Bid)
                .filter(Bid.listing_id == listing.id)
                .order_by(Bid.amount.desc())
                .first()
            )

            # If no bids → just close listing
            if not highest_bid:
                listing.is_active = False
                continue

            # 3. Create order
            order = Order(
                listing_id=listing.id,
                buyer_id=highest_bid.user_id,
                seller_id=listing.seller_id,
                final_price=highest_bid.amount,
                status="COMPLETED"
            )

            db.add(order)

            # 4. Close listing
            listing.is_active = False

        db.commit()

    except Exception as e:
        print("AUTO CLOSE ERROR:", e)

    finally:
        db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()

    # runs every 30 seconds (you can change later)
    scheduler.add_job(close_expired_auctions, "interval", seconds=30)

    scheduler.start()