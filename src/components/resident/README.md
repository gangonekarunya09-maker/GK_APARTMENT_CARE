# `src/components/resident/` — Resident Storefront

The default public experience for residents: browsing services, booking them, tracking
bookings, and onboarding flows for RWAs and vendors.

## Files

| File | Role |
|------|------|
| `Hero.tsx` | Landing hero with value props and CTA buttons (scroll to catalog / open booking modal). |
| `ServiceCatalog.tsx` | Filterable service grid for the selected community; renders `ServiceCard` per service; category filters + search. |
| `ServiceCard.tsx` | Single service tile: pricing tiers (normal / community / Sunday bulk), demand badge, "Book" (opens `BookingModal` via context) and "Share" (opens `WhatsAppShareModal`) actions. |
| `BookingModal.tsx` | Global booking dialog mounted once in `App.tsx`; driven by `bookingModalService` context state. Collects flat/date/slot details and calls `createBooking`, awaiting the `MutationResult` to show submit loading and an inline error on failure. Also reused by `admin/BookingsManager`. |
| `WhatsAppShareModal.tsx` | Global share dialog mounted once in `App.tsx`; driven by `shareModalService` state; builds WhatsApp share links for campaigns. |
| `MyBookingsView.tsx` | "My bookings" tab: lists the resident's bookings, renders `StatusTracker` per booking. |
| `StatusTracker.tsx` | Visual timeline of a booking's lifecycle (`received → vendor_assigned → in_progress → completed`) with provider contact actions. |
| `TrustSection.tsx` | Static trust/safety marketing section under the catalog. |
| `RWAPartnershipsView.tsx` | "RWA" tab: partnership pitch + `submitRWAApplication` form (awaitable mutation with error handling). |
| `VendorOnboardingView.tsx` | "Vendor" tab: onboarding pitch + `submitVendorApplication` form (awaitable mutation with error handling). |
| `MobileStickyCTA.tsx` | Fixed bottom call-to-action on mobile; opens the booking modal for the featured service. |
| `SocietySelectorModal.tsx` | Community picker modal; toggled by `societySelectorOpen` context state. **Not currently mounted anywhere** — the root website has no community-selection gate (community entry is via explicit /c/:slug/:token links). |

## Connections

- **Composed by** `src/App.tsx` inside the default resident route: `Navbar` (common) +
  tab-conditional views (`ServiceCatalog`/`Hero`/`TrustSection`, `MyBookingsView`,
  `RWAPartnershipsView`, `VendorOnboardingView`, `CommunityCustomerPortal` from `public/`)
  + `Footer` + the global modals `BookingModal` and `WhatsAppShareModal`.
- Internal composition: `ServiceCatalog → ServiceCard`; `MyBookingsView → StatusTracker`.
- All data/actions come from `useApp()` (`src/context/AppContext.tsx`): services, categories,
  campaigns, bookings, modal setters, and the awaitable `MutationResult` mutations
  (`createBooking`, `submitRWAApplication`, `submitVendorApplication`, …) that surface
  loading and errors inline.
- Types from `src/types/` (`Service`, `Booking`, `BookingStatus`, …). Icons via
  `lucide-react`, animation via `motion/react`.
