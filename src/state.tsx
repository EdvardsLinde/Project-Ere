import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang, Localized } from './data'
import { translations } from './i18n'
import type { Dict } from './i18n'

/** Linear flow. Order here = order on screen. */
export const STEPS = ['welcome', 'interests', 'profile', 'paths', 'training', 'saldus', 'thanks'] as const
type FlowStep = (typeof STEPS)[number]
/** 'me' = the "Mans profils" page; reachable any time, outside the linear flow. */
export type Step = FlowStep | 'me'
/** Steps shown in the progress indicator (thank-you screen is not counted). */
export const PROGRESS_STEPS = STEPS.length - 1

export interface Experience {
  id: number
  type: string
  title: string
  description: string
}

export interface Profile {
  name: string
  email: string
  interests: string[]
  skills: string[]
  customSkills: string[]
  motivationText: string
  motivationTags: string[]
  experiences: Experience[]
  careerId: string | null
  /** Pressed "Esmu ieinteresēts/-a". */
  interested: boolean
}

const emptyProfile: Profile = {
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
}

interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
  /** Pick the current language from a `{ lv, en }` content object. */
  l: (text: Localized) => string
  step: Step
  stepIndex: number
  goTo: (s: Step) => void
  /** Go to the next flow step — or back to "Mans profils" when editing from there. */
  next: (fallback?: Step) => void
  back: () => void
  /** Open a flow step to edit it; "next"/"back" then return to "Mans profils". */
  edit: (s: Step) => void
  /** True while editing a step opened from "Mans profils". */
  editing: boolean
  profile: Profile
  update: (patch: Partial<Profile>) => void
  restart: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('lv')
  const [step, setStep] = useState<Step>('welcome')
  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [editing, setEditing] = useState(false)

  const stepIndex = STEPS.indexOf(step as FlowStep)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const show = useCallback((s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

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
      profile,
      update: (patch) => setProfile((p) => ({ ...p, ...patch })),
      restart: () => {
        setProfile(emptyProfile)
        goTo('welcome')
      },
    }),
    [lang, step, stepIndex, goTo, show, editing, profile],
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
