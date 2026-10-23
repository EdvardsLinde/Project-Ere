# SEER — see where your career can go.

SEER is a career-launch portal for young people aged 15–24 in the Saldus region of Latvia. It helps them get into IT support, cybersecurity, AI & data and web development, and shows that they can do this work remotely while living in Saldus.

This is a clickable prototype. It has **no backend yet**. The user's profile is saved in the browser (`localStorage`), and all content comes from typed mock data in `src/data/`, which a real API can replace later.

## Run

```bash
npm install && npm run dev
```

`npm test` runs the unit tests for the scoring and next-step logic (`src/lib/*.test.ts`). See **TESTING.md** for a ready-made plan for testing with 5 young people.

Then open the URL that Vite prints (usually http://localhost:5173). `npm run build` type-checks the code and makes a production build. The app uses real URLs (`/jobs`, `/my-path`…), so a static host has to serve `index.html` for every path. `vite build --mode artifact` switches to hash URLs (`#/jobs`) for hosts that can't do that.

## The flow

**Onboarding (once, at sign-up, 5 short steps):** sign-up → interests → career paths → learning path → work from Saldus → done. Profile details (skills, motivation, experience) are filled in later from **Mans profils**. You can also **look around first without signing up** (guest mode) and create a profile later.

On the home page, a **"Tavs nākamais solis"** card always shows the next step on the core path: profile → skills test → free training tasks / gap-closing course → jobs (`src/lib/nextStep.ts`).

**After onboarding**, the app connects everything through one shared profile:

| Feature | Route | What it does |
| --- | --- | --- |
| Skills test | `/skills-test` | 12 questions: interests, self-rated skills and two small scenarios. It scores 4 tracks and sets a base level (0–100) for 10 skills. Self-ratings are capped at 70; going higher takes solved tasks or completed courses. |
| Career match ("Mans ceļš") | `/my-path` | Shows the best-fit tracks and what the job involves, then lists the required skills with the user's level and gaps, plus courses and jobs that close those gaps. |
| Courses | `/courses`, `/courses/:id` | Courses, bootcamps and internships tagged by skill and track. Courses that close the user's gaps are highlighted. Users can mark a course started or completed; completing it raises their skill levels. **Example:** "Kiberdrošības pamati jauniešiem" (SecNord Labs) comes with 4 free training tasks (`src/data/tasks.ts`) that can be solved in the app; each solved task adds skill points. |
| Jobs | `/jobs` | Local Saldus and remote roles, each with required skill levels. Shown as a compact list (title, company, place, fit %). Tapping a job opens a detail window: **Ko prasām / Ko sagaidām / Ko piedāvājam**, hours, languages, fit and missing skills, with Apply and Save. |
| News & events (home page) | `/news`, `/news?c=<section>` | **The first page after sign-up.** Hero ("Kas notiek Saldū?") with search, a section dropdown and section chips; then card rows: this week, events, Saldus, technology, courses & volunteering. Picture cards show type, price or reading time, place, date and "Skatīt vairāk". On phones each row swipes sideways. A section or a search shows all matching cards. |
| Article | `/news/:id` | Full article page: headline, standfirst, byline, read time, cover, body text, event details with an "Interested" button, sidebar and related stories. |
| Profile | `/profile` | Profile, readiness for the chosen path, saved courses and people to follow. It's in the main menu and behind the avatar. |
| People | `/people`, `/people/:id` | Mentors, professionals and peers to follow, each with a profile page. Follow only, no private messages, and every profile has a **Report** button. It's kept out of the main desktop menu on purpose: connecting minors with adults needs moderation before it goes live. |
| Search | `/search` | One search across jobs, courses, people, careers and companies. |
| Privacy | `/privacy` | Plain-language explanation of what is stored (only in this browser) and a **Delete my data** button. |

The ring around the avatar in the header shows readiness for the user's current track.

> **News photos.** News stories show Saldus or other Latvian places: two Saldus photos supplied by the team (also behind the News hero; **source still to be credited**, see `TODO` in `src/data/newsPhotos.ts` and `src/data/heroPhotos.ts`) and Latvian photos from [Pexels](https://www.pexels.com/license/). Events, courses and explainers show the activity itself (Pexels stock photos). Files are in `src/assets/news/<news id>.jpg`; captions name the place and say the image is illustrative, because the stories are made up. Pexels does not allow selling unaltered copies, implying that people shown endorse SEER, or showing identifiable people in a bad light.

> **All companies, jobs, courses, news items and people are fictional examples.** The UI marks them with a "Piemērs" badge and a notice on each page. Replace them with real partners once you have agreements. Job age limits are placeholders and must be checked against Latvian labour law.

## Project structure

```
src/
  features/            one folder per feature — teams can work in parallel
    onboarding/        Welcome, Interests, ProfileBuilder, Saldus, Thanks
    skills-test/       SkillsTest
    career-match/      MyPath, Paths (career cards), Training (learning path)
    courses/           Courses
    jobs/              Jobs, JobCard
    news/              News
    profile/           MyProfile
    people/            People, PersonProfile
    search/            SearchPage
  components/          shared UI (ui.tsx, Layout.tsx, cards.tsx)
  data/                typed mock data, one file per topic (swap for an API later)
  lib/
    state.tsx          routes + the shared profile context (persisted to localStorage)
    skills.ts          scoring: test → tracks, skill levels, gaps, course gains, job fit
  i18n/                lv.ts (default, source of truth), en.ts (same shape), index.ts
  index.css            colours (light + dark), radius, shadows
```

## Filters

Every list page except news (courses, jobs, people) uses one shared `FilterBar` (`src/components/FilterBar.tsx`): a search box plus compact dropdowns such as field, language, type and place.

## Conventions

- **No hard-coded visible text.** Add every string to `src/i18n/lv.ts` and `src/i18n/en.ts`. The build fails if `en` is missing a key.
- **Content goes in `src/data/`**, as typed constants with comments. Bilingual content uses `{ lv, en }`.
- **One shared profile.** Read it and change it with `useApp()` (`profile`, `update`). Scoring belongs in `src/lib/skills.ts`, not in components.
- **New feature?** Create `src/features/<name>/`, add a route in `ROUTES` (`src/lib/state.tsx`) and `PAGES` (`src/App.tsx`), and add a nav link in `src/components/Layout.tsx`.
- **Colours come from the theme tokens** in `index.css`. Don't use raw hex values in components, so dark mode keeps working.

## Stack

React + Vite + TypeScript, React Router, Tailwind CSS v4, lucide-react icons.
