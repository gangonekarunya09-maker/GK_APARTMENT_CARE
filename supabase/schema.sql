-- ====================================================================
-- SUPABASE POSTGRESQL PRODUCTION BACKEND SCHEMA
-- App: GateKeep / Community Services & Group Buying Platform
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if recreating (Clean Slate setup)
-- DROP TABLE IF EXISTS vendor_applications CASCADE;
-- DROP TABLE IF EXISTS rwa_applications CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS resident_requests CASCADE;
-- DROP TABLE IF EXISTS campaigns CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS service_providers CASCADE;
-- DROP TABLE IF EXISTS service_categories CASCADE;
-- DROP TABLE IF EXISTS apartments CASCADE;

-- ====================================================================
-- 3. Create Tables
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
-- 4. Automatic Updated At Triggers
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
-- 5. Row Level Security (RLS) Policies
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

-- Allow Public Read Access for all app tables
CREATE POLICY "Public Read Apartments" ON apartments FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Providers" ON service_providers FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public Read Resident Requests" ON resident_requests FOR SELECT USING (true);
CREATE POLICY "Public Read Bookings" ON bookings FOR SELECT USING (true);

-- Allow Public Insert Access for Resident Bookings, Requests, & Applications
CREATE POLICY "Public Insert Resident Requests" ON resident_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert RWA Applications" ON rwa_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Vendor Applications" ON vendor_applications FOR INSERT WITH CHECK (true);

-- Allow Public/Anon Full Access (Insert/Update/Delete) for standard operations
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
-- 6. Enable Realtime Publications for Instant Sync
-- ====================================================================

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;

-- ====================================================================
-- 7. Initial Seed Data
-- ====================================================================

