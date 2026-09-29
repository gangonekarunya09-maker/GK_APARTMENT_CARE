# `src/data/` — Demo Seed Data

## Files

| File | Role |
|------|------|
| `mockData.ts` | Exports the `INITIAL_*` seed arrays: `INITIAL_APARTMENTS`, `INITIAL_CATEGORIES`, `INITIAL_PROVIDERS`, `INITIAL_SERVICES`, `INITIAL_CAMPAIGNS`, `INITIAL_RESIDENT_REQUESTS`, `INITIAL_BOOKINGS`, `INITIAL_RWA_APPLICATIONS`, `INITIAL_VENDOR_APPLICATIONS`. Currently all empty — the app starts clean. |

## Purpose

These arrays are the **demo dataset** for running without a backend. When Supabase is not
configured (missing or placeholder `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`),
`src/context/AppContext.tsx` hydrates its state from here and `dataStatus` becomes `'demo'`.
State is kept **in memory only** — nothing is written to `localStorage` — so changes are lost
on reload by design. In Supabase mode these seeds are never used, and the admin sidebar's
"Reset Demo Data" action (`resetToDemoData()`) is a no-op there.

## Connections

- **Consumed by** `src/context/AppContext.tsx` only (demo-mode hydration and
  `resetToDemoData`).
- **Typed by** `src/types/index.ts` — each `INITIAL_*` array is typed with the matching
  domain interface, so any seed added here is compile-checked against the schema.
- **Mirrors** the tables in `supabase/schema.sql` one-to-one.
