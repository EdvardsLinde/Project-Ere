# DESIGN.md — SEER

**SEER Expo — the Saldus agriculture, forestry and logistics innovation fair.**
Calm and confident, like a serious trade fair: a warm off-white page, **one
strong colour** (forest green `#2F593E`), **one warm highlight** (orange
`#E17235`), thin soft outlines and low, soft shadows. Both colours come from the
"Saldus novads · Digitālā prakse" badge. The one picture is the **key visual**,
Saldus seen from above. Big Bricolage Grotesque headings carry the personality,
so everything around them can stay quiet. **Light mode is the default**; dark
mode stays available from the header toggle.

> Values live in `config/site.ts` (`theme.light`, `theme.dark`) and become CSS
> variables via `lib/theme-css.ts`; components use the token names, never hex.

## Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#F8F6F1` | `#0E1712` | Page background (warm off-white / green-black) |
| `surface` | `#FFFFFF` | `#16211B` | Cards, inputs, dialogs |
| `surface-muted` | `#EEEBE3` | `#1D2B23` | Alternate sections, table heads, segmented controls |
| `line` | `#DDD9CE` | `#2B3B31` | Dividers, section rules, input borders |
| `edge` | `#D2CDBF` | `#33463A` | Card and panel outlines (1px) |
| `ink` | `#13241A` | `#F2F0EA` | Text (15.0:1 / 16.0:1 on bg) |
| `ink-muted` | `#4D5C52` | `#AEBBB2` | Secondary text (6.6:1 / 9.2:1 on bg, ≥ 5.9:1 on every surface) |
| `primary` | `#2F593E` | `#7FC79A` | Forest green: links, eyebrows, numbers, focus ring (≥ 6.7:1 / 7.4:1 on every surface) |
| `primary-fill` | `#2F593E` | `#2F593E` | Green fills with white text (8.0:1) |
| `primary-hover` | `#24462F` | `#3A6B4B` | Hover on green fills |
| `primary-soft` | `#E6EFE8` | `#17301F` | Icon discs, active nav item, soft badges |
| `accent` | `#E17235` | `#E17235` | Orange: the one main button per screen, the dot after the name, the road in the key visual |
| `accent-ink` | `#A84B17` | `#F2A174` | Orange as text or small icons (≥ 4.8:1 / 7.1:1) |
| `accent-soft` | `#FCEADF` | `#2E1E14` | Orange-tinted panels |
| `on-accent` | `#13241A` | `#13241A` | Text on orange (5.1:1) |
| `night` / `on-night` | `#13241A` / `#F8F6F1` | `#08100B` / `#F2F0EA` | Always-dark surfaces: footer; outlines and light points in the key visual |
| `land-*` | | | Field colours of the key visual: `crop` + `row`, `forest` + `moss`, `meadow`, `wheat` + `straw` (dimmer in dark mode) |
| `success`, `warning`, `danger` (+ `-soft`) | | | Status colours, all ≥ 5.3:1 on their soft background |

- **Orange is rare.** One orange button per screen (the main action), the dot
  after "SEER Expo" and the road in the key visual. Labels, icons and numbers
  are green. Never `accent` orange as text on white (use `accent-ink`), and
  never white text on orange (use `on-accent`).
- **One solid block at a time.** A section is off-white or `surface-muted`;
  only the investor panel and the closing call to action are solid green.
- **Printing is always light.**
- Focus rings are `primary`; inside `bg-night` and `bg-primary-fill` panels they
  switch to `accent` so they stay visible.

## Typography

| Family | Use | Source |
|---|---|---|
| **Bricolage Grotesque Variable** (`font-display`) | All `h1`–`h3`, big numbers, brand name | `@fontsource-variable/bricolage-grotesque` (latin-ext: ā č ē ģ ī ķ ļ ņ š ū ž) |
| **Inter Variable** (`font-sans`) | Body, labels, buttons, tables | `@fontsource-variable/inter` (latin-ext) |

Headings get `font-display` automatically (`@layer base` in `app/globals.css`).
The link preview image uses static Bricolage files from `@fontsource/bricolage-grotesque`.

| Step | Size / line height | Weight | Use |
|---|---|---|---|
| display | clamp(3rem, 9vw, 5.75rem) / 0.92, tracking −0.035em | 800 | Hero name only |
| h1 | 2rem → 3rem / 1.1 | 800 | Page titles |
| h2 | 2rem → 2.75rem / 1.05 | 800 | Section titles |
| h3 | 1.125–1.5rem / 1.3 | 800 | Card titles |
| stat | 2.4rem → 3rem | 800 display, green | Numbers in the facts strip |
| lead | 1.125rem / 1.6 | 400 | Intro paragraphs |
| body | 1rem / 1.6 | 400–500 | Default |
| small | 0.875rem / 1.5 | 500 | Meta, help text |
| micro | 0.75rem / 1.4 | 700, uppercase, tracking 0.14em | Eyebrows (green text), badges |

Body copy max width ~60ch. Labels are bold (700) so forms read at a glance.

## Spacing and layout

