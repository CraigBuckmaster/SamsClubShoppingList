-- ============================================================
-- Sam's List — Full Database Schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- Items (Master List)
CREATE TABLE IF NOT EXISTS items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT DEFAULT 'Other',
  sams_url        TEXT,
  sams_product_id TEXT,
  image_url       TEXT,
  unit_price      NUMERIC(10,2),
  last_price      NUMERIC(10,2),
  price_updated   TIMESTAMPTZ,
  notes           TEXT,
  is_regular      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL DEFAULT 'Sam''s Run',
  budget     NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed  BOOLEAN DEFAULT FALSE
);

-- Trip Items (junction)
CREATE TABLE IF NOT EXISTS trip_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID REFERENCES trips(id) ON DELETE CASCADE,
  item_id    UUID REFERENCES items(id) ON DELETE CASCADE,
  qty        INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2),
  checked    BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  added_at   TIMESTAMPTZ DEFAULT now()
);

-- Price History
CREATE TABLE IF NOT EXISTS price_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    UUID REFERENCES items(id) ON DELETE CASCADE,
  price      NUMERIC(10,2) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- Category Sort Order (store layout)
CREATE TABLE IF NOT EXISTS category_sort_order (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category   TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default store layout (typical Sam's Club walk order)
INSERT INTO category_sort_order (category, sort_order) VALUES
  ('Bakery',          1),
  ('Produce',         2),
  ('Deli',            3),
  ('Meat',            4),
  ('Dairy',           5),
  ('Beverages',       6),
  ('Snacks',          7),
  ('Frozen',          8),
  ('Household',       9),
  ('Health & Beauty', 10),
  ('Other',           11)
ON CONFLICT (category) DO NOTHING;

-- Enable Row Level Security (open policy for single-user personal app)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_sort_order ENABLE ROW LEVEL SECURITY;

-- Allow all operations (single-user app using anon key)
CREATE POLICY "Allow all" ON items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON trip_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON price_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON category_sort_order FOR ALL USING (true) WITH CHECK (true);
