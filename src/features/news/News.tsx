import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Info, Search, X } from 'lucide-react'
import { NEWS } from '../../data'
import { articlePath, useApp } from '../../lib/state'
import { NextStepCard } from '../../components/NextStepCard'
import {
  EventRow,
  LatestList,
  MostRead,
  SECTIONS,
  SectionHead,
  SectionNav,
  Story,
  byNewest,
  inSection,
  isUpcoming,
  mostRead,
  published,
} from './NewsItem'
import type { Section } from './NewsItem'

/**
 * ERE Ziņas — the home page after onboarding, laid out like a news portal:
 * masthead + section nav, a lead story with a "latest" column, then sections
 * (Saldus, events, technology, learning). A section or search shows a classic list.
 * Every story opens its own article page.
 */
export function News() {
  const { t, l } = useApp()
  const [params] = useSearchParams()
  const raw = params.get('c')
  const section: Section = SECTIONS.includes(raw as Section) ? (raw as Section) : 'all'
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()

  const search = (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative md:w-64">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.news.searchPlaceholder}
        aria-label={t.news.searchPlaceholder}
        className="h-10 w-full rounded-lg border-0 bg-slate-50 pr-9 pl-9 text-sm text-slate-900 ring-1 ring-slate-200 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {q && (
        <button
          type="button"
          onClick={() => setQ('')}
          aria-label={t.filters.clear}
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-200"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  )

  const breaking = published()[0]

  return (
    <>
      <Masthead />
      <SectionNav active={needle ? null : section} aside={search} />

      {breaking && !needle && section === 'all' && (
        <Link
          to={articlePath(breaking.id)}
          className="group mt-3 flex items-center gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm ring-1 ring-red-400/30"
        >
          <span className="shrink-0 rounded bg-red-700 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase dark:bg-red-500 dark:text-slate-50">
            {t.news.breaking}
          </span>
          <span className="min-w-0 truncate font-semibold text-slate-900 group-hover:underline">{l(breaking.title)}</span>
        </Link>
      )}

      {needle || section !== 'all' ? <ListView section={section} needle={needle} /> : <FrontPage />}

      <p className="mt-12 flex items-start gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <Info className="mt-px size-3.5 shrink-0 text-amber-600" />
        {t.news.fictional}
      </p>
    </>
  )
}

/** Newspaper-style title band: date, name, tagline. */
function Masthead() {
  const { t, lang } = useApp()
  const date = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  return (
    <header className="relative -mt-5 bg-card pt-5 pb-4 shadow-[0_0_0_100vmax_var(--color-card)] [clip-path:inset(0_-100vmax)] sm:-mt-8 sm:pt-7">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 first-letter:uppercase">{date}</p>
          <h1 className="mt-1 font-serif text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {t.news.masthead}
          </h1>
        </div>
        <p className="pb-1 text-sm text-slate-600">{t.news.tagline}</p>
      </div>
    </header>
  )
}

function FrontPage() {
  const { t } = useApp()
  const news = published()
  const lead = news.find((n) => n.featured) ?? news[0]
  const rest = news.filter((n) => n !== lead)
  const top = rest.filter((n) => n.kind === 'news').slice(0, 4)
  const used = new Set([lead, ...top].map((n) => n.id))
  const saldus = rest.filter((n) => n.inSaldus && !used.has(n.id)).slice(0, 4)
  saldus.forEach((n) => used.add(n.id))
  const tech = rest.filter((n) => n.kind === 'article' && n.track && !used.has(n.id)).slice(0, 6)
  const upcoming = NEWS.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const events = upcoming.filter((n) => n.kind === 'event').slice(0, 6)
  const learn = upcoming.filter((n) => n.kind !== 'event').slice(0, 4)

  return (
    <div className="mt-6 space-y-12">
      {/* Lead story + latest */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Story item={lead} variant="lead" className="lg:col-span-8" />
        <aside className="lg:col-span-4">
          <LatestList items={news.slice(0, 7)} />
        </aside>
      </div>

      {/* Top stories */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 border-t border-slate-200 pt-8 sm:gap-x-6 lg:grid-cols-4">
        {top.map((n) => (
          <Story key={n.id} item={n} />
        ))}
      </div>

      {/* Saldus + most read */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <SectionHead title={t.news.inSaldusTitle} section="saldus" />
          <div className="divide-y divide-slate-200">
            {saldus.map((n) => (
              <Story key={n.id} item={n} variant="row" className="py-4 first:pt-0" />
            ))}
          </div>
        </section>
        <aside className="space-y-8 lg:col-span-4">
          <MostRead items={mostRead()} />
          <div>
            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">{t.news.yourStep}</p>
            <NextStepCard stacked />
          </div>
        </aside>
      </div>

      {/* Events */}
      {events.length > 0 && (
        <section>
          <SectionHead title={t.news.eventsTitle} section="events" />
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-slate-200">
            {events.map((n) => (
              <EventRow key={n.id} item={n} />
            ))}
          </div>
        </section>
      )}

      {/* Technology */}
      <section>
        <SectionHead title={t.news.techTitle} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {tech.slice(0, 3).map((n) => (
            <Story key={n.id} item={n} />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-slate-200 pt-6 sm:grid-cols-3">
          {tech.slice(3).map((n) => (
            <Story key={n.id} item={n} variant="mini" />
          ))}
        </div>
      </section>

      {/* Courses + volunteering */}
      {learn.length > 0 && (
        <section>
          <SectionHead title={t.news.learnTitle} section="learn" />
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            {learn.map((n) => (
              <Story key={n.id} item={n} variant="row" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/** A section page or search results: classic news list + sidebar. */
function ListView({ section, needle }: { section: Section; needle: string }) {
  const { t } = useApp()
  const items = NEWS.filter(
    (n) =>
      inSection(n, needle ? 'all' : section) &&
      (!needle || [n.title.lv, n.title.en, n.summary.lv, n.summary.en].join(' ').toLowerCase().includes(needle)),
  )
  // Events are listed soonest first; everything else newest first.
  const sorted =
    section === 'events' && !needle
      ? [...items.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date)), ...items.filter((n) => !isUpcoming(n)).sort(byNewest)]
      : [...items].sort(byNewest)

  return (
    <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-8">
        <SectionHead title={needle ? t.news.resultsFor(needle) : t.news.sections[section]} />
        <p className="-mt-2 mb-4 text-sm text-slate-500">{t.news.count(sorted.length)}</p>
        {!sorted.length && <p className="py-10 text-center text-slate-500">{t.news.noResults}</p>}
        <div className="divide-y divide-slate-200">
          {sorted.map((n) => (
            <Story key={n.id} item={n} variant="row" className="py-5 first:pt-0" />
          ))}
        </div>
      </section>
      <aside className="space-y-8 lg:col-span-4">
        <LatestList items={published().slice(0, 6)} />
        <MostRead items={mostRead()} />
      </aside>
    </div>
  )
}
