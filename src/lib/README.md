# `src/lib/` — Router, ID/Token Generation & Backend Client

## Files

| File | Role |
|------|------|
| `router.ts` | **Explicit URL router.** Pure function `resolveRoute(pathname, search)` → `RouteMatch { kind, via, campaignToken, communitySlug, communityToken, communityIdOrSlug }`, plus `isAdminPath()`. Deterministic priority: query-token campaign → query-community → `/community/:slug/:service/:token` → `/campaign|/book/:token` → `/c/:slug[/:token]` → `/community-portal/:idOrSlug` → `/admin` → resident default. Guarantees campaign tokens are matched against the `campaigns` table only and community slugs/tokens against `apartments` only. |
| `ids.ts` | ID/token helpers: `generateId(prefix)` (UUID v4 via `crypto.randomUUID`, timestamp fallback), `generateShareToken(length)` (8-char token from the 31-symbol unambiguous alphabet `23456789ABCDEFGHJKLMNPQRSTUVWXYZ`, ~25 bits of entropy via `crypto.getRandomValues`), and `slugify(input)`. Used by the context and admin managers for primary keys and shareable portal/campaign tokens. |
| `supabase.ts` | The **only** file that touches the Supabase SDK. Validates env config and defines all snake_case ↔ camelCase row mappers. |

## `supabase.ts` Exports

- `SUPABASE_CONFIG_ERROR` — true when the URL/key env vars are missing **or placeholders**
  (e.g. a literal `https://YOUR_PROJECT.supabase.co`); drives the config-error panels.
- `isSupabaseConfigured()` — hardened flag the context and routes use to decide between
  live mode and demo mode.
- `supabase` — `SupabaseClient | null`; `null` when the config check fails.
- Mapper pairs, one per domain entity (used by `src/context/AppContext.tsx` and the scoped
  route components in `src/App.tsx` for every read and write):
  `mapApartment…`, `mapCategory…`, `mapProvider…`, `mapService…`, `mapCampaign…`,
  `mapResidentRequest…`, `mapBooking…`, `mapRWAApplication…`, `mapVendorApplication…`
  (`…FromDb` converts DB rows to app types, `…ToDb` the reverse). Mappers are null-safe on
  optional columns and normalize defaults (prices, dates, ratings) so components never see
  raw DB rows.

## Why Mappers Exist

Postgres columns are `snake_case` (`portal_token`, `normal_price`, `booking_type`) while the
app's TypeScript interfaces in `src/types/` are `camelCase` (`portalToken`, `normalPrice`,
`bookingType`). Each mapper also normalizes missing values so components never see raw DB rows.

## Connections

- **Imports from**: `@supabase/supabase-js` and `src/types/` only (plus browser `crypto` in
  `ids.ts`). No cross-imports between the three files.
- **Imported by**:
  - `src/context/AppContext.tsx` — every load, mutation, and Realtime refetch goes through
    `supabase.ts`; token/ID generation uses `ids.ts`.
  - `src/App.tsx` — `resolveRoute` / `isAdminPath` from `router.ts`; the scoped campaign and
    portal routes dynamically import `supabase.ts` mappers for their targeted queries.
- **Schema source of truth**: `supabase/schema.sql` defines the exact tables and column
  names these mappers map to (`apartments`, `service_categories`, `service_providers`,
  `services`, `campaigns`, `resident_requests`, `bookings`, `rwa_applications`,
  `vendor_applications`) and the RLS policies that scope what each query may read/write.
- The env vars consumed here are documented in `.env.example`
  (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
