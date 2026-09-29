# `src/components/resident/` — Resident Storefront & Homepage

The public web experience for Hyderabad residents: discovering doorstep home and auto services, exploring community bulk pricing, and submitting partnership applications.

## Files

| File | Role |
|------|------|
| `Hero.tsx` | Display headline, primary & secondary action CTAs, and a pinned live stat ticker marquee. |
| `StepsSection.tsx` | 01–03 numbered 3-step breakdown of hyper-local demand pooling and doorstep delivery. |
| `ServicesMarquee.tsx` | Dual-row continuous marquee of apartment service offerings with pause/play controls. |
| `ServiceCatalog.tsx` | Filterable service grid with search bar, category pill chips, and empty state fallback. |
| `ServiceCard.tsx` | 24px-radius service card with standard price vs. doorstep bulk price breakdown, booking modal trigger, and WhatsApp sharing. |
| `ComparisonSection.tsx` | Feature comparison table contrasting GK Apartment Care against random outside vendors. |
| `NetworkSection.tsx` | Hyderabad network stat cards (`25K+ Flats`, `45+ Societies`, `35% Savings`, `4.9★ Rating`) paired with an instant society/area lookup tool. |
| `AssociationTrustSection.tsx` | Verified society protocols (quiet hours, police verification, gate passes) and RWA committee testimonials. |
| `FAQSection.tsx` | Accordion FAQ addressing pooling mechanics, quiet hours, staff verification, and payment terms. |
| `ClosingCTA.tsx` | Full-bleed dark inverse section with dual pill buttons. |
| `RWAPartnershipsView.tsx` | "RWA Society Partners" tab: partnership proposal pitch + society onboarding application form. |
| `VendorOnboardingView.tsx` | "Service Providers" tab: partner benefits pitch + vendor application form. |
| `BookingModal.tsx` | Global multi-step booking modal: community selection, date/slot picker, resident details, and confirmation card. |
| `WhatsAppShareModal.tsx` | Global WhatsApp share modal: formatted society group message generator with copy/redirect actions. |
| `MyBookingsView.tsx` & `StatusTracker.tsx` | Booking lookup & visual progress timeline component. |

## Connections

- **Composed by** `src/App.tsx` on the default route (`/`) along with `PromoBar`, `Navbar`, and `Footer`.
- **Modals** (`BookingModal`, `WhatsAppShareModal`) are mounted globally at the root of `App.tsx` and driven by context state.
