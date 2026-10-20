import { ArrowRight, Check, ClipboardCheck, RotateCcw, Route, Target } from 'lucide-react'
import type { ReactNode } from 'react'
import { JOBS, SKILL_AREAS } from '../../data'
import { useApp } from '../../lib/state'
import { coursesForGaps, currentTrack, effectiveSkills, jobFit, rankedTracks, readiness, skillGaps } from '../../lib/skills'
import { Button, Card, Meter, PageHeader, cx } from '../../components/ui'
import { CourseCard } from '../../components/cards'
import { Illustration } from '../../components/Illustration'
import { JobCard } from '../jobs/JobCard'

/**
 * Career Match ("Mans ceļš"): best-fit tracks from the skills test, what the work
 * involves, the skills it needs vs the user's levels, and what closes the gaps.
 */
export function MyPath() {
  const { t, l, profile, update, goTo } = useApp()

  if (!profile.testResult) {
    return (
      <Card className="mx-auto max-w-xl p-8 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <ClipboardCheck className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">{t.match.noTestTitle}</h1>
        <p className="mt-2 text-slate-600">{t.match.noTestText}</p>
        <Button size="lg" className="mt-6" onClick={() => goTo('test')}>
          {t.match.takeTest} <ArrowRight className="size-5" />
        </Button>
      </Card>
    )
  }

  const track = currentTrack(profile)
  const skills = effectiveSkills(profile)
  const gaps = skillGaps(track, skills)
  const ready = Math.round(100 * readiness(track, skills))
  const courses = coursesForGaps(profile, track)
  const jobs = JOBS.filter((j) => j.track === track.id)
    .sort((a, b) => jobFit(b, skills) - jobFit(a, skills))
    .slice(0, 2)
  const skill = (id: string) => SKILL_AREAS.find((s) => s.id === id)!

  return (
    <>
      <PageHeader icon={Target} eyebrow={t.match.eyebrow} title={t.match.title(l(track.title))} />

      {/* Track ranking — tap to switch path */}
      <section aria-label={t.match.ranking} className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {rankedTracks(profile).map(({ career, score }) => {
          const on = career.id === track.id
          return (
            <button
              key={career.id}
              type="button"
              aria-pressed={on}
              onClick={() => update({ careerId: career.id })}
              className={cx(
                'flex cursor-pointer flex-col gap-3 rounded-2xl p-4 text-left transition',
                on ? 'bg-brand-50 shadow-card ring-2 ring-brand-600' : 'bg-card shadow-card ring-1 ring-slate-200 hover:ring-brand-300',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className={cx('flex size-9 items-center justify-center rounded-lg ring-1', career.tone)}>
                  <career.icon className="size-4.5" />
                </span>
                <span className="text-lg font-extrabold text-brand-700 tabular-nums">{score}%</span>
              </span>
              <span className="text-sm leading-tight font-semibold text-slate-900">{l(career.title)}</span>
              <span className={cx('text-xs font-semibold', on ? 'text-brand-700' : 'text-slate-400')}>
                {on ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="size-3.5" strokeWidth={3} /> {t.match.chosen}
                  </span>
                ) : (
                  t.match.choose
                )}
              </span>
            </button>
          )
        })}
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          {/* Skills: current vs needed */}
          <Card className="p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{t.match.skillsTitle}</h2>
                <p className="mt-1 text-sm text-slate-500">{t.match.skillsHint}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-brand-700 tabular-nums">{ready}%</p>
                <p className="text-xs text-slate-500" title={t.match.readinessHint}>
                  {t.match.readiness}
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-5">
              {gaps.map((g) => {
                const s = skill(g.id)
                return (
                  <li key={g.id}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                          <s.icon className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-slate-900">{l(s.label)}</span>
                          <span className="block text-xs text-slate-500">{l(s.hint)}</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-3 text-sm">
                        <span className="text-slate-500 tabular-nums">
                          {t.match.you} <b className="text-slate-900">{g.current}</b> / {t.match.needed} {g.target}
                        </span>
                        {g.gap === 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-800">
                            <Check className="size-3" strokeWidth={3} /> {t.match.done}
                          </span>
                        ) : (
                          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 tabular-nums">
                            {t.match.gap(g.gap)}
                          </span>
                        )}
                      </span>
                    </div>
                    <Meter value={g.current} target={g.target} tone={g.gap === 0 ? 'accent' : 'brand'} label={l(s.label)} />
                  </li>
                )
              })}
            </ul>
          </Card>

          <Section title={t.match.gapCourses} action={t.match.seeCourses} onAction={() => goTo('courses')}>
            {courses.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {courses.map((c) => (
                  <CourseCard key={c.id} course={c} compact />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-accent-50 p-4 text-sm font-medium text-accent-800">{t.match.noGaps}</p>
            )}
          </Section>

          <Section title={t.match.jobsTitle} action={t.match.seeJobs} onAction={() => goTo('jobs')}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} compact />
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <Card className="overflow-hidden">
            <Illustration scene={track.id} size="md" />
            <div className="p-5 sm:p-6">
            <h2 className="font-bold text-slate-900">{t.match.whatIs}</h2>
            <h3 className="mt-5 text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.match.dayToDay}</h3>
            <ul className="mt-3 space-y-2">
              {track.dayToDay.map((d) => (
                <li key={d.lv} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent-500" strokeWidth={2.5} /> {l(d)}
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-6 w-full" onClick={() => goTo('training')}>
              <Route className="size-4" /> {t.match.learningPath}
            </Button>
            </div>
          </Card>
          <Button variant="ghost" className="w-full" onClick={() => goTo('test')}>
            <RotateCcw className="size-4" /> {t.match.retake}
          </Button>
        </aside>
      </div>
    </>
  )
}

function Section({ title, action, onAction, children }: { title: string; action: string; onAction: () => void; children: ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
        <button
          type="button"
          onClick={onAction}
          className="-mr-2 inline-flex h-10 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-3 text-sm font-semibold whitespace-nowrap text-brand-700 hover:bg-brand-50"
        >
          {action} <ArrowRight className="size-4" />
        </button>
      </div>
      {children}
    </section>
  )
}
