# SEER: full project brief (paste this into any AI tool or hand it to a developer)

> You are continuing work on **SEER**, a clickable web prototype that helps young people (15–24) in the **Saldus region of Latvia** discover digital careers, see what skills they lack, find free courses and practice tasks, and find IT jobs they can do while still living in Saldus. Everything below describes the product **as it is built right now**. Keep what exists, follow the design and content rules, and do not reintroduce anything listed under "Rejected — do not bring back".

---

## 1. Product in one paragraph

SEER (tagline: **"SEER — see where your career can go."**, Latvian: **"Ieraugi, kur var aizvest tava karjera"**) is a Latvian-first (LV default, EN toggle) career-discovery portal. A young person signs up with just a name (or browses as a guest), picks interests, sees four digital career paths (Cybersecurity, AI & data, Web development, IT support), takes a 12-question skills test, and gets a personal **"My path"** page showing readiness, skill gaps, recommended courses with free training tasks, and matching jobs with a fit percentage. The home page after sign-up is a **news & events portal for Saldus** ("Kas notiek Saldū?") with photo cards. It is **not a job board**: jobs are one part of a learning journey. All companies, people, courses, jobs and news are **fictional examples** and are clearly labelled **"PIEMĒRS" / "EXAMPLE"**.

**Audience:** 15–24-year-olds in Saldus municipality, little or no IT experience, mostly on phones.
**Single job of the product:** show a young person that a digital career is reachable from Saldus, and give them the next concrete step.
**Status:** prototype for user testing with ~5 young people (see `TESTING.md`). No backend; profile saved in the browser.

---

## 2. Tech stack and how to run

- **React 19 + TypeScript 7 + Vite 8**, **Tailwind CSS v4** (`@tailwindcss/vite`), **react-router 8.5** (`BrowserRouter` normally, `HashRouter` in the `artifact` build mode), **lucide-react** icons, **Vitest 5** unit tests.
- No UI kit; all components are hand-written in `src/components/`.
- Run: `npm install && npm run dev` → http://localhost:5173
- Build: `npm run build` (runs `tsc -b` then `vite build`). Tests: `npm test` (11 Vitest tests in `src/lib/skills.test.ts`).
- **Single-file build** (used for the shareable Claude artifact): `npx vite build --mode artifact --base ./ --outDir <dir>`; in this mode `vite.config.ts` sets `assetsInlineLimit: () => true` so every image is embedded as a data URI, then the JS and CSS are inlined into one HTML file. The published page cannot load images or scripts from other sites, which is why everything is embedded (~3.7 MB).
- Repo: `EdvardsLinde/Project-Ere`, working branch `claude/ere-career-discovery-app-gk6v7q`. Live prototype: https://claude.ai/artifact/QQSzRmSqutk3GTt8e3NNPc

---

## 3. Code structure

```
src/
  main.tsx              Router choice (HashRouter for artifact mode)
  App.tsx               Routes, page frame (max-w-6xl container), header/footer shell
  index.css             Theme tokens (colours, radii, shadows), dark mode, base styles
  lib/
    state.tsx           AppProvider + useApp(): lang, theme, routes, navigation, the ONE profile, localStorage
    skills.ts           Scoring: test → skills, readiness, gaps, course value, job fit, progress
    skills.test.ts      11 unit tests
    nextStep.ts         "What should I do next?" logic
  i18n/lv.ts, en.ts     All UI text (lv.ts is the source of truth; en.ts must match its shape)
  data/                 Typed mock data (swap for an API later)
    careers.ts (4 tracks + learning paths), skillAreas.ts (10 skills), skillsTest.ts (12 questions),
    courses.ts (13), tasks.ts (4 training tasks), jobs.ts (9), providers.ts (7), people.ts (8),
    news.ts (31 items), newsPhotos.ts (photo per news item), heroPhotos.ts (Saldus hero photo),
    profileOptions.ts, types.ts, index.ts
  components/
    Brand.tsx           Logo: orange "S" tile (inline SVG) + "SEER" + tagline
    Layout.tsx          Header (top tabs), mobile tab row, hamburger menu, theme + language toggles,
                        avatar with progress ring, onboarding step bar, footer
    ui.tsx              Button, Chip, Card, PageHeader (full-width band + breadcrumb), ActionBar, Meter, Pill, inputClass
    cards.tsx           CourseCard, PersonCard, Avatar, SearchBox, ExampleBadge, ExampleNotice
    FilterBar.tsx       Search + compact dropdown filters (courses, jobs, people)
    Modal.tsx           Accessible centred dialog (Esc / X / backdrop closes)
    Illustration.tsx    Drawn fallback covers (shapes + icons) when no photo exists
    NextStepCard.tsx    "Your next step" banner
  features/
    onboarding/         Welcome, Interests, ProfileBuilder, Saldus, Thanks
    career-match/       Paths, Training, MyPath
    skills-test/        SkillsTest
    courses/            Courses, CourseDetail (with training tasks)
    jobs/               Jobs, JobItem (list + detail modal)
    news/               News (home), NewsItem (cards, sections), Article (/news/:id)
    people/             People, PersonProfile
    profile/            MyProfile, Privacy
    search/             SearchPage
  assets/news/*.jpg     31 cover photos (960×540), one per news id
  assets/saldus/square.webp   Saldus town-square photo (hero)
public/favicon.svg      Same "S" tile as the logo
README.md, TESTING.md   Developer docs; Latvian usability test plan
```

