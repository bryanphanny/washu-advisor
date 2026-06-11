-- Add curriculum designator attributes (NSM, HUM, SSC, ETH, LCD, etc.)
-- and typical offering periods to the courses table.
-- Run this once in Supabase SQL editor before running seed_courses.py.

ALTER TABLE courses ADD COLUMN IF NOT EXISTS attributes text[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS periods text;
