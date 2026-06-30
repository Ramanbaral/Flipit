from sqlalchemy import Column, Numeric, String, Float, DateTime, Enum, Boolean, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from database import Base
import enum


# -------------------------
# ENUMS
# -------------------------
class ListingType(str, enum.Enum):
    FIXED = "FIXED"
    AUCTION = "AUCTION"


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


# -------------------------
# USERS (Supabase-managed identity)
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    avatar_url = Column(String)
    bio = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# -------------------------
# CATEGORIES
# -------------------------
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)


# -------------------------
# LISTINGS
# -------------------------
class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    category_id = Column(Integer, ForeignKey("categories.id"))

    title = Column(String, nullable=False)

    description = Column(Text)

    type = Column(Enum(ListingType), nullable=False)

    price = Column(Float)

    start_price = Column(Float)

    current_price = Column(Float)

    end_time = Column(DateTime)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)


# -------------------------
# LISTING IMAGES
# -------------------------
class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"))

    image_url = Column(Text, nullable=False)


# -------------------------
# BIDS
# -------------------------
class Bid(Base):
    __tablename__ = "bids"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID, ForeignKey("listings.id"))
    user_id = Column(UUID, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# -------------------------
# ORDERS
# -------------------------
class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    final_price = Column(Numeric(12,2), nullable=False)

    status = Column(String, default="PENDING")

    created_at = Column(DateTime, default=datetime.utcnow)