---

## 4. Routes

| Page | URL | Notes |
|---|---|---|
| Welcome / sign-up | `/` | Name (+ optional email), "Browse without signing up", privacy link. Returning users with a profile are redirected to `/news`. |
| Interests | `/start/interests` | Onboarding step: pick interests (multi-select chips) |
| Career paths | `/careers` | 4 track cards with "best match" |
| Learning path | `/careers/learning-path` | 3-step path for the chosen track, switch to other tracks |
| Work from Saldus | `/work-from-saldus` | Remote work from Saldus + "I'm interested" |
| Done | `/start/done` | Summary; unlocks the app |
| **News (home)** | `/news`, `/news?c=<section>` | Portal home after sign-up (see §7) |
| Article | `/news/:id` | Full story / event page |
| My path | `/my-path` | Readiness, gaps, recommended courses/jobs |
| Skills test | `/skills-test` | 12 questions → result |
| Courses | `/courses`, `/courses/:id` | List with filters; detail with free training tasks |
| Jobs | `/jobs` | Title list + detail modal with fit % |
| People | `/people`, `/people/:id` | Follow-only mentors / role models, report button |
| My profile | `/profile`, edit at `/profile/edit` | Profile + completeness |
| Search | `/search` | Global search across courses, people, careers, companies |
| Privacy | `/privacy` | What is stored, delete everything |

Onboarding order: welcome → interests → paths → training → saldus → thanks. A progress bar shows only during onboarding or when editing a step from the profile. Main navigation (top tabs, website style, not app style): **Jaunumi (News), Mans ceļš (My path), Kursi (Courses), Darbs (Jobs), Profils (Profile)**; "Cilvēki (People)" is in the mobile tab row and menu.

---

## 5. State, persistence, language

- One context `useApp()` holds language, theme, current step (derived from the URL), navigation helpers (`goTo`, `next`, `back`, `edit`, `openCourse`, `openPerson`), onboarding/guest flags, search query and **the one `Profile`** that every feature reads and writes.
- `Profile` fields: name, email, interests, skills, customSkills, motivationText, motivationTags, experiences (each with multiple types), careerId, interested, savedCourses, appliedCourses, courseProgress (started/completed), taskProgress, savedJobs, appliedJobs, savedNews ("Interesē"), following, testResult.
- Saved in **localStorage** key `ere:v1` (profile, onboarded, lang) and theme in `ere:theme:v2`. The old "ere" prefix is kept on purpose so saved profiles survive the rename. All storage access is wrapped in try/catch.
- **Dark mode is the default**; the header toggle switches to light. The tab title follows the language (`SEER — ieraugi, kur var aizvest tava karjera.` / `SEER — see where your career can go.`).
- i18n: every string lives in `src/i18n/lv.ts` (source) and `en.ts`; content data uses `{ lv, en }` objects. Never hard-code UI text.

---

