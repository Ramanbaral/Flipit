from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, get_db
from crud import create_bid
from crud import close_auction

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


    
# -------------------------
# LISTINGS
# -------------------------
@app.post("/listings")
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    return crud.create_listing(db, listing)


@app.get("/listings")
def get_listings(db: Session = Depends(get_db)):
    return crud.get_listings(db)


@app.get("/listings/{listing_id}")
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    return crud.get_listing(db, listing_id)


@app.delete("/listings/{listing_id}")
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    return crud.delete_listing(db, listing_id)


# -------------------------
# BIDS
# -------------------------
@app.post("/bids")
def place_bid(bid: schemas.BidCreate, db: Session = Depends(get_db)):
    try:
        return create_bid(db, bid)
    except Exception as e:
        return {"error": str(e)}


@app.get("/bids/{listing_id}")
def get_bids(listing_id: str, db: Session = Depends(get_db)):
    return crud.get_bids(db, listing_id)


@app.get("/bids/{listing_id}/highest")
def highest_bid(listing_id: str, db: Session = Depends(get_db)):
    return crud.get_highest_bid(db, listing_id)

@app.post("/auction/close/{listing_id}")
def close_auction_route(listing_id: str, db: Session = Depends(get_db)):
    try:
        return close_auction(db, listing_id)
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def home():
    return {"message": "Flipit API running"}