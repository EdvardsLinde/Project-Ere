import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Clock,
  Gift,
  Languages,
  ListChecks,
  MapPin,
  Wifi,
} from 'lucide-react'
import { CAREERS, PROVIDERS, SKILL_AREAS } from '../../data'
import type { Job } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { effectiveSkills, jobFit, jobMissing } from '../../lib/skills'
import { Button, Card, Meter, cx } from '../../components/ui'
import { ExampleBadge } from '../../components/cards'
import { Modal } from '../../components/Modal'

function fitTone(fit: number) {
  if (fit >= 80) return 'bg-accent-100 text-accent-800'
  if (fit >= 50) return 'bg-brand-50 text-brand-800'
  return 'bg-slate-100 text-slate-600'
}

/** Jobs as a compact list: only the title and key facts. Tap a row for details. */
export function JobList({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState<Job | null>(null)
  return (
    <>
      <Card className="divide-y divide-slate-100 overflow-hidden">
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} onOpen={() => setOpen(job)} />
        ))}
      </Card>
      {open && <JobDetail job={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function JobRow({ job, onOpen }: { job: Job; onOpen: () => void }) {
  const { t, l, profile } = useApp()
  const provider = PROVIDERS.find((p) => p.id === job.providerId)!
  const fit = jobFit(job, effectiveSkills(profile))
  const saved = profile.savedJobs.includes(job.id)
  const applied = profile.appliedJobs.includes(job.id)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:bg-brand-50 focus-visible:outline-none"
    >
      <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold', provider.tone)}>
        {provider.name.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-slate-900 group-hover:text-brand-700">{l(job.title)}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
          <span>{provider.name}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            {job.location !== 'saldus' && <Wifi className="size-3 text-accent-600" />}
            {t.jobs.locations[job.location]}
          </span>
          <span aria-hidden>·</span>
          <span>{t.jobs.employment[job.employment]}</span>
          {(applied || saved) && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-accent-700">
              <Check className="size-3" strokeWidth={3} /> {applied ? t.jobs.applied : t.jobs.saved}
            </span>
          )}
        </span>
      </span>
      {profile.testResult && (
        <span className={cx('shrink-0 rounded-lg px-2 py-1 text-sm font-bold tabular-nums', fitTone(fit))} title={t.jobs.fit}>
          {fit}%
        </span>
      )}
      <ChevronRight className="size-5 shrink-0 text-slate-300 group-hover:text-brand-600" />
    </button>
  )
}

/** Detail window: what the employer requires, expects and offers. */
function JobDetail({ job, onClose }: { job: Job; onClose: () => void }) {
  const { t, l, profile, update, goTo } = useApp()
  const provider = PROVIDERS.find((p) => p.id === job.providerId)!
  const career = CAREERS.find((c) => c.id === job.track)
  const skills = effectiveSkills(profile)
  const fit = jobFit(job, skills)
  const missing = jobMissing(job, skills)
  const saved = profile.savedJobs.includes(job.id)
  const applied = profile.appliedJobs.includes(job.id)

  return (
    <Modal
      open
      onClose={onClose}
      title={l(job.title)}
      footer={
        <>
          <Button
            variant={applied ? 'secondary' : 'primary'}
            onClick={() => update({ appliedJobs: toggle(profile.appliedJobs, job.id) })}
            title={t.courses.appliedHint}
          >
            {applied && <Check className="size-4" strokeWidth={2.5} />}
            {applied ? t.jobs.applied : t.jobs.apply}
          </Button>
          <Button variant="secondary" onClick={() => update({ savedJobs: toggle(profile.savedJobs, job.id) })} aria-pressed={saved}>
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {saved ? t.jobs.saved : t.jobs.save}
          </Button>
          {profile.testResult && missing.length > 0 && (
            <Button
              variant="ghost"
              className="ml-auto"
              onClick={() => {
                onClose()
                goTo('courses')
              }}
            >
              {t.jobs.findCourses}
            </Button>
          )}
        </>
      }
    >
      <div className="p-5 pr-14 sm:p-6 sm:pr-16">
        <div className="flex items-center gap-3">
          <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-xl font-extrabold', provider.tone)}>
            {provider.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="font-semibold text-slate-800">{provider.name}</p>
              <ExampleBadge />
            </div>
            <p className="text-xs text-slate-500">{l(provider.kind)}</p>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{l(job.title)}</h2>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <Fact>{t.jobs.employment[job.employment]}</Fact>
          {career && (
            <Fact>
              <career.icon className="size-3.5" /> {l(career.title)}
            </Fact>
          )}
          <Fact>
            <MapPin className="size-3.5" /> {t.jobs.locations[job.location]}
          </Fact>
          <Fact>
            <Languages className="size-3.5" /> {job.languages.map((x) => t.filters.langs[x]).join(', ')}
          </Fact>
          <Fact>{t.jobs.minAge(job.minAge)}</Fact>
          {job.location !== 'saldus' && (
            <Fact strong>
              <Wifi className="size-3.5" /> {t.paths.remote}
            </Fact>
          )}
        </div>
        <p className="mt-4 text-sm text-slate-700">{l(job.description)}</p>

        {profile.testResult && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-slate-800">{t.jobs.yourFit}</span>
              <span className="text-lg font-extrabold text-brand-700 tabular-nums">{fit}%</span>
            </div>
            <div className="mt-2">
              <Meter value={fit} label={t.jobs.yourFit} />
            </div>
            <p className="mt-2 text-xs text-slate-600">
              {missing.length ? (
                <>
                  {t.jobs.missing} {missing.map((id) => l(SKILL_AREAS.find((s) => s.id === id)!.label)).join(', ')}
                </>
              ) : (
                t.jobs.allSet
              )}
            </p>
          </div>
        )}

        <Section icon={<ListChecks className="size-4" />} title={t.jobs.requires} items={job.requires.map(l)} />
        <Section icon={<CircleCheck className="size-4" />} title={t.jobs.expects} items={job.expects.map(l)} />
        <Section icon={<Gift className="size-4" />} title={t.jobs.offers} items={job.offers.map(l)} tone="accent" />
        <p className="mt-5 flex items-center gap-2 text-sm text-slate-600">
          <Clock className="size-4 text-slate-400" /> <span className="font-semibold">{t.jobs.schedule}:</span> {l(job.schedule)}
        </p>
      </div>
    </Modal>
  )
}

function Fact({ strong, children }: { strong?: boolean; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium',
        strong ? 'bg-accent-100 text-accent-800' : 'bg-slate-100 text-slate-700',
      )}
    >
      {children}
    </span>
  )
}

function Section({ icon, title, items, tone = 'brand' }: { icon: ReactNode; title: string; items: string[]; tone?: 'brand' | 'accent' }) {
  return (
    <section className="mt-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span
          className={cx(
            'flex size-7 items-center justify-center rounded-lg',
            tone === 'accent' ? 'bg-accent-100 text-accent-700' : 'bg-brand-50 text-brand-700',
          )}
        >
          {icon}
        </span>
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5 pl-9">
        {items.map((item) => (
          <li key={item} className="list-disc text-sm text-slate-700 marker:text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