## 6. Design system (current, approved)

**Look:** black and orange, modern, website-like (top tabs, full-width bands), rounded but compact, photo-led on the news page. Inter font (Google Fonts) with system fallbacks.

**Colour tokens** (Tailwind scales are redefined in `src/index.css`, so components use `slate-*`, `brand-*`, `accent-*`, `amber-*`, `red-*`):

| Token | Light | Dark (default) |
|---|---|---|
| Page background `slate-50` | `#f7f5f3` | `#0b0a09` |
| Card `card` | `#ffffff` | `#151210` |
| Text `slate-900` | `#171412` | `#f5f2ef` |
| Muted text `slate-500` | `#655e58` | `#b6afa9` |
| Primary `brand-600` (buttons, white text) | `#c2410c` | `#c2410c` |
| Links `brand-700` | `#9a3412` | `#ff8a3d` |
| Accent `accent-500` (active chip, icon tiles, price badges; black text `#140a03`) | `#ff7a1a` | `#ff7a1a` |
| Footer `ink` | `#0c0a09` | `#050403` |
| Sun yellow `amber-500` (example badges) | `#eec05b` | `#eec05b` |

Rules: neutrals are warm greys; orange text on white uses the darker orange for contrast; every page passes an automatic WCAG contrast check (text ≥ 4.5:1, large ≥ 3:1) in both themes. The app root paints its own background so a host page can never show white through in dark mode.

**Logo:** rounded orange gradient tile (`#f97316` → `#9a3412`) with a white "S" drawn as one SVG stroke, next to **SEER** in extra-bold text and the tagline beneath (tagline hidden on phones; under 360px only the tile shows). The favicon is the same tile.

**Components:** cards `rounded-2xl` with a thin ring and soft shadow; buttons `rounded-lg`/`rounded-xl`; chips are pills; section titles use an orange icon tile + bold title + one-line description + optional "Visi →" link. "PIEMĒRS" badge on every fictional item.

---

## 7. Page details

### News home — "Kas notiek Saldū?" (`/news`)
- **Hero:** full-width band with the **Saldus town-square photo** (`assets/saldus/square.webp`, original 2000px, sized exactly to the screen width so it never pixelates), colours boosted (`saturate-150`), **one even veil** over the whole photo (white 30% in light mode, black 45% in dark), and a **short soft fade** (h-12/h-16) at the bottom into the page background. No side fade, no grid lines, no caption.
- Hero content: big title **"Kas notiek Saldū?"**, subtitle "Ziņas, pasākumi, kursi un brīvprātīgais darbs — viss vienuviet.", a **full-width search box**, and a row of **section chips**: Visi, Saldus, Pasākumi, MI un dati, Kiberdrošība, Web, IT atbalsts, Mācības (active chip = solid orange). No eyebrow text, no result count, no dropdown.
- **Sections** (each a row of 4 photo cards; on phones the row scrolls sideways): **Aktuāli šonedēļ** (newest news, lead story first), **Pasākumi** (upcoming events), **Saldus novadā** (local stories), **Tehnoloģijas** (explainer articles), **Kursi un brīvprātīgais darbs** (upcoming courses & volunteering).
- **Card:** 16:9 photo; top-left black section badge (e.g. SALDUS, KIBERDROŠĪBA); top-right orange price badge **only for events, courses and volunteering** ("BEZMAKSAS" / "NO €3"); small "PIEMĒRS" tag bottom-right on the photo; title (max 3 lines); place and date/time with orange icons; "Skatīt vairāk ›" row. **No reading-time badge on news cards.**
- Choosing a section or typing a search shows all matching cards in a grid.
- Footer line: "All news, events and people on this page are made up — examples only."

### Article (`/news/:id`)
Breadcrumb (SEER Ziņas › section), kicker, large headline, standfirst, byline ("Teksts: <name>", date, time, reading time) with a PIEMĒRS badge, large cover photo with caption **"Foto: Pexels (link) · <place> · ilustratīvs attēls, ziņa ir izdomāta"**, an **event info box** for events/courses (when, time, where, "Noderīgi zināt" bullets, "Interesē" button that saves it), 2–4 body paragraphs, fictional-content notice, "Visas ziņas" back link, sidebar with **Jaunākais** (timestamped list: "11:15", "Vakar", "Pirms 3 dienām") and **Lasītākais** (numbered), and **Lasi arī** (3 related cards).

