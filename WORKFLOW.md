# GK Apartment Care — Application Workflow

Flowcharts of how the app runs at runtime, how data moves, and the key business flows.
(Mermaid blocks render on GitHub; ASCII versions are readable anywhere.)

---

## 1. Boot & Route Resolution (every page load)

```mermaid
flowchart TD
    A[User opens URL] --> B[Vercel: SPA rewrite /index.html<br/>assets/ keeps cache headers]
    B --> C[main.tsx → StrictMode App]
    C --> D[AppProvider init]
    D --> E{isSupabaseConfigured?}
    E -- no --> F[Demo mode: in-memory seeds<br/>dataStatus = 'demo']
    E -- yes --> G[Load 9 tables via mappers<br/>dataStatus = ready / error]
    G --> H[Subscribe Realtime:<br/>campaigns, apartments, resident_requests<br/>800 ms debounce refetch]
    F --> I
    H --> I[App.tsx: resolveRoute pathname, search]
    I --> J{Route kind?}
    J -- campaign --> K[CampaignRoute:<br/>fetchCampaignByToken → campaigns table only]
    J -- community --> L[CommunityPortalRoute:<br/>fetchApartmentForPortal → apartments only<br/>+ scoped services & campaigns]
    J -- admin --> M{isAdminReady?}
    J -- resident --> N[Resident storefront]

    K -- found --> K1[PublicCampaignPage]
    K -- not found / error --> K2[StatusPanel: Retry / Home]
    L -- found --> L1[CommunityCustomerPortal]
    L -- not found / error --> L2[StatusPanel: Retry / Home]
    M -- not authenticated --> M1[AdminLogin<br/>Supabase Auth only]
    M -- config missing --> M3[Config-error panel]
    M -- authenticated --> M2[AdminDashboard]
```

ASCII:

```
                     ┌──────────────────────────┐
                     │     User opens a URL     │
                     └────────────┬─────────────┘
                                  ▼
        Vercel rewrite "/((?!assets/).*)" → /index.html   (assets keep cache headers)
                                  ▼
                     main.tsx → <AppProvider> → App.tsx
                                  ▼
                   AppContext: isSupabaseConfigured() ?
                       │ yes                    │ no
                       ▼                        ▼
        Load 9 tables + Realtime sub     Demo mode — in-memory seeds
        (campaigns/apartments/requests,  only; dataStatus = 'demo'
         800 ms debounce)                (admin routes blocked)
                       └───────────┬───────────┘
                                   ▼
        resolveRoute(pathname, search)   ← src/lib/router.ts (pure, deterministic)
                                   ▼
   ┌───────────────┬───────────────┼───────────────────┐
   ▼               ▼               ▼                   ▼
campaign        community        /admin*           resident (default)
   │               │               │                   │
   ▼               ▼               ▼                   ▼
fetchCampaign   fetchApartment   isAdminReady?      Navbar + tab views
ByToken()       ForPortal()      │no → AdminLogin   services / community /
(campaigns      (apartments      │yes→ AdminDashboard  my-bookings / rwa / vendor
 table only)     only + scoped   (+ is_admin() RLS)  + global modals:
   │             services &                          BookingModal,
   ▼             campaigns)                          WhatsAppShareModal,
found? ─ yes →                                       SocietySelectorModal
PublicCampaignPage
   │ no                     not found / error on any route
   ▼                                  ▼
StatusPanel (Retry / Home)  ← shared fallback UI
```

---

## 2. Data & Mutation Flow (every write)

```mermaid
flowchart TD
    A[Component: user action] --> B[useApp mutation<br/>e.g. createBooking, submitResidentInterest]
    B --> C[Optimistic local update]
    C --> D[src/lib/supabase.ts mapper<br/>camelCase → snake_case]
    D --> E[Supabase Postgres<br/>enforced by RLS v2:<br/>anon = read catalog + insert forms<br/>admin = is_admin allow-list]
    E -- success --> F[MutationResult success]
    E -- failure --> G[Rollback optimistic update<br/>MutationResult error]
    G --> H[Inline error shown in UI]
    F --> I[Realtime postgres_changes event]
    I --> J[800 ms debounce → refetch]
    J --> K[All clients re-render with fresh rows]
```

