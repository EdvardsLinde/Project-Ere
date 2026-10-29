# DESIGN.md — SEER

**SEER — see where your career can go.** Bold & youthful: a bright off-white
page, **one strong colour** (electric blue), **one warm highlight** (sunny
yellow) and deep ink outlines. Things look like **stickers**: rounded shapes,
2px ink edges and hard offset shadows with no blur. Big, friendly headings in
Bricolage Grotesque do the shouting so the body text can stay calm and readable.
**Light mode is the default**; dark mode stays available from the header toggle.

The one formal object is the **diploma-style certificate** with its round seal.
It uses the same colours but keeps a quiet, symmetrical layout, and it is always
paper-white.

> Values live in `config/site.ts` (`theme.light`, `theme.dark`) and become CSS
> variables via `lib/theme-css.ts`; components use the token names, never hex.

## Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#FAF8F3` | `#0E0E1C` | Page background (warm off-white / ink-navy) |
| `surface` | `#FFFFFF` | `#181829` | Cards, inputs, dialogs |
| `surface-muted` | `#F0EDE4` | `#21223A` | Alternate sections, table heads, segmented controls |
| `line` | `#E2DED3` | `#2E2F4A` | Quiet dividers and input borders |
| `edge` | `#16152B` | `#5A5B80` | Sticker outlines and hard shadows: cards, buttons, header rule |
| `ink` | `#16152B` | `#F6F4EE` | Text (16.8:1 / 17.4:1 on bg) |
| `ink-muted` | `#5A5870` | `#B4B3C9` | Secondary text (6.5:1 / 9.3:1 on bg, ≥ 5.8:1 on every surface) |
| `primary` | `#2337E8` | `#9AA6FF` | Electric blue: links, focus ring, blue text (7.1:1 / 8.4:1) |
| `primary-fill` | `#2337E8` | `#3347FF` | Blue fills with white text (7.6:1 / 6.0:1) |
| `primary-hover` | `#1A2BC4` | `#4A5CFF` | Hover on blue fills |
| `primary-soft` | `#E8EBFF` | `#1C2150` | Soft badges, tags |
| `accent` | `#FFD23F` | `#FFD23F` | Sunny yellow: the main CTA, marker highlight, eyebrows, selected chips, stickers |
| `accent-ink` | `#B23E00` | `#FFD86B` | Warm text (focus-area labels, small icons) (5.0:1 on muted / 13.9:1) |
| `accent-soft` | `#FFF5D1` | `#2C2512` | Yellow-tinted panels ("our" row, QR panel) |
| `on-accent` | `#16152B` | `#16152B` | Text on yellow (12.4:1) |
| `night` / `on-night` | `#16152B` / `#FAF8F3` | `#08081A` / `#F6F4EE` | Always-dark surfaces: footer, phone mock |
| `success`, `warning`, `danger` (+ `-soft`) | | | Status colours, all ≥ 5.2:1 on their soft background |

- **One loud colour per block.** A section is either off-white with blue and
  yellow details, or a solid blue block (company benefits, closing CTA) with
  white text and yellow buttons. Never yellow text on white.
- **Certificates are paper.** `.paper` re-applies the light tokens, so the
  certificate (and its hero miniature) look the same in both themes; printing
  is always light.
- **Inverted chips** (`bg-ink text-bg`: active language, segmented tabs, toasts)
  flip with the theme on purpose.
- Focus rings are `primary`; inside `bg-night` and `bg-primary-fill` panels they
  switch to `accent` so they stay visible.

## Typography

| Family | Use | Source |
|---|---|---|
| **Bricolage Grotesque Variable** (`font-display`) | All `h1`–`h3`, big numbers, brand name, partner chips | `@fontsource-variable/bricolage-grotesque` (latin-ext: ā č ē ģ ī ķ ļ ņ š ū ž) |
| **Inter Variable** (`font-sans`) | Body, labels, buttons, tables | `@fontsource-variable/inter` (latin-ext) |
| `ui-monospace` | Certificate IDs only | system |

Headings get `font-display` automatically (`@layer base` in `app/globals.css`).

