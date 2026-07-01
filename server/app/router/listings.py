from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from core.database import get_db
import services.listing_service as service
import schemas

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.post("", response_model=schemas.ListingOut)
async def create(data: schemas.ListingCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_listing(db, data)


@router.get("/{listing_id}")
async def get_one(listing_id: UUID, db: AsyncSession = Depends(get_db)):
    return await service.get_listing(db, listing_id)