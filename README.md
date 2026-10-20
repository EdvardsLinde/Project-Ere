# ERE — Atrodi savu digitālo karjeru

ERE is a career-launch portal for young people aged 15–24 in the Saldus region of Latvia. It helps them get into IT support, cybersecurity, AI & data and web development, and shows that they can do this work remotely while living in Saldus.

This is a clickable prototype. It has **no backend yet**. The user's profile is saved in the browser (`localStorage`), and all content comes from typed mock data in `src/data/`, which a real API can replace later.

## Run

```bash
npm install && npm run dev
```

Then open the URL that Vite prints (usually http://localhost:5173). `npm run build` type-checks the code and makes a production build. The app uses real URLs (`/jobs`, `/my-path`…), so a static host has to serve `index.html` for every path. `vite build --mode artifact` switches to hash URLs (`#/jobs`) for hosts that can't do that.

## The flow

**Onboarding (once, at sign-up):** sign-up → interests → profile (skills, motivation, experience) → career paths → learning path → work from Saldus → done.

**After onboarding**, the app connects everything through one shared profile:

| Feature | Route | What it does |
| --- | --- | --- |
| Skills test | `/skills-test` | 12 questions: interests, self-rated skills and two small scenarios. It scores 4 tracks and sets a base level (0–100) for 10 skills. |
| Career match ("Mans ceļš") | `/my-path` | Shows the best-fit tracks and what the job involves, then lists the required skills with the user's level and gaps, plus courses and jobs that close those gaps. |
| Courses | `/courses` | Courses, bootcamps and internships tagged by skill and track. Courses that close the user's gaps are highlighted. Users can mark a course started or completed; completing it raises their skill levels. |
| Jobs | `/jobs` | Local Saldus and remote roles, each with required skill levels. Each job shows a fit % against the user's skills and which skills are still missing. |
| News & events (home page) | `/news` | **The first page after sign-up.** Articles about AI, cybersecurity, data, web and IT support, plus local job-market news, events, courses and volunteering. Filters cover type, topic (track) and Saldus only. A profile card links to the user's profile. |
| Profile | `/profile` | Profile, readiness for the chosen path, saved courses and people to follow. It's in the main menu and behind the avatar. |
| People | `/people`, `/people/:id` | Mentors, professionals and peers to follow, each with a profile page. |
| Search | `/search` | One search across jobs, courses, people, careers and companies. |

The ring around the avatar in the header shows readiness for the user's current track.

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

## Conventions

- **No hard-coded visible text.** Add every string to `src/i18n/lv.ts` and `src/i18n/en.ts`. The build fails if `en` is missing a key.
- **Content goes in `src/data/`**, as typed constants with comments. Bilingual content uses `{ lv, en }`.
- **One shared profile.** Read it and change it with `useApp()` (`profile`, `update`). Scoring belongs in `src/lib/skills.ts`, not in components.
- **New feature?** Create `src/features/<name>/`, add a route in `ROUTES` (`src/lib/state.tsx`) and `PAGES` (`src/App.tsx`), and add a nav link in `src/components/Layout.tsx`.
- **Colours come from the theme tokens** in `index.css`. Don't use raw hex values in components, so dark mode keeps working.

## Stack

React + Vite + TypeScript, React Router, Tailwind CSS v4, lucide-react icons.
