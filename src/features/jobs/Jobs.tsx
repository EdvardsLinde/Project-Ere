import { useState } from 'react'
import { BriefcaseBusiness, ClipboardCheck, Info, Wifi } from 'lucide-react'
import { CAREERS, JOBS } from '../../data'
import type { Employment, JobLocation, Lang } from '../../data'
import { useApp } from '../../lib/state'
import { effectiveSkills, jobFit } from '../../lib/skills'
import { PageHeader } from '../../components/ui'
import { FilterBar } from '../../components/FilterBar'
import type { FilterDef } from '../../components/FilterBar'
import { ExampleNotice } from '../../components/cards'
import { JobList } from './JobItem'

/** Jobs & local market: IT roles in Saldus and remote, matched against the user's skills. */
export function Jobs() {
  const { t, l, profile, goTo } = useApp()
  const [track, setTrack] = useState('')
  const [location, setLocation] = useState('')
  const [employment, setEmployment] = useState('')
  const [language, setLanguage] = useState('')

  const skills = effectiveSkills(profile)
  const results = JOBS.filter(
    (j) =>
      (!track || j.track === track) &&
      (!location || j.location === location) &&
      (!employment || j.employment === employment) &&
      (!language || j.languages.includes(language as Lang)),
  ).sort((a, b) => jobFit(b, skills) - jobFit(a, skills) || b.posted.localeCompare(a.posted))
  const remoteCount = JOBS.filter((j) => j.location !== 'saldus').length
  const hasFilters = !!(track || location || employment || language)

  const filters: FilterDef[] = [
    { id: 'field', label: t.filters.field, value: track, onChange: setTrack, options: CAREERS.map((c) => ({ value: c.id, label: l(c.title) })) },
    {
      id: 'place',
      label: t.filters.place,
      value: location,
      onChange: setLocation,
      options: (Object.keys(t.jobs.locations) as JobLocation[]).map((k) => ({ value: k, label: t.jobs.locations[k] })),
    },
    {
      id: 'type',
      label: t.filters.type,
      value: employment,
      onChange: setEmployment,
      options: (Object.keys(t.jobs.employment) as Employment[]).map((k) => ({ value: k, label: t.jobs.employment[k] })),
    },
    {
      id: 'language',
      label: t.filters.language,
      value: language,
      onChange: setLanguage,
      options: (['lv', 'en'] as Lang[]).map((k) => ({ value: k, label: t.filters.langs[k] })),
    },
  ]

  return (
    <>
      <PageHeader icon={BriefcaseBusiness} eyebrow={t.jobs.eyebrow} title={t.jobs.title} subtitle={t.jobs.subtitle} />
      <ExampleNotice />

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1.5 font-medium text-accent-800 ring-1 ring-accent-200">
          <Wifi className="size-4 shrink-0" /> {t.jobs.remoteBanner(remoteCount, JOBS.length)}
        </span>
        {!profile.testResult && (
          <button
            type="button"
            onClick={() => goTo('test')}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 font-medium text-brand-800 ring-1 ring-brand-200 hover:bg-brand-100"
          >
            <ClipboardCheck className="size-4 shrink-0" /> {t.jobs.noTestHint}
          </button>
        )}
      </div>

      <FilterBar
        filters={filters}
        count={t.jobs.results(results.length)}
        onClear={
          hasFilters
            ? () => {
                setTrack('')
                setLocation('')
                setEmployment('')
                setLanguage('')
              }
            : undefined
        }
      />

      {results.length ? (
        <JobList jobs={results} />
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
          <BriefcaseBusiness className="size-8 text-slate-300" />
          <p className="mt-3 text-slate-500">{t.jobs.noResults}</p>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-xs text-slate-500">
        <Info className="mt-px size-3.5 shrink-0" /> {t.jobs.ageNote}
      </p>
    </>
  )
}
