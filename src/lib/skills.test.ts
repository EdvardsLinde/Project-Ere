import { describe, expect, it } from 'vitest'
import { COURSES, JOBS, SKILL_AREAS, TASKS, TEST_QUESTIONS } from '../data'
import type { SkillAreaId } from '../data'
import { emptyProfile } from './state'
import type { Profile } from './state'
import { effectiveSkills, jobFit, jobMissing, readiness, scoreTest } from './skills'
import { CAREERS } from '../data'
import { nextStep } from './nextStep'

/** Answer every question with the given option index (clamped to the question's options). */
const answerAll = (pick: (qIndex: number) => number) =>
  Object.fromEntries(TEST_QUESTIONS.map((q, i) => [q.id, Math.min(pick(i), q.options.length - 1)]))

const allSkills = (level: number) =>
  Object.fromEntries(SKILL_AREAS.map((s) => [s.id, level])) as Record<SkillAreaId, number>

const profileWith = (patch: Partial<Profile>): Profile => ({ ...emptyProfile, name: 'Anna', ...patch })

describe('scoreTest', () => {
  it('ranks IT support first when interest answers all point to it', () => {
    // Option 3 is the IT-support answer in every interest question.
    const result = scoreTest(answerAll((i) => (TEST_QUESTIONS[i].kind === 'interest' ? 3 : 2)))
    const best = Object.entries(result.trackScores).sort((a, b) => b[1] - a[1])[0][0]
    expect(best).toBe('it-support')
  })

  it('caps self-rated skills at 70, so higher levels need proof', () => {
    const result = scoreTest(answerAll(() => 4)) // highest option everywhere
    expect(result.skills.programming).toBe(70)
    expect(result.skills.english).toBe(70)
  })

  it('estimates the data skill from maths and programming', () => {
    const result = scoreTest(answerAll(() => 4))
    expect(result.skills.data).toBe(Math.round((70 * 0.6 + 70 * 0.4) * 0.8))
  })

  it('keeps every track score between 0 and 100', () => {
    for (const pick of [0, 1, 2, 3, 4]) {
      const { trackScores } = scoreTest(answerAll(() => pick))
      for (const v of Object.values(trackScores)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('effectiveSkills', () => {
  const base = scoreTest(answerAll(() => 0))

  it('adds gains from completed courses only', () => {
    const course = COURSES[0]
    const started = effectiveSkills(profileWith({ testResult: base, courseProgress: { [course.id]: 'started' } }))
    const completed = effectiveSkills(profileWith({ testResult: base, courseProgress: { [course.id]: 'completed' } }))
    for (const [id, gain] of Object.entries(course.skills)) {
      expect(started[id as SkillAreaId]).toBe(base.skills[id as SkillAreaId])
      expect(completed[id as SkillAreaId]).toBe(Math.min(100, base.skills[id as SkillAreaId] + gain))
    }
  })

  it('adds gains from solved training tasks', () => {
    const task = TASKS[0]
    const levels = effectiveSkills(profileWith({ testResult: base, taskProgress: { [task.id]: 'done' } }))
    for (const [id, gain] of Object.entries(task.skills)) {
      expect(levels[id as SkillAreaId]).toBe(base.skills[id as SkillAreaId] + gain)
    }
  })

  it('never goes above 100', () => {
    const everything = Object.fromEntries(COURSES.map((c) => [c.id, 'completed' as const]))
    const levels = effectiveSkills(profileWith({ testResult: scoreTest(answerAll(() => 4)), courseProgress: everything }))
    for (const v of Object.values(levels)) expect(v).toBeLessThanOrEqual(100)
  })
})

describe('jobFit and readiness', () => {
  const job = JOBS[0]

  it('is 100% when every required level is met', () => {
    expect(jobFit(job, allSkills(100))).toBe(100)
    expect(jobMissing(job, allSkills(100))).toEqual([])
  })

  it('is proportional when levels are half of what is needed', () => {
    const half = { ...allSkills(0) }
    for (const [id, need] of Object.entries(job.requiredSkills)) half[id as SkillAreaId] = need / 2
    expect(jobFit(job, half)).toBe(50)
  })

  it('readiness is 1 when all track skills are met', () => {
    expect(readiness(CAREERS[0], allSkills(100))).toBe(1)
  })
})

describe('nextStep', () => {
  it('walks the core path: profile → test → tasks → course → jobs', () => {
    expect(nextStep(emptyProfile).kind).toBe('profile')
    expect(nextStep(profileWith({})).kind).toBe('test')

    const low = scoreTest(answerAll(() => 0))
    const withTest = profileWith({ testResult: low, careerId: 'cyber' })
    expect(nextStep(withTest).kind).toBe('tasks')

    const allTasks = Object.fromEntries(TASKS.map((x) => [x.id, 'done' as const]))
    expect(nextStep({ ...withTest, taskProgress: allTasks }).kind).toBe('course')

    const maxed = { ...low, skills: allSkills(100) }
    expect(nextStep(profileWith({ testResult: maxed, careerId: 'cyber' })).kind).toBe('jobs')
  })
})
