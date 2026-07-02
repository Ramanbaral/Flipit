from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services import listing_service as service
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
    description="""
Create a marketplace listing.

Supports two listing types:

- **FIXED** → Requires a fixed `price`
- **AUCTION** → Requires `start_price` and `end_time`

Validation is automatically performed based on the listing type.
""",
    responses={
        201: {"description": "Listing created successfully"},
        400: {"description": "Invalid listing data"},
        422: {"description": "Validation error"},
    },
)
async def create_listing(
    data: schemas.ListingCreate,
    db: AsyncSession = Depends(get_db),
):
    return await service.create_listing(db, data)


# ==========================================================
# GET ALL LISTINGS
# ==========================================================

@router.get(
    "",
    response_model=schemas.ListingListResponse,
    summary="Get all listings",
    description="""
Retrieve marketplace listings.

Supports searching, filtering, sorting and pagination.
""",
    responses={
        200: {"description": "Listings retrieved successfully"},
    },
)
async def get_listings(
    search: Optional[str] = Query(
        None,
        description="Search listings by title or description.",
    ),
    category_id: Optional[int] = Query(
        None,
        description="Filter by category ID.",
    ),
    listing_type: Optional[ListingType] = Query(
        None,
        description="Listing type (FIXED or AUCTION).",
    ),
    min_price: Optional[float] = Query(
        None,
        ge=0,
        description="Minimum current price.",
    ),
    max_price: Optional[float] = Query(
        None,
        ge=0,
        description="Maximum current price.",
    ),
    sort: str = Query(
        "newest",
        description="Sort results: newest, oldest, price_low, price_high.",
    ),
    limit: int = Query(
        10,
        ge=1,
        le=100,
        description="Maximum number of listings returned.",
    ),
    offset: int = Query(
        0,
        ge=0,
        description="Pagination offset.",
    ),
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
    description="Retrieve a single listing using its UUID.",
    responses={
        200: {"description": "Listing retrieved successfully"},
        404: {"description": "Listing not found"},
    },
)
async def get_listing(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_listing(
        db,
        listing_id,
    )

# ==========================================================
# GET SIMILAR LISTINGS (Content-Based Recommendation)
# ==========================================================

@router.get(
    "/{listing_id}/recommendations",
    response_model=list[schemas.ListingOut],
)
async def get_recommendations(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.get_similar_listings(
        db,
        listing_id,
    )
# ==========================================================
# UPDATE LISTING
# ==========================================================

@router.patch(
    "/{listing_id}",
    response_model=schemas.ListingOut,
    summary="Update a listing",
    description="""
Update one or more fields of an existing listing.

Only supplied fields are modified.
""",
    responses={
        200: {"description": "Listing updated successfully"},
        404: {"description": "Listing not found"},
    },
)
async def update_listing(
    listing_id: UUID,
    data: schemas.ListingUpdate,
    db: AsyncSession = Depends(get_db),
):
    return await service.update_listing(
        db,
        listing_id,
        data,
    )


# ==========================================================
# DELETE LISTING
# ==========================================================

@router.delete(
    "/{listing_id}",
    response_model=schemas.MessageResponse,
    summary="Delete a listing",
    description="Delete a listing permanently.",
    responses={
        200: {"description": "Listing deleted successfully"},
        404: {"description": "Listing not found"},
    },
)
async def delete_listing(
    listing_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    return await service.delete_listing(
        db,
        listing_id,
    )