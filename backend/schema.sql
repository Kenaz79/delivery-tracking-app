-- Delivery Tracking App — database schema (Postgres)

CREATE TYPE user_role AS ENUM ('rider', 'customer', 'manager');
CREATE TYPE delivery_status AS ENUM ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  university_id TEXT,          -- required for riders (student developer proof of enrolment)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES users(id),
  customer_id UUID REFERENCES users(id) NOT NULL,
  status delivery_status NOT NULL DEFAULT 'pending',
  destination_address TEXT NOT NULL,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  delivery_notes TEXT,
  sap_delivery_note_ref TEXT,   -- reference id returned by SAP ByD once pushed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Optional: only needed if you want location history rather than just live state.
-- For the prototype, live location can stay purely in-memory / WebSocket and skip this table.
CREATE TABLE location_pings (
  id BIGSERIAL PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deliveries_rider ON deliveries(rider_id);
CREATE INDEX idx_deliveries_customer ON deliveries(customer_id);
CREATE INDEX idx_location_pings_delivery ON location_pings(delivery_id);
