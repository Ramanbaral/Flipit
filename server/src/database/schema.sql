-- =========================================
-- EXTENSIONS
-- =========================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- ENUM TYPES
-- =========================================
CREATE TYPE listing_type AS ENUM ('FIXED', 'AUCTION');

CREATE TYPE item_condition AS ENUM (
    'NEW',
    'LIKE_NEW',
    'GOOD',
    'FAIR',
    'USED'
);

CREATE TYPE order_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELLED'
);

-- =========================================
-- USERS
-- (Supabase-compatible, enriched profile)
-- =========================================
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    seller_rating NUMERIC(2,1) DEFAULT 5.0,
    total_sales INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- CATEGORIES
-- =========================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- =========================================
-- USER INTERESTS (for recommendations)
-- =========================================
CREATE TABLE user_interests (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, category_id)
);

-- =========================================
-- LISTINGS
-- =========================================
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id),

    title TEXT NOT NULL,
    description TEXT,

    quantity INTEGER DEFAULT 1,
    condition item_condition DEFAULT 'GOOD',
    location TEXT,

    type listing_type NOT NULL,

    price NUMERIC(12,2),
    start_price NUMERIC(12,2),
    current_price NUMERIC(12,2),

    end_time TIMESTAMP,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        (
            type = 'FIXED'
            AND price IS NOT NULL
            AND start_price IS NULL
            AND end_time IS NULL
        )
        OR
        (
            type = 'AUCTION'
            AND start_price IS NOT NULL
            AND end_time IS NOT NULL
        )
    )
);

-- =========================================
-- LISTING IMAGES
-- =========================================
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 1
);

-- =========================================
-- BIDS
-- =========================================
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- BID ANALYTICS
-- =========================================
CREATE TABLE bid_analytics (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,

    total_bids INTEGER DEFAULT 0,
    highest_bid NUMERIC(12,2),
    average_bid NUMERIC(12,2),

    updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- ORDERS
-- =========================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),

    final_price NUMERIC(12,2) NOT NULL,

    status order_status DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- LISTING VIEWS (for recommendations)
-- =========================================
CREATE TABLE listing_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,

    viewed_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- INDEXES (PERFORMANCE)
-- =========================================
CREATE INDEX idx_listing_seller ON listings(seller_id);
CREATE INDEX idx_listing_category ON listings(category_id);
CREATE INDEX idx_listing_type ON listings(type);
CREATE INDEX idx_listing_active ON listings(is_active);

CREATE INDEX idx_bid_listing ON bids(listing_id);
CREATE INDEX idx_bid_bidder ON bids(bidder_id);

CREATE INDEX idx_order_buyer ON orders(buyer_id);
CREATE INDEX idx_order_seller ON orders(seller_id);

CREATE INDEX idx_listing_views_user ON listing_views(user_id);
CREATE INDEX idx_listing_views_listing ON listing_views(listing_id);

CREATE INDEX idx_listing_images_listing ON listing_images(listing_id);

-- =========================================
-- DEFAULT CATEGORIES
-- =========================================
INSERT INTO categories(name)
VALUES
('Electronics'),
('Gaming'),
('Mobile Phones'),
('Laptops'),
('Accessories'),
('Fashion'),
('Books'),
('Furniture'),
('Sports'),
('Home'),
('Vehicles'),
('Collectibles'),
('Music'); 
