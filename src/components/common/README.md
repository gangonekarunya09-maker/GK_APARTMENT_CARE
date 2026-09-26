# `src/components/common/` — Shared Chrome

Small, app-wide UI pieces used by multiple audiences.

## Files

| File | Role |
|------|------|
| `Logo.tsx` | Brand mark component, parameterizable by size/variant. |
| `Navbar.tsx` | Top navigation for the resident experience: switches `residentTab` (services / community / my-bookings / RWA / vendor) via the context, and opens the society selector. |
| `Footer.tsx` | Site footer with quick links, society-selector trigger, and contact info. |

## Connections

- `Navbar` and `Footer` are rendered by `src/App.tsx` around the resident views only —
  the `public/` portal pages render their own minimal headers, and the `admin/` dashboard
  uses `AdminSidebar` instead.
- Both import the context (`src/context/AppContext.tsx`) to drive tab navigation.
- `Logo` is reused across folders: `common/Navbar`, `common/Footer`, `admin/AdminSidebar`,
  `admin/AdminLogin`, and both `public/` portal pages.
- `resident/SocietySelectorModal` is no longer mounted: the root website has no
  community-selection gate, and community entry is via explicit /c/:slug/:token portal
  links. (The modal component and its context state remain available but unused.)
