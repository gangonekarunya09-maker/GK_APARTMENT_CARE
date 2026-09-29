# `src/components/ui/` — Design System Primitives

Reusable UI components implementing the visual language and token system (`DESIGN_SYSTEM.md`, `COMPONENTS.md`, `INTERACTIONS.md`):

| File | Component | Description & Token Usage |
|------|-----------|---------------------------|
| `Button.tsx` | `<Button />` | Full-pill buttons (`rounded-full`, h48/h56, px28) with `primary` (ink fill `#111111`), `secondary` (hairline border `#E4E0D8`), `inverse` (light fill `#FAF8F5` on dark), `accent` (`#2596be`), and `link` styles. |
| `Badge.tsx` | `<Badge />` | Full-pill labels (h28, px12) with `neutral`, `accent`, `success`, and `outline` variants for metadata and status indicators. |
| `Section.tsx` | `<Section />` | Standardized section container enforcing 1280px max-width, responsive vertical padding (64px mobile / 96px tablet / 128px desktop), and background tokens (`bg`, `surface`, `surface-alt`, `inverse`). |
| `Marquee.tsx` | `<Marquee />` | Infinite linear CSS transform marquees (left/right direction, speed presets) with pause-on-hover, accessible pause/play toggle, and `prefers-reduced-motion` compliance. |
| `StatCard.tsx` | `<StatCard />` | Large numeral anchor cards (`clamp(44px, 7vw, 88px)` display numbers) with labels, descriptions, and 24px card radii. |
| `Accordion.tsx` | `<Accordion />` | Smooth single-open accordion for FAQs with rotating indicators, hairline dividers, and accessible ARIA attributes. |

## Design Tokens (consumed via `src/index.css`)

- **Palette:** `--bg: #FAF8F5`, `--surface: #FFFFFF`, `--surface-alt: #F0EDE7`, `--ink: #111111`, `--ink-muted: #5C5A56`, `--line: #E4E0D8`, `--accent: #2596be`, `--inverse-bg: #111111`, `--inverse-ink: #FAF8F5`
- **Radii:** Pill (`9999px`), Card (`24px`), Small (`12px`)
- **Typography:** `Plus Jakarta Sans` / `Inter` / `JetBrains Mono`
