/**
 * ERE — shared app state: language, theme, navigation helpers and the ONE user
 * profile that every feature reads and writes (test → match → gaps → courses → jobs).
 *
 * The profile is persisted to localStorage (all access wrapped in try/catch), so
 * it survives a refresh. Swap `loadSaved` / `save` for an API later.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router'
import type { Lang, Localized, SkillAreaId, TrackId } from '../data'
import { translations } from '../i18n'
import type { Dict } from '../i18n'

/* -------------------------------------------------------------------------- */
/*  Routes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Onboarding flow, in order. Runs once at sign-up and is kept short on purpose:
 * the profile details (skills, motivation, experience) are filled in later from "Mans profils".
 */
export const STEPS = ['welcome', 'interests', 'paths', 'training', 'saldus', 'thanks'] as const
type FlowStep = (typeof STEPS)[number]
/** Pages of the app itself (after onboarding). One route per feature. */
export type AppPage =
  | 'me'
  | 'profile'
  | 'test'
  | 'match'
  | 'courses'
  | 'course'
  | 'jobs'
  | 'news'
  | 'article'
  | 'people'
  | 'person'
  | 'search'
  | 'privacy'
export type Step = FlowStep | AppPage
/** Steps shown in the onboarding progress bar (the thank-you screen is not counted). */
export const PROGRESS_STEPS = STEPS.length - 1

/** URL for every page. `person` takes an id: /people/:id */
export const ROUTES: Record<Step, string> = {
  welcome: '/',
  interests: '/start/interests',
  profile: '/profile/edit',
  paths: '/careers',
  training: '/careers/learning-path',
  saldus: '/work-from-saldus',
  thanks: '/start/done',
  me: '/profile',
  test: '/skills-test',
  match: '/my-path',
  courses: '/courses',
  course: '/courses/:id',
  jobs: '/jobs',
  news: '/news',
  article: '/news/:id',
  people: '/people',
  person: '/people/:id',
  search: '/search',
  privacy: '/privacy',
}

/** Link to one news article / event page. */
export const articlePath = (id: string) => ROUTES.article.replace(':id', encodeURIComponent(id))

function stepFromPath(pathname: string): Step {
  const hit = (Object.keys(ROUTES) as Step[]).find((s) => matchPath({ path: ROUTES[s], end: true }, pathname))
  return hit ?? 'welcome'
}

/* -------------------------------------------------------------------------- */
/*  Profile                                                                    */
/* -------------------------------------------------------------------------- */

export interface Experience {
  id: number
  /** Experience type ids — one entry can be several (e.g. school project + course). */
  types: string[]
  title: string
  description: string
}

/** Result of the skills test. `skills` are the BASE levels (0–100) before courses. */
export interface TestResult {
  answers: Record<string, number>
  trackScores: Record<TrackId, number>
  skills: Record<SkillAreaId, number>
  takenAt: string
}

export type CourseStatus = 'started' | 'completed'

export interface Profile {
  name: string
  email: string
  interests: string[]
  skills: string[]
  customSkills: string[]
  motivationText: string
  motivationTags: string[]
  experiences: Experience[]
  /** Chosen career track. */
  careerId: string | null
  /** Pressed "Esmu ieinteresēts/-a". */
  interested: boolean
  savedCourses: string[]
  appliedCourses: string[]
  /** Course progress; completed courses raise skill levels (see lib/skills.ts). */
  courseProgress: Record<string, CourseStatus>
  /** Solved training tasks (task id → done); each adds skill points. */
  taskProgress: Record<string, 'done'>
  savedJobs: string[]
  appliedJobs: string[]
  /** News & events the user marked "Interesē". */
  savedNews: string[]
  following: string[]
  testResult: TestResult | null
}

export const emptyProfile: Profile = {
  name: '',
  email: '',
  interests: [],
  skills: [],
  customSkills: [],
  motivationText: '',
  motivationTags: [],
  experiences: [],
  careerId: null,
  interested: false,
  savedCourses: [],
  appliedCourses: [],
  courseProgress: {},
  taskProgress: {},
  savedJobs: [],
  appliedJobs: [],
  savedNews: [],
  following: [],
  testResult: null,
}

/* -------------------------------------------------------------------------- */
/*  Persistence (localStorage, always wrapped in try/catch)                    */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'ere:v1'
/** v2: the black/orange theme made dark the default (old saved 'light' choices are ignored). */
const THEME_KEY = 'ere:theme:v2'

interface Saved {
  profile: Profile
  onboarded: boolean
  lang: Lang
}

function loadSaved(): Saved {
  const fallback: Saved = { profile: emptyProfile, onboarded: false, lang: 'lv' }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw) as Partial<Saved>
    return {
      // Merge so profiles saved by older versions get any new fields.
      profile: { ...emptyProfile, ...(data.profile ?? {}) },
      onboarded: !!data.onboarded,
      lang: data.lang === 'en' ? 'en' : 'lv',
    }
  } catch {
    return fallback
  }
}

