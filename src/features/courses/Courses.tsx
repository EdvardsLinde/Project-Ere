import { useState } from 'react'
import { ArrowRight, BookOpen, Dumbbell, GraduationCap } from 'lucide-react'
import { CAREERS, COURSES, PROVIDERS, TASKS } from '../../data'
import type { Course, CourseFormat, CourseType } from '../../data'
import { useApp } from '../../lib/state'
import { currentTrack, effectiveSkills, gapValue, skillGaps } from '../../lib/skills'
import type { Lang } from '../../data'
import { Button, PageHeader } from '../../components/ui'
import { FilterBar } from '../../components/FilterBar'
import type { FilterDef } from '../../components/FilterBar'
import { CourseCard, ExampleNotice, useIsRecommended } from '../../components/cards'

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
  const { t, l, profile, openCourse } = useApp()
  const isRecommended = useIsRecommended()
  // Course that comes with free training tasks (the example), shown as a shortcut.
  const taskCourse = COURSES.find((c) => TASKS.some((x) => x.courseId === c.id))
  const [q, setQ] = useState('')
  const [career, setCareer] = useState('')
  const [type, setType] = useState('')
  const [format, setFormat] = useState('')
  const [language, setLanguage] = useState('')
  const [price, setPrice] = useState('')
  const [progress, setProgress] = useState('')

  // Gaps for the user's current track (only meaningful after the skills test).
  const gaps = profile.testResult ? skillGaps(currentTrack(profile), effectiveSkills(profile)) : []

  const results = COURSES.filter(
    (c) =>
      matchCourse(c, q) &&
      (!career || c.careerId === career) &&
      (!type || c.type === type) &&
      (!format || c.format === format) &&
      (!language || c.languages.includes(language as Lang)) &&
      (!price || (price === 'free' ? c.price === 0 : c.price > 0)) &&
      (!progress ||
        (progress === 'gaps'
          ? gapValue(c, gaps) > 0 && profile.courseProgress[c.id] !== 'completed'
          : profile.courseProgress[c.id] === progress)),
  ).sort(
    (a, b) => gapValue(b, gaps) - gapValue(a, gaps) || Number(isRecommended(b)) - Number(isRecommended(a)),
  )

  const hasFilters = !!(q || career || type || format || language || price || progress)
  const clear = () => {
    setQ('')
    setCareer('')
    setType('')
    setFormat('')
    setLanguage('')
    setPrice('')
    setProgress('')
  }

  const filters: FilterDef[] = [
    {
      id: 'field',
      label: t.filters.field,
      value: career,
      onChange: setCareer,
      options: CAREERS.map((c) => ({ value: c.id, label: l(c.title) + (profile.careerId === c.id ? ' ★' : '') })),
    },
    {
      id: 'type',
      label: t.filters.type,
      value: type,
      onChange: setType,
      options: (['course', 'bootcamp', 'internship'] as CourseType[]).map((k) => ({ value: k, label: t.courses.types[k] })),
    },
    {
      id: 'place',
      label: t.filters.place,
      value: format,
      onChange: setFormat,
      options: (Object.keys(t.courses.formats) as CourseFormat[]).map((k) => ({ value: k, label: t.courses.formats[k] })),
    },
    {
      id: 'language',
      label: t.filters.language,
      value: language,
      onChange: setLanguage,
      options: (['lv', 'en'] as Lang[]).map((k) => ({ value: k, label: t.filters.langs[k] })),
    },
    {
      id: 'price',
      label: t.filters.price,
      value: price,
      onChange: setPrice,
      options: [
        { value: 'free', label: t.filters.free },
        { value: 'paid', label: t.filters.paid },
      ],
    },
    {
      id: 'progress',
      label: t.filters.progress,
      value: progress,
      onChange: setProgress,
      options: [
        ...(gaps.length ? [{ value: 'gaps', label: t.filters.myGaps }] : []),
        { value: 'started', label: t.progress.status.started },
        { value: 'completed', label: t.progress.status.completed },
      ],
    },
  ]

  return (
    <>
      <PageHeader icon={GraduationCap} eyebrow={t.courses.eyebrow} title={t.courses.title} subtitle={t.courses.subtitle} />
      <ExampleNotice />
      {taskCourse && (
        <button
          type="button"
          onClick={() => openCourse(taskCourse.id)}
          className="mb-4 flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-amber-50 p-3 text-left ring-1 ring-amber-200 transition hover:bg-amber-100"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-on-sun">
            <Dumbbell className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-slate-900">{t.tasks.title}</span>
            <span className="block truncate text-xs text-slate-600">
              {l(taskCourse.title)} · {t.tasks.badge(TASKS.filter((x) => x.courseId === taskCourse.id).length)}
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-amber-800" />
        </button>
      )}
      <FilterBar
        search={{ value: q, onChange: setQ, placeholder: t.courses.searchPlaceholder }}
        filters={filters}
        count={t.courses.results(results.length)}
        onClear={hasFilters ? clear : undefined}
      />

      {results.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
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
