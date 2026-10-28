# DESIGN.md — Saldus Industrial Digital Passport

Direction: **workshop, not boardroom.** Trustworthy like a safety sign and a
work permit, friendly enough for a 16-year-old. Forest green carries the
actions, signal orange marks what matters (like a safety vest in a forest),
everything else is warm off-white and graphite. One recurring object — the
**passport** with day stamps — is the visual idea the site is built around.

> Not based on comparing real reference sites (the UXKIN library was not
> reachable when this was written). Decisions follow the brief and the rules
> below. Values live in `config/site.ts` (`theme`) and are exposed as CSS
> variables in `app/globals.css`; components use the token names, never hex.

## Colour

| Token | Light value | Role |
|---|---|---|
| `bg` | `#FAF7F2` | Page background (warm white) |
| `surface` | `#FFFFFF` | Cards, inputs, header |
| `surface-muted` | `#F2EEE6` | Alternate sections, table heads, chips |
| `line` | `#E2DCD0` | Borders and dividers |
| `ink` | `#1F2421` | Body text, headings (graphite) — 14.7:1 on bg |
| `ink-muted` | `#5A615C` | Secondary text — 6.0:1 on bg |
| `primary` | `#1E5A3C` | Primary buttons (white text 8.1:1), links, focus ring |
| `primary-hover` | `#16472F` | Hover/active on primary |
| `primary-soft` | `#E6F0EA` | Selected states, soft badges with `primary` text |
| `accent` | `#F26A1B` | Signal orange: highlights, stamps, step numbers, hazard band. **Never small text on light bg** |
| `accent-ink` | `#A8430A` | Orange used as text (5.7:1 on bg) |
| `accent-soft` | `#FDEBDD` | Orange-tinted badge background (text `accent-ink`) |
| `on-accent` | `#1F2421` | Text on orange buttons (5.1:1) |
| `success` / `success-soft` | `#17663F` / `#E3F3E9` | Approved, valid certificate |
| `warning` / `warning-soft` | `#8A5A00` / `#FFF4D6` | Illustrative-example badge, pending, deadlines |
| `danger` / `danger-soft` | `#B42318` / `#FDECEA` | Errors, rejected, delete |

Dark mode: not in v1 (printable certificate and a light, paper-like feel are
core). Tokens are variables, so a dark set can be added in one place.

## Typography

One family: **Manrope Variable** (self-hosted via `@fontsource-variable/manrope`,
includes latin-ext: ā č ē ģ ī ķ ļ ņ š ū ž). Monospace (`ui-monospace`) only for
certificate IDs.

| Step | Size / line height | Weight | Use |
|---|---|---|---|
| display | clamp(2.25rem, 5vw, 3.5rem) / 1.05 | 800, tracking −0.02em | Hero headline only |
| h1 | 2.25rem / 1.15 | 800 | Page titles |
| h2 | 1.75rem / 1.2 | 800 | Section titles |
| h3 | 1.25rem / 1.3 | 700 | Card titles |
| lead | 1.125rem / 1.6 | 500 | Intro paragraphs |
| body | 1rem / 1.6 | 400–500 | Default |
| small | 0.875rem / 1.5 | 500 | Meta, help text |
| micro | 0.75rem / 1.4 | 700, uppercase, tracking 0.08em | Eyebrows, badges |

Body copy max width ~68ch.

## Spacing and layout

4px base (Tailwind scale). Common steps: 8, 12, 16, 24, 32, 48, 64, 96.
Content width `max-w-6xl` (72rem); 16px side gutter on phones, 24px from `sm`.
Sections: `py-16` mobile, `py-24` desktop. Works from 360px.

## Shape and depth

Radius: `sm` 6px (badges, inputs), `md` 10px (buttons, small cards), `lg` 16px
(cards, panels), `full` for chips. Two shadows only: `shadow-card`
(0 1px 2px rgb(31 36 33 / .06), 0 1px 1px rgb(31 36 33 / .04)) and
`shadow-lift` (0 10px 30px −12px rgb(31 36 33 / .25)) on hover/popovers.

## Components

- **Buttons:** `primary` (green, white text), `accent` (orange, graphite text —
  the single most important CTA on a screen), `secondary` (white, line border,
  ink text), `quiet` (text only, primary colour). Height 44px (40px small).
  Hover darkens; focus = 2px `primary` ring with 2px offset; disabled = 50%
  opacity, no pointer.
- **Links:** `primary`, underline on hover, external links get an arrow icon.
- **Inputs:** 44px, white, `line` border, `md` radius, label above, help text
  below in `ink-muted`, error text in `danger` with icon; `aria-invalid` +
  `aria-describedby`.
- **Cards:** white, `line` border, `lg` radius, `shadow-card`; clickable cards
  lift 2px on hover.
- **Badges:** micro type, `sm` radius. Illustrative example = `warning-soft`;
  beginner-friendly = `primary-soft`; status colours by meaning.
- **Header:** white, bottom border, sticky. Right side: two role buttons
  (companies = secondary, students = primary) → user menu when logged in.
- **Footer:** graphite (`ink`) background, off-white text, hazard band on top.

## Imagery and icons

- Icons: **lucide-react**, 1.75 stroke, 20px in text, 24px in feature tiles.
- No stock photos of people, no company logos (partners appear as text chips).
- Illustration: simple geometric SVG — the passport card with day stamps, a
  saw-tooth factory roofline, a 24px dot grid behind the hero, and a thin
  orange/graphite **hazard band** used at most once per screen as a divider.
- Motion: 150–200ms ease-out on hover/focus; 200ms fade/slide between builder
  steps; respects `prefers-reduced-motion`.
