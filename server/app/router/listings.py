from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services import listing_service as service
from app.services import recommendation_service as rec_service
from app import schemas
from app.models import ListingType

router = APIRouter(
    prefix="/listings",
    tags=["Listings"],
)

# ==========================================================
# CREATE LISTING
# ==========================================================

@router.post(
    "",
    response_model=schemas.ListingOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new listing",
)
async def create_listing(
    data: schemas.ListingCreate,
    db: AsyncSession = Depends(get_db),
):
    return await service.create_listing(db, data)


# ==========================================================
# GET ALL LISTINGS (SEARCH + FILTER + SORT)
# ==========================================================

@router.get(
    "",
    response_model=schemas.ListingListResponse,
    summary="Get all listings",
)
async def get_listings(
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    listing_type: Optional[ListingType] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    sort: str = Query("newest"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_listings(
        db=db,
        search=search,
        category_id=category_id,
        listing_type=listing_type,
        min_price=min_price,
        max_price=max_price,
        sort=sort,
        limit=limit,
        offset=offset,
    )


# ==========================================================
# GET SINGLE LISTING
# ==========================================================

@router.get(
    "/{listing_id}",
    response_model=schemas.ListingOut,
    summary="Get listing by ID",
)
async def get_listing(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_listing(db, listing_id)


# ==========================================================
# GET SIMILAR LISTINGS (RECOMMENDATIONS)
# ==========================================================

@router.get(
    "/{listing_id}/recommendations",
    summary="Get similar listings",
)
async def get_recommendations(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await rec_service.get_similar_listings(
        db,
        listing_id,
        limit=5
    )


# ==========================================================
# UPDATE LISTING
# ==========================================================

@router.patch(
    "/{listing_id}",
    response_model=schemas.ListingOut,
    summary="Update listing",
)
async def update_listing(
    listing_id: UUID,
    data: schemas.ListingUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await service.update_listing(db, listing_id, data)


# ==========================================================
# DELETE LISTING
# ==========================================================

@router.delete(
    "/{listing_id}",
    response_model=schemas.MessageResponse,
    summary="Delete listing",
)
async def delete_listing(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.delete_listing(db, listing_id)
