# GK Apartment Care — Hyper-Local Community Services

Community-first home & auto care platform for gated communities in Hyderabad. Residents access verified doorstep services at exclusive community bulk prices, join **Sunday bulk demand pools** through group-buying campaigns, track live order status with gate-pass clearance, and share WhatsApp campaign links. Operators manage communities, campaigns, service providers, and bookings from an integrated admin operations dashboard.

## Tech Stack

| Layer      | Technology |
|------------|------------|
| UI         | React 19, TypeScript, Tailwind CSS 4 (via `@import "tailwindcss"` in `src/index.css`), Motion (`motion/react`), lucide-react icons |
| Design     | Editorial design system: warm neutral token palette (`--bg: #FAF8F5`, `--surface: #FFFFFF`, `--surface-alt: #F0EDE7`, `--ink: #111111`, `--line: #E4E0D8`, `--accent: #2596be`), tight-tracked display typography, 24px card radius, hairline borders, and full-pill action buttons |
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

- **With env vars set** — the app loads live data from Supabase and every mutation writes to Postgres, guarded by secure RLS policies in `supabase/schema.sql`.
- **Without env vars** — the app runs in a local demo mode backed by in-memory collections; admin dashboard and login require Supabase.

The first-run backend checklist lives in `supabase/README.md`: apply `supabase/schema.sql`, then promote your operator account with `SELECT public.add_admin('<auth-user-uuid>');`.

## Folder Map

```
├── index.html               Vite entry HTML (loads Google fonts & /src/main.tsx)
├── vite.config.ts           Build config, @/ path alias, HMR flags
├── vercel.json              Vercel deployment: SPA rewrite "/(.*)" → /index.html
├── supabase-schema.sql      Copy of the DB schema
├── src/                     Application source → see src/README.md
│   ├── components/          All React UI components → see src/components/README.md
│   │   ├── admin/           Operator dashboard (12 resource managers) → admin/README.md
│   │   ├── common/          Navbar / PromoBar / Footer / Logo → common/README.md
│   │   ├── public/          Anonymous link pages (scoped community portals) → public/README.md
│   │   ├── resident/        Resident storefront & section rhythm → resident/README.md
│   │   └── ui/              Reusable design system primitives (Button, Badge, Marquee, etc.) → ui/README.md
│   ├── context/             Global state store (AppContext) → context/README.md
│   ├── data/                In-memory demo seeds → data/README.md
│   ├── lib/                 Router, ID/token generators, Supabase client → lib/README.md
│   └── types/               Shared TypeScript domain models → types/README.md
└── supabase/                SQL schema (secure RLS v2) → supabase/README.md
```

## How the Architecture Connects

```
              ┌─────────────────────────────────────────────────────────────┐
              │  src/main.tsx → src/App.tsx                                 │
              │  (entry; classifies URLs & composes views from router)      │
              └──┬──────────────────────────┬───────────────────────────────┘
                 │ resolveRoute()           │ wraps tree in AppProvider
                 ▼                          ▼
        ┌────────────────┐        ┌──────────────────────────────┐
        │ src/lib/router │        │     src/context/AppContext   │
        └────────────────┘        │ (single source of truth for  │
                                  │  app data, auth, & modals)   │
                                  └──┬──────────┬──────────┬─────┘
                          reads/writes│          │ maps rows│ seeds (demo mode)
                                      ▼          ▼          ▼
                     src/lib/supabase.ts  src/types/index.ts  src/data/mockData.ts
                                      ▲
                                      │  SQL mirrors domain entities
                            supabase/schema.sql
```

* **`src/lib/router.ts`** is the URL router: a pure `resolveRoute(pathname, search)` classifying every URL as `campaign` / `community` / `admin` / `resident` (plus `isAdminPath`).
* **`src/App.tsx`** handles top-level view composition:
  - **Public Campaign Links (`/campaign/:token`, `/book/:token`, `?token=`)** → `public/PublicCampaignPage`
  - **Resident Community Portals (`/c/:slug/:token`, `/c/:slug`)** → `public/CommunityCustomerPortal` (scoped queries; includes tabbed **Services & Bulk Pools** and **Track Orders & Bookings** timeline)
  - **Admin Operations Portal (`/admin*`)** → `admin/AdminLogin` or `admin/AdminDashboard`
  - **Public Homepage (`/`)** → Composed of `PromoBar`, `Navbar`, the complete resident section rhythm (`Hero`, `StepsSection`, `ServicesMarquee`, `ServiceCatalog`, `ComparisonSection`, `NetworkSection`, `AssociationTrustSection`, `FAQSection`, `ClosingCTA`), and `Footer`.
* **`src/components/ui/`** contains reusable design tokens and primitive components:
  - `Button`: Pill button supporting `primary`, `secondary`, `inverse`, `accent`, and `link` variants.
  - `Badge`: Pill badge labels for status indicators and society metadata.
  - `Section`: Container enforcing 1280px max-width, responsive gutters, and alternating surface backgrounds.
  - `Marquee`: Continuous looping marquee with pause-on-hover, accessible controls, and `prefers-reduced-motion`.
  - `StatCard`: Large numeral display cards.
  - `Accordion`: Single-open FAQ accordion with rotating indicators and hairline dividers.
* **`src/context/AppContext.tsx`** is the central state store: owns the 9 data collections, optimistic awaitable `MutationResult` methods, admin session state, and debounced Supabase Realtime subscriptions.
* **`src/lib/supabase.ts`** encapsulates Supabase SDK client initialization, environment validation (`isSupabaseConfigured`), and camelCase↔snake_case row mappers.

## Resident Community Portal (`/c/:slug/:token`)

The resident service portal serves individual gated communities:
1. **Services & Bulk Pools Tab:** Displays live community campaigns, standard vs. doorstep bulk rates, minimum demand thresholds, and one-click "Join Community Bulk Pool" interest registration.
2. **Track Orders & Bookings Tab:** Allows residents to filter by flat number, name, phone, or booking number, and view live status badges alongside a 4-step progress timeline (`Received` → `Vendor Assigned` → `In Progress` → `Completed`), gate pass verification with society security apps (e.g. MyGate), and direct WhatsApp support links.

## Deployment Notes (Vercel)

- `vercel.json` uses the standard Vercel SPA rewrite (`"source": "/(.*)"` → `/index.html`), ensuring deep links (`/c/:slug/:token`, `/campaign/:token`, `/admin`) resolve smoothly on direct navigation and refresh.
- The build outputs `dist/vercel.json` automatically via the Vite config plugin.
- Communities are database-driven: any `/c/:communitySlug/:token` resolves at runtime against the `apartments` table in Supabase.
