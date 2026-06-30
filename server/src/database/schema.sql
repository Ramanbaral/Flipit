CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE listing_type AS ENUM ('FIXED', 'AUCTION');

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    description TEXT,

    type listing_type NOT NULL,

    -- FIXED PRICE (only for FIXED)
    price NUMERIC(12,2),

    -- AUCTION FIELDS (only for AUCTION)
    start_price NUMERIC(12,2),
    current_price NUMERIC(12,2),
    end_time TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    -- RULES enforcement
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

CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    amount NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);
