# `supabase/` — Production Database Schema (Secure RLS v2)

## Files

| File | Role |
|------|------|
| `schema.sql` | Idempotent SQL for the Supabase Postgres backend: extensions, 9 app tables + `admin_users`, `updated_at` triggers, the v2 secure RLS policies, the `increment_campaign_demand` RPC, and a realtime publication. Run it in the Supabase SQL editor (or `psql`). A duplicate copy exists at the repo root as `supabase-schema.sql`. |

## Tables

| Table | Backs app type | Notes |
|-------|----------------|-------|
| `apartments` | `Apartment` | Communities with unique `slug` and `portal_token` used for portal deep links. |
| `service_categories` | `ServiceCategory` | Service groupings with icon names. |
| `service_providers` | `ServiceProvider` | Verified vendors; `category_ids`, `services_offered`, `service_areas` are text arrays. |
| `services` | `Service` | FK → `service_categories`, optional FK → `service_providers`; three price columns (bulk price nullable via migration), demand counters, availability arrays, status workflow. |
| `campaigns` | `Campaign` | FK → `apartments` and `services`; unique share `token`; group-buy status workflow from `collecting_demand` to `completed`. |
| `resident_requests` | `ResidentRequest` | FK → `apartments`; `campaign_id` is nullable (demand-poll requests); interest signups from the public campaign page. |
| `bookings` | `Booking` | FK → `services` and `apartments`; unique `booking_number`; `regular` vs `sunday_bulk` type. |
| `rwa_applications` | `RWAPartnershipApplication` | Inbound RWA partnership applications. |
| `vendor_applications` | `VendorApplication` | Inbound vendor onboarding applications. |
| `admin_users` | — | Admin allow-list: `user_id UUID PRIMARY KEY REFERENCES auth.users`. A user is an admin iff listed here. |

## How to Apply

1. **Fresh project**: run the whole `schema.sql` in the Supabase SQL editor.
2. **Existing project that ran the old (v1) schema**: run **Section 2B ("v1 → v2 migration")**
   inside `schema.sql`. It drops the legacy `Allow All%` policies, makes
   `sunday_bulk_price` nullable, relaxes `resident_requests.campaign_id`, adds
   `UNIQUE(portal_token)`, and installs the secure policies.
3. **Promote your operator**: create the user in Supabase Auth (Dashboard → Authentication),
   then run `SELECT public.add_admin('<auth-user-uuid>');` (Dashboard/SQL editor — the
   function is revoked from `anon`/`authenticated` and granted to `service_role` only).

> The app cannot run this DDL itself — applying the schema and adding the first admin are
> one-time manual steps in the Supabase dashboard.

## Security Model (RLS v2)

1. **Extensions** — `uuid-ossp`, `pgcrypto`.
2. **Admin allow-list** — `is_admin()` (`SECURITY DEFINER`) checks `admin_users`;
   `add_admin()` manages entries but `EXECUTE` is revoked from `anon`/`authenticated`.
   A frontend flag can never grant admin rights.
3. **Row Level Security** — enabled on all 10 tables, with legacy `Allow All%` policies
   removed by housekeeping code:
   - **anon + authenticated read** (public catalog): `apartments`, `service_categories`,
     `service_providers`, `services`, `campaigns` — everything the public campaign and
     portal pages need to render, and nothing more.
   - **anon + authenticated write** (form submissions only): `INSERT` on
     `resident_requests`, `bookings`, `rwa_applications`, `vendor_applications`; read-back
     restricted to rows created in-session, plus admin-only read/update/delete.
   - **Admin CRUD**: all rights on every table gated by `is_admin()` — enforced
     server-side, not by hiding UI.
   - **`admin_users`**: admins may read the allow-list; nobody writes via the API.
4. **Atomic demand increment** — `increment_campaign_demand(p_campaign_id, p_request)`
   RPC (`SECURITY DEFINER`, granted to `anon`): locks the campaign row, inserts the
   resident request, increments `current_demand`, flips status at the target, and returns
   the fresh row — no anonymous writes to `campaigns` and no racing increments.
5. **Triggers** — `update_timestamp()` keeps `updated_at` fresh on the five mutable tables.
6. **Realtime** — a `supabase_realtime` publication for all tables, feeding the debounced
   `postgres_changes` subscription in `src/context/AppContext.tsx`.

## Connections to the App

- **`src/lib/supabase.ts`** maps these snake_case tables/columns to the camelCase interfaces
  in **`src/types/`** — the table names there must match the ones defined here.
- **`src/context/AppContext.tsx`** reads/writes every table listed above via that client,
  listens to the realtime publication, and calls the demand RPC from the public campaign
  page flow.
- **`src/lib/router.ts` + `src/App.tsx`** rely on the anon-read catalog policies so scoped
  campaign/portal pages can fetch a single campaign or community without authentication.
- **`src/data/mockData.ts`** seeds mirror these tables for the no-backend (in-memory) mode.
- Env vars required by the app to reach this database are documented in `.env.example`
  (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
