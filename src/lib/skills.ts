/**
 * ERE — scoring helpers shared by the skills test, career match, courses and jobs.
 * Pure functions (no React), so they can move to a backend unchanged.
 *
 * Skill levels are 0–100.
 *   base level      = from the skills test (or 0 if not taken)
 *   effective level = base + gains from completed courses and solved tasks (capped at 100)
 */
import { CAREERS, COURSES, SKILL_AREAS, TASKS, TEST_QUESTIONS } from '../data'
import type { Career, Course, Job, SkillAreaId, TrackId } from '../data'
import type { Profile, TestResult } from './state'

export const TRACK_IDS: TrackId[] = ['cyber', 'ai-data', 'web', 'it-support']
const SKILL_IDS = SKILL_AREAS.map((s) => s.id)

export type SkillLevels = Record<SkillAreaId, number>

const zeroSkills = (): SkillLevels => Object.fromEntries(SKILL_IDS.map((id) => [id, 0])) as SkillLevels
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/** Share (0–1) of a track's required skill levels the user already has. */
export function readiness(track: Career, skills: SkillLevels): number {
  const req = Object.entries(track.requiredSkills) as [SkillAreaId, number][]
  if (!req.length) return 0
  return req.reduce((sum, [id, target]) => sum + Math.min(skills[id] / target, 1), 0) / req.length
}

/**
 * Turn test answers (question id → option index) into track scores and base skills.
 * Track score = 60% interest answers + 40% readiness from the skills the user rated.
 */
export function scoreTest(answers: Record<string, number>): TestResult {
  const interest = Object.fromEntries(TRACK_IDS.map((t) => [t, 0])) as Record<TrackId, number>
  const maxInterest = Object.fromEntries(TRACK_IDS.map((t) => [t, 0])) as Record<TrackId, number>
  const skills = Object.fromEntries(SKILL_IDS.map((id) => [id, 10])) as SkillLevels

  for (const q of TEST_QUESTIONS) {
    for (const t of TRACK_IDS) maxInterest[t] += Math.max(0, ...q.options.map((o) => o.tracks?.[t] ?? 0))
    const opt = q.options[answers[q.id]]
    if (!opt) continue
    for (const [t, pts] of Object.entries(opt.tracks ?? {})) interest[t as TrackId] += pts
    for (const [id, level] of Object.entries(opt.skills ?? {})) skills[id as SkillAreaId] = level
  }
  // There is no separate data question: estimate it from maths and programming.
  skills.data = clamp((skills.math * 0.6 + skills.programming * 0.4) * 0.8)

  const trackScores = Object.fromEntries(
    TRACK_IDS.map((t) => {
      const career = CAREERS.find((c) => c.id === t)!
      const interestShare = maxInterest[t] ? interest[t] / maxInterest[t] : 0
      return [t, clamp(100 * (0.6 * interestShare + 0.4 * readiness(career, skills)))]
    }),
  ) as Record<TrackId, number>

  return { answers, trackScores, skills, takenAt: new Date().toISOString() }
}

/** Skill levels after completed courses. Without a test, starts from 0. */
export function effectiveSkills(profile: Profile): SkillLevels {
  const levels = { ...zeroSkills(), ...(profile.testResult?.skills ?? {}) }
  for (const course of COURSES) {
    if (profile.courseProgress[course.id] !== 'completed') continue
    for (const [id, gain] of Object.entries(course.skills)) {
      levels[id as SkillAreaId] = clamp(levels[id as SkillAreaId] + gain)
    }
  }
  for (const task of TASKS) {
    if (profile.taskProgress?.[task.id] !== 'done') continue
    for (const [id, gain] of Object.entries(task.skills)) {
      levels[id as SkillAreaId] = clamp(levels[id as SkillAreaId] + gain)
    }
  }
  return levels
}

/** Tracks ordered best-first by test score (or 0 without a test). */
export function rankedTracks(profile: Profile) {
  return CAREERS.map((career) => ({ career, score: profile.testResult?.trackScores[career.id] ?? 0 })).sort(
    (a, b) => b.score - a.score,
  )
}

/** The user's chosen track, else their best test match, else the first track. */
export function currentTrack(profile: Profile): Career {
  return (
    CAREERS.find((c) => c.id === profile.careerId) ??
    (profile.testResult ? rankedTracks(profile)[0].career : CAREERS[0])
  )
}

export interface SkillGap {
  id: SkillAreaId
  target: number
  current: number
  /** Points still missing (0 = done). */
  gap: number
}

export function skillGaps(track: Career, skills: SkillLevels): SkillGap[] {
  return (Object.entries(track.requiredSkills) as [SkillAreaId, number][])
    .map(([id, target]) => ({ id, target, current: skills[id], gap: Math.max(0, target - skills[id]) }))
    .sort((a, b) => b.gap - a.gap)
}

/** Gap skills (ids) a course improves, for the "closes your gap" badge. */
export function gapsClosedBy(course: Course, gaps: SkillGap[]): SkillAreaId[] {
  return gaps.filter((g) => g.gap > 0 && (course.skills[g.id] ?? 0) > 0).map((g) => g.id)
}

/** How many missing points a course would close for this track. */
export function gapValue(course: Course, gaps: SkillGap[]): number {
  return gaps.reduce((sum, g) => sum + Math.min(g.gap, course.skills[g.id] ?? 0), 0)
}

/** Courses best at closing the user's gaps (excluding completed ones). */
export function coursesForGaps(profile: Profile, track: Career, limit = 3): Course[] {
  const gaps = skillGaps(track, effectiveSkills(profile))
  return COURSES.filter((c) => profile.courseProgress[c.id] !== 'completed' && gapValue(c, gaps) > 0)
    .sort((a, b) => gapValue(b, gaps) - gapValue(a, gaps))
    .slice(0, limit)
}

/** Job fit 0–100: average share of each required skill level the user has. */
export function jobFit(job: Job, skills: SkillLevels): number {
  const req = Object.entries(job.requiredSkills) as [SkillAreaId, number][]
  if (!req.length) return 100
  return clamp((100 * req.reduce((s, [id, need]) => s + Math.min(skills[id] / need, 1), 0)) / req.length)
}

/** Skills where the user is below what the job asks for. */
export function jobMissing(job: Job, skills: SkillLevels): SkillAreaId[] {
  return (Object.entries(job.requiredSkills) as [SkillAreaId, number][])
    .filter(([id, need]) => skills[id] < need)
    .map(([id]) => id)
}

/** Overall progress for the header ring: readiness for the current track (0–100). */
export function overallProgress(profile: Profile): number {
  if (!profile.testResult) return 0
  return clamp(100 * readiness(currentTrack(profile), effectiveSkills(profile)))
}
