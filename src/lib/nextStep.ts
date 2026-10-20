/**
 * ERE — "what should I do next?" Guides the user along the core path:
 * profile → skills test → training tasks / courses that close gaps → jobs.
 */
import { COURSES, TASKS } from '../data'
import type { Course } from '../data'
import type { Profile, Step } from './state'
import { coursesForGaps, currentTrack, effectiveSkills, gapValue, skillGaps } from './skills'

export type NextStep =
  | { kind: 'profile'; to: Step }
  | { kind: 'test'; to: Step }
  | { kind: 'tasks'; to: Step; course: Course; left: number }
  | { kind: 'course'; to: Step; course: Course }
  | { kind: 'jobs'; to: Step }

export function nextStep(profile: Profile): NextStep {
  if (!profile.name) return { kind: 'profile', to: 'welcome' }
  if (!profile.testResult) return { kind: 'test', to: 'test' }

  const track = currentTrack(profile)
  const gaps = skillGaps(track, effectiveSkills(profile))
  if (gaps.some((g) => g.gap > 0)) {
    // Free training tasks first: quick to do and they prove skills.
    const withTasks = COURSES.find((c) => {
      const left = TASKS.filter((x) => x.courseId === c.id && profile.taskProgress[x.id] !== 'done').length
      return left > 0 && (c.careerId === track.id || gapValue(c, gaps) > 0)
    })
    if (withTasks) {
      const left = TASKS.filter((x) => x.courseId === withTasks.id && profile.taskProgress[x.id] !== 'done').length
      return { kind: 'tasks', to: 'course', course: withTasks, left }
    }
    const course = coursesForGaps(profile, track, 1)[0]
    if (course) return { kind: 'course', to: 'course', course }
  }
  return { kind: 'jobs', to: 'jobs' }
}
