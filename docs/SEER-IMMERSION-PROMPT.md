# Prompt for Claude Code: build "SEER — Saldus Industrial Digital Immersion"

> **This replaces the old career-discovery pages** (skills test, career paths, courses, jobs, people, news, search, onboarding) with the immersion model below. **Keep** the SEER design system, logo, layout shell and EN/LV i18n setup. **Remove** the old feature pages, routes, data and strings (git history keeps them; do not leave a hybrid). Work on the current branch, commit in small steps, and run `npm test` and `npm run build` before every commit.

---

## 1. What SEER is now

SEER connects **young people aged 15–24 in the Saldus region** (school pupils and Saldus Tehnikums students) with **real local industrial companies** for **3–5 day digital work placements called "immersions"** (LV: *"iegremdēšanās prakse"* — short label in UI: **"Prakse"**).

During an immersion a student comes into a company, solves **real, low-risk digital micro-tasks** inside the company's actual systems (sensor data, quality checklists, basic cybersecurity checks, GPS logs, dashboards), gets **feedback from a company mentor**, and earns an **Industrial Digital Passport** (LV: **"Industriālā digitālā pase"**) — a certificate that the local companies themselves recognise.

- **For students:** real experience with industrial systems, mentor feedback, a recognised certificate, a path into local tech jobs, a reason to stay in Saldus.
- **For companies:** see and evaluate future employees before hiring, get small real tasks done, strengthen their employer brand locally, far cheaper than a wrong hire or an external consultant.

Tagline stays: **"SEER — see where your career can go."** / **"Ieraugi, kur var aizvest tava karjera"**. Product subtitle: **"Saldus Industrial Digital Immersion"** / **"Saldus industriālā digitālā prakse"**.

---

## 2. Keep / remove

**Keep and reuse (do not redesign):**
- `src/index.css` theme: black-and-orange, **dark mode default**, light mode toggle; colour tokens (page `slate-50` #0b0a09 dark / #f7f5f3 light, cards `card`, primary `brand-600` #c2410c with white text, accent `accent-500` #ff7a1a with near-black text, links `brand-700`). Keep WCAG contrast ≥ 4.5:1 for text in both themes.
- `src/components/Brand.tsx` (orange "S" tile + **SEER**), `public/favicon.svg`.
- `src/components/Layout.tsx` header/footer shell (website-style top navigation, theme toggle, LV/EN toggle, hamburger on phones), `ui.tsx` (Button, Card, Chip, Meter, Pill, PageHeader), `Modal.tsx`, `FilterBar.tsx`.
- `src/lib/state.tsx` pattern: one `AppProvider`/`useApp()` context, localStorage persistence wrapped in try/catch, router (BrowserRouter; HashRouter when `import.meta.env.MODE === 'artifact'`), the `vite.config.ts` artifact mode that inlines images.
- i18n: `src/i18n/lv.ts` is the source of truth (`Dict = typeof lv`), `en.ts` must match; content data uses `{ lv, en }`. **No hard-coded visible text anywhere.**
- The Saldus town-square photo `src/assets/saldus/square.webp` for the landing hero (same treatment as now: full screen width, `saturate-150`, even veil `bg-white/30` light / `bg-black/45` dark, short soft bottom fade into the page; no side fade, no glow, no panel behind text).

**Remove:** `src/features/*` (onboarding, career-match, skills-test, courses, jobs, people, news, search, profile), old data files (careers, skillAreas, skillsTest, courses, tasks, jobs, providers, people, news, newsPhotos, profileOptions), `src/assets/news/`, old i18n sections, `lib/skills.ts`, `lib/nextStep.ts`, `NextStepCard`, `Illustration`, old tests. Write new tests for the new logic.

---

## 3. Roles (front-end only, no real auth)

At the top of the site (in the header on every page, and as two big boxes on the landing page) there are two entry points:

- **"Esmu skolēns / students — piesakies praksei"** / "I'm a student — apply for a placement"
- **"Esmu uzņēmums — piedāvā praksi"** / "I'm a company — post a placement"

Choosing one sets `role: 'student' | 'company'` in state + localStorage (key `seer:v2`). Show the current role as a small pill in the header with "Mainīt lomu / Switch role". No passwords. A company user also picks **which company they represent** (from the seed list, or "New company" which they fill in the constructor). The role decides the navigation:

| Role | Nav items |
|---|---|
| none (first visit) | Ideja (Idea) · Prakses (Placements, read-only) · two role buttons |
| student | Ideja · **Prakses** (browse) · **Manas prakses** (My placements) · **Mana pase** (My passport) |
| company | Ideja · **Mūsu prakses** (Our placements) · **Pievienot praksi** (Add placement) · **Pieteikumi** (Applications) |

---

## 4. Routes

| Page | URL | Who |
|---|---|---|
| Landing / The idea | `/` | everyone (always first) |
| Placement board | `/placements` | everyone; Apply needs student role |
| Placement detail | `/placements/:id` | everyone |
| Apply form | `/placements/:id/apply` | student |
| My placements | `/me/placements` | student |
| Passport (certificate) | `/passport/:id` | anyone with the link (read-only view) |
| Company dashboard | `/company` | company |
| Placement constructor (new / edit) | `/company/new`, `/company/edit/:id` | company |
| Applications for a placement | `/company/placements/:id` | company |
| About & privacy | `/privacy` | everyone |

---

## 5. Page 1 — Landing / "The idea" (most important first impression)

A detailed, well-designed, scannable explanation. Short sentences, visuals, no walls of text. Sections in order:

1. **Hero** (Saldus photo behind): title **"Īsta digitālā pieredze Saldus uzņēmumos — 3 līdz 5 dienās"** / "Real digital experience in Saldus companies — in 3 to 5 days"; one-line subtitle; two big role buttons (student / company).
2. **What is an immersion** — 3 short facts with icons: 3–5 days on site · real low-risk tasks in real systems · a certificate companies recognise.
3. **How it works** — 6 numbered steps (this IS a sequence, so numbers are fine): 1) company posts a placement → 2) student applies → 3) company accepts → 4) 3–5 days on site with a mentor → 5) mentor gives feedback → 6) student receives the Industrial Digital Passport.
4. **For students** — benefits list (hands-on experience with real industrial systems; mentor feedback; recognised Industrial Digital Passport; a path into local tech careers; a reason to stay in Saldus) + CTA.
5. **For companies** — benefits list (scout and evaluate future employees before hiring; real micro-tasks completed; stronger employer brand among local youth; far cheaper than a wrong hire or an external consultant; low effort: one mentor, a few hours) + CTA.
6. **Example micro-tasks by field** — 5 small cards: Sensoru dati (sensor data), Kiberdrošība (cybersecurity), Kvalitātes kontrole (quality control), GPS un loģistika, Dati un paneļi (data & dashboards), each with 1 example task.
7. **The Industrial Digital Passport** — a preview of the certificate (same component as the real one, filled with an example) with "What it proves".
8. **Example companies in the Saldus region** — company names as text tiles (no real logos), with a visible note: *"Piemēri — sadarbība vēl nav apstiprināta"* / "Examples — partnership not yet confirmed".
9. **FAQ** (accordion): Is it paid / free? Who is responsible for safety on site? Minimum age? Do I need experience? Who recognises the passport? What does the company need to prepare?
10. Final CTA: the two role buttons again.

