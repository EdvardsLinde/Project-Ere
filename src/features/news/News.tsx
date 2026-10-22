import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { CalendarDays, ChevronDown, Cpu, GraduationCap, Info, Lightbulb, MapPin, Newspaper, Search, X } from 'lucide-react'
import { NEWS } from '../../data'
import type { NewsItem } from '../../data'
import { useApp } from '../../lib/state'
import { cx } from '../../components/ui'
import { CardRail, NewsCard, SECTIONS, SectionTitle, byNewest, inSection, isUpcoming, published, sectionPath } from './NewsItem'
import type { Section } from './NewsItem'

/**
 * News & events — the home page after onboarding. A hero with search, a section
 * dropdown and section chips; then card rows per section (this week, events,
 * Saldus, technology, learning). A section or a search shows all matching cards.
 * Every card opens its own article page.
 */
export function News() {
  const { t } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const raw = params.get('c')
  const section: Section = SECTIONS.includes(raw as Section) ? (raw as Section) : 'all'
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()

  const matches = NEWS.filter(
    (n) =>
      inSection(n, section) &&
      (!needle || [n.title.lv, n.title.en, n.summary.lv, n.summary.en, n.place.lv].join(' ').toLowerCase().includes(needle)),
  )

  return (
    <>
      {/* Hero: full-width band with a faint grid, like an events portal */}
      <section className="relative -mt-5 bg-card pt-8 pb-6 shadow-[0_0_0_100vmax_var(--color-card)] [clip-path:inset(0_-100vmax)] after:absolute after:-inset-x-[100vmax] after:bottom-0 after:h-px after:bg-slate-200 sm:-mt-8 sm:pt-12 sm:pb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-[100vmax] inset-y-0 opacity-60 [background-image:linear-gradient(var(--color-slate-200)_1px,transparent_1px),linear-gradient(90deg,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative">
          <p className="text-xs font-bold tracking-wide text-accent-600 uppercase sm:text-sm">{t.news.heroEyebrow}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{t.news.heroTitle}</h1>
              <p className="mt-2 text-base text-slate-600 sm:text-lg">{t.news.heroSubtitle}</p>
            </div>
            <p className="text-sm text-slate-500 tabular-nums">{t.news.found(matches.length)}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_16rem]">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.news.heroSearch}
                aria-label={t.news.heroSearch}
                className="h-13 w-full rounded-xl border-0 bg-slate-50 pr-11 pl-12 text-base text-slate-900 ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  aria-label={t.filters.clear}
                  className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
                >
                  <X className="size-4" />
                </button>
              )}
            </form>
            <label className="relative">
              <span className="sr-only">{t.filters.type}</span>
              <Lightbulb className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-accent-600" />
              <select
                value={section}
                onChange={(e) => navigate(sectionPath(e.target.value as Section))}
                className="h-13 w-full cursor-pointer appearance-none rounded-xl border-0 bg-slate-50 pr-10 pl-12 text-base font-medium text-slate-900 ring-1 ring-slate-300 ring-inset focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? t.filters.all : t.news.sections[s]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-500" />
            </label>
          </div>

          <nav aria-label={t.news.sectionsLabel} className="-mx-4 mt-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <ul className="flex gap-2 whitespace-nowrap sm:flex-wrap">
              {SECTIONS.map((s) => (
                <li key={s}>
                  <Link
                    to={sectionPath(s)}
                    aria-current={section === s ? 'page' : undefined}
                    className={cx(
                      'inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors',
                      section === s
                        ? 'bg-accent-500 text-on-accent shadow-sm'
                        : 'bg-card text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 hover:ring-slate-400',
                    )}
                  >
                    {s === 'all' ? t.filters.all : t.news.sections[s]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {needle || section !== 'all' ? <Results items={matches} needle={needle} section={section} /> : <Sections />}

      <p className="mt-12 flex items-start gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <Info className="mt-px size-3.5 shrink-0 text-amber-600" />
        {t.news.fictional}
      </p>
    </>
  )
}

/** Front page: one card row per section. */
function Sections() {
  const { t } = useApp()
  const news = published()
  const lead = news.find((n) => n.featured)
  const week = [...(lead ? [lead] : []), ...news.filter((n) => n !== lead && n.kind === 'news')].slice(0, 4)
  const used = new Set(week.map((n) => n.id))
  const upcoming = NEWS.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const saldus = news.filter((n) => n.inSaldus && !used.has(n.id)).slice(0, 4)
  const tech = news.filter((n) => n.kind === 'article' && n.track).slice(0, 4)

  const rows: { icon: typeof Newspaper; title: string; subtitle: string; items: NewsItem[]; section?: Section }[] = [
    { icon: Newspaper, title: t.news.thisWeek, subtitle: t.news.thisWeekSub, items: week },
    { icon: CalendarDays, title: t.news.eventsTitle, subtitle: t.news.eventsSub, items: upcoming.filter((n) => n.kind === 'event').slice(0, 4), section: 'events' },
    { icon: MapPin, title: t.news.inSaldusTitle, subtitle: t.news.saldusSub, items: saldus, section: 'saldus' },
    { icon: Cpu, title: t.news.techTitle, subtitle: t.news.techSub, items: tech },
    { icon: GraduationCap, title: t.news.learnTitle, subtitle: t.news.learnSub, items: upcoming.filter((n) => n.kind !== 'event').slice(0, 4), section: 'learn' },
  ]

  return (
    <div className="divide-y divide-slate-200">
      {rows
        .filter((r) => r.items.length)
        .map((r) => (
          <section key={r.title} className="py-10 first:pt-8">
            <SectionTitle icon={r.icon} title={r.title} subtitle={r.subtitle} section={r.section} />
            <CardRail items={r.items} />
          </section>
        ))}
    </div>
  )
}

/** A section page or search results: all matching cards. */
function Results({ items, needle, section }: { items: NewsItem[]; needle: string; section: Section }) {
  const { t } = useApp()
  // Events are listed soonest first; everything else newest first.
  const sorted =
    section === 'events'
      ? [...items.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date)), ...items.filter((n) => !isUpcoming(n)).sort(byNewest)]
      : [...items].sort(byNewest)
  return (
    <section className="pt-8">
      <SectionTitle
        icon={needle ? Search : Newspaper}
        title={needle ? t.news.resultsFor(needle) : section === 'all' ? t.filters.all : t.news.sections[section]}
        subtitle={t.news.count(sorted.length)}
      />
      {!sorted.length && <p className="py-12 text-center text-slate-500">{t.news.noResults}</p>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}
      </div>
    </section>
  )
}
