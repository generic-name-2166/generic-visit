-- wrangler d1 execute d1_generic_visit --<local>|<remote> --file migrations/init.sql 
CREATE TABLE IF NOT EXISTS visit (
    id INTEGER PRIMARY KEY, 
    -- unix timestamp in seconds from date.valueOf()
    date INTEGER NOT NULL,
    ip TEXT, -- can be IPv4 or IPv6
    user_agent TEXT,
    country TEXT,
    city TEXT,
    postal_code TEXT,
    language TEXT NOT NULL,
    encoding TEXT,
    timezone_offset INTEGER NOT NULL,
    timezone TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    color_depth INTEGER NOT NULL,
    platform TEXT NOT NULL,
    hardware_concurrency INTEGER NOT NULL
) STRICT;
