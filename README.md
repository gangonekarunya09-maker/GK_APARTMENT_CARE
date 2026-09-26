# GK Apartment Care — Hyper-Local Community Services

Community-first home & auto care platform for gated communities in Hyderabad. Residents book
verified services at community prices, unlock **bulk Sunday discounts** through group-buying
campaigns, and share WhatsApp campaign links. Operators run everything from an admin portal.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| UI         | React 19, TypeScript, Tailwind CSS 4 (via `@tailwindcss/vite`), Motion animations, lucide-react icons |
| Build      | Vite 8 (`vite.config.ts`), deployed on Vercel (`vercel.json` SPA rewrites) |
| Backend    | Supabase (Postgres + Auth + Realtime) — `@supabase/supabase-js` |
| State      | Single React Context (`src/context/AppContext.tsx`); **Supabase is the single source of truth** (demo mode keeps in-memory seeds only — no localStorage persistence of app data) |

## Getting Started

```bash
npm install
npm run dev      # dev server on port 3000
npm run build    # production build to dist/
npm run lint     # TypeScript check (tsc --noEmit)
```

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

- **With env vars set** — the app loads everything from Supabase and every mutation writes to
  Postgres, guarded by the secure RLS policies in `supabase/schema.sql`.
- **Without env vars** — the app still runs in a local demo mode backed by the (empty) seed
  arrays in `src/data/mockData.ts`, held in memory only; changes are not persisted anywhere.
  Admin login and the `/admin` dashboard require Supabase and are blocked without it.

The first-run backend checklist lives in `supabase/README.md`: apply `supabase/schema.sql`,
then promote your operator account with `SELECT public.add_admin('<auth-user-uuid>');`.

## Folder Map

```
├── index.html               Vite entry HTML (loads /src/main.tsx)
├── vite.config.ts           Build config, @/ path alias, HMR flags
├── vercel.json              Vercel deployment: SPA rewrite "/(.*)" → /index.html
│                            (keeps /c/... and /campaign/... deep links working on refresh)
├── supabase-schema.sql      Copy of the DB schema (run supabase/schema.sql instead)
├── src/                     Application source → see src/README.md
│   ├── components/          All React UI → see src/components/README.md
│   │   ├── admin/           Operator dashboard (12 managers) → admin/README.md
│   │   ├── common/          Navbar / Footer / Logo → common/README.md
│   │   ├── public/          Anonymous link pages (scoped data) → public/README.md
│   │   └── resident/        Resident storefront & flows → resident/README.md
│   ├── context/             Global state store (AppContext) → context/README.md
│   ├── data/                In-memory demo seeds → data/README.md
│   ├── lib/                 Router, ID/token generators, Supabase client → lib/README.md
│   └── types/               Shared TypeScript domain models → types/README.md
└── supabase/                SQL schema (secure RLS v2) → supabase/README.md
```

## How the Folders Connect

The dependency flow is strictly one-directional — `components` never import each other across
feature folders except for `common`:

```
              ┌─────────────────────────────────────────────┐
              │  src/main.tsx → src/App.tsx                 │
              │  (entry; composes views from a route match) │
              └──┬──────────────────────────┬───────────────┘
                 │ resolveRoute()           │ wraps everything in AppProvider
                 ▼                          ▼
        ┌────────────────┐        ┌──────────────────────────────┐
        │ src/lib/router │        │     src/context/AppContext   │
        └────────────────┘        │ (single source of truth for  │
                                  │  app data & auth state)      │
                                  └──┬──────────┬──────────┬─────┘
                          reads/writes│          │ maps rows│ seeds (demo mode)
                                      ▼          ▼          ▼
                     src/lib/supabase.ts  src/types/index.ts  src/data/mockData.ts
                                      ▲
                                      │  SQL mirrors these tables
                            supabase/schema.sql
```

* **`src/lib/router.ts`** is the URL router: a pure `resolveRoute(pathname, search)` that
  classifies every URL as `campaign` / `community` / `admin` / `resident` (plus `isAdminPath`).
  `src/App.tsx` consumes the match and renders exactly one top-level view.
* **`src/App.tsx`** composes views from the route match: campaign links →
  `public/PublicCampaignPage`, community portal links → `public/CommunityCustomerPortal`,
  `/admin*` → `admin/AdminDashboard` (or `AdminLogin`), otherwise the resident storefront.
  Campaign and portal routes load **only the rows they need** (scoped Supabase queries) and
  render shared loading / error / retry panels instead of blank screens.
* **`src/context/AppContext.tsx`** is imported by every screen and manager via `useApp()`.
  It owns the nine data collections, awaitable mutations (`MutationResult` with optimistic
  rollback), Supabase-only admin auth, load status (`dataStatus` / `reloadAll`), and a
  debounced Realtime subscription scoped to the collections the app actually displays.
* **`src/lib/supabase.ts`** is the only file that touches the Supabase SDK; it validates env
  config (`isSupabaseConfigured`, `SUPABASE_CONFIG_ERROR`) and holds the
  snake_case↔camelCase row mappers. `src/lib/ids.ts` provides UUID + unambiguous share-token
  generation used by the context and admin managers.
* **`src/types/index.ts`** defines the domain interfaces every other folder imports.
* **`src/data/mockData.ts`** provides the empty seed arrays used only for the in-memory demo
  mode when Supabase is not configured.
* **`supabase/schema.sql`** is the SQL mirror of `src/types`: one table per interface, with
  the **secure RLS v2** model (anon read-only catalog + insert-only forms; admin rights
  gated server-side by `admin_users` / `is_admin()`), an atomic
  `increment_campaign_demand` RPC, and a realtime publication that triggers context reloads.

Cross-component imports: `public` and `admin` screens reuse `common/Logo`; the root `App.tsx`
composes `common` (Navbar/Footer) with `resident` views and global modals
(`BookingModal`, `WhatsAppShareModal`).

## Deployment Notes (Vercel)

- `vercel.json` uses the **standard Vercel SPA rewrite** (`"source": "/(.*)"` → `/index.html`).
  Vercel checks the filesystem **before** applying rewrites, so `/assets/*` bundles and
  `dist/vercel.json` are still served as real files; every non-file path (`/c/:slug/:token`,
  `/campaign/:token`, `/admin`, …) falls back to `index.html` — deep links never 404.
  Do **not** replace this with regex lookaheads (e.g. `/((?!assets/).*)`): Vercel's
  path-to-regexp router silently matches nothing for that form, and every deep link
  returns the edge `X-Vercel-Error: NOT_FOUND` while `/` keeps working — exactly the
  production incident this config fixes.
- The build **also emits `dist/vercel.json`** (via the `emitVercelConfig` plugin in
  `vite.config.ts`), so deployments made from the build output alone (static/CLI uploads)
  carry the SPA rewrite with them. Never deploy a bare `dist/` without it: unknown paths
  would hit Vercel's edge 404 (`X-Vercel-Error: NOT_FOUND`) before React loads.
  Note: `vite dev` and `vite preview` apply their own SPA fallback, so this class of bug
  can only be observed on a real Vercel deployment — test deep links there after any
  routing-config change.
- Communities are **DB-driven**: any `/c/:communitySlug/:token` resolves at runtime against
  the `apartments` table. No per-community Vercel routes or config are ever needed.
- Env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` must be set in the Vercel project;
  a placeholder/missing value surfaces as a config-error panel, not a blank page.
