# `src/components/` — React UI Layer

All presentational and interactive components, organized by domain and audience. Data and mutations are consumed from **`src/context/AppContext.tsx`** via the `useApp()` hook.

## Sub-folders

| Folder | Audience | Contents |
|--------|----------|----------|
| `ui/` | Reusable Primitives | Foundation tokens & design system primitives: `Button`, `Badge`, `Section`, `Marquee`, `StatCard`, `Accordion`. → `ui/README.md` |
| `common/` | Global Chrome | Shared layout components: `Navbar`, `PromoBar`, `Footer`, `Logo`. → `common/README.md` |
| `resident/` | Public Website & Residents | Homepage sections (`Hero`, `StepsSection`, `ServicesMarquee`, `ServiceCatalog`, `ComparisonSection`, `NetworkSection`, `AssociationTrustSection`, `FAQSection`, `ClosingCTA`), RWA partnership proposals, vendor partner onboarding, and global modals (`BookingModal`, `WhatsAppShareModal`). → `resident/README.md` |
| `public/` | Gated Community Link Visitors | Scoped customer portals: `CommunityCustomerPortal` (tabbed **Services & Bulk Pools** + **Track Orders & Bookings**) and `PublicCampaignPage` (WhatsApp campaign group-buying links). → `public/README.md` |
| `admin/` | Platform Operators | Admin operations hub: Supabase authentication, dashboard overview, and 12 dedicated resource managers. → `admin/README.md` |

## Connections

- **Rendered by** `src/App.tsx`, which classifies the URL via `src/lib/router.ts`.
- **Styling:** Tailwind CSS 4 with CSS variables defined in `src/index.css`.
- **Icons & Motion:** `lucide-react` for stroke icons and `motion/react` for layout and reveal animations.
