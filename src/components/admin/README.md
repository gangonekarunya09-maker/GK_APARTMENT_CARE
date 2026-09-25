# `src/components/admin/` — Operator Dashboard

Back-office screens for the GK Apartment Care operator. Rendered only when the URL is in the
`/admin` namespace (or `?admin=true`) **and** the user is authenticated via Supabase Auth
and allow-listed in `admin_users` (`is_admin()` RLS in `supabase/schema.sql`). Blocked with
a config-error panel when Supabase is not configured.

## Files

| File | Role |
|------|------|
| `AdminLogin.tsx` | Supabase email/password login screen. Shown by `App.tsx` while `isAdminReady` is false or unauthenticated. No demo bypass and no client sign-up — accounts are created in Supabase Auth and promoted with `public.add_admin()`. |
| `AdminDashboard.tsx` | Layout shell: mounts `AdminSidebar` (desktop + mobile drawer) and switches the main panel based on the `adminSection` context value. |
| `AdminSidebar.tsx` | Navigation with live counts for each section; logout and "Reset Demo Data" (no-op when connected to Supabase). |
| `AdminOverview.tsx` | "Dashboard" landing panel with KPI cards and recent activity. |
| `ApartmentsManager.tsx` | CRUD for communities; generates customer-portal tokens/links via `generateCustomerPortalToken` (tokens from `src/lib/ids.ts`) with awaitable mutations and inline errors; after creation shows a success banner with the origin-derived portal URL (`${window.location.origin}/c/:slug/:token`) plus Copy Link / Open Portal / Share on WhatsApp actions; drills into a community's campaigns via `CampaignDetail`. |
| `ServicesManager.tsx` | CRUD for services incl. pricing tiers (normal / community / Sunday bulk), availability, and status. |
| `CategoriesManager.tsx` | CRUD for service categories. |
| `ProvidersManager.tsx` | CRUD for verified service providers. |
| `CampaignsManager.tsx` | List of group-buying campaigns; creates campaigns and opens `CampaignDetail`; all mutations awaitable with inline error states. |
| `CampaignDetail.tsx` | Per-campaign workspace: demand counter, provider assignment, status progression (`collecting_demand` → … → `completed`). |
| `ResidentRequestsManager.tsx` | Inbox of resident interest requests raised from campaign pages. |
| `BookingsManager.tsx` | Bookings table with status transitions and vendor assignment; `BookingModal` (resident folder) also used here supports async submission with error states. |
| `DemandManager.tsx` | Cross-community demand heat view to spot services worth campaigning. |
| `WhatsAppCampaigns.tsx` | Generates/copyable WhatsApp campaign share links. |
| `AdminAnalytics.tsx` | Aggregated metrics (bookings, demand, revenue signals). |
| `ApplicationsManager.tsx` | Applications inbox (RWA + vendor) component — currently not wired into the sidebar sections. |

## Connections

- `App.tsx` renders `AdminLogin` / `AdminDashboard` for `/admin*` routes (classified by
  `src/lib/router.ts`), gated on `isAdminReady` from the context.
- `AdminDashboard` is the composition root for every other file here (switch on
  `adminSection` from `src/context/AppContext.tsx`); `CampaignsManager` and
  `ApartmentsManager` additionally render `CampaignDetail`.
- All data & mutations come from `useApp()` (`src/context/`) — every mutation returns
  `MutationResult` and surfaces failures inline instead of silently losing data. Types come
  from `src/types/`; token/ID generation from `src/lib/ids.ts`.
- Write access is enforced server-side by the `is_admin()` RLS policies in
  `supabase/schema.sql`; this UI is the friendly layer on top.
- Reuses `../common/Logo` for branding in the sidebar and login screen.