function save(data: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* storage full or blocked — the app keeps working, just without saving */
  }
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  /** Dark by default; the header toggle switches to light. */
  dark: boolean
  toggleDark: () => void
  t: Dict
  /** Pick the current language from a `{ lv, en }` content object. */
  l: (text: Localized) => string
  /** Current page, derived from the URL. */
  step: Step
  /** Position in the onboarding flow, or -1 outside it. */
  stepIndex: number
  goTo: (s: Step) => void
  /** Go to the next flow step — or back to "Mans profils" when editing from there. */
  next: (fallback?: Step) => void
  back: () => void
  /** Open a flow step to edit it; "next"/"back" then return to "Mans profils". */
  edit: (s: Step) => void
  /** True while editing a step opened from "Mans profils". */
  editing: boolean
  /** True once the user can use the app: finished onboarding, or chose to browse as a guest. */
  onboarded: boolean
  /** True while the user is going through the sign-up steps (progress bar on, main nav off). */
  flowActive: boolean
  /** Main app navigation is visible. */
  appNav: boolean
  /** Sign-up form submitted: start the onboarding steps. */
  startOnboarding: () => void
  /** Skip sign-up and look around first. */
  browseAsGuest: () => void
  query: string
  setQuery: (q: string) => void
  /** Run a search from anywhere (header, suggestions) and open the results. */
  search: (q: string) => void
  /** Id of the person whose profile is open (from /people/:id). */
  personId: string | null
  /** Id of the open course (from /courses/:id). */
  courseId: string | null
  /** Id of the open news article (from /news/:id). */
  articleId: string | null
  openCourse: (id: string) => void
  openPerson: (id: string) => void
  closePerson: () => void
  profile: Profile
  update: (patch: Partial<Profile>) => void
  restart: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [initial] = useState(loadSaved)

  const [lang, setLang] = useState<Lang>(initial.lang)
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) !== 'light'
    } catch {
      return true
    }
  })
  const [profile, setProfile] = useState<Profile>(initial.profile)
  const [onboarded, setOnboarded] = useState(initial.onboarded)
  const [editing, setEditing] = useState(false)
  const [flowActive, setFlowActive] = useState(false)
  const [query, setQuery] = useState('')

  const step = stepFromPath(location.pathname)
  const stepIndex = STEPS.indexOf(step as FlowStep)
  const personId = matchPath(ROUTES.person, location.pathname)?.params.id ?? null
  const courseId = matchPath(ROUTES.course, location.pathname)?.params.id ?? null
  const articleId = matchPath(ROUTES.article, location.pathname)?.params.id ?? null

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      /* storage unavailable — theme just won't be remembered */
    }
  }, [dark])

  // Reaching the last onboarding screen unlocks the app.
  useEffect(() => {
    if (step === 'thanks') {
      setOnboarded(true)
      setFlowActive(false)
    }
  }, [step])

  useEffect(() => {
    save({ profile, onboarded, lang })
  }, [profile, onboarded, lang])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  const show = useCallback((s: Step) => navigate(ROUTES[s]), [navigate])

  const goTo = useCallback(
    (s: Step) => {
      setEditing(false)
      show(s)
    },
    [show],
  )

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      dark,
      toggleDark: () => setDark((d) => !d),
      t: translations[lang],
      l: (text) => text[lang],
      step,
      stepIndex,
      goTo,
      next: (fallback) =>
        goTo(editing ? 'me' : (fallback ?? STEPS[Math.min(stepIndex + 1, STEPS.length - 1)])),
      back: () => goTo(editing ? 'me' : STEPS[Math.max(stepIndex - 1, 0)]),
      edit: (s) => {
        setEditing(true)
        show(s)
      },
      editing,
      onboarded,
      flowActive,
      appNav: onboarded && !flowActive,
      startOnboarding: () => {
        setFlowActive(true)
        goTo('interests')
      },
      browseAsGuest: () => {
        setOnboarded(true)
        goTo('news')
      },
      query,
      setQuery,
      personId,
      courseId,
      articleId,
      openCourse: (id) => {
        setEditing(false)
        navigate(ROUTES.course.replace(':id', encodeURIComponent(id)))
      },
      openPerson: (id) => {
        setEditing(false)
        navigate(ROUTES.person.replace(':id', encodeURIComponent(id)))
      },
      // Back to wherever the user came from; deep links fall back to the people list.
      closePerson: () => (location.key !== 'default' ? navigate(-1) : goTo('people')),
      search: (q) => {
        setQuery(q)
        goTo('search')
      },
      profile,
      update: (patch) => setProfile((p) => ({ ...p, ...patch })),
      restart: () => {
        setProfile(emptyProfile)
        setOnboarded(false)
        setFlowActive(false)
        setQuery('')
        goTo('welcome')
      },
    }),
    [lang, dark, step, stepIndex, goTo, show, navigate, location.key, editing, onboarded, flowActive, query, personId, courseId, articleId, profile],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

/** Toggle an id in a list (for multi-select tags). */
export function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
}
