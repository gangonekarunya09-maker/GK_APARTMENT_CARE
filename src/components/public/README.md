# `src/components/public/` — Anonymous Link Pages

Full-screen pages for people arriving from shared links. They render **standalone** (no
resident Navbar/Footer, no admin chrome) and are matched directly by the URL router in
`src/lib/router.ts` / `src/App.tsx`.

## Files

| File | Role |
|------|------|
| `PublicCampaignPage.tsx` | Landing page for a group-buying campaign shared on WhatsApp. Receives the matched `campaign`, `apartment`, and `service` as **props** (loaded by `App.tsx`'s `CampaignRoute` via the scoped `fetchCampaignByToken` query), shows pricing tiers, demand progress vs. `minimumDemand`, and collects resident interest (`submitResidentInterest` from the context) with submit loading and error states. |
| `CommunityCustomerPortal.tsx` | Per-community storefront used for a community's customer portal link. Receives `apartment`, `campaigns`, `services`, and optional `residentRequests` as **props** (scoped queries from `CommunityPortalRoute` — no full-table loads), with submit loading/error handling and divide-by-zero-safe stats. Also reused inside the resident experience when `residentTab === 'community'`, where `allowLookup` can enable community lookup. |

## Connections

- **Selected by** `src/App.tsx` using `resolveRoute()`: campaign deep links (`/campaign/:token`,
  `/book/:token`, `?token=`, `/community/:slug/:service/:token`) render `PublicCampaignPage`;
  community portal links (`/c/:slug/:token`, `/c/:slug`, `?c=`, `?community=`,
  `/community-portal/:idOrSlug`) render `CommunityCustomerPortal`.
- Both routes render shared `StatusPanel` loading/error/not-found fallbacks (with Retry and
  Home actions) while the scoped Supabase queries run, and a demo/config banner when
  applicable.
- `CommunityCustomerPortal` is **also imported by** `src/App.tsx` for the resident
  "community" tab — the only component shared between the public and resident experiences;
  anonymous portal links pass `allowLookup: false` to hide community lookup.
- Data comes via props + `useApp()` from `src/context/AppContext.tsx`; types come from
  `src/types/`.
- Reuses `../common/Logo` for branding. Reads depend on the anon SELECT policies of the
  catalog tables in `supabase/schema.sql` (RLS v2) — writes go through the context
  mutations (interest submissions land in `resident_requests`, demand polls via the
  `increment_campaign_demand` RPC).
