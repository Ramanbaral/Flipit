from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import services.bid_service as service

router = APIRouter(prefix="/bids", tags=["Bids"])


@router.post("")
def create_bid(listing_id: str, user_id: str, amount: float, db: Session = Depends(get_db)):
    return service.create_bid(db, listing_id, user_id, amount)


@router.get("/{listing_id}")
def get_all(listing_id: str, db: Session = Depends(get_db)):
    return service.get_bids(db, listing_id)


@router.get("/{listing_id}/highest")
def highest(listing_id: str, db: Session = Depends(get_db)):
    return service.get_highest_bid(db, listing_id)