### My path (`/my-path`)
Without a test: prompt to take it. With a test: ranked track matches (choose one), what the job is, day-to-day, a skills chart (your level vs. junior target marker), skill gaps, recommended courses that close the gaps, matching jobs, and the **Next step** card.

### Skills test (`/skills-test`)
12 questions: **3 interest**, **7 self-rating** (Nemāku…Ļoti labi; self-rating capped at **70/100** so higher levels need proof from courses or tasks), **2 scenario**. Result: track scores (60% interest answers + 40% readiness) and base skill levels.

### Courses (`/courses`, `/courses/:id`)
FilterBar (search + dropdowns: field, type, place/format, language, price free/paid, my progress); "Recommended" marks courses that close your gaps; save / apply / start / complete. **"Kiberdrošības pamati jauniešiem"** (SecNord Labs) includes **4 free training tasks** with realistic material (a mock phishing email, a login log table, a list of URLs) and instant feedback; each solved task adds skill points.

### Jobs (`/jobs`)
FilterBar (search + field, type, place, language). Compact title list; a click opens a modal with **what they require / what they expect / what they offer**, schedule, minimum age, languages, remote flag, fit % and "still to learn" skills with a "Find courses" link; apply and save.

### People (`/people`, `/people/:id`)
FilterBar (search + field, who, place). 8 fictional IT people (mentor/role-model style), "Suggested for you" based on interests, follow only (**no private messages**), report-profile button, safety note.

### My profile (`/profile`)
Avatar, completeness meter, quick stats, about, interests, skills, experience, chosen path card, saved/applied courses (or recommendations when empty); edit sections jump back into onboarding steps.

### Search, Privacy
Global search across courses, people, career paths and companies; privacy page explains local-only storage and has **Delete everything** with an in-page confirmation.

---

## 8. Data and content (all fictional, labelled PIEMĒRS)

- **Career tracks (4):** Kiberdrošība (cyber), Mākslīgais intelekts un dati (ai-data), Web izstrāde (web), IT atbalsts (it-support); each with required skill levels and a 3-step learning path.
- **Skill areas (10):** Programmēšana, Matemātika un loģika, Datori un tīkli, Drošība internetā, Darbs ar datiem, Mājaslapu veidošana, Dizains, Komunikācija, Angļu valoda, Problēmu novēršana.
- **Providers (7):** SecNord Labs, DatuDarbnīca, WebLauks, CloudBalt, Novada Koda klubs, OzolLog, Kurzemes Krams.
- **Courses (13):** e.g. Kiberdrošības pamati jauniešiem, CTF treniņi Saldū, Python un datu analīze no nulles, Pirmā mājaslapa: HTML un CSS, React izstrādes intensīvais kurss, Datoru labošanas darbnīca, Tīkli un Wi-Fi iesācējiem, internships.
- **Jobs (9):** e.g. IT atbalsta palīgs (nepilna slodze), Junior helpdesk speciālists, Jaunākais drošības analītiķis, Kiberdrošības vasaras prakse, Junior datu analītiķis, Junior frontend izstrādātājs, Interneta veikala satura palīgs, Web izstrādes prakse.
- **People (8):** Laura Kalniņa, Mārtiņš Ozols, Elīza Bērziņa, Dāvis Krūmiņš, Anete Vītola, Kristaps Jansons, Katrīna Zariņa, Roberts Liepiņš.
- **News (31):** explainers (how AI learns, AI for studying honestly, 5 signs of a scam, two-step login, a day of a security analyst, what a data analyst does, first website in an evening, why PCs get slow), Saldus news (Saldus Tech Week 9–15 Nov as the lead story, fake parcel SMS wave, coding-club record sign-ups, students' "Kad būs autobuss?" app wins a Kurzeme hackathon, AI corner at the coworking space, coworking space opens, fast internet for three more villages, youth survey, remote worker Elīza's story, summer IT interns), events (CV workshop, gaming tournament + talk, CTF night, AI chatbot workshop, girls in tech, online career day, hackathon), courses and volunteering (repair café, helping seniors with smartphones, school website). Fictional bylines: Marta Kalniņa, Jānis Ozols, Līga Bērziņa, Roberts Liepa, "SEER redakcija". Dates are around Oct–Dec 2026; "today / yesterday / in N days" labels use the real current date.

