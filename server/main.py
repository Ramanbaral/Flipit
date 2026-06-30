from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
import models
import schemas
import crud
from auth import verify_token

Base.metadata.create_all(bind=engine)

app = FastAPI()


# DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ROOT
@app.get("/")
def root():
    return {"message": "Flipit API running"}


# CREATE LISTING (AUTH REQUIRED)
@app.post("/listings")
def create_listing(
    listing: schemas.ListingCreate,
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):
    user_id = user["id"]  # Supabase user ID

    return crud.create_listing(db, listing, user_id)


# GET ALL LISTINGS
@app.get("/listings")
def get_listings(db: Session = Depends(get_db)):
    return crud.get_listings(db)


# GET ONE
@app.get("/listings/{listing_id}")
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = crud.get_listing(db, listing_id)

    if not listing:
        raise HTTPException(status_code=404, detail="Not found")

    return listing


# DELETE LISTING (AUTH REQUIRED)
@app.delete("/listings/{listing_id}")
def delete_listing(
    listing_id: str,
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):
    result = crud.delete_listing(db, listing_id, user["id"])

    if not result:
        raise HTTPException(status_code=404, detail="Not found")

    return {"message": "Deleted"}