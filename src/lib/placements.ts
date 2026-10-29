/**
 * SEER — pure logic for placements, applications and certificates (no React, easy to test).
 */
import type { Application, ApplicationStatus, Company, DateRange, Duration, Field, Level, Placement } from '../data'

/** Seed items overridden by stored items with the same id; new stored items appended. */
export function mergeById<T extends { id: string }>(seed: T[], stored: T[]): T[] {
  const byId = new Map(stored.map((x) => [x.id, x]))
  const merged = seed.map((s) => byId.get(s.id) ?? s)
  const seedIds = new Set(seed.map((s) => s.id))
  return [...merged, ...stored.filter((x) => !seedIds.has(x.id))]
}

/** Statuses that hold a spot. */
const TAKES_SPOT: ApplicationStatus[] = ['accepted', 'in_progress', 'completed']

/** Free spots in one date run (\`spots\` is the capacity of each run). */
export function spotsLeftIn(placement: Placement, applications: Application[], range: DateRange): number {
  const taken = applications.filter(
    (a) => a.placementId === placement.id && a.dates.start === range.start && TAKES_SPOT.includes(a.status),
  ).length
  return Math.max(0, placement.spots - taken)
}

/** Free spots across all date runs. */
export function spotsLeft(placement: Placement, applications: Application[]): number {
  return placement.dates.reduce((sum, d) => sum + spotsLeftIn(placement, applications, d), 0)
}

/** The next date range that has not started yet (or the last one if all are past). */
export function nextDates(placement: Placement, today: string): DateRange | undefined {
  const sorted = [...placement.dates].sort((a, b) => a.start.localeCompare(b.start))
  return sorted.find((d) => d.start >= today) ?? sorted[sorted.length - 1]
}

export interface PlacementFilters {
  q: string
  companyId: string
  field: Field | ''
  duration: string
  level: Level | ''
  /** "Saldus", "Brocēni" or "other" */
  location: string
}

export const KNOWN_TOWNS = ['Saldus', 'Brocēni']

export function filterPlacements(placements: Placement[], companies: Company[], f: PlacementFilters): Placement[] {
  const needle = f.q.trim().toLowerCase()
  const companyOf = (p: Placement) => companies.find((c) => c.id === p.companyId)
  return placements.filter((p) => {
    const c = companyOf(p)
    if (f.companyId && p.companyId !== f.companyId) return false
    if (f.field && p.field !== f.field) return false
    if (f.duration && String(p.durationDays) !== f.duration) return false
    if (f.level && p.level !== f.level) return false
    if (f.location) {
      const town = c?.town ?? ''
      if (f.location === 'other' ? KNOWN_TOWNS.includes(town) : town !== f.location) return false
    }
    if (needle) {
      const hay = [
        p.title.lv, p.title.en, p.task.lv, p.task.en, p.location.lv, p.location.en, ...p.tools,
        c?.name ?? '', c?.industry.lv ?? '', c?.industry.en ?? '', c?.description.lv ?? '', c?.description.en ?? '', c?.address ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(needle)) return false
    }
    return true
  })
}

/** Allowed status changes a company can make. */
const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  applied: ['accepted', 'declined'],
  accepted: ['in_progress', 'declined'],
  in_progress: ['completed'],
  completed: [],
  declined: [],
}

export function canMove(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return TRANSITIONS[from].includes(to)
}

/** "SEER-2026-0043": next free number for the year, starting at 0001. */
export function nextCertificateId(existing: string[], year: number): string {
  const prefix = `SEER-${year}-`
  const max = existing
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)) || 0)
    .reduce((a, b) => Math.max(a, b), 0)
  return prefix + String(max + 1).padStart(4, '0')
}

/* -------------------------------------------------------------------------- */
/*  Validation — returns a map of field → error key (keys are in i18n `errors`) */
/* -------------------------------------------------------------------------- */

export type ErrorKey = 'required' | 'email' | 'age' | 'tooYoung' | 'guardian' | 'consent' | 'short' | 'skills' | 'dates' | 'spots' | 'deadline' | 'logo'
export type Errors = Partial<Record<string, ErrorKey>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ApplicationForm {
  name: string
  age: string
  school: string
  email: string
  phone: string
  dates: string
  motivation: string
  experience: string
  guardianConsent: boolean
  guardianContact: string
  shareConsent: boolean
}

export const isMinor = (age: number) => age < 18

export function validateApplication(form: ApplicationForm, placement: Placement): Errors {
  const e: Errors = {}
  const age = Number(form.age)
  if (!form.name.trim()) e.name = 'required'
  if (!form.age.trim() || !Number.isInteger(age) || age < 15 || age > 24) e.age = 'age'
  else if (age < placement.minAge) e.age = 'tooYoung'
  if (!form.school.trim()) e.school = 'required'
  if (!EMAIL.test(form.email.trim())) e.email = 'email'
  if (!form.dates) e.dates = 'required'
  if (form.motivation.trim().length < 20) e.motivation = 'short'
  if (Number.isInteger(age) && isMinor(age)) {
    if (!form.guardianConsent) e.guardianConsent = 'guardian'
    if (!form.guardianContact.trim()) e.guardianContact = 'required'
  }
  if (!form.shareConsent) e.shareConsent = 'consent'
  return e
}

/** Everything the constructor edits: the placement plus its company. */
export interface PlacementDraft {
  company: Company
  placement: Placement
}

export function validateDraft({ company, placement: p }: PlacementDraft): Errors {
  const e: Errors = {}
  const req = (key: string, v: string | undefined) => {
    if (!v || !v.trim()) e[key] = 'required'
  }
  req('companyName', company.name)
  req('address', company.address)
  req('industry', company.industry.lv || company.industry.en)
  req('description', company.description.lv || company.description.en)
  req('contactName', company.contactName)
  if (!EMAIL.test(company.contactEmail.trim())) e.contactEmail = 'email'
  req('title', p.title.lv || p.title.en)
  req('task', p.task.lv || p.task.en)
  req('deliverable', p.deliverable.lv || p.deliverable.en)
  const skills = p.certificateSkills.filter((s) => (s.lv || s.en).trim())
  if (skills.length < 3 || skills.length > 5) e.certificateSkills = 'skills'
  if (!p.dates.length || p.dates.some((d) => !d.start || !d.end || d.end < d.start)) e.dates = 'dates'
  if (!Number.isInteger(p.spots) || p.spots < 1 || p.spots > 20) e.spots = 'spots'
  if (!p.deadline) e.deadline = 'required'
  else if (p.dates[0]?.start && p.deadline > p.dates[0].start) e.deadline = 'deadline'
  req('mentorName', p.mentor.name)
  req('mentorRole', p.mentor.role.lv || p.mentor.role.en)
  return e
}

/** Day plan always has exactly `days` lines (keeps what was typed). */
export function fitDayPlan<T>(plan: T[], days: Duration, empty: () => T): T[] {
  return Array.from({ length: days }, (_, i) => plan[i] ?? empty())
}

/** Inclusive number of days in a range. */
export function daysIn(range: DateRange): number {
  return Math.round((Date.parse(range.end) - Date.parse(range.start)) / 864e5) + 1
}
