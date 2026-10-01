import { useState } from 'react'
import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { CAREERS, COURSES, PROVIDERS } from '../data'
import type { Course, CourseFormat, CourseType } from '../data'
import { useApp } from '../state'
import type { Lang } from '../data'
import { Button, Chip, cx } from '../components/ui'
import { CourseCard, ExampleNotice, SearchBox, useIsRecommended } from '../components/cards'

/** Free-text match across a course's title, description, provider and keywords (both languages). */
export function matchCourse(course: Course, q: string) {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const provider = PROVIDERS.find((p) => p.id === course.providerId)
  const career = CAREERS.find((c) => c.id === course.careerId)
  const hay = [
    ...(['lv', 'en'] as Lang[]).flatMap((lang) => [
      course.title[lang],
      course.description[lang],
      career?.title[lang] ?? '',
      provider?.location[lang] ?? '',
    ]),
    provider?.name ?? '',
    course.keywords,
    course.price === 0 ? 'bezmaksas free' : '',
    course.type === 'internship' ? 'prakse internship' : '',
    course.type === 'job' ? 'darbs job vakance' : '',
    course.format === 'online' ? 'attālināti remote tiešsaistē online' : '',
    course.format === 'saldus' ? 'saldus klātienē' : '',
  ]
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((word) => hay.includes(word))
}

const TYPE_ORDER: CourseType[] = ['job', 'internship', 'course', 'bootcamp']

/**
 * Start page after onboarding: jobs, internships and courses in one place,
 * with search, quick filters and personal recommendations on top.
 */
export function Home() {
  const { t, l, profile } = useApp()
  const isRecommended = useIsRecommended()
  const [q, setQ] = useState('')
  const [career, setCareer] = useState<string | null>(null)
  const [type, setType] = useState<CourseType | null>(null)
  const [format, setFormat] = useState<CourseFormat | null>(null)
  const [freeOnly, setFreeOnly] = useState(false)

  const results = COURSES.filter(
    (c) =>
      matchCourse(c, q) &&
      (!career || c.careerId === career) &&
      (!type || c.type === type) &&
      (!format || c.format === format) &&
      (!freeOnly || (c.price === 0 && (c.type === 'course' || c.type === 'bootcamp'))),
  ).sort(
    (a, b) =>
      Number(isRecommended(b)) - Number(isRecommended(a)) || TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type),
  )

  const hasFilters = !!(q || career || type || format || freeOnly)
  const clear = () => {
    setQ('')
    setCareer(null)
    setType(null)
    setFormat(null)
    setFreeOnly(false)
  }

  const myCareer = CAREERS.find((c) => c.id === profile.careerId)
  const recommended = COURSES.filter(isRecommended)
    .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type))
    .slice(0, 3)

  const quick = [
    { label: t.courses.quick.jobs, on: type === 'job', toggle: () => setType(type === 'job' ? null : 'job') },
    {
      label: t.courses.quick.internships,
      on: type === 'internship',
      toggle: () => setType(type === 'internship' ? null : 'internship'),
    },
    { label: t.courses.quick.remote, on: format === 'online', toggle: () => setFormat(format === 'online' ? null : 'online') },
    { label: t.courses.quick.saldus, on: format === 'saldus', toggle: () => setFormat(format === 'saldus' ? null : 'saldus') },
    { label: t.courses.quick.free, on: freeOnly, toggle: () => setFreeOnly(!freeOnly) },
  ]
  const count = (types: CourseType[]) => COURSES.filter((c) => types.includes(c.type)).length

  return (
    <>
      {/* Hero: greeting + search */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-5 py-8 text-white shadow-lift sm:px-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold text-white/80">{t.courses.greeting(profile.name)}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{t.courses.title}</h1>
          <p className="mt-3 text-base text-white/85 sm:text-lg">{t.courses.subtitle}</p>
          <div className="mt-6">
            <SearchBox value={q} onChange={setQ} placeholder={t.courses.searchPlaceholder} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {quick.map((f) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={f.on}
                onClick={f.toggle}
                className={cx(
                  'min-h-10 cursor-pointer rounded-full px-4 text-sm font-semibold transition',
                  f.on ? 'bg-white text-brand-700' : 'bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/75 tabular-nums">
            {count(['job'])} {t.courses.counts.job} · {count(['internship'])} {t.courses.counts.internship} ·{' '}
            {count(['course', 'bootcamp'])} {t.courses.counts.learn}
          </p>
        </div>
      </section>

      <div className="mt-6">
        <ExampleNotice />
      </div>

      {/* Personal recommendations (hidden while searching/filtering) */}
      {!hasFilters && recommended.length > 0 && (
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.courses.recommendedTitle}</h2>
            {myCareer && <p className="mt-1 text-sm text-slate-500">{t.courses.recommendedHint(l(myCareer.title))}</p>}
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {recommended.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}

      {/* All opportunities: filters + results */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.courses.allTitle}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{t.courses.results(results.length)}</p>
          </div>
          {hasFilters && (
            <Button variant="ghost" onClick={clear}>
              {t.courses.clear}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
          <aside className="space-y-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 lg:sticky lg:top-24">
            <FilterGroup label={t.courses.typeLabel}>
              {TYPE_ORDER.map((k) => (
                <Chip key={k} selected={type === k} onClick={() => setType(type === k ? null : k)}>
                  {t.courses.types[k]}
                </Chip>
              ))}
            </FilterGroup>
            <FilterGroup label={t.courses.field}>
              {CAREERS.map((c) => (
                <Chip key={c.id} selected={career === c.id} onClick={() => setCareer(career === c.id ? null : c.id)}>
                  {l(c.title)}
                  {profile.careerId === c.id && ' ★'}
                </Chip>
              ))}
            </FilterGroup>
            <FilterGroup label={t.courses.formatLabel}>
              {(Object.keys(t.courses.formats) as CourseFormat[]).map((k) => (
                <Chip key={k} selected={format === k} onClick={() => setFormat(format === k ? null : k)}>
                  {t.courses.formats[k]}
                </Chip>
              ))}
            </FilterGroup>
          </aside>

          {results.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {results.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
              <BookOpen className="size-8 text-slate-300" />
              <p className="mt-3 max-w-sm text-slate-500">{t.courses.noResults}</p>
              <Button variant="secondary" className="mt-4" onClick={clear}>
                {t.courses.clear}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
