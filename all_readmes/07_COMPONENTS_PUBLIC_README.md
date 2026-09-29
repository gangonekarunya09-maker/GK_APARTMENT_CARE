# `src/components/public/` — Scoped Community Portals & Campaign Links

Dedicated pages for residents arriving via society portal links (`/c/:slug/:token`) or WhatsApp campaign deep links (`/campaign/:token`).

## Files

| File | Role |
|------|------|
| `CommunityCustomerPortal.tsx` | Per-community resident service portal. Features an isolated header and community banner with security app verification, plus a tabbed view switcher: <br/>1. **Services & Bulk Pools:** Lists active campaigns, bulk discount progress meters, and "Join Community Bulk Pool" interest registration. <br/>2. **Track Orders & Bookings:** Society-scoped order tracker with live search, status badges, 4-step progress timeline (`Received` → `Assigned` → `In Progress` → `Completed`), gate pass clearance status, and direct WhatsApp operations assistance. |
| `PublicCampaignPage.tsx` | Single campaign landing page for WhatsApp group-buying links. Displays live flat demand counter, discount pricing slabs, and interest submission form. |

## Connections

- Rendered standalone by `src/App.tsx` via `resolveRoute()`.
- Data is scoped strictly to the requested community or campaign token.
