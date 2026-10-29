import { describe, expect, it } from 'vitest'
import { APPLICATIONS, COMPANIES, PLACEMENTS } from '../data'
import type { Placement } from '../data'
import {
  canMove,
  daysIn,
  filterPlacements,
  fitDayPlan,
  mergeById,
  nextDates,
  nextCertificateId,
  spotsLeft,
  spotsLeftIn,
  validateApplication,
  validateDraft,
} from './placements'
import type { ApplicationForm, PlacementFilters } from './placements'
import { formatRange } from './format'

const none: PlacementFilters = { q: '', companyId: '', field: '', duration: '', level: '', location: '' }
const pata = PLACEMENTS.find((p) => p.id === 'pata-downtime') as Placement

describe('seed data', () => {
  it('has one published example placement per company, each with a valid day plan', () => {
    expect(PLACEMENTS).toHaveLength(COMPANIES.length)
    for (const p of PLACEMENTS) {
      expect(p.isExample && p.status === 'published').toBe(true)
      expect(p.dayPlan).toHaveLength(p.durationDays)
      expect(p.certificateSkills.length).toBeGreaterThanOrEqual(3)
      expect(COMPANIES.some((c) => c.id === p.companyId)).toBe(true)
    }
  })
})

describe('mergeById', () => {
  it('overrides seed items by id and appends new ones', () => {
    const merged = mergeById([{ id: 'a', v: 1 }, { id: 'b', v: 1 }], [{ id: 'b', v: 2 }, { id: 'c', v: 3 }])
    expect(merged).toEqual([{ id: 'a', v: 1 }, { id: 'b', v: 2 }, { id: 'c', v: 3 }])
  })
})

describe('spots and dates', () => {
  it('counts taken spots per date run', () => {
    // jets-network-check: 1 spot per run; the December run has an accepted example application
    const jets = PLACEMENTS.find((p) => p.id === 'jets-network-check') as Placement
    expect(spotsLeftIn(jets, APPLICATIONS, jets.dates[0])).toBe(0)
    expect(spotsLeftIn(jets, APPLICATIONS, jets.dates[1])).toBe(1)
    expect(spotsLeft(jets, APPLICATIONS)).toBe(1)
    // pata-downtime: 2 spots per run; the completed example ran on an earlier date, so both runs are free
    expect(spotsLeft(pata, APPLICATIONS)).toBe(4)
  })
  it('formats a date range compactly', () => {
    expect(formatRange({ start: '2026-12-01', end: '2026-12-03' }, 'en')).toBe('1–3 Dec 2026')
  })
  it('picks the next date range that has not started', () => {
    expect(nextDates(pata, '2026-12-01')?.start).toBe('2027-01-18')
    expect(nextDates(pata, '2026-10-28')?.start).toBe('2026-11-16')
  })
  it('counts days inclusively', () => {
    expect(daysIn({ start: '2026-11-16', end: '2026-11-19' })).toBe(4)
  })
})

describe('filterPlacements', () => {
  it('filters by field, duration, town and text', () => {
    expect(filterPlacements(PLACEMENTS, COMPANIES, { ...none, field: 'cyber' }).map((p) => p.id)).toEqual(['jets-network-check'])
    expect(filterPlacements(PLACEMENTS, COMPANIES, { ...none, duration: '5' })).toHaveLength(2)
    expect(filterPlacements(PLACEMENTS, COMPANIES, { ...none, location: 'Brocēni' }).every((p) => ['warmeston', 'schwenk'].includes(p.companyId))).toBe(true)
    expect(filterPlacements(PLACEMENTS, COMPANIES, { ...none, q: 'druva' }).map((p) => p.id)).toEqual(['tervete-cold-chain'])
  })
})

describe('status and certificates', () => {
  it('only allows the company workflow order', () => {
    expect(canMove('applied', 'accepted')).toBe(true)
    expect(canMove('applied', 'completed')).toBe(false)
    expect(canMove('in_progress', 'completed')).toBe(true)
    expect(canMove('completed', 'declined')).toBe(false)
  })
  it('numbers certificates per year', () => {
    expect(nextCertificateId(['SEER-2026-0042', 'SEER-2025-0100'], 2026)).toBe('SEER-2026-0043')
    expect(nextCertificateId([], 2027)).toBe('SEER-2027-0001')
  })
})

describe('validation', () => {
  const ok: ApplicationForm = {
    name: 'Anna', age: '19', school: 'Saldus tehnikums', email: 'anna@example.lv', phone: '',
    dates: '2026-11-16', motivation: 'Gribu iemācīties strādāt ar ražošanas datiem.', experience: '',
    guardianConsent: false, guardianContact: '', shareConsent: true,
  }
  it('accepts a complete adult application', () => {
    expect(validateApplication(ok, pata)).toEqual({})
  })
  it('requires guardian consent under 18 and enforces the minimum age', () => {
    expect(validateApplication({ ...ok, age: '16' }, pata)).toMatchObject({ guardianConsent: 'guardian', guardianContact: 'required' })
    const jets = PLACEMENTS.find((p) => p.id === 'jets-network-check') as Placement
    expect(validateApplication({ ...ok, age: '15', guardianConsent: true, guardianContact: 'x' }, jets).age).toBe('tooYoung')
    expect(validateApplication({ ...ok, email: 'nope' }, pata).email).toBe('email')
  })
  it('checks the constructor: 3–5 certificate skills, valid dates and deadline before start', () => {
    const company = COMPANIES[0]
    expect(validateDraft({ company, placement: pata })).toEqual({})
    expect(validateDraft({ company, placement: { ...pata, certificateSkills: pata.certificateSkills.slice(0, 2) } }).certificateSkills).toBe('skills')
    expect(validateDraft({ company, placement: { ...pata, deadline: '2026-12-31' } }).deadline).toBe('deadline')
  })
  it('keeps the day plan the same length as the duration', () => {
    expect(fitDayPlan(['a', 'b'], 4, () => '')).toEqual(['a', 'b', '', ''])
    expect(fitDayPlan(['a', 'b', 'c', 'd'], 3, () => '')).toEqual(['a', 'b', 'c'])
  })
})
