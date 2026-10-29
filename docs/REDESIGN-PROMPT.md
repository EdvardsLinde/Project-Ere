# Prompt: try a different look for SEER (keep every function)

Paste everything below the line into a new Claude Code chat that has access to
the `EdvardsLinde/Project-Ere` repository. Replace the `[NEW LOOK]` paragraph
with the look you want to try (or pick one of the two examples).

---

You are redesigning an existing, working website. **Change how it looks, not what it does.**

**Repository:** `EdvardsLinde/Project-Ere`. Start from branch `claude/upbeat-rubin-4nld1n` (the current version) and create a **new branch** for this redesign, e.g. `claude/seer-redesign-b`. Never push to `claude/upbeat-rubin-4nld1n`; it is the version we compare against.

**What the site is:** SEER, a site for 3–5 day digital placements at companies in Saldus municipality, Latvia, for 15–24-year-olds. Students find a placement and apply. Companies publish placements with a 7-step builder and approve applicants. After the placement, the company rates the student and issues a diploma-style certificate with a QR code that anyone can verify. Latvian is the default language, with an English toggle. Read `README.md` and `DESIGN.md` first.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, lucide-react. Demo data lives in localStorage via `lib/data/`.

**[NEW LOOK] — describe the direction here.** Two examples to pick from or mix:
- *A. Bold & youthful:* bright off-white background, one strong colour (e.g. electric blue or green) with a warm highlight, big friendly headings, rounded shapes, playful but readable. Light mode default.
- *B. Calm & premium:* lots of white space, a refined serif for headings with a clean sans for text, muted deep colour (e.g. navy or forest) with a thin gold or copper accent, quiet animations. Light mode default.

**Where the design lives (change these):**
- `config/site.ts` → `theme.light` / `theme.dark` colour tokens, `defaultTheme`
- `app/globals.css` → fonts, radius, shadows, dot pattern, hazard band
- `lib/theme-css.ts` → how tokens become CSS variables (light, dark, `.paper`, print)
- `components/ui/*` (buttons, form fields, cards, badges, dialog), `components/site-header.tsx`, `components/site-footer.tsx`
- `app/page.tsx` (home page layout and sections), `components/certificate-illustration.tsx`
- `components/certificate-sheet.tsx`, `components/seal.tsx`, `components/logo.tsx` (certificate look; keep it a formal, diploma-style document)
- `DESIGN.md` → rewrite it for the new direction

**Do not change:** routes, the data layer (`lib/data/`), business rules (`lib/placements.ts`, `lib/builder.ts`), what pages do, and the wording in `messages/lv.ts` / `messages/en.ts`, unless a new layout needs a short new label. Then add it to both files.

**Rules:**
- All UI text comes from `messages/lv.ts` and `messages/en.ts` (never hard-coded). The font must support Latvian letters (ā č ē ģ ī ķ ļ ņ š ū ž).
- Text contrast at least 4.5:1 in every theme you keep. If you drop dark mode, remove the toggle cleanly.
- Works at 360 px width with no sideways scrolling. Keyboard focus is always visible.
- No stock photos of people, no company logos, no Saldus photo.
- The certificate stays on one A4 page when printed, always light, and keeps the QR code and the `SEER-2026-0001` style ID.
- Keep the "Ilustratīvs piemērs" (illustrative example) badges and the notice that the sample companies haven't confirmed.

**Check before you finish:**
1. `npm install`, then `npm run build` and `npm run lint` with no errors.
2. Click through the full flow: register a company → create and publish a placement with the builder → log out → register a student → find it in the catalogue → apply → company approves → marks it completed with an evaluation → the student sees the certificate → the ID verifies on `/parbaudit`. Demo accounts: `demo@uznemums.lv` / `demo1234` and `demo@skolens.lv` / `demo1234`.
3. Check the home page, catalogue, a placement page, the builder and the certificate at desktop and phone width.

**Deliver:**
- Commit and push to your new branch.
- Build a clickable preview with `npm run build:artifact -- <scratchpad>/seer-b.html` and publish that file as an artifact so I can try it next to the current version.
- Tell me in a few lines what you changed and why it fits the direction.
