/**
 * SEER — shared data types for the immersion model:
 * companies post short placements, students apply, mentors give feedback,
 * and a completed placement issues an Industrial Digital Certificate.
 */
export type Lang = 'lv' | 'en'

/** Text in both languages; the UI picks one with `l()` from useApp(). */
export type Localized = Record<Lang, string>

export type Role = 'student' | 'company'

/** What kind of micro-task a placement is about. */
export type Field = 'sensors' | 'cyber' | 'quality' | 'gps' | 'dashboards' | 'other'
export const FIELDS: Field[] = ['sensors', 'cyber', 'quality', 'gps', 'dashboards', 'other']

export type Level = 'beginner' | 'some'
export type Duration = 3 | 4 | 5
export type WorkLang = 'lv' | 'en' | 'ru'

export interface Company {
  id: string
  name: string
  industry: Localized
  /** Town used for the location filter, e.g. "Saldus", "Brocēni". */
  town: string
  address: string
  description: Localized
  regNumber?: string
  website?: string
  contactName: string
  contactEmail: string
  phone?: string
  /** Optional uploaded logo (data URL, user-created companies only). */
  logoDataUrl?: string
  /** Real company used as an example: partnership not confirmed. */
  isExample: boolean
}

export interface DateRange {
  /** ISO date, e.g. "2026-11-16". */
  start: string
  end: string
}

export interface Placement {
  id: string
  companyId: string
  title: Localized
  /** What the student will actually do, in a sentence or two. */
  task: Localized
  field: Field
  tools: string[]
  /** One line per day; length = durationDays. */
  dayPlan: Localized[]
  /** What the company keeps at the end. */
  deliverable: Localized
  /** Skills the mentor will rate on the certificate (3–5). */
  certificateSkills: Localized[]
  prerequisites: Localized
  level: Level
  minAge: number
  languages: WorkLang[]
  bring: Localized
  /** Own laptop needed. */
  laptopNeeded?: boolean
  /** Free-text safety notes (restricted areas etc.). */
  safety: Localized
  ppeProvided?: boolean
  safetyBriefing?: boolean
  /** Free-text data / confidentiality notes. */
  dataNote: Localized
  dataKind?: 'sample' | 'anonymised' | 'real'
  nda?: boolean
  durationDays: Duration
  dates: DateRange[]
  /** e.g. "9:00–15:00" */
  hours: string
  location: Localized
  transport: Localized
  lunch: boolean
  /** Euros for the whole placement; undefined / 0 = unpaid. */
  stipend?: number
  spots: number
  /** ISO date. */
  deadline: string
  mentor: { name: string; role: Localized }
  backupContact?: string
  status: 'draft' | 'published' | 'closed'
  isExample: boolean
  /** ISO date-time. */
  createdAt: string
}

export type ApplicationStatus = 'applied' | 'accepted' | 'in_progress' | 'completed' | 'declined'

export interface StudentInfo {
  name: string
  age: number
  school: string
  email: string
  phone?: string
  guardianConsent?: boolean
  guardianContact?: string
}

export interface Application {
  id: string
  placementId: string
  student: StudentInfo
  /** The date range the student chose. */
  dates: DateRange
  motivation: string
  experience?: string
  status: ApplicationStatus
  /** Sent from this browser by the student role (shows in "My placements"). */
  mine: boolean
  isExample: boolean
  createdAt: string
}

export type SkillLevel = 1 | 2 | 3 | 4

export interface Certificate {
  /** e.g. "SEER-2026-0042" */
  id: string
  applicationId: string
  /** ISO date. */
  issuedAt: string
  skills: { label: Localized; level: SkillLevel }[]
  feedback: string
  mentorName: string
  mentorRole: Localized
  isExample: boolean
}