-- Apartments
INSERT INTO apartments (id, name, slug, portal_token, address, area, city, pincode, total_units, gate_security_app, rwa_contact, rwa_phone, rwa_email, status, notes, created_at)
VALUES
('community_green_valley_001', 'Green Valley Apartments', 'green-valley', '7H4K92', 'Road No. 12, Banjara Hills', 'Banjara Hills', 'Hyderabad', '500034', 320, 'MyGate', 'Col. K. R. Sharma (President)', '+91 98490 12345', 'rwa@greenvalleyhyd.org', 'active', 'Gate passes issued via MyGate portal.', '2026-01-15T10:00:00Z'),
('community_my_home_bhooja_002', 'My Home Bhooja', 'my-home-bhooja', 'MH82B1', 'Silpa Gram Craft Village, Rai Durg', 'HITEC City', 'Hyderabad', '500081', 1860, 'MyGate', 'Venkata Ramana (Secretary)', '+91 94401 88990', 'facilities@bhoojarwa.in', 'active', 'Block A to G. Dedicated service elevators available.', '2026-02-01T10:00:00Z'),
('community_aparna_sarovar_003', 'Aparna Sarovar Zenith', 'aparna-sarovar', 'AS39Z4', 'Near Citizen Hospital, Nallagandla', 'Nallagandla', 'Hyderabad', '500019', 2475, 'NoBrokerHood', 'Deepak Reddy (Facility Manager)', '+91 97010 44552', 'rwa.zenith@aparna.org', 'active', 'Strict gate approval through NoBrokerHood.', '2026-02-10T10:00:00Z'),
('community_jayabheri_summit_004', 'Jayabheri The Summit', 'jayabheri-summit', 'JS15T8', 'Nanakramguda Financial District', 'Financial District', 'Hyderabad', '500032', 540, 'MyGate', 'Srinivas Murthy', '+91 99890 33441', 'manager@jayabherisummit.com', 'active', 'Sunday bulk slots prioritized by tower committees.', '2026-02-15T10:00:00Z'),
('community_lakeview_005', 'Lakeview Residency', 'lakeview-residency', 'LR61V3', 'Durgam Cheruvu Road, Kavuri Hills', 'Madhapur', 'Hyderabad', '500081', 210, 'Traditional', 'M. Sudhakar Rao', '+91 98850 77123', 'lakeview.rwa@gmail.com', 'active', 'Traditional gate entry logging at security room.', '2026-02-20T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Service Categories
INSERT INTO service_categories (id, name, icon_name, description, active)
VALUES
('cat-auto-care', 'Auto Care', 'Car', 'Doorstep waterless detailing, interior foam deep clean, paint protection & battery care.', true),
('cat-deep-cleaning', 'Deep Cleaning', 'Sparkles', 'Full home, sofa, mattress, balcony & water tank cleaning for apartments.', true),
('cat-pest-control', 'Pest Control', 'ShieldCheck', 'Odorless cockroach gel, bedbug treatment, mosquito fogging & termite shield.', true),
('cat-home-repairs', 'Home Repairs', 'Wrench', 'Certified electrical work, plumbing, AC servicing, carpentry & painting.', true),
('cat-pet-grooming', 'Pet Care & Grooming', 'Heart', 'At-home grooming van, vet visits on call, pet sitting & walking.', true),
('cat-appliance-care', 'Appliance Servicing', 'Armchair', 'AC gas refilling, chimney deep wash, washing machine & RO water purifier care.', true)
ON CONFLICT (id) DO NOTHING;

-- Service Providers
INSERT INTO service_providers (id, business_name, contact_person, phone, whatsapp, email, category_ids, services_offered, service_areas, address, normal_pricing_ratio, verification_status, completed_jobs, rating, notes, created_at)
VALUES
('prov-aqua-shine', 'AquaShine Express Detailing', 'Rajesh Varma', '+91 98480 11223', '+91 98480 11223', 'contact@aquashine.in', ARRAY['cat-auto-care'], ARRAY['Waterless Eco Car Wash', 'Sofa & Mattress Shampooing'], ARRAY['Banjara Hills', 'HITEC City', 'Nallagandla', 'Financial District'], 'Plot 42, Auto Nagar, Gachibowli, Hyderabad', 1.00, 'verified', 1420, 4.90, 'Equipped with portable steam machines.', '2026-01-01T10:00:00Z'),
('prov-clean-hive', 'CleanHive Home Care', 'Anitha Rao', '+91 97001 22334', '+91 97001 22334', 'support@cleanhive.in', ARRAY['cat-deep-cleaning', 'cat-pest-control'], ARRAY['Full Home Deep Clean', 'Herbal Pest Control Shield'], ARRAY['HITEC City', 'Madhapur', 'Gachibowli', 'Financial District'], 'Suite 302, Cyber Towers Road, Madhapur, Hyderabad', 1.00, 'verified', 890, 4.80, 'Uses non-toxic eco-certified cleaning chemicals.', '2026-01-10T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO services (id, name, category_id, description, icon_name, apartment_ids, provider_id, provider_name, normal_price, community_price, sunday_bulk_price, minimum_demand, current_demand, duration_minutes, available_days, available_slots, status, popular, created_at)
VALUES
('srv-car-wash', 'Waterless Car Wash & Interior Vacuuming', 'cat-auto-care', 'Doorstep waterless exterior eco-wash, high-pressure tire degreasing, dash shine & complete interior vacuuming right in your apartment basement slot.', 'Car', ARRAY[]::TEXT[], 'prov-aqua-shine', 'AquaShine Express Detailing', 499, 299, 249, 10, 14, 45, ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], ARRAY['07:00 AM - 09:00 AM', '09:00 AM - 11:00 AM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'], 'active', true, '2026-01-20T10:00:00Z'),
('srv-sofa-shampoo', 'Sofa & Upholstery Steam Clean (5-Seater)', 'cat-deep-cleaning', 'Deep germicidal hot-steam extraction, stain removal & anti-allergen treatment for 5-seater fabric/leather sofas.', 'Sparkles', ARRAY[]::TEXT[], 'prov-clean-hive', 'CleanHive Home Care', 1499, 999, 849, 5, 8, 90, ARRAY['Fri', 'Sat', 'Sun'], ARRAY['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'], 'active', true, '2026-01-22T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Initial Campaigns
INSERT INTO campaigns (id, token, apartment_id, service_id, normal_price, community_price, sunday_bulk_price, minimum_demand, current_demand, available_dates, available_slots, status, provider_id, notes, created_at)
VALUES
('camp_gv_carwash_001', '7H4K-CW', 'community_green_valley_001', 'srv-car-wash', 499, 299, 249, 10, 14, ARRAY['2026-03-29', '2026-04-05'], ARRAY['07:00 AM - 09:00 AM', '09:00 AM - 11:00 AM', '04:00 PM - 06:00 PM'], 'target_reached', 'prov-aqua-shine', 'RWA approved basement parking bay 2.', '2026-03-01T10:00:00Z'),
('camp_bhooja_sofa_002', 'MH82-SF', 'community_my_home_bhooja_002', 'srv-sofa-shampoo', 1499, 999, 849, 8, 6, ARRAY['2026-03-29', '2026-04-05'], ARRAY['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM'], 'collecting_demand', 'prov-clean-hive', 'Block C & D service elevator booked.', '2026-03-10T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Initial Bookings
INSERT INTO bookings (id, booking_number, service_id, service_name, apartment_id, apartment_name, resident_name, phone, email, block, flat_number, date, slot, price, booking_type, status, provider_id, provider_name, provider_phone, notes, created_at)
VALUES
('bk_001', 'GK-CW-901', 'srv-car-wash', 'Waterless Car Wash & Interior Vacuuming', 'community_green_valley_001', 'Green Valley Apartments', 'Suresh Kumar', '+91 98490 88221', 'suresh.k@gmail.com', 'Block A', 'A-402', '2026-03-29', '07:00 AM - 09:00 AM', 249, 'sunday_bulk', 'vendor_assigned', 'prov-aqua-shine', 'AquaShine Express Detailing', '+91 98480 11223', 'Parked at basement slot B-14', '2026-03-15T10:00:00Z')
ON CONFLICT (id) DO NOTHING;