---

## 6. Student side

### Placement board (`/placements`)
- Heading + search + **filters** (FilterBar dropdowns): company, field/task type, duration (3/4/5 days), level (beginner / some experience), location (Saldus / Brocēni / other). Result count.
- **Placement card** shows: company name + industry, placement title, **the micro-task in one sentence**, field badge, duration, level, location, dates (next available), spots left, short "about the company", deliverable, and **Pieteikties / Apply**. A small "PIEMĒRS" badge on every seed placement.
- **Detail page** (`/placements/:id`): everything on the card in full, plus day-by-day plan (Day 1…Day N), required skills/prerequisites, what to bring, safety requirements (PPE etc.), mentor (name/role), how to get there, deliverable the company keeps, what skills go on the passport, contact. Apply button (if role is not student, the button asks them to choose the student role first).

### Apply form (`/placements/:id/apply`)
Fields: full name, age (15–24), school / Tehnikums + class or course, email, phone (optional), preferred dates (from the placement's available dates), short motivation (why this placement, 2–3 sentences), relevant experience (optional), **parent/guardian consent checkbox and guardian contact if under 18**, consent to share the application with the company. Validation with clear messages. On submit: status `applied`, toast, go to My placements.

### My placements (`/me/placements`)
Tabs or groups: **Pieteikts** (applied) · **Apstiprināts** (accepted) · **Notiek** (in progress) · **Pabeigts** (completed) · **Noraidīts** (declined). Each item shows company, title, dates, status, next action. Completed items link to the passport.
For the demo, the student can also see one **pre-seeded completed placement** so the passport is visible on first load.

### Industrial Digital Passport (`/passport/:id`) — **make this the most polished screen**
A certificate that looks official and is shareable:
- SEER mark + title **"Industriālā digitālā pase"** / "Industrial Digital Passport", unique ID (e.g. `SEER-2026-0042`) and issue date.
- Student name, school; company name; placement title; dates and number of days.
- **Task completed** (one sentence) and **deliverable**.
- **Skills demonstrated** — 3–5 skills, each with a level (e.g. 1–4 dots: Introduced / Practised / Independent / Strong) set by the mentor.
- **Mentor feedback** — quote + mentor name and role.
- "Recognised by **[company]**" statement + mentor signature line (typed name).
- A verification block: ID + "Verify at seer.lv/passport/ID" text (no real backend; the page itself is the verification in the prototype).
- Actions: **Copy link** (clipboard, with a fallback that selects the text), **Download as image/PDF is out of scope**; a print-friendly layout is a nice-to-have.
- Looks right in both themes and on a phone (stacked layout), with a clear "PIEMĒRS" watermark on seed passports.

---

## 7. Company side

### Dashboard (`/company`)
Company header (name, industry, location), stats (active placements, open spots, new applications, passports issued), list of **our placements** with status (draft / published / closed), spots filled, and actions: edit, view applications, close, duplicate. Big button **"Pievienot praksi / Add placement"**.

### Placement constructor (`/company/new`) — large, structured, step-by-step form
Split into clear sections (one page with a sticky section index on desktop, or a 4-step wizard on phones). Show a **live preview of the student card** next to the form (below on phones). Save as **draft** or **publish**.

**A. Company**
- Company name*, legal/registration number (optional), address* (street, town, municipality), industry/sector*, short description* (max ~400 chars), website (optional), logo upload (optional; preview only, stored as data URL in localStorage, max ~300 KB), contact person*, contact email*, phone.

**B. The placement**
- Placement title*.
- Task description* — what the student will actually do (rich text not needed; plain multi-line).
- Task type / field* — Sensoru dati / Kiberdrošība / Kvalitātes kontrole / GPS un loģistika / Dati un paneļi / Cits.
- Systems / tools the student will use (tags, e.g. Excel, Power BI, SCADA export, PLC data, GPS logs).
- Day-by-day plan (one line per day, number of lines = duration).
- Deliverable the company keeps*.
- Skills that will appear on the passport* (choose 3–5 from a list + custom).

**C. Requirements**
- Prerequisites / required skills, recommended level* (beginner / some experience), minimum age* (15–24), languages (LV / EN / RU), what to bring (laptop yes/no, ID, clothing).
- Safety: PPE provided / required, site safety briefing (yes/no), restricted areas note.
- Data & confidentiality: student works on anonymised / sample / real data; NDA needed (yes/no).

**D. Logistics**
- Duration* (3, 4 or 5 days), available date ranges* (one or more), daily hours (e.g. 9:00–15:00), location on site, how to get there (bus stop / transport note), lunch provided (yes/no), stipend/compensation (none / amount), number of student spots*, application deadline*.
- Mentor name* and role* (the company's own engineer / IT person), backup contact.
- Visibility: publish now / save as draft.

On publish the placement appears on the student board immediately (local state), with a "Jauns / New" badge.

### Applications (`/company/placements/:id`)
List of applicants (name, age, school, motivation, preferred dates, consent status) with **Accept / Decline**. Accepted → status `accepted`; company can mark **Started** and **Completed**. On Completed the company fills a **mentor feedback form** (skill levels for the passport skills, short comment, mentor name) → this **issues the passport** and the student sees it in "My passport". This closes the loop; without it the passport cannot be issued.

---

## 8. Data model (TypeScript, in `src/data/types.ts`)

```ts
type Role = 'student' | 'company'
type Field = 'sensors' | 'cyber' | 'quality' | 'gps' | 'dashboards' | 'other'
type Level = 'beginner' | 'some'
interface Company { id; name; industry: Localized; town; address; description: Localized; website?; contactName; contactEmail; phone?; logoDataUrl?; isExample: boolean }
interface Placement { id; companyId; title: Localized; task: Localized; field: Field; tools: string[]; dayPlan: Localized[]; deliverable: Localized; passportSkills: Localized[]; prerequisites: Localized; level: Level; minAge: number; languages: ('lv'|'en'|'ru')[]; bring: Localized; safety: Localized; dataNote: Localized; durationDays: 3|4|5; dates: {start: string; end: string}[]; hours: string; location: Localized; transport: Localized; lunch: boolean; stipend?: number; spots: number; deadline: string; mentor: {name: string; role: Localized}; status: 'draft'|'published'|'closed'; isExample: boolean; createdAt: string }
interface Application { id; placementId; student: {name; age; school; email; phone?; guardianConsent?: boolean; guardianContact?}; dates; motivation; experience?; status: 'applied'|'accepted'|'in_progress'|'completed'|'declined'; createdAt }
interface Passport { id; applicationId; issuedAt; skills: {label: Localized; level: 1|2|3|4}[]; feedback: string; mentorName; mentorRole }
```
Seed data lives in `src/data/companies.ts`, `src/data/placements.ts`, `src/data/applications.ts` (a few example applications + one completed placement with a passport). User-created data is merged on top and saved in localStorage. Pure logic (filters, status transitions, passport ID generation, validation) goes in `src/lib/` with Vitest tests.

---

## 9. Seed companies — use only these facts

These are **real companies** in the Saldus region. **None of them has agreed to take part yet**, so every company card, placement and passport built from them must carry the **"PIEMĒRS"** badge and the note *"Sadarbība vēl nav apstiprināta"* / "Partnership not yet confirmed". **Do not** use their logos, **do not** show employee numbers, and **do not** invent facts beyond the list below (team note: headcounts in our research are partly unverified).

| Company | What it is (safe to show) | Example task for the seed placement |
|---|---|---|
| **PATA Saldus** | Sawmill and timber processing, Saldus | Clean a week of machine sensor data and build a simple downtime chart |
| **Jets Vacuum** (SIA, Saldus) | Part of the Norwegian Jets group; vacuum systems | Check a list of production-network devices against a basic security checklist (passwords, updates, open ports) on sample data |
| **SC GRUPA** | Road and infrastructure construction, Saldus *(team: confirm the exact company name and the "formerly Saldus ceļinieks" link before publishing)* | Analyse a day of construction-machine GPS logs and mark idle time |
| **Brimer Saldus** (Norplast group, Saldus parish) | Composite / plastic products manufacturing *(team: confirm whether to describe it as fibreglass composites)* | Turn a paper quality-inspection checklist into a simple digital form |
| **Tērvete Food** (Druva, Saldus parish) | Makes **Druva** ice cream; part of the Latvian Agrolats Grupa | Visualise cold-storage temperature logs and flag readings outside limits |
| **Warmeston** (SIA, Brocēni) | Wood pellet factory with a cogeneration (CHP) plant; owned by the Estonian Warmeston group | Clean maintenance-log entries and build a simple maintenance dashboard |
| **SCHWENK Latvija** (Brocēni) | Cement plant; the plant also uses solar electricity | Build an energy-use dashboard from sample meter data |

Create **7 published placements (one per company)** in LV + EN, durations mixed (3, 4, 5 days), levels mixed, dates in the coming months, 1–3 spots each, a realistic mentor role per company (e.g. "production engineer", "IT administrator", "quality manager"; mentor names clearly fictional). Mark all with `isExample: true`.

---

## 10. Design and UX rules

- Reuse the current visual language: black-and-orange, dark default, rounded cards with thin rings, orange icon tiles for section titles, solid orange active chips, Inter font.
- Mobile-first: everything works at 390px with no horizontal scroll; constructor usable on a phone.
- Short copy, active verbs on buttons ("Pieteikties", "Publicēt praksi", "Izsniegt pasi"); clear empty states ("Vēl nav pieteikumu — dalies ar prakses saiti").
- Forms: labels above fields, required marks, inline errors in plain language, keyboard accessible, visible focus.
- Every fictional or example item shows "PIEMĒRS"; the footer says the site is a prototype and companies are examples until partnerships are confirmed.
- Privacy page: what is stored (only in this browser), that applicants' data would be shared with the chosen company, guardian consent for under-18s, and a "Delete all my data" button with an in-page confirmation.

---

## 11. Acceptance checklist

- [ ] `npm install && npm run dev` works; `npm test` and `npm run build` pass.
- [ ] First visit shows the landing page with two clear role buttons; all sections from §5 present in LV and EN.
- [ ] Student can filter the board, open a placement, apply (with guardian consent when under 18), and see it in My placements.
- [ ] A seeded completed placement shows a polished passport; Copy link works.
- [ ] Company can create a placement in the constructor with live preview, save as draft, publish, and see it appear on the student board.
- [ ] Company can accept an applicant, mark completed, fill mentor feedback and thereby issue a passport the student can open.
- [ ] Everything persists across reloads (localStorage) and survives blocked storage (try/catch).
- [ ] Dark and light themes both readable; no horizontal scroll at 390px.
- [ ] No old career-discovery pages, routes or strings remain.
- [ ] Seed companies show only the facts in §9, with "PIEMĒRS" and "partnership not yet confirmed".
