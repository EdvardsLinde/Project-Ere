import type { ReactNode } from 'react'
import { ArrowRight, SearchX } from 'lucide-react'
import { CAREERS, COURSES, PEOPLE, PROVIDERS } from '../data'
import type { Lang } from '../data'
import { useApp } from '../state'
import { Card, cx } from '../components/ui'
import { CourseCard, ExampleBadge, ExampleNotice, PersonCard, SearchBox } from '../components/cards'
import { matchCourse } from './Home'
import { matchPerson } from './People'

const LANGS: Lang[] = ['lv', 'en']
const has = (hay: string, q: string) => {
  const h = hay.toLowerCase()
  return q.trim().toLowerCase().split(/\s+/).every((w) => h.includes(w))
}

export function SearchPage() {
  const { t, l, query, setQuery, goTo, update } = useApp()
  const q = query.trim()

  const courses = q ? COURSES.filter((c) => matchCourse(c, q)) : []
  const people = q ? PEOPLE.filter((p) => matchPerson(p, q)) : []
  const careers = q
    ? CAREERS.filter((c) => has(LANGS.flatMap((x) => [c.title[x], c.description[x]]).join(' '), q))
    : []
  const providers = q
    ? PROVIDERS.filter((p) => has([p.name, ...LANGS.flatMap((x) => [p.kind[x], p.location[x]])].join(' '), q))
    : []
  const total = courses.length + people.length + careers.length + providers.length

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {q ? t.search.resultsFor(q) : t.search.title}
      </h1>
      <div className="mt-6 max-w-3xl">
        <SearchBox value={query} onChange={setQuery} placeholder={t.search.placeholder} autoFocus />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">{t.search.try}</span>
          {t.search.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className={cx(
                'min-h-9 cursor-pointer rounded-full px-3 font-medium ring-1 transition',
                q.toLowerCase() === s.toLowerCase()
                  ? 'bg-brand-600 text-white ring-brand-600'
                  : 'bg-white text-slate-600 ring-slate-300 hover:bg-brand-50 hover:text-brand-800',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <ExampleNotice />
      </div>

      {!q && <p className="text-slate-500">{t.search.empty}</p>}

      {q && total === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
          <SearchX className="size-8 text-slate-300" />
          <p className="mt-3 text-slate-500">{t.search.none}</p>
        </div>
      )}

      <div className="space-y-12">
        {careers.length > 0 && (
          <Group title={t.search.careers} count={careers.length}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {careers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    update({ careerId: c.id })
                    goTo('training')
                  }}
                  className="group cursor-pointer text-left"
                >
                  <Card className="flex h-full items-start gap-3 p-5 transition group-hover:shadow-lift">
                    <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl ring-1', c.tone)}>
                      <c.icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-slate-900">{l(c.title)}</span>
                      <span className="mt-1 line-clamp-2 block text-sm text-slate-600">{l(c.description)}</span>
                    </span>
                  </Card>
                </button>
              ))}
            </div>
          </Group>
        )}

        {courses.length > 0 && (
          <Group title={t.search.courses} count={courses.length} onSeeAll={() => goTo('home')} seeAll={t.search.seeAll}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 6).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </Group>
        )}

        {people.length > 0 && (
          <Group title={t.search.people} count={people.length} onSeeAll={() => goTo('people')} seeAll={t.search.seeAll}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {people.slice(0, 6).map((p) => (
                <PersonCard key={p.id} person={p} />
              ))}
            </div>
          </Group>
        )}

        {providers.length > 0 && (
          <Group title={t.search.providers} count={providers.length}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((p) => (
                <Card key={p.id} className="flex items-center gap-3 p-4">
                  <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold', p.tone)}>
                    {p.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      <ExampleBadge />
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {l(p.kind)} · {l(p.location)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Group>
        )}
      </div>
    </>
  )
}

function Group({
  title,
  count,
  onSeeAll,
  seeAll,
  children,
}: {
  title: string
  count: number
  onSeeAll?: () => void
  seeAll?: string
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          {title} <span className="ml-1 text-base font-semibold text-slate-400 tabular-nums">{count}</span>
        </h2>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-lg px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            {seeAll} <ArrowRight className="size-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}