4px base (Tailwind scale). Common steps: 8, 12, 16, 24, 32, 48, 64, 96.
Content width `max-w-6xl` (72rem); 16px side gutter on phones, 24px from `sm`.
Sections: `py-16` mobile, `py-24` desktop, separated by a 1px `line` rule or a
change to `surface-muted`. Works from 360px with no sideways scroll.

## Shape and depth

- Radius: `sm` 8px, `md` 14px (inputs, notices, tiles), `lg` 20px (cards,
  panels, dialogs), `full` for buttons, chips, badges, nav items and tabs.
- Outlines: 1px `edge` on cards, panels, dialogs and menus; 1px `line` for
  rules and dividers.
- Shadows are **soft and low**: `shadow-card` for raised panels, `shadow-pop`
  for hover, `shadow-lift` for menus and dialogs. Most cards have no shadow.
- No tilts, no hard offset shadows, no thick ink outlines.

## Components

- **Buttons:** pills. `accent` (orange, ink text) is the single most important
  action on a screen; `primary` (green, white text); `secondary` (thin ink
  outline, transparent); `quiet` (text only, green); `danger` (red outline);
  `inverse` (white outline on green). Height 44px (36px small, 52px large).
  They sink 1px on click. Disabled = 50% opacity, no pointer.
- **Links:** `primary`, underline on hover, external links get an arrow.
- **Inputs:** 44px, white, `line` border that turns `edge` on focus plus the
  3px green focus ring, `md` radius, bold label above, help text below in
  `ink-muted`, error text in `danger` with icon; `aria-invalid` +
  `aria-describedby`.
- **Choice chips** (form options): pills; selected = orange.
- **Cards:** white, 1px `edge`, `lg` radius; clickable cards get `shadow-pop`
  on hover.
- **Icon discs:** a 44–56px `primary-soft` circle with a green icon.
- **Badges:** micro type, pill. "PIEMĒRS" (example) = `warning-soft` with a
  flask icon; "participation not yet confirmed" = neutral; "looking for
  investment" = `primary-soft`; statuses by meaning (submitted/pending =
  warning, approved/accepted = success, rejected/declined = danger).
- **Eyebrows:** small uppercase green text above section and page titles (no pill).
- **Header:** off-white, sticky, 1px `line` bottom rule. Menu items depend on
  the role (none, exhibitor, innovator, investor, school); active item = soft
  green pill. Right side: theme and language toggles, then the role menu
  ("Choose a role" button, or the current role with switch / leave options).
- **Hero:** eyebrow (Saldus · days · dates and venue), the name huge with
  "Expo" in green and an orange dot, the subtitle, the lead, then one orange
  button (company: book a stand), one outlined button (investor) and two
  underlined links (innovator, school team). The key visual with its legend
  sits on the right (below on phones).
- **Facts strip:** four numbers from `config/event.ts` (days, paid stands,
  free innovator places, smallest stand price) between thin rules, 2×2 on phones.
- **Role buttons** (closing call to action, empty dashboard): the same four
  roles as a 2×2 grid; on green, the non-orange ones are `inverse`.
- **Stand map** (`components/fair/stand-map.tsx`): a 6-column grid, L = 2×2,
  M = 2×1, S = 1×1 tiles; free = white with a green outline, reserved = orange
  with a clock icon, sold = green with a lock icon (never colour alone);
  innovator zone and entrance below; free tiles are links (stands page) or a
  picker (booking form).
- **Lists instead of cards** where items are read, not clicked ("why Saldus",
  FAQ): rows between thin rules.
- **Footer:** `night` block with the tagline set huge in Bricolage Grotesque.

## Key visual

`components/key-visual.tsx`, geometry in `lib/key-visual.ts`, markup in
`lib/key-visual-svg.ts`. Saldus from above: jittered field parcels with crop
rows (agriculture), tree crowns (forestry), meadows and stubble; an orange road
along the field corners (logistics); linked points on the road (innovation),
with dashed links to nearby fields. It is seeded, so it is the same picture
every time (`seed` 1 in the hero); change the seed to get a different
arrangement. The road's dashes move slowly and one point pulses, both off with
`prefers-reduced-motion`. It follows the theme through the `land-*` tokens and
is always `aria-hidden`; the legend under it names the sectors.

The same drawing makes the **link preview image** (`app/opengraph-image.tsx`,
1200×630, built at build time): name, LV and EN subtitle, dates line, and the
visual on the right.

## Imagery and icons

- Icons: **lucide-react**, 1.75 stroke (3 for check marks), 20px in text,
  often inside a `primary-soft` icon disc.
- No stock photos of people, no company logos (exhibitors upload their own),
  no Saldus photo. The key visual is the only illustration.
- Logo: a forest-green rounded tile with a white "S" and an orange dot, the
  "eye" that sees ahead (`components/logo.tsx`, `public/icon.svg`).
- Motion: 150ms ease-out on hover/press; 200ms fade/slide when switching agenda
  days; the key visual's road and one point. Everything respects
  `prefers-reduced-motion`.