ASCII:

```
component action
   │  useApp() mutation (awaitable)
   ▼
optimistic local update ──► src/lib/supabase.ts mapper ──► Supabase Postgres
                                                            │ RLS v2:
                                                            │  anon  → read catalog,
                                                            │           INSERT forms
                                                            │  admin → is_admin() allow-list
                        ┌────────────── success ────────────┤
                        ▼                                   ▼ failure
             MutationResult.success                rollback optimistic update
                        │                                   ▼
                        ▼                          inline error in UI
        Realtime postgres_changes event
                        ▼
             800 ms debounce → refetch rows
                        ▼
        every connected client re-renders
```

---

## 3. Campaign (Group-Buy) Lifecycle

```mermaid
flowchart TD
    A[Admin: CampaignsManager → createCampaign] --> B[campaign row<br/>status = collecting_demand<br/>8-char share token]
    B --> C[Admin: WhatsAppCampaigns → copy share link<br/>/campaign/TOKEN or /c/slug]
    C --> D[Resident opens WhatsApp link]
    D --> E[PublicCampaignPage: pricing, demand progress]
    E --> F[Submit interest → submitResidentInterest<br/>or increment_campaign_demand RPC]
    F --> G[current_demand += 1<br/>target reached? status = target_reached]
    G --> H[Admin: CampaignDetail → assign provider<br/>status = provider_assigned]
    H --> I[... → scheduled → in_progress → completed]
```

ASCII:

```
Admin creates campaign (collecting_demand, 8-char token)
        │
        ▼
Admin copies WhatsApp share link  /campaign/TOKEN
        │
        ▼
Residents open link → PublicCampaignPage
        │  submit interest (anon INSERT → resident_requests,
        │  demand via increment_campaign_demand RPC)
        ▼
current_demand++ ──≥ minimum_demand → status = target_reached
        │
        ▼
Admin assigns provider → provider_assigned → scheduled
        │
        ▼
in_progress → completed        (realtime keeps every screen in sync)
```

---

## 4. Resident Booking Flow

```mermaid
flowchart TD
    A[Select society — SocietySelectorModal] --> B[ServiceCatalog: filter/search services]
    B --> C[ServiceCard: Book → BookingModal]
    C --> D[Flat / date / slot details]
    D --> E[createBooking → bookings table<br/>booking number GK-XX-NNNNN]
    E -- ok --> F[MyBookingsView → StatusTracker<br/>received → vendor_assigned → in_progress → completed]
    E -- fail --> G[Inline error, booking not created]
    B --> H[ServiceCard: Share → WhatsAppShareModal → campaign link]
```

ASCII:

```
Pick society → browse ServiceCatalog → Book on ServiceCard
      → BookingModal (flat, date, slot)
      → createBooking → bookings (GK-XX-NNNNN)
      → MyBookingsView → StatusTracker timeline
Alternate: Share → WhatsAppShareModal → campaign link out
```

---

## 5. Setup & Deploy Flow (one-time / per release)

```mermaid
flowchart TD
    A[Supabase: run supabase/schema.sql<br/>fresh = whole file · existing = Section 2B] --> B[Supabase Auth: create admin user]
    B --> C[SQL editor: SELECT public.add_admin 'uuid']
    C --> D[.env: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY]
    D --> E[npm run lint → npm run build]
    E --> F[Push → Vercel deploy<br/>vercel.json SPA rewrite + env vars]
```

ASCII:

```
Run supabase/schema.sql (fresh: whole file / existing: Section 2B migration)
   → create admin user in Supabase Auth
   → SELECT public.add_admin('<auth-user-uuid>')
   → set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (local .env + Vercel)
   → npm run lint && npm run build
   → push → Vercel (SPA rewrite keeps /c/... and /campaign/... alive)
```
