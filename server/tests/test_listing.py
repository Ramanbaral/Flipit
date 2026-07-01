import pytest
from fastapi import HTTPException

from app.schemas import ListingCreate
from app.models import ListingType
from app.services.listing_service import validate_listing


def test_fixed_listing_cannot_have_start_price():

    listing = ListingCreate(
        seller_id="11111111-1111-1111-1111-111111111111",
        category_id=1,
        title="Laptop",
        description="Gaming",
        quantity=1,
        type=ListingType.FIXED,
        price=1200,
        start_price=100,
    )

    with pytest.raises(HTTPException):
        validate_listing(listing)