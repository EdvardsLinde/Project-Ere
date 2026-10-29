# DESIGN.md — SEER

**SEER — see where your career can go.** The identity of the earlier SEER
prototype: the Saldus coat of arms (blue and gold), a blue "S" mark, warm
neutrals, and **dark mode by default** with a light-mode toggle. One recurring
object — the **diploma-style certificate** with a round seal — is the visual
idea the placement site is built around; it is always paper-white.

> Values live in `config/site.ts` (`theme.light`, `theme.dark`) and become CSS
> variables via `lib/theme-css.ts`; components use the token names, never hex.

## Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#F7F5F3` | `#0B0A09` | Page background |
| `surface` | `#FFFFFF` | `#151210` | Cards, inputs, header |
| `surface-muted` | `#EFEBE7` | `#1C1917` | Alternate sections, table heads, chips |
| `line` | `#E3DED9` | `#2A2522` | Borders and dividers |
| `ink` | `#171412` | `#F5F2EF` | Text (16.9:1 / 17.7:1 on bg) |
| `ink-muted` | `#655E58` | `#B6AFA9` | Secondary text (5.9:1 / 9.1:1) |
| `primary` | `#005DAB` | `#6CB2EC` | Links, focus ring, blue text, borders (6.1:1 / 8.7:1) |
| `primary-fill` | `#005DAB` | `#005DAB` | Button and badge fills with white text (6.7:1) |
| `primary-hover` | `#004A8A` | `#0068BD` | Hover on fills |
| `primary-soft` | `#EAF3FB` | `#0D2033` | Selected states, soft badges |
| `accent` | `#A38443` | `#B8964D` | Saldus gold: highlight buttons (with `on-accent` text), icons, hazard band |
| `accent-ink` | `#7D6326` | `#D8BD80` | Gold as text (5.2:1 / 10.8:1) |
| `accent-soft` | `#F8F4EA` | `#2A2213` | Gold-tinted backgrounds |
| `on-accent` | `#231F1E` | `#231F1E` | Text on gold (4.6:1 / 5.8:1) |
| `night` / `on-night` | `#0C0A09` / `#F5F2EF` | `#050403` / `#F5F2EF` | Always-dark surfaces: footer, company panel, phone mock |
| `success`, `warning`, `danger` (+ `-soft`) | | | Status colours, all ≥ 5:1 on their soft background |

- **Certificates are paper.** `.paper` re-applies the light tokens, so the
  certificate (and its hero miniature) look the same in both themes; printing
  is always light.
- **Inverted chips** (`bg-ink text-bg`: active language, toasts, "Finished"
  badge) flip with the theme on purpose.

## Typography

One family: **Inter Variable** (as in SEER; self-hosted via
`@fontsource-variable/inter`, includes latin-ext: ā č ē ģ ī ķ ļ ņ š ū ž). Monospace (`ui-monospace`) only for
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
- Illustration: simple geometric SVG — the certificate with double frame, orange
  corner diamonds and the round seal (`components/seal.tsx`), a
  saw-tooth factory roofline, a 24px dot grid behind the hero, and a thin
  orange/graphite **hazard band** used at most once per screen as a divider.
- Motion: 150–200ms ease-out on hover/focus; 200ms fade/slide between builder
  steps; respects `prefers-reduced-motion`.
