/**
 * SEER — shared app state: language, theme, role, the company a company user represents,
 * and all placements / applications / passports (seed data + what users create here).
 *
 * Everything the user creates is saved to localStorage (all access wrapped in
 * try/catch); seed items are merged underneath by id. Swap `load` / `save` for an API later.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { APPLICATIONS, COMPANIES, PASSPORTS, PLACEMENTS } from '../data'
import type { Application, ApplicationStatus, Company, Lang, Localized, Passport, Placement, Role } from '../data'
import { translations } from '../i18n'
import type { Dict } from '../i18n'
import { canMove, mergeById, nextPassportId } from './placements'

/* -------------------------------------------------------------------------- */
/*  Routes                                                                     */
/* -------------------------------------------------------------------------- */

export const ROUTES = {
  landing: '/',
  board: '/placements',
  placement: '/placements/:id',
  apply: '/placements/:id/apply',
  mine: '/me/placements',
  myPassport: '/me/passport',
  passport: '/passport/:id',
  company: '/company',
  newPlacement: '/company/new',
  editPlacement: '/company/edit/:id',
  applications: '/company/placements/:id',
  allApplications: '/company/applications',
  privacy: '/privacy',
} as const

/** Fill the `:id` in a route. */
export const path = (route: string, id: string) => route.replace(':id', encodeURIComponent(id))

/* -------------------------------------------------------------------------- */
/*  Persistence                                                                */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'seer:v2'
/** Theme key kept from the earlier SEER prototype so the user's choice survives. */
const THEME_KEY = 'ere:theme:v2'

interface Saved {
  lang: Lang
  role: Role | null
  companyId: string | null
  companies: Company[]
  placements: Placement[]
  applications: Application[]
  passports: Passport[]
}

const EMPTY: Saved = { lang: 'lv', role: null, companyId: null, companies: [], placements: [], applications: [], passports: [] }

/** Keep only array items that at least have an id; anything else in storage is ignored. */
function list<T extends { id: string }>(x: unknown): T[] {
  return Array.isArray(x) ? x.filter((i): i is T => !!i && typeof i === 'object' && typeof (i as T).id === 'string') : []
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const data = JSON.parse(raw) as Partial<Saved>
    return {
      lang: data.lang === 'en' ? 'en' : 'lv',
      role: data.role === 'student' || data.role === 'company' ? data.role : null,
      companyId: data.companyId ?? null,
      companies: list(data.companies),
      placements: list(data.placements),
      applications: list(data.applications),
      passports: list(data.passports),
    }
  } catch {
    return EMPTY
  }
}

function save(data: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* storage full or blocked — the app keeps working, just without saving */
  }
}

/** Upsert by id. */
const put = <T extends { id: string }>(list: T[], item: T) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Today as an ISO date (local time). */
export const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface RolePickerState {
  open: boolean
  /** Jump straight to this role's step (e.g. "Apply" asks for student). */
  preferred?: Role
  /** Where to go after choosing. */
  redirect?: string
}

interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  dark: boolean
  toggleDark: () => void
  t: Dict
  /** Pick the current language from a `{ lv, en }` object. */
  l: (text: Localized) => string
  role: Role | null
  /** Company the company user represents (null = new company, filled in the builder). */
  companyId: string | null
  chooseRole: (role: Role, companyId?: string | null) => void
  rolePicker: RolePickerState
  openRolePicker: (preferred?: Role, redirect?: string) => void
  closeRolePicker: () => void
  companies: Company[]
  placements: Placement[]
  applications: Application[]
  passports: Passport[]
  company: Company | undefined
  companyOf: (p: Placement) => Company | undefined
  saveCompany: (c: Company) => void
  savePlacement: (p: Placement) => void
  submitApplication: (a: Application) => void
  moveApplication: (id: string, to: ApplicationStatus) => boolean
  /** Completes the application and issues its passport; returns the passport id. */
  issuePassport: (applicationId: string, data: Omit<Passport, 'id' | 'applicationId' | 'issuedAt' | 'isExample'>) => string
  resetAll: () => void
  toast: string | null
  notify: (message: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load)
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) !== 'light'
    } catch {
      return true
    }
  })
  const [rolePicker, setRolePicker] = useState<RolePickerState>({ open: false })
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const t = translations[saved.lang]

  useEffect(() => {
    document.documentElement.lang = saved.lang
    document.title = t.brand.title
  }, [saved.lang, t])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      /* theme just won't be remembered */
    }
  }, [dark])

  useEffect(() => save(saved), [saved])

  const notify = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const value = useMemo<AppState>(() => {
    const companies = mergeById(COMPANIES, saved.companies)
    const placements = mergeById(PLACEMENTS, saved.placements)
    const applications = mergeById(APPLICATIONS, saved.applications)
    const passports = mergeById(PASSPORTS, saved.passports)
    const update = (patch: Partial<Saved>) => setSaved((s) => ({ ...s, ...patch }))

    return {
      lang: saved.lang,
      setLang: (lang) => update({ lang }),
      dark,
      toggleDark: () => setDark((d) => !d),
      t,
      l: (text) => text[saved.lang] || text.lv || text.en,
      role: saved.role,
      companyId: saved.companyId,
      chooseRole: (role, companyId) => update({ role, companyId: role === 'company' ? (companyId ?? null) : saved.companyId }),
      rolePicker,
      openRolePicker: (preferred, redirect) => setRolePicker({ open: true, preferred, redirect }),
      closeRolePicker: () => setRolePicker({ open: false }),
      companies,
      placements,
      applications,
      passports,
      company: companies.find((c) => c.id === saved.companyId),
      companyOf: (p) => companies.find((c) => c.id === p.companyId),
      saveCompany: (c) => setSaved((s) => ({ ...s, companies: put(s.companies, c) })),
      savePlacement: (p) => setSaved((s) => ({ ...s, placements: put(s.placements, p) })),
      submitApplication: (a) => setSaved((s) => ({ ...s, applications: put(s.applications, a) })),
      moveApplication: (id, to) => {
        const app = applications.find((a) => a.id === id)
        if (!app || !canMove(app.status, to)) return false
        setSaved((s) => ({ ...s, applications: put(s.applications, { ...app, status: to }) }))
        return true
      },
      issuePassport: (applicationId, data) => {
        const app = applications.find((a) => a.id === applicationId)
        const id = nextPassportId(passports.map((p) => p.id), new Date().getFullYear())
        const passport: Passport = { ...data, id, applicationId, issuedAt: todayIso(), isExample: false }
        setSaved((s) => ({
          ...s,
          passports: put(s.passports, passport),
          applications: app ? put(s.applications, { ...app, status: 'completed' }) : s.applications,
        }))
        return id
      },
      resetAll: () => setSaved({ ...EMPTY, lang: saved.lang }),
      toast,
      notify,
    }
  }, [saved, dark, t, rolePicker, toast, notify])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
