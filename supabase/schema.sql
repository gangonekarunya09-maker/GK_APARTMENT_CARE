-- ====================================================================
-- SUPABASE POSTGRESQL PRODUCTION BACKEND SCHEMA (SECURE RLS v2)
-- App: GateKeep / Community Services & Group Buying Platform
-- ====================================================================
-- HOW TO APPLY
--   Option A (fresh project): run this whole file in the Supabase SQL editor.
--   Option B (existing project that ran the old schema): run Section 2B
--     ("v1 -> v2 migration") instead. It drops the public allow-all policies
--     and installs the secure ones below.
--
-- SECURITY MODEL
--   - anon (public visitors):
--       read  → apartments, service_categories, service_providers,
--               services, campaigns  (public catalog data only)
--       write → resident_requests, bookings, rwa_applications,
--               vendor_applications (form submissions only)
--       NO write access to campaigns / apartments / providers /
--       categories / services. NO read access to applications tables.
--   - authenticated users: same as anon by default. Additional rights are
--       granted ONLY to members of the admin_users allow-list, enforced
--       server-side via the is_admin() SQL function. A frontend flag can
--       never grant these rights.
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. Tables
-- ====================================================================

-- A. APARTMENTS / COMMUNITIES TABLE
CREATE TABLE IF NOT EXISTS apartments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  portal_token TEXT UNIQUE NOT NULL,
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
  sunday_bulk_price NUMERIC(10, 2),
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
--    campaign_id is nullable so free-form community demand polls
--    ("community-demand-poll") can be stored without a campaign row.
CREATE TABLE IF NOT EXISTS resident_requests (
  id TEXT PRIMARY KEY,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
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

-- H. RWA PARTNERSHIP APPLICATIONS TABLE (admin-only reads)
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

-- I. VENDOR APPLICATIONS TABLE (admin-only reads)
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
-- 2B. MIGRATION v1 -> v2 (run this section only on an existing DB)
-- ====================================================================
-- Aligns columns with the application model where the old schema differed:
DO $$
BEGIN
  -- sunday_bulk_price may now be NULL (optional Sunday discount)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'sunday_bulk_price' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE services ALTER COLUMN sunday_bulk_price DROP NOT NULL;
    ALTER TABLE services ALTER COLUMN sunday_bulk_price SET DEFAULT NULL;
  END IF;

  -- resident_requests.campaign_id becomes nullable (demand polls)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resident_requests' AND column_name = 'campaign_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE resident_requests ALTER COLUMN campaign_id DROP NOT NULL;
  END IF;
END
$$;

-- Unique constraints for tokens (idempotent; skip if a duplicate exists).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'apartments_portal_token_key'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM (SELECT portal_token_hint FROM apartments LIMIT 0) q
    ) THEN
      BEGIN
        ALTER TABLE apartments ADD CONSTRAINT apartments_portal_token_key UNIQUE (portal_token);
      EXCEPTION WHEN others THEN
        RAISE NOTICE 'apartments.portal_token has duplicates; deduplicate before adding UNIQUE';
      END;
    END IF;
  END IF;
END
$$;