| Step | Size / line height | Weight | Use |
|---|---|---|---|
| display | clamp(2.5rem, 7vw, 4.75rem) / 1.0, tracking −0.03em | 800 | Hero headline only |
| h1 | 2rem → 3rem / 1.1 | 800 | Page titles |
| h2 | 2.1rem → 3rem / 1.05 | 800 | Section titles |
| h3 | 1.125–1.5rem / 1.3 | 800 | Card titles |
| stat | 1.65rem (phone) → 3rem | 800 display | Numbers in the stat bubbles |
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
  menus, the certificate sheet), all in the `edge` colour.
- Press feedback: buttons lift 1px on hover and sink 2px into their shadow on
  click.

## Components

- **Buttons:** pills. `accent` (yellow, ink text) is the single most important
  CTA on a screen; `primary` (blue, white text); `secondary` (white, ink
  text); all three are stickers (2px edge + hard shadow). `quiet` (text only,
  blue), `danger` (red outline), `inverse` (white outline on blue). Height 44px
  (36px small, 52px large). Disabled = 50% opacity, no pointer.
- **Links:** `primary`, underline on hover, external links get an arrow.
- **Inputs:** 44px, white, 2px `line` border that turns `edge` on focus plus the
  3px blue focus ring, `md` radius, bold label above, help text below in
  `ink-muted`, error text in `danger` with icon; `aria-invalid` +
  `aria-describedby`.
- **Choice chips** (filters, builder): pills; selected = yellow sticker
  (`accent`, edge, `shadow-card`).
- **Cards:** white, 2px `edge`, `lg` radius, `shadow-card`; clickable cards move
  up-left 2px and grow to `shadow-lift` on hover.
- **Badges:** micro type, pill. Illustrative example = `warning-soft`;
  beginner-friendly = `primary-soft`; status colours by meaning.
- **Eyebrows:** small yellow pills above section and page titles.
- **Header:** off-white, sticky, 2px `edge` bottom rule. Active nav item =
  yellow pill. Right side: theme and language pills, then the two role
  buttons (companies = secondary, students = primary) or the user menu.
- **Footer:** `night` block with a scalloped yellow edge on top and the tagline
  set huge in Bricolage Grotesque.

## Graphic devices

Use one or two per screen, never all at once.

- **Marker highlight** (`.marker`): a yellow, slightly rounded block behind
  the last part of a headline (after " — ") or a key name. Text on it is
  always `on-accent`, so it works in both themes.
- **Circles:** a big blue disc behind the hero certificate, a yellow disc
  behind the phone mock and in the closing CTA, small yellow/ink dots. Always
  outlined in `edge`, never behind running text.
- **Round sticker:** a tilted yellow disc with a short label from the
  dictionaries (the hero's "3–5 working days").
- **Stat bubbles:** the four "why now" figures are equal round bubbles in a
  row (2×2 on phones), alternating blue and yellow, each holding the number,
  a short bold label and a small "Source ↗" link.
- **Tilts:** step cards and partner chips tilt ±1–2° on large screens like
  stickers on a laptop lid. Never tilt body text blocks.
- **Dot grid** (`.bg-dots`): 22px blue dots behind the hero, the login page
  and the top of the certificate, faded out with a mask.
- **Scallop** (`.scallop`): a row of yellow half-circles along the footer top.

## Certificate

A formal, symmetrical A4 diploma: 3px ink outer frame, 2px blue inner frame,
blue dot-and-yellow-centre corner ornaments, the SEER mark, the title in
spaced Bricolage capitals, the participant's name on a thick yellow underline,
a facts table, the mentor's evaluation as blue bar rows, two signature lines
with the seal (blue ring, yellow ribbons outlined in ink) between them, and the
footer with the `SEER-2026-0001` style ID and the QR code. It prints on exactly
one A4 page, always light (`.paper` + print rules in `app/globals.css`).

## Imagery and icons

- Icons: **lucide-react**, 1.75 stroke (3 for check marks), 20px in text,
  often inside a 40–56px round sticker (blue or yellow with an `edge` outline).
- No stock photos of people, no company logos (partners appear as text chips),
  no Saldus photo.
- Logo: an electric-blue rounded tile with a white "S" and a yellow dot, the
  "eye" that sees ahead (`components/logo.tsx`, `public/icon.svg`).
- Motion: 150ms ease-out on hover/press; 200ms fade/slide between builder
  steps; nothing moves on its own. Everything respects
  `prefers-reduced-motion`.
