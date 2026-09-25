# `src/` — Application Source

Entry chain: `index.html` → `main.tsx` → `App.tsx`.

| Folder / File | Purpose |
|---------------|---------|
| `main.tsx` | React 19 `createRoot` bootstrap, mounts `<App />` in `StrictMode`, imports `index.css` (Tailwind). |
| `App.tsx` | Root component: wraps the tree in `AppProvider`, resolves the URL with `src/lib/router.ts`, and renders exactly one top-level view. Campaign and community-portal routes fetch their own scoped rows from Supabase and share `StatusPanel` (loading / error / retry) fallbacks. |
| `index.css` | Global stylesheet; imports Tailwind CSS 4 (`@import "tailwindcss"`). |
| `components/` | All React UI, split by audience. → `components/README.md` |
| `context/` | `AppContext.tsx` — the single global state store. → `context/README.md` |
| `data/` | In-memory demo seeds (used only when Supabase is not configured). → `data/README.md` |
| `lib/` | URL router, ID/token generators, Supabase client + DB row mappers. → `lib/README.md` |
| `types/` | Shared TypeScript domain models. → `types/README.md` |

## Routing (App.tsx + src/lib/router.ts)

`App.tsx` keeps a lightweight `window.location` + `history.pushState`/`popstate` router
(exposed through the context as `currentPath` / `navigate`), but the **route classification
lives in `src/lib/router.ts`** as the pure function `resolveRoute(pathname, search)`.
Resolution priority:

1. **Campaign deep links** — `?token=` / `?campaign=`, `/campaign/:token`, `/book/:token`,
   `/community/:slug/:service/:token` → `CampaignRoute` renders `public/PublicCampaignPage`
   after `fetchCampaignByToken(token)` (campaigns table only) succeeds.
2. **Community portal links** — `?c=` / `?community=`, `/c/:slug/:token`, `/c/:slug`,
   `/community-portal/:idOrSlug` → `CommunityPortalRoute` renders
   `public/CommunityCustomerPortal` from `fetchApartmentForPortal(...)` plus that
   community's campaigns and services (scoped queries — no full-table loads).
3. **Admin namespace** — `/admin*` (or `?admin=true`) → `admin/AdminLogin` until
   `isAdminReady` becomes true via Supabase Auth, then `admin/AdminDashboard`. Blocked with
   a config-error panel when Supabase env vars are missing/placeholder.
4. **Default resident experience** — `common/Navbar` + one of the `resident` tab views
   (`services`, `community`, `my-bookings`, `rwa`, `vendor`) + `common/Footer`, with the
   global modals `BookingModal`, `WhatsAppShareModal`, and `SocietySelectorModal` mounted.

Campaign and portal routes render a shared `StatusPanel` for loading, error (with Retry +
Home actions), and "not found" states, and show a banner when running in demo mode or when
Supabase config is broken. It also syncs the URL-selected community back into context state
(`selectedApartmentId`) and honors a legacy `?service=` deep link by opening the booking modal.

## Folder Connections

- `App.tsx` imports `lib/router.ts` (route classification) and from **every** component
  folder plus `context/AppContext`.
- Everything under `components/` consumes state and mutations from `context/` via `useApp()`.
- `context/` imports types from `types/`, seeds from `data/` (demo mode only), and the
  Supabase client/mappers from `lib/` — the only folder that talks to the backend SDK.
- `supabase/schema.sql` (outside `src/`) mirrors `types/` one SQL table per TS interface and
  defines the RLS model every query must respect.
