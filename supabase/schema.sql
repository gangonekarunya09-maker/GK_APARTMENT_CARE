-- ====================================================================
-- SUPABASE POSTGRESQL PRODUCTION BACKEND SCHEMA (CLEAN & EMPTY STATE)
-- App: GateKeep / Community Services & Group Buying Platform
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. Create Tables
-- ====================================================================

-- A. APARTMENTS / COMMUNITIES TABLE
CREATE TABLE IF NOT EXISTS apartments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  portal_token TEXT NOT NULL,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  gate_security_app TEXT NOT NULL DEFAULT 'MyGate',
  rwa_contact TEXT,
  rwa_phone TEXT,
  rwa_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. SERVICE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  description TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. SERVICE PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS service_providers (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  category_ids TEXT[] DEFAULT '{}',
  services_offered TEXT[] DEFAULT '{}',
  service_areas TEXT[] DEFAULT '{}',
  address TEXT NOT NULL,
  normal_pricing_ratio NUMERIC(4, 2) DEFAULT 1.00,
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'rejected')),
  completed_jobs INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- D. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  apartment_ids TEXT[] DEFAULT '{}', -- Empty array means available in all apartments
  provider_id TEXT REFERENCES service_providers(id) ON DELETE SET NULL,
  provider_name TEXT,
  normal_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  community_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sunday_bulk_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  minimum_demand INTEGER NOT NULL DEFAULT 5,
  current_demand INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  available_days TEXT[] DEFAULT '{}',
  available_slots TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'collecting_demand', 'target_reached', 'vendor_confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- E. CAMPAIGNS TABLE (Group Buying & Bulk Demand Drives)
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  apartment_id TEXT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  normal_price NUMERIC(10, 2) NOT NULL,
  community_price NUMERIC(10, 2) NOT NULL,
  sunday_bulk_price NUMERIC(10, 2),
  minimum_demand INTEGER NOT NULL DEFAULT 5,
  current_demand INTEGER NOT NULL DEFAULT 0,
  available_dates TEXT[] DEFAULT '{}',
  available_slots TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'collecting_demand' CHECK (status IN ('collecting_demand', 'target_reached', 'provider_selected', 'provider_confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  provider_id TEXT REFERENCES service_providers(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- F. RESIDENT INTEREST REQUESTS TABLE
CREATE TABLE IF NOT EXISTS resident_requests (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  apartment_id TEXT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  resident_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  block TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  email TEXT,
  preferred_date TEXT,
  preferred_slot TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'interested' CHECK (status IN ('interested', 'confirmed', 'scheduled', 'completed')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- G. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  apartment_id TEXT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  apartment_name TEXT NOT NULL,
  resident_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  block TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  date TEXT NOT NULL,
  slot TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  booking_type TEXT NOT NULL DEFAULT 'regular' CHECK (booking_type IN ('regular', 'sunday_bulk')),
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'vendor_assigned', 'in_progress', 'completed', 'cancelled')),
  provider_id TEXT REFERENCES service_providers(id) ON DELETE SET NULL,
  provider_name TEXT,
  provider_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- H. RWA PARTNERSHIP APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS rwa_applications (
  id TEXT PRIMARY KEY,
  society_name TEXT NOT NULL,
  rwa_contact TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  area TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'partnered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- I. VENDOR APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS vendor_applications (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  services_offered TEXT NOT NULL,
  service_areas TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  pricing_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 3. Automatic Updated At Triggers
-- ====================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_apartments_updated BEFORE UPDATE ON apartments FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ====================================================================
-- 4. Row Level Security (RLS) Policies
-- ====================================================================

ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE resident_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rwa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon Full Access for application functionality
CREATE POLICY "Allow All Apartments" ON apartments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Categories" ON service_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Providers" ON service_providers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Resident Requests" ON resident_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All RWA Applications" ON rwa_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Vendor Applications" ON vendor_applications FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 5. Enable Realtime Publications for Instant Sync
-- ====================================================================

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;
