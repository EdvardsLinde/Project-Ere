import { Bookmark, BookmarkCheck, Check, MapPin, Wifi } from 'lucide-react'
import { CAREERS, PROVIDERS, SKILL_AREAS } from '../../data'
import type { Job } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { effectiveSkills, jobFit, jobMissing } from '../../lib/skills'
import { Button, Card, cx } from '../../components/ui'
import { ExampleBadge } from '../../components/cards'

/** Fit badge colour: strong / partial / far. */
function fitTone(fit: number) {
  if (fit >= 80) return 'bg-accent-100 text-accent-800 ring-accent-300'
  if (fit >= 50) return 'bg-brand-50 text-brand-800 ring-brand-200'
  return 'bg-slate-100 text-slate-600 ring-slate-200'
}

export function JobCard({ job, compact = false }: { job: Job; compact?: boolean }) {
  const { t, l, lang, profile, update, goTo } = useApp()
  const provider = PROVIDERS.find((p) => p.id === job.providerId)!
  const career = CAREERS.find((c) => c.id === job.track)
  const skills = effectiveSkills(profile)
  const hasTest = !!profile.testResult
  const fit = jobFit(job, skills)
  const missing = jobMissing(job, skills)
  const saved = profile.savedJobs.includes(job.id)
  const applied = profile.appliedJobs.includes(job.id)
  const remoteOk = job.location !== 'saldus'
  const posted = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'short' }).format(
    new Date(job.posted),
  )

  return (
    <Card className="flex h-full flex-col p-5 transition hover:shadow-lift sm:p-6">
      <div className="flex items-start gap-3">
        <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold', provider.tone)}>
          {provider.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-slate-800">{provider.name}</p>
            <ExampleBadge />
          </div>
          <p className="truncate text-xs text-slate-500">
            {l(provider.kind)} · {t.jobs.posted(posted)}
          </p>
        </div>
        {hasTest && (
          <span
            className={cx('shrink-0 rounded-xl px-2.5 py-1.5 text-center ring-1', fitTone(fit))}
            title={t.jobs.fit}
          >
            <span className="block text-lg leading-none font-extrabold tabular-nums">{fit}%</span>
            <span className="text-[10px] font-semibold tracking-wide uppercase">{t.jobs.fit}</span>
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg leading-snug font-bold text-slate-900">{l(job.title)}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          {t.jobs.employment[job.employment]}
        </span>
        {career && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{l(career.title)}</span>}
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{t.jobs.minAge(job.minAge)}</span>
      </div>
      {!compact && <p className="mt-3 line-clamp-2 text-sm text-slate-600">{l(job.description)}</p>}

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <MapPin className="size-4 text-slate-400" /> {t.jobs.locations[job.location]}
        </span>
        {remoteOk && (
          <span className="inline-flex items-center gap-1.5 font-medium text-accent-700">
            <Wifi className="size-4" /> {t.paths.remote}
          </span>
        )}
      </p>

      {hasTest && (
        <p className="mt-3 text-xs text-slate-500">
          {missing.length ? (
            <>
              {t.jobs.missing}{' '}
              {missing.map((id) => (
                <span key={id} className="mr-1 inline-block rounded-md bg-amber-50 px-1.5 py-0.5 font-medium text-amber-800">
                  {l(SKILL_AREAS.find((s) => s.id === id)!.label)}
                </span>
              ))}
            </>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-accent-700">
              <Check className="size-3.5" strokeWidth={3} /> {t.jobs.allSet}
            </span>
          )}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <Button
          variant={applied ? 'secondary' : 'primary'}
          onClick={() => update({ appliedJobs: toggle(profile.appliedJobs, job.id) })}
          title={t.courses.appliedHint}
        >
          {applied && <Check className="size-4" strokeWidth={2.5} />}
          {applied ? t.jobs.applied : t.jobs.apply}
        </Button>
        {hasTest && missing.length > 0 && !compact && (
          <Button variant="ghost" onClick={() => goTo('courses')}>
            {t.jobs.findCourses}
          </Button>
        )}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? t.jobs.saved : t.jobs.save}
          title={saved ? t.jobs.saved : t.jobs.save}
          onClick={() => update({ savedJobs: toggle(profile.savedJobs, job.id) })}
          className={cx(
            'ml-auto flex size-10 cursor-pointer items-center justify-center rounded-lg transition',
            saved ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
          )}
        >
          {saved ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
        </button>
      </div>
    </Card>
  )
}
