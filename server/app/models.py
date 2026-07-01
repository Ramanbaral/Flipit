import uuid
import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    String,
    Float,
    DateTime,
    Enum,
    Boolean,
    Integer,
    ForeignKey,
    Text,
    Numeric,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import List, TYPE_CHECKING
if TYPE_CHECKING:
    from .models import User, Listing, Bid, Order, Category

from app.core.database import Base


# ==========================================================
# ENUMS
# ==========================================================

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


# ==========================================================
# USERS
# ==========================================================

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
    )

    display_name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    seller_rating: Mapped[Decimal] = mapped_column(
        Numeric(2, 1),
        default=5.0,
    )

    total_sales: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    total_purchases: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    listings: Mapped[List["Listing"]] = relationship(
        "Listing",
        back_populates="seller",
        foreign_keys="Listing.seller_id",
    )

    bids: Mapped[List["Bid"]] = relationship(
        "Bid",
        back_populates="user",
    )

    purchases: Mapped[List["Order"]] = relationship(
        "Order",
        foreign_keys="Order.buyer_id",
        back_populates="buyer",
    )

    sales: Mapped[List["Order"]] = relationship(
        "Order",
        foreign_keys="Order.seller_id",
        back_populates="seller",
    )




# ==========================================================
# CATEGORIES
# ==========================================================

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
    )

    listings: Mapped[List["Listing"]] = relationship(
        "Listing",
        back_populates="category",
    )
# ==========================================================
# LISTINGS
# ==========================================================

class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    seller_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
    )

    condition: Mapped[ItemCondition] = mapped_column(
        Enum(ItemCondition),
        default=ItemCondition.GOOD,
    )

    type: Mapped[ListingType] = mapped_column(
        Enum(ListingType),
        nullable=False,
    )

    price: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    start_price: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    current_price: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    end_time: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
    seller: Mapped["User"] = relationship(
        "User",
        back_populates="listings",
    )

    category: Mapped["Category"] = relationship(
        "Category",
        back_populates="listings",
    )

    bids: Mapped[List["Bid"]] = relationship(
        "Bid",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    orders: Mapped[List["Order"]] = relationship(
        "Order",
        back_populates="listing",
    )

# ==========================================================
# BIDS
# ==========================================================

class Bid(Base):
    __tablename__ = "bids"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("listings.id", ondelete="CASCADE"),
        nullable=False,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    # Relationships
    listing: Mapped["Listing"] = relationship(
        "Listing",
        back_populates="bids",
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="bids",
    )


# ==========================================================
# ORDERS
# ==========================================================

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("listings.id"),
        nullable=False,
    )

    buyer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    seller_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    final_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus),
        default=OrderStatus.PENDING,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    # Relationships
    listing: Mapped["Listing"] = relationship(
        "Listing",
        back_populates="orders",
    )

    buyer: Mapped["User"] = relationship(
        "User",
        foreign_keys=[buyer_id],
        back_populates="purchases",
    )

    seller: Mapped["User"] = relationship(
        "User",
        foreign_keys=[seller_id],
        back_populates="sales",
    )
