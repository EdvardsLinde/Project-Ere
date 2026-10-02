import { ArrowRight, BookOpen, Clock, Laptop, Rocket, Trophy, Wrench } from 'lucide-react'
import { CAREERS, TRAINING } from '../data'
import { useApp } from '../state'
import { ActionBar, Button, Card, PageHeader, cx } from '../components/ui'
import { useRankedCareers } from './Paths'

const STEP_ICONS = [BookOpen, Wrench, Rocket]

export function Training() {
  const { t, l, profile, update, next, goTo, onboarded, editing } = useApp()
  const ranked = useRankedCareers()
  // Fall back to the best-matching career if the user jumped here from the nav.
  const career = CAREERS.find((c) => c.id === profile.careerId) ?? ranked[0].career
  const steps = TRAINING[career.id]
  const CareerIcon = career.icon

  return (
    <>
      <PageHeader
        eyebrow={t.training.eyebrow}
        title={t.training.title(l(career.title))}
        subtitle={t.training.subtitle}
        aside={
          <span className={cx('hidden size-16 shrink-0 items-center justify-center rounded-2xl ring-1 md:flex', career.tone)}>
            <CareerIcon className="size-8" />
          </span>
        }
      />

      <div className="-mt-2 mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-slate-500">{t.training.switchCareer}</span>
        {CAREERS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => update({ careerId: c.id })}
            aria-pressed={c.id === career.id}
            className={cx(
              'min-h-10 cursor-pointer rounded-full px-4 text-sm font-medium transition',
              c.id === career.id
                ? 'bg-brand-600 text-white'
                : 'bg-card text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            {l(c.title)}
          </button>
        ))}
      </div>

      <ol key={career.id} className="relative grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
        {/* connector line (desktop) */}
        <span aria-hidden className="absolute top-11 right-[16%] left-[16%] hidden h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-accent-300 md:block" />
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i]
          return (
            <li key={i} className="animate-fade-up relative" style={{ animationDelay: `${i * 80}ms` }}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3 md:flex-col md:items-start">
                  <span
                    className={cx(
                      'relative flex size-11 items-center justify-center rounded-full text-base font-bold ring-4 ring-card',
                      i === 2 ? 'bg-accent-500 text-on-accent' : 'bg-brand-600 text-white',
                    )}
                  >
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 md:mt-2">
                    {i + 1}. {t.training.steps[i]}
                  </h2>
                </div>
                <p className="mt-3 mb-6 leading-relaxed text-slate-600">{l(step.description)}</p>

                <dl className="mt-auto space-y-2.5 border-t border-slate-100 pt-5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-4 shrink-0 text-slate-400" />
                    <dt className="sr-only">{t.training.duration}</dt>
                    <dd className="text-slate-700">{l(step.duration)}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Laptop className="size-4 shrink-0 text-slate-400" />
                    <dt className="sr-only">{t.training.format}</dt>
                    <dd className="text-slate-700">{l(step.format)}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0 text-accent-500" />
                    <dt className="sr-only">{t.training.outcome}</dt>
                    <dd className="font-medium text-slate-900">{l(step.outcome)}</dd>
                  </div>
                </dl>
              </Card>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-50 px-5 py-4 text-sm text-brand-900 ring-1 ring-brand-100">
        <Trophy className="size-5 shrink-0 text-brand-600" />
        {t.training.total}
      </div>

      <ActionBar>
        {onboarded && !editing ? (
          <Button size="lg" onClick={() => goTo('courses')}>
            {t.training.findCourses} <ArrowRight className="size-5" />
          </Button>
        ) : (
          <Button size="lg" onClick={() => next()}>
            {t.common.next} <ArrowRight className="size-5" />
          </Button>
        )}
      </ActionBar>
    </>
  )
}
