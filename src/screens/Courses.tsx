import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { CAREERS, COURSES, PROVIDERS } from '../data'
import type { Course, CourseFormat, CourseType } from '../data'
import { useApp } from '../state'
import type { Lang } from '../data'
import { Button, Chip, PageHeader } from '../components/ui'
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
    course.format === 'saldus' ? 'saldus klātienē' : '',
  ]
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((word) => hay.includes(word))
}

export function Courses() {
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
      (!freeOnly || c.price === 0),
  ).sort((a, b) => Number(isRecommended(b)) - Number(isRecommended(a)))

  const hasFilters = !!(q || career || type || format || freeOnly)
  const clear = () => {
    setQ('')
    setCareer(null)
    setType(null)
    setFormat(null)
    setFreeOnly(false)
  }

  return (
    <>
      <PageHeader eyebrow={t.courses.eyebrow} title={t.courses.title} subtitle={t.courses.subtitle} />
      <ExampleNotice />

      <div className="space-y-5">
        <SearchBox value={q} onChange={setQ} placeholder={t.courses.searchPlaceholder} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-x-6">
          <FilterLabel>{t.courses.field}</FilterLabel>
          <div className="flex flex-wrap gap-2">
            <Chip selected={!career} onClick={() => setCareer(null)}>{t.courses.all}</Chip>
            {CAREERS.map((c) => (
              <Chip key={c.id} selected={career === c.id} onClick={() => setCareer(career === c.id ? null : c.id)}>
                {l(c.title)}
                {profile.careerId === c.id && ' ★'}
              </Chip>
            ))}
          </div>

          <FilterLabel>{t.courses.typeLabel}</FilterLabel>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(t.courses.types) as CourseType[]).map((k) => (
              <Chip key={k} selected={type === k} onClick={() => setType(type === k ? null : k)}>
                {t.courses.types[k]}
              </Chip>
            ))}
          </div>

          <FilterLabel>{t.courses.formatLabel}</FilterLabel>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(t.courses.formats) as CourseFormat[]).map((k) => (
              <Chip key={k} selected={format === k} onClick={() => setFormat(format === k ? null : k)}>
                {t.courses.formats[k]}
              </Chip>
            ))}
            <Chip selected={freeOnly} onClick={() => setFreeOnly(!freeOnly)}>
              {t.courses.freeOnly}
            </Chip>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <p className="text-sm font-semibold text-slate-700">{t.courses.results(results.length)}</p>
        {hasFilters && (
          <Button variant="ghost" onClick={clear}>
            {t.courses.clear}
          </Button>
        )}
      </div>

      {results.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
    </>
  )
}

function FilterLabel({ children }: { children: string }) {
  return <p className="-mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase lg:mb-0">{children}</p>
}
