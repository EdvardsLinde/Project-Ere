# DESIGN.md — SEER

**SEER Expo — the Saldus agriculture, forestry and logistics innovation fair.**
Bold & youthful: a bright off-white
page, **one strong colour** (forest green `#2F593E`), **one warm highlight**
(orange `#E17235`) and green-black ink outlines. Both colours come from the
"Saldus novads · Digitālā prakse" badge. Things look like **stickers**: rounded shapes,
2px ink edges and hard offset shadows with no blur. Big, friendly headings in
Bricolage Grotesque do the shouting so the body text can stay calm and readable.
**Light mode is the default**; dark mode stays available from the header toggle.

The one formal-looking object is the **expo pass** in the hero: a paper card
with a double frame, always paper-white.

> Values live in `config/site.ts` (`theme.light`, `theme.dark`) and become CSS
> variables via `lib/theme-css.ts`; components use the token names, never hex.

## Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#F8F6F1` | `#0E1712` | Page background (warm off-white / green-black) |
| `surface` | `#FFFFFF` | `#16211B` | Cards, inputs, dialogs |
| `surface-muted` | `#EEEBE3` | `#1D2B23` | Alternate sections, table heads, segmented controls |
| `line` | `#DDD9CE` | `#2B3B31` | Quiet dividers and input borders |
| `edge` | `#13241A` | `#4E6A58` | Sticker outlines and hard shadows: cards, buttons, header rule |
| `ink` | `#13241A` | `#F2F0EA` | Text (15.0:1 / 16.0:1 on bg) |
| `ink-muted` | `#4D5C52` | `#AEBBB2` | Secondary text (6.6:1 / 9.2:1 on bg, ≥ 5.9:1 on every surface) |
| `primary` | `#2F593E` | `#7FC79A` | Forest green: links, focus ring, green text (≥ 6.7:1 / 7.4:1 on every surface) |
| `primary-fill` | `#2F593E` | `#2F593E` | Green fills with white text (8.0:1) |
| `primary-hover` | `#24462F` | `#3A6B4B` | Hover on green fills (white text 10.5:1 / 6.2:1) |
| `primary-soft` | `#E6EFE8` | `#17301F` | Soft badges, tags |
| `accent` | `#E17235` | `#E17235` | Orange: the main CTA, marker highlight, eyebrows, selected chips, stickers |
| `accent-ink` | `#A84B17` | `#F2A174` | Orange as text (focus-area labels, small icons) (≥ 4.8:1 / 7.1:1) |
| `accent-soft` | `#FCEADF` | `#2E1E14` | Orange-tinted panels ("our" row, QR panel) |
| `on-accent` | `#13241A` | `#13241A` | Text on orange (5.1:1; 6.0:1 on hover) |
| `night` / `on-night` | `#13241A` / `#F8F6F1` | `#08100B` / `#F2F0EA` | Always-dark surfaces: footer, phone mock |
| `success`, `warning`, `danger` (+ `-soft`) | | | Status colours, all ≥ 5.3:1 on their soft background |

- **One loud colour per block.** A section is either off-white with green
  and orange details, or a solid green block (company benefits, closing CTA)
  with white text and orange buttons. Never `accent` orange as text on white
  (use `accent-ink`), and never white text on orange (use `on-accent`).
- **The pass is paper.** `.paper` re-applies the light tokens, so the hero's
  expo pass looks the same in both themes; printing is always light.
- **Inverted chips** (`bg-ink text-bg`: active language, segmented tabs, toasts)
  flip with the theme on purpose.
- Focus rings are `primary`; inside `bg-night` and `bg-primary-fill` panels they
  switch to `accent` so they stay visible.

## Typography

| Family | Use | Source |
|---|---|---|
| **Bricolage Grotesque Variable** (`font-display`) | All `h1`–`h3`, big numbers, brand name, partner chips | `@fontsource-variable/bricolage-grotesque` (latin-ext: ā č ē ģ ī ķ ļ ņ š ū ž) |
| **Inter Variable** (`font-sans`) | Body, labels, buttons, tables | `@fontsource-variable/inter` (latin-ext) |

Headings get `font-display` automatically (`@layer base` in `app/globals.css`).

| Step | Size / line height | Weight | Use |
|---|---|---|---|
| display | clamp(2.5rem, 7vw, 4.75rem) / 1.0, tracking −0.03em | 800 | Hero headline only |
| h1 | 2rem → 3rem / 1.1 | 800 | Page titles |
| h2 | 2.1rem → 3rem / 1.05 | 800 | Section titles |
| h3 | 1.125–1.5rem / 1.3 | 800 | Card titles |
| stat | 2.2rem (phone) → 3.2rem | 800 display | Numbers in the fact bubbles |
| lead | 1.125rem / 1.6 | 400 | Intro paragraphs |
| body | 1rem / 1.6 | 400–500 | Default |
| small | 0.875rem / 1.5 | 500 | Meta, help text |
| micro | 0.75rem / 1.4 | 700, uppercase, tracking 0.08em | Eyebrow pills, badges |

Body copy max width ~60ch. Labels are bold (700) so forms read at a glance.

## Spacing and layout

4px base (Tailwind scale). Common steps: 8, 12, 16, 24, 32, 48, 64, 96.
Content width `max-w-6xl` (72rem); 16px side gutter on phones, 24px from `sm`.
Sections: `py-16` mobile, `py-24` desktop, separated by 2px `edge` rules or a
colour change. Works from 360px with no sideways scroll (decorative shapes sit
inside `overflow-hidden` sections).

## Shape and depth