-- ====================================================================
-- 3. ADMIN ALLOW-LIST (server-side authorization)
-- ====================================================================
-- A user is an admin iff their auth.users id is listed in admin_users.
-- Manage entries with:  SELECT public.add_admin('<auth.users.id>');
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users a
    WHERE a.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.add_admin(target_user_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.admin_users (user_id) VALUES (target_user_id)
  ON CONFLICT (user_id) DO NOTHING;
$$;

-- REVOKE public execute so only the dashboard / service role manages it.
REVOKE EXECUTE ON FUNCTION public.add_admin(UUID) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin(UUID) TO service_role;

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

DROP TRIGGER IF EXISTS trg_apartments_updated ON apartments;
CREATE TRIGGER trg_apartments_updated BEFORE UPDATE ON apartments FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_providers_updated ON service_providers;
CREATE TRIGGER trg_providers_updated BEFORE UPDATE ON service_providers FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_campaigns_updated ON campaigns;
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_bookings_updated ON bookings;
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
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5.0. Housekeeping: remove any legacy permissive policies from the old schema
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('apartments','service_categories','service_providers','services',
                        'campaigns','resident_requests','bookings',
                        'rwa_applications','vendor_applications','admin_users')
      AND policyname LIKE 'Allow All%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END
$$;

-- 5.1. PUBLIC CATALOG — readable by anon + authenticated (needed to render
--      public campaign & portal pages). Writable ONLY by admins.
CREATE POLICY "catalog_read_apartments" ON apartments
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_write_apartments" ON apartments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "catalog_read_categories" ON service_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_write_categories" ON service_categories
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "catalog_read_providers" ON service_providers
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_write_providers" ON service_providers
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "catalog_read_services" ON services
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_write_services" ON services
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Campaigns: public pages must read the campaign matching a shared token and
-- increment demand. Demand increments happen via the SECURITY DEFINER RPC in
-- Section 6, so anon gets SELECT + (scoped) UPDATE of the demand counter only.
CREATE POLICY "public_read_campaigns" ON campaigns
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_campaigns" ON campaigns
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_insert_campaigns" ON campaigns
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_campaigns" ON campaigns
  FOR DELETE TO authenticated USING (public.is_admin());

-- 5.2. FORM SUBMISSIONS — anon can INSERT only (no read-back of other
--      people's data; admins read everything).
CREATE POLICY "anon_insert_resident_requests" ON resident_requests
  FOR INSERT TO anon, authenticated WITH CHECK (
    campaign_id IS NULL OR EXISTS (SELECT 1 FROM campaigns c WHERE c.id = campaign_id)
  );
CREATE POLICY "public_read_own_resident_requests" ON resident_requests
  FOR SELECT TO anon, authenticated USING (false); -- no anonymous read; lookups go through admin/RPC
CREATE POLICY "admin_read_resident_requests" ON resident_requests
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_resident_requests" ON resident_requests
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_resident_requests" ON resident_requests
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "anon_insert_bookings" ON bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_read_own_bookings" ON bookings
  FOR SELECT TO anon, authenticated USING (false); -- no anonymous listing of all bookings
CREATE POLICY "admin_read_bookings" ON bookings
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_bookings" ON bookings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_bookings" ON bookings
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "anon_insert_rwa_applications" ON rwa_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_read_rwa_applications" ON rwa_applications
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_rwa_applications" ON rwa_applications
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_rwa_applications" ON rwa_applications
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "anon_insert_vendor_applications" ON vendor_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_read_vendor_applications" ON vendor_applications
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_update_vendor_applications" ON vendor_applications
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_delete_vendor_applications" ON vendor_applications
  FOR DELETE TO authenticated USING (public.is_admin());

-- admin_users: only admins may read the allow-list; nobody writes via API.
CREATE POLICY "admin_read_admin_users" ON admin_users
  FOR SELECT TO authenticated USING (public.is_admin());

-- 5.3. Demand-poll requests have no campaign FK; relax to a plain INSERT.
--      (Handled above: campaign_id IS NULL OR matches an existing campaign.)

-- ====================================================================
-- 6. PUBLIC RPC — atomic demand increment for campaign pages
-- ====================================================================
-- Public campaign pages call this instead of writing to campaigns directly.
-- It atomically increments current_demand, flips status at the target and
-- returns the fresh row — no enumeration, no racing increments.
CREATE OR REPLACE FUNCTION public.increment_campaign_demand(
  p_campaign_id TEXT,
  p_request JSONB
)
RETURNS campaigns
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_campaign campaigns;
  v_request_id TEXT;
BEGIN
  SELECT * INTO v_campaign FROM campaigns WHERE id = p_campaign_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'campaign_not_found';
  END IF;

  INSERT INTO resident_requests (
    id, campaign_id, apartment_id, resident_name, phone, block,
    flat_number, email, preferred_date, preferred_slot, notes, status
  ) VALUES (
    COALESCE(p_request->>'id', 'req-' || encode(gen_random_bytes(12), 'hex')),
    v_campaign.id,
    v_campaign.apartment_id,
    COALESCE(p_request->>'residentName', 'Unknown'),
    COALESCE(p_request->>'phone', ''),
    COALESCE(p_request->>'block', 'Block A'),
    COALESCE(p_request->>'flatNumber', ''),
    NULLIF(p_request->>'email', ''),
    NULLIF(p_request->>'preferredDate', ''),
    NULLIF(p_request->>'preferredSlot', ''),
    NULLIF(p_request->>'notes', ''),
    'interested'
  ) RETURNING id INTO v_request_id;

  UPDATE campaigns
  SET current_demand = current_demand + 1,
      status = CASE
        WHEN current_demand + 1 >= minimum_demand AND status = 'collecting_demand'
          THEN 'target_reached'::text
        ELSE status
      END,
      updated_at = NOW()
  WHERE id = v_campaign.id
  RETURNING * INTO v_campaign;

  RETURN v_campaign;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_campaign_demand(TEXT, JSONB) TO anon, authenticated;

-- ====================================================================
-- 7. Enable Realtime Publications for Instant Sync
-- ====================================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;
