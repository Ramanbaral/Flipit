from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import services.listing_service as service
import schemas

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.post("")
def create(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    return service.create_listing(db, listing)


@router.get("")
def get_all(
    search: str = None,
    category_id: int = None,
    listing_type: str = None,
    min_price: float = None,
    max_price: float = None,
    sort: str = "newest",
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    return service.get_listings(
        db,
        search,
        category_id,
        listing_type,
        min_price,
        max_price,
        sort,
        limit,
        offset
    )


@router.get("/{listing_id}")
def get_one(listing_id: str, db: Session = Depends(get_db)):
    return service.get_listing(db, listing_id)


@router.delete("/{listing_id}")
def delete(listing_id: str, db: Session = Depends(get_db)):
    return service.delete_listing(db, listing_id)