---

## 9. Scoring logic (`src/lib/skills.ts`)

- `scoreTest` → base skill levels (self-ratings capped at 70) + track scores.
- `effectiveSkills` = test base + gains from **completed courses** + gains from **solved training tasks**, each skill capped at 100.
- `readiness(track)` = average over the track's required skills of min(level / target, 1).
- `skillGaps`, `coursesForGaps` (courses ranked by how much gap they close), `jobFit` (0–100%), `jobMissing`, `overallProgress` (header avatar ring).
- `nextStep`: no name → finish profile; no test → take the test; gaps → free training tasks first, then the best course; otherwise → jobs.

---

## 10. Photos and licensing

- **News covers:** news stories show **Saldus or other Latvian places** (two team-supplied Saldus photos + Latvian Pexels photos of Riga, Liepāja/Karosta and Ikšķile); events, courses and explainers show the **activity itself** (Pexels stock photos). Mapping lives in `src/data/newsPhotos.ts` (news id → Pexels id, place).
- Pexels licence: free to use, credit not required (we still link each photo); not allowed: selling unaltered copies, implying people shown endorse SEER, showing identifiable people in a bad light (so scam/hacking stories use phones, hands and screens, not faces).
- Every article caption says the photo is illustrative and the story is made up.
- **TODO:** the two Saldus photos (town square, "Saldus" sign) have **no credited source yet** (marked `TODO` in `newsPhotos.ts` and `heroPhotos.ts`); the town-square photo shows a Swedbank sign that should be cropped before any public use.

---

## 11. Rejected — do not bring back

The product owner tried and explicitly rejected these:
- Dark blue / navy theme (#00022E). The theme is **black + orange**.
- Earlier blue/teal palette.
- Eye-shaped logo, hand-drawn wordmark with orange E bars, and the mirrored "SEƎR" E. Keep the simple **"S" tile + bold SEER**.
- Grid-square background pattern anywhere.
- Hero: result count ("Atrasti N ieraksti"), section dropdown next to search, orange eyebrow text above the title, "Saldus centrs" caption, cross-fading slideshow (use **one** photo), side-to-side fade, text glow/halo, and a solid panel behind the hero text.
- A strong/long bottom fade (keep it short and soft).
- Reading-time badges on news cards (prices on events/courses stay).
- Opportunities/jobs as the home page (home is the News page; the profile must stay one tap away).
- App-like bottom tab bar (navigation is website-style top tabs).
- Long text blocks; prefer short text + visuals.

---

## 12. Known limitations and open work

1. No backend or accounts; data lives in one browser. Real version needs auth, a database and moderation.
2. All content is fictional; replace with real partners (schools, municipality, companies) before any public launch.
3. Safety for minors: people profiles are follow-only, no messaging; a real version needs moderation, reporting workflow, age checks and a full privacy policy (GDPR).
4. Light-mode hero: the subtitle can be hard to read over the white building (no panel/glow allowed); options are a bolder/darker subtitle or shifting the photo crop.
5. Photo credits for the two Saldus photos are missing (see §10).
6. Check the Latvian tagline with native speakers, and check "SEER" for existing trademarks before using the name publicly.
7. News dates are relative to the real date; by late 2026 events will be in the past.
8. Pending integration: "Mācies un Balvo" (learn-and-earn rewards) feature, waiting for the spec file from the team.
9. Bundle is >500 KB (no code splitting yet).

---

## 13. Quality bar for any change

- Latvian first, English complete; every new string in both `lv.ts` and `en.ts`.
- Works at phone width (≈390px) with no horizontal scrolling; check desktop and phone.
- Both themes readable (contrast ≥ 4.5:1 for text); dark mode is the default.
- Every fictional item keeps its "PIEMĒRS" label.
- Run `npm test` and `npm run build` before shipping.
