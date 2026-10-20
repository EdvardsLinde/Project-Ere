import { useState } from 'react'
import type { ReactNode } from 'react'
import { BriefcaseBusiness, ClipboardCheck, Info, Wifi } from 'lucide-react'
import { CAREERS, JOBS } from '../../data'
import type { Employment, JobLocation, TrackId } from '../../data'
import { useApp } from '../../lib/state'
import { effectiveSkills, jobFit } from '../../lib/skills'
import { Button, Chip, PageHeader } from '../../components/ui'
import { ExampleNotice } from '../../components/cards'
import { JobCard } from './JobCard'

/** Jobs & local market: IT roles in Saldus and remote, matched against the user's skills. */
export function Jobs() {
  const { t, l, profile, goTo } = useApp()
  const [track, setTrack] = useState<TrackId | null>(null)
  const [location, setLocation] = useState<JobLocation | null>(null)
  const [employment, setEmployment] = useState<Employment | null>(null)

  const skills = effectiveSkills(profile)
  const results = JOBS.filter(
    (j) => (!track || j.track === track) && (!location || j.location === location) && (!employment || j.employment === employment),
  ).sort((a, b) => jobFit(b, skills) - jobFit(a, skills) || b.posted.localeCompare(a.posted))
  const remoteCount = JOBS.filter((j) => j.location !== 'saldus').length
  const hasFilters = !!(track || location || employment)

  return (
    <>
      <PageHeader eyebrow={t.jobs.eyebrow} title={t.jobs.title} subtitle={t.jobs.subtitle} />
      <ExampleNotice />

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl bg-accent-50 px-4 py-3 text-sm font-medium text-accent-800 ring-1 ring-accent-200">
          <Wifi className="size-5 shrink-0" /> {t.jobs.remoteBanner(remoteCount, JOBS.length)}
        </div>
        {!profile.testResult && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-900 ring-1 ring-brand-200">
            <ClipboardCheck className="size-5 shrink-0" />
            <span className="min-w-0 flex-1">{t.jobs.noTestHint}</span>
            <Button className="h-9" onClick={() => goTo('test')}>
              {t.jobs.takeTest}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <FilterRow label={t.jobs.track}>
          <Chip selected={!track} onClick={() => setTrack(null)}>{t.jobs.all}</Chip>
          {CAREERS.map((c) => (
            <Chip key={c.id} selected={track === c.id} onClick={() => setTrack(track === c.id ? null : c.id)}>
              {l(c.title)}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label={t.jobs.location}>
          {(Object.keys(t.jobs.locations) as JobLocation[]).map((k) => (
            <Chip key={k} selected={location === k} onClick={() => setLocation(location === k ? null : k)}>
              {t.jobs.locations[k]}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label={t.jobs.type}>
          {(Object.keys(t.jobs.employment) as Employment[]).map((k) => (
            <Chip key={k} selected={employment === k} onClick={() => setEmployment(employment === k ? null : k)}>
              {t.jobs.employment[k]}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <div className="mt-8 mb-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <p className="text-sm font-semibold text-slate-700">{t.jobs.results(results.length)}</p>
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              setTrack(null)
              setLocation(null)
              setEmployment(null)
            }}
          >
            {t.jobs.clear}
          </Button>
        )}
      </div>

      {results.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
          <BriefcaseBusiness className="size-8 text-slate-300" />
          <p className="mt-3 text-slate-500">{t.jobs.noResults}</p>
        </div>
      )}

      <p className="mt-8 flex items-start gap-2 text-xs text-slate-500">
        <Info className="mt-px size-3.5 shrink-0" /> {t.jobs.ageNote}
      </p>
    </>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-center">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
