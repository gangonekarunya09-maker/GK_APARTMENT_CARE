# `src/context/` — Global State Store

## Files

| File | Role |
|------|------|
| `AppContext.tsx` | The application's single state container. Exports `AppProvider` (wraps the app in `src/App.tsx`) and `useApp()` (consumed by every screen), plus the `LoadStatus` and `MutationResult<T>` types. |

## What It Owns

- **Routing state** — `currentPath` / `navigate()` built on `history.pushState` + `popstate`
  (route *classification* lives in `src/lib/router.ts`), plus `residentTab` and
  `adminSection` for in-page navigation.
- **Auth (Supabase-only)** — `loginAdmin(email, password)` → Supabase Auth sign-in,
  `logoutAdmin()`, `authUser`, `isAdminAuthenticated`, and `isAdminReady` (true once the
  session check completes, so admin routes can distinguish "loading" from "denied"). There
  is deliberately **no** password-bypass, demo login, or client sign-up — admin rights are
  enforced server-side by the `admin_users` allow-list / `is_admin()` RLS in
  `supabase/schema.sql`.
- **Data collections** — `apartments`, `categories`, `providers`, `services`, `campaigns`,
  `residentRequests`, `bookings`, `rwaApplications`, `vendorApplications`.
- **Load status** — `dataStatus: LoadStatus` (`'idle' \| 'loading' \| 'ready' \| 'error' \|
  'demo'`), `dataError`, `isBackendConnected` / `backendError`, and `reloadAll()` — so screens
  can render proper loading/error/retry states instead of blank content.
- **Mutations (awaitable, rollback-safe)** — one function per use case, all returning
  `Promise<MutationResult<T>> { success, data?, error? }`: `createCampaign`,
  `updateCampaign`, `updateCampaignStatus`, `assignProviderToCampaign`,
  `submitResidentInterest`, `createBooking`, `updateBookingStatus`, `addApartment`,
  `updateApartment`, `toggleApartmentStatus`, `generateCustomerPortalToken`,
  `submitCommunityDemand`, `addCategory`, `toggleCategoryStatus`, `addProvider`,
  `updateProvider`, `addService`, `updateService`, `submitRWAApplication`,
  `submitVendorApplication`. Each applies an optimistic local update, rolls it back on
  failure, and returns the error for inline display.
- **Scoped fetchers for public pages** — `fetchApartmentForPortal(slugOrToken, token?)` and
  `fetchCampaignByToken(token)` resolve portal/campaign links with targeted queries.
  Portal lookup enforces **strict slug+token pairing**: when both are present, one
  `.eq('slug', …).eq('portal_token', …)` query must match the SAME row, so a valid token
  under a wrong (or revoked) slug can never load another community. Community slugs/tokens
  match `apartments` only; campaign tokens match `campaigns` only.
- **`addApartment`** assigns a collision-free slug (`my-home-bhooja`, `my-home-bhooja-2`,
  …) and a portal token via `src/lib/ids.ts`, so newly created communities are immediately
  routable at `/c/:slug/:token` with zero config changes.
- **Modal/UI state** — `bookingModalService`, `shareModalService`, `trackingBooking`,
  `societySelectorOpen`.

## Persistence Model

1. **Supabase mode** (env vars configured): loads the nine tables on mount via
   `src/lib/supabase.ts` mappers, writes every mutation to Postgres (subject to the RLS in
   `supabase/schema.sql`), and subscribes to Supabase Realtime `postgres_changes` for
   `campaigns`, `apartments`, and `resident_requests` with an 800 ms debounce refetch —
   enough for cross-tab/cross-device freshness without hammering the DB.
2. **Demo mode** (no/placeholder env vars): hydrates from the empty seed arrays in
   `src/data/mockData.ts` and keeps state **in memory only** — nothing is written to
   `localStorage`. `resetToDemoData()` restores the baseline seeds in this mode (no-op in
   Supabase mode). Collections never persist to localStorage; the only persisted key is the
   admin UI section (`STORAGE_KEYS.ADMIN_SECTION`). Community selection is **session-scoped**
   by design — it is never restored from storage, so the root landing page can never
   auto-enter a previously selected community.
   There is no fallback share token (e.g. the old `'7H4K92'`) — portal URLs always come
   from real rows.

## Connections

- **Imports from**: `src/types/` (domain models), `src/data/mockData.ts` (demo seeds),
  `src/lib/supabase.ts` (client + row mappers), `src/lib/ids.ts` (ID/token generation).
  This makes it the junction point of the app.
- **Imported by**: `src/App.tsx` (`AppProvider` + `useApp`) and **every** component in
  `src/components/{admin,common,public,resident}` via the `useApp()` hook.
- **Backed by**: `supabase/schema.sql` — its table names and snake_case columns are exactly
  what the mapper functions in `src/lib/supabase.ts` translate to/from the types here, and
  its RLS policies + `increment_campaign_demand` RPC define what the mutations may do.
