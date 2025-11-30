-- wrangler d1 execute d1_generic_visit --<local>|<remote> --file migrations/init.sql 
-- DROP TABLE IF EXISTS visit;
CREATE TABLE IF NOT EXISTS visit (
    id INTEGER PRIMARY KEY, 
    -- unix timestamp in seconds from date.valueOf()
    date INTEGER NOT NULL,
    ip TEXT, -- can be IPv4 or IPv6
    userAgent TEXT,
    country TEXT,
    city TEXT,
    postal_code TEXT,
    language TEXT NOT NULL,
    encoding TEXT,
    timezoneOffset INTEGER NOT NULL,
    timezone TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    colorDepth INTEGER NOT NULL,
    platform TEXT NOT NULL,
    hardwareConcurrency INTEGER NOT NULL
) STRICT;
