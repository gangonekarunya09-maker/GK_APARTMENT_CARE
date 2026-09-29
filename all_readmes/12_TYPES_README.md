# `src/types/` — Shared Domain Models

## Files

| File | Role |
|------|------|
| `index.ts` | All TypeScript interfaces and union types for the domain, shared by every other folder. |

## Domain Models

| Interface | Meaning | SQL table (supabase/schema.sql) |
|-----------|---------|-------------------------------|
| `Apartment` | A gated community (slug + `portalToken` power its customer-portal URL) | `apartments` |
| `ServiceCategory` | Grouping for services (cleaning, car care, …) | `service_categories` |
| `ServiceProvider` | Verified vendor with contact info, areas, rating | `service_providers` |
| `Service` | A bookable service with 3 price tiers (normal / community / Sunday bulk), demand counters, availability slots | `services` |
| `Campaign` | Group-buying drive for one service in one community; `token` powers its shareable WhatsApp link; status workflow `collecting_demand → … → completed` | `campaigns` |
| `ResidentRequest` | A resident's interest signup on a campaign | `resident_requests` |
| `Booking` | A confirmed booking (`GK-XX-NNNNN` number, flat/date/slot, regular vs `sunday_bulk`) | `bookings` |
| `RWAPartnershipApplication` | Inbound partnership application from a society's RWA | `rwa_applications` |
| `VendorApplication` | Inbound vendor onboarding application | `vendor_applications` |

Supporting unions: `GateSecurityApp`, `ServiceStatus`, `BookingStatus`, `CampaignStatus`,
plus the `BookingTimelineEvent` helper used by the status tracker UI.

## Connections

- **Imported by** every other `src/` folder: `context/AppContext.tsx` (state + mutation
  signatures), `lib/supabase.ts` (mapper return types), `lib/router.ts` (no direct import —
  route matches carry these types), `data/mockData.ts` (seed typing), and components across
  `admin/`, `public/`, `resident/`.
- **Mirrored by** `supabase/schema.sql` (and its copy `supabase-schema.sql` at the repo
  root): each interface has a matching table with snake_case columns; the mappers in
  `src/lib/supabase.ts` translate between the two representations. The schema also adds
  `admin_users` (no app interface — it backs server-side admin authorization) and the
  `increment_campaign_demand` RPC, whose JSONB payload mirrors `ResidentRequest`.
- Access to rows of these types is governed by the RLS v2 policies in
  `supabase/schema.sql` (anon read-only catalog, insert-only forms, admin CRUD via
  `is_admin()`).
