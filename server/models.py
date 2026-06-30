from sqlalchemy import Column, String, Float, DateTime, Enum, Boolean, Integer, ForeignKey, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime
import enum


# -------------------------
# ENUMS
# -------------------------
class ListingType(str, enum.Enum):
    FIXED = "FIXED"
    AUCTION = "AUCTION"


class ItemCondition(str, enum.Enum):
    NEW = "NEW"
    LIKE_NEW = "LIKE_NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    USED = "USED"


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


# -------------------------
# USERS
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    avatar_url = Column(String)
    bio = Column(Text)
    seller_rating = Column(Numeric(2,1), default=5.0)
    total_sales = Column(Integer, default=0)
    total_purchases = Column(Integer, default=0)
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

    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    title = Column(String, nullable=False)
    description = Column(Text)

    quantity = Column(Integer, default=1)
    condition = Column(Enum(ItemCondition), default=ItemCondition.GOOD)

    type = Column(Enum(ListingType), nullable=False)

    price = Column(Float)
    start_price = Column(Float)
    current_price = Column(Float)

    end_time = Column(DateTime)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


# -------------------------
# BIDS
# -------------------------
class Bid(Base):
    __tablename__ = "bids"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id", ondelete="CASCADE"))

    # IMPORTANT FIX (was user_id mismatch earlier)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# -------------------------
# ORDERS
# -------------------------
class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"))
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    final_price = Column(Numeric(12,2), nullable=False)

    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)

    created_at = Column(DateTime, default=datetime.utcnow)