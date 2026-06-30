from sqlalchemy import Column, String, Text, Enum, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base
import enum


class ListingType(str, enum.Enum):
    FIXED = "FIXED"
    AUCTION = "AUCTION"


class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text)

    type = Column(Enum(ListingType), nullable=False)

    price = Column(Numeric(12,2))

    start_price = Column(Numeric(12,2))
    current_price = Column(Numeric(12,2))
    end_time = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)