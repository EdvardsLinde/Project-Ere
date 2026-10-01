# ERE — Atrodi savu digitālo karjeru

ERE is a clickable prototype of a career-discovery tool for young people aged 16–21 in the Saldus region of Latvia. It helps them discover digital careers (cybersecurity, AI & data, web development), build a simple profile, and see a realistic learning path. It also shows that they can work in these fields remotely while still living in Saldus.

It is for demos and user testing only. There is **no backend, database or auth**. Everything is kept in React state and is lost on refresh.

## Run

```bash
npm install && npm run dev
```

Then open the URL that Vite prints (usually http://localhost:5173). `npm run build` type-checks the code and makes a production build.

## Flow

**Onboarding (once, at sign-up):** Welcome / sign-up → Interests → Profile (skills, motivation, experience) → Career paths → Learning path → Work from Saldus → Done

**After onboarding** the main navigation appears:

- **Iespējas (home page)**: jobs, internships and courses in one place. It has a search box, quick filters (Jobs, Internships, Remote, In Saldus, Free courses), recommendations based on the user's career path, and a full list with filters. Users can save an opportunity or "apply" (nothing is sent).
- **Cilvēki**: suggested mentors, professionals and other young people to follow.
- **Karjeras ceļi**: the career cards and learning paths from onboarding.
- **Mans profils**: the user's profile, saved opportunities, suggested people and a completeness checklist. Each section opens the matching step to edit it, and Save returns to the profile.
- **Meklēt**: one search across opportunities, people, careers and companies.

The header has an LV/EN toggle. Latvian is the default language.

> **All companies, jobs, courses and people are fictional examples.** The UI labels them that way with a "Piemērs" badge and a notice on every page. Replace them with real partners in `src/data.ts` once you have agreements.

## Where to edit

| What | File |
| --- | --- |
| Interests, skills, motivation tags, experience types, careers, training steps, example companies / jobs / courses / people | `src/data.ts` (commented constants at the top) |
| All UI text (LV + EN) | `src/i18n.ts`. `en` is type-checked against `lv`, so a missing key fails the build |
| Brand colours / font | `src/index.css` (`@theme` block) |
| App state & step order | `src/state.tsx` |
| Screens | `src/screens/*` |
| Header, step bar, footer, shared UI | `src/components/*` |

## Stack

React + Vite + TypeScript, Tailwind CSS v4, lucide-react icons.
