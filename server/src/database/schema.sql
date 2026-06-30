--extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--users table to store user information

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

--listing_type enum to differentiate between fixed price and auction listings
CREATE TYPE listing_type AS ENUM ('FIXED', 'AUCTION');

--listings table to store both fixed price and auction listings
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    description TEXT,

    type listing_type NOT NULL,

    -- FIXED PRICE
    price NUMERIC(12,2),

    -- AUCTION FIELDS
    start_price NUMERIC(12,2),
    current_price NUMERIC(12,2),
    end_time TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        (type = 'FIXED'
            AND price IS NOT NULL
            AND start_price IS NULL
            AND end_time IS NULL)
        OR
        (type = 'AUCTION'
            AND start_price IS NOT NULL
            AND end_time IS NOT NULL)
    )
);


-- Bids table to store individual bids for auction listings

CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);


-- Bid analytics table to store aggregated bid data for each listing

CREATE TABLE bid_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

    total_bids INT DEFAULT 0,
    highest_bid NUMERIC(12,2) DEFAULT 0,
    average_bid NUMERIC(12,2) DEFAULT 0,

    last_updated TIMESTAMP DEFAULT NOW()
);


-- ORDERS TABLE (TRANSACTIONS)

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id),

    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),

    final_price NUMERIC(12,2) NOT NULL,

    order_status TEXT DEFAULT 'COMPLETED',

    created_at TIMESTAMP DEFAULT NOW()
);

--Performance Indexes

CREATE INDEX idx_listings_user_id ON listings(user_id);

CREATE INDEX idx_bids_listing_id ON bids(listing_id);

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);

CREATE INDEX idx_orders_seller_id ON orders(seller_id);