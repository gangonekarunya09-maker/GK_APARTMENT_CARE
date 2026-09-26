# `src/components/` — React UI Layer

All presentational and interactive components, organized by audience. Every component that
needs data or actions pulls them from **`src/context/AppContext.tsx`** via the `useApp()`
hook — components never hold domain state of their own.

## Sub-folders

| Folder | Audience | Contents |
|--------|----------|----------|
| `admin/` | Platform operators | Operator dashboard: Supabase-only login, sidebar, and 10+ resource managers (communities, services, categories, providers, campaigns, requests, bookings, demand, WhatsApp, analytics). → `admin/README.md` |
| `common/` | Everyone | Shared chrome: `Navbar`, `Footer`, `Logo`. → `common/README.md` |
| `public/` | Anonymous link visitors | Standalone portal pages rendered *without* the resident shell: `PublicCampaignPage` (WhatsApp campaign links) and `CommunityCustomerPortal` (per-community portal). Both receive **scoped data via props** and render loading/error states. → `public/README.md` |
| `resident/` | Residents | The main storefront: hero, service catalog + cards, booking flow, WhatsApp sharing, bookings tracker, RWA partnership and vendor onboarding forms, mobile CTA, society selector. → `resident/README.md` |

## Connections

- **Rendered by** `src/App.tsx`, which classifies the URL with `src/lib/router.ts` and picks
  between the `public/` pages, the `admin/` dashboard, and the `resident/` storefront.
- **Depend on** `src/context/` for all data and mutations (now awaitable
  `MutationResult` calls with inline error handling) and `src/types/` for domain models.
- **Cross-folder reuse** is minimal by design: `public/` and `admin/` screens import
  `common/Logo`, and the root app composes `common/Navbar`, `common/Footer` and the global
  modals (`resident/BookingModal`, `resident/WhatsAppShareModal`) around `resident/` views.
- Internal composition examples: `resident/ServiceCatalog` renders `resident/ServiceCard`;
  `resident/MyBookingsView` renders `resident/StatusTracker`; `admin/AdminDashboard` renders
  every other `admin/*` manager by section; `admin/CampaignsManager` and
  `admin/ApartmentsManager` both drill into `admin/CampaignDetail`.
- Styling is Tailwind CSS 4 classes only (imported once in `src/index.css`); animation uses
  the `motion/react` package and icons come from `lucide-react`.
