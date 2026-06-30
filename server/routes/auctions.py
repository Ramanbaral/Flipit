from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import services.auction_service as service

router = APIRouter(prefix="/auction", tags=["Auction"])


@router.post("/close/{listing_id}")
def close(listing_id: str, db: Session = Depends(get_db)):
    return service.close_auction(db, listing_id)