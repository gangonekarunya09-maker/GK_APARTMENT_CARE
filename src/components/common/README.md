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
- Both import the context (`src/context/AppContext.tsx`) to drive tab navigation and the
  `societySelectorOpen` modal flag.
- `Logo` is reused across folders: `common/Navbar`, `common/Footer`, `admin/AdminSidebar`,
  `admin/AdminLogin`, and both `public/` portal pages.
- `resident/SocietySelectorModal` is the modal that `Navbar`/`Footer` open; the modal
  component is mounted globally in `src/App.tsx` and shown via the context's
  `societySelectorOpen` state (the common components only toggle the flag).