- Radius: `sm` 8px, `md` 14px (inputs, notices, tiles), `lg` 22px (cards,
  panels, dialogs), `full` for buttons, chips, badges, nav items and tabs.
- Outlines: 2px `edge` on cards, buttons, dialogs, menus, the header bottom.
- Shadows are **hard offsets, no blur**: `shadow-card` 3px 3px, `shadow-pop`
  4px 4px (button hover), `shadow-lift` 6px 6px (feature panels, dialogs,
  menus), all in the `edge` colour.
- Press feedback: buttons lift 1px on hover and sink 2px into their shadow on
  click.

## Components

- **Buttons:** pills. `accent` (orange, ink text) is the single most important
  CTA on a screen; `primary` (green, white text); `secondary` (white, ink
  text); all three are stickers (2px edge + hard shadow). `quiet` (text only,
  green), `danger` (red outline), `inverse` (white outline on green). Height 44px
  (36px small, 52px large). Disabled = 50% opacity, no pointer.
- **Links:** `primary`, underline on hover, external links get an arrow.
- **Inputs:** 44px, white, 2px `line` border that turns `edge` on focus plus the
  3px green focus ring, `md` radius, bold label above, help text below in
  `ink-muted`, error text in `danger` with icon; `aria-invalid` +
  `aria-describedby`.
- **Choice chips** (form options): pills; selected = orange sticker
  (`accent`, edge, `shadow-card`).
- **Cards:** white, 2px `edge`, `lg` radius, `shadow-card`; clickable cards move
  up-left 2px and grow to `shadow-lift` on hover.
- **Badges:** micro type, pill. "PIEMĒRS" (example) = `warning-soft` with a
  flask icon; "participation not yet confirmed" = neutral; "looking for
  investment" = `primary-soft`; statuses by meaning (submitted/pending =
  warning, approved/accepted = success, rejected/declined = danger).
- **Eyebrows:** small orange pills above section and page titles.
- **Header:** off-white, sticky, 2px `edge` bottom rule. Menu items depend on
  the role (none, exhibitor, innovator, investor, school); active item =
  orange pill. Right side: theme and language pills, then the role menu
  ("Choose a role" button, or the current role with switch / leave options).
- **Role buttons:** the four "who are you?" buttons on the landing page,
  closing CTA and empty dashboard; company = accent (the main CTA), investor =
  primary, innovator and school = secondary.
- **Stand map** (`components/fair/stand-map.tsx`): a 6-column grid, L = 2×2,
  M = 2×1, S = 1×1 tiles; free = white, reserved = orange with a clock icon,
  sold = green with a lock icon (never colour alone); innovator zone and
  entrance below; free tiles are links (stands page) or a picker (booking form).
- **Cards:** exhibitor, showcase and challenge cards share the card style; the
  booking form shows the exhibitor card as a live preview in a dashed frame.
- **Footer:** `night` block with a scalloped orange edge on top and the tagline
  set huge in Bricolage Grotesque.

## Graphic devices

Use one or two per screen, never all at once.

- **Marker highlight** (`.marker`): an orange, slightly rounded block behind
  the last part of a headline (after " — ") or a key name. Text on it is
  always `on-accent`, so it works in both themes.
- **Circles:** a big green disc behind the hero's expo pass, an orange disc in
  the hero corner and in the closing CTA. Always
  outlined in `edge`, never behind running text.
- **Round sticker:** a tilted orange disc with a short label from the
  dictionaries (the hero's "3 days").
- **Fact bubbles:** four equal round bubbles in a row (2×2 on phones),
  alternating green and orange, each holding a number and a short bold label
  (days, sectors, formats, visit day). No statistics without a source.
- **Nature × digital illustrations** (`components/nature.tsx`): Saldus is
  farming and forest country, and SEER brings IT, AI and cybersecurity to it.
  Four hand-drawn SVG motifs in the theme colours with the same ink edge:
  `PineBranch` (forestry, with an orange cone), `WheatEar` (agriculture),
  `LeafSprig` (a green/orange leafy twig) and `CircuitLeaf` (a leaf whose
  veins are circuit traces with round nodes: nature meets technology). Used in
  the hero corners, beside section titles, under the FAQ title and in the
  closing CTA; always `aria-hidden`, never behind running text,
  most of them hidden below `lg` to keep phones calm.
- **Tilts:** sector and fair-part cards tilt ±1–2° on large screens like
  stickers on a laptop lid. Never tilt body text blocks.
- **Dot grid** (`.bg-dots`): 22px green dots behind the hero, faded out with a
  mask.
- **Scallop** (`.scallop`): a row of orange half-circles along the footer top.

## Expo pass

The hero's paper card (`components/expo-illustration.tsx`): 3px ink outer
frame, 2px green inner frame, green dot-and-orange-centre corner ornaments,
"SEER EXPO" in spaced Bricolage capitals, the three sectors on a thick orange
underline, a mini stand map and the "dates and venue to be confirmed" line from
`config/event.ts`. Decorative (`aria-hidden`).

## Imagery and icons

- Icons: **lucide-react**, 1.75 stroke (3 for check marks), 20px in text,
  often inside a 40–56px round sticker (green or orange with an `edge` outline).
- No stock photos of people, no company logos (exhibitors upload their own),
  no Saldus photo. Nature and technology are drawn, not photographed (see the
  nature × digital illustrations above).
- Logo: a forest-green rounded tile with a white "S" and an orange dot, the
  "eye" that sees ahead (`components/logo.tsx`, `public/icon.svg`).
- Motion: 150ms ease-out on hover/press; 200ms fade/slide when switching agenda
  days; nothing moves on its own. Everything respects
  `prefers-reduced-motion`.
