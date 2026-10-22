/**
 * Building blocks of the news portal: story cards in several sizes, event rows
 * with a date block, the section nav and the sidebar lists. Every story links
 * to its own article page (/news/:id).
 */
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BookOpen, CalendarDays, Clock, GraduationCap, HandHeart, MapPin, Newspaper, Star } from 'lucide-react'
import { NEWS } from '../../data'
import type { NewsItem, NewsKind } from '../../data'
import { articlePath, useApp } from '../../lib/state'
import { cx } from '../../components/ui'
import { Illustration, newsScene } from '../../components/Illustration'

export const KIND_STYLE: Record<NewsKind, { icon: typeof Newspaper; tone: string }> = {
  news: { icon: Newspaper, tone: 'bg-brand-50 text-brand-700' },
  article: { icon: BookOpen, tone: 'bg-brand-100 text-brand-800' },
  event: { icon: CalendarDays, tone: 'bg-accent-100 text-accent-800' },
  course: { icon: GraduationCap, tone: 'bg-accent-50 text-accent-800' },
  volunteering: { icon: HandHeart, tone: 'bg-amber-50 text-amber-800' },
}

const DAY = 864e5
const today = () => {
  const d = new Date()
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
}
export const daysUntil = (iso: string) => Math.round((Date.parse(iso) - today()) / DAY)
export const isDated = (n: NewsItem) => n.kind === 'event' || n.kind === 'course' || n.kind === 'volunteering'
export const isUpcoming = (n: NewsItem) => isDated(n) && daysUntil(n.date) >= 0

/* -------------------------------------------------------------------------- */
/*  Sections                                                                   */
/* -------------------------------------------------------------------------- */

export const SECTIONS = ['all', 'saldus', 'events', 'ai-data', 'cyber', 'web', 'it-support', 'learn'] as const
export type Section = (typeof SECTIONS)[number]

export const inSection = (n: NewsItem, s: Section) =>
  s === 'all' ||
  (s === 'saldus' && n.inSaldus) ||
  (s === 'events' && n.kind === 'event') ||
  (s === 'learn' && (n.kind === 'course' || n.kind === 'volunteering')) ||
  n.track === s

/** The section a story is filed under, shown as its kicker. */
export function sectionOf(n: NewsItem): Section {
  if (n.kind === 'event') return 'events'
  if (n.kind === 'course' || n.kind === 'volunteering') return 'learn'
  if (n.track) return n.track
  return n.inSaldus ? 'saldus' : 'all'
}

export const sectionPath = (s: Section) => (s === 'all' ? '/news' : `/news?c=${s}`)

/** News first (newest first); events, courses and volunteering by start date. */
export const byNewest = (a: NewsItem, b: NewsItem) => b.date.localeCompare(a.date) || (b.at ?? '').localeCompare(a.at ?? '')
export const published = () => NEWS.filter((n) => !isDated(n)).sort(byNewest)

/* -------------------------------------------------------------------------- */
/*  Small parts                                                                */
/* -------------------------------------------------------------------------- */

/** "11:15" today, "Vakar", "Pirms 3 dienām" or a date — like a news site's timestamp. */
export function useWhen() {
  const { t, lang } = useApp()
  const short = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'short' })
  return (n: NewsItem) => {
    const d = daysUntil(n.date)
    if (isDated(n)) {
      if (d === 0) return t.news.today
      if (d > 0 && d <= 7) return t.news.inDays(d)
      return short.format(new Date(n.date))
    }
    if (d === 0) return n.at ?? t.news.today
    if (d === -1) return t.news.yesterday
    if (d < 0 && d > -7) return t.news.daysAgo(-d)
    return short.format(new Date(n.date))
  }
}

export function Kicker({ item, className }: { item: NewsItem; className?: string }) {
  const { t } = useApp()
  const s = sectionOf(item)
  return (
    <span className={cx('text-xs font-bold tracking-wide text-accent-600 uppercase', className)}>
      {s === 'all' ? t.news.kinds[item.kind] : t.news.sections[s]}
    </span>
  )
}

function Meta({ item, className }: { item: NewsItem; className?: string }) {
  const { t, l, profile } = useApp()
  const when = useWhen()
  return (
    <span className={cx('flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500', className)}>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" /> {when(item)}
      </span>
      {isDated(item) ? (
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{l(item.place)}</span>
        </span>
      ) : (
        item.readMin && <span>· {t.news.readMin(item.readMin)}</span>
      )}
      {profile.savedNews.includes(item.id) && <Star className="size-3.5 fill-accent-500 text-accent-500" aria-label={t.news.interestedDone} />}
    </span>
  )
}

/** Cover picture of a story. */
export function Cover({ item, className, scale }: { item: NewsItem; className?: string; scale?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <Illustration
      scene={newsScene(item)}
      size="auto"
      scale={scale}
      day={new Date(item.date).getDate()}
      className={cx('rounded-xl transition duration-300 group-hover:brightness-[1.03]', className)}
    />
  )
}

const headline = 'font-bold tracking-tight text-balance text-slate-900 group-hover:text-brand-700 group-hover:underline decoration-2 underline-offset-4'

/* -------------------------------------------------------------------------- */
/*  Story layouts                                                              */
/* -------------------------------------------------------------------------- */

type Variant = 'lead' | 'card' | 'row' | 'mini'

/** One story, linked to its article page. */
export function Story({ item, variant = 'card', className }: { item: NewsItem; variant?: Variant; className?: string }) {
  const { l } = useApp()
  const to = articlePath(item.id)

  if (variant === 'lead')
    return (
      <Link to={to} className={cx('group block', className)}>
        <Cover item={item} scale="xl" className="aspect-[16/9] w-full" />
        <Kicker item={item} className="mt-4 block" />
        <h2 className={cx(headline, 'mt-1.5 text-2xl leading-tight sm:text-4xl')}>{l(item.title)}</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{l(item.summary)}</p>
        <Meta item={item} className="mt-3" />
      </Link>
    )

  if (variant === 'row')
    return (
      <Link to={to} className={cx('group grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[13rem_minmax(0,1fr)]', className)}>
        <Cover item={item} scale="xs" className="aspect-[4/3] w-full" />
        <span className="min-w-0">
          <Kicker item={item} />
          <span className={cx(headline, 'mt-0.5 line-clamp-3 block text-base leading-snug sm:text-lg')}>{l(item.title)}</span>
          <span className="mt-1 hidden text-sm leading-relaxed text-slate-600 sm:line-clamp-2">{l(item.summary)}</span>
          <Meta item={item} className="mt-1.5" />
        </span>
      </Link>
    )

  if (variant === 'mini')
    return (
      <Link to={to} className={cx('group grid grid-cols-[minmax(0,1fr)_5rem] items-start gap-3', className)}>
        <span className="min-w-0">
          <span className={cx(headline, 'line-clamp-3 block text-[15px] leading-snug')}>{l(item.title)}</span>
          <Meta item={item} className="mt-1" />
        </span>
        <Cover item={item} scale="2xs" className="aspect-square w-full" />
      </Link>
    )

  return (
    <Link to={to} className={cx('group block', className)}>
      <Cover item={item} scale="sm" className="aspect-[16/10] w-full" />
      <Kicker item={item} className="mt-3 block" />
      <h3 className={cx(headline, 'mt-1 line-clamp-4 text-[15px] leading-snug sm:text-lg')}>{l(item.title)}</h3>
      <Meta item={item} className="mt-2" />
    </Link>
  )
}

/** Event listing with a calendar date block. */
export function EventRow({ item }: { item: NewsItem }) {
  const { l, lang } = useApp()
  const d = new Date(item.date)
  const month = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { month: 'short' }).format(d).replace('.', '')
  const weekday = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { weekday: 'short' }).format(d)
  return (
    <Link to={articlePath(item.id)} className="group flex items-start gap-4 py-4">
      <span className="flex w-16 shrink-0 flex-col items-center overflow-hidden rounded-xl bg-card text-center ring-1 ring-slate-200">
        <span className="w-full bg-accent-500 py-0.5 text-[11px] font-bold text-on-accent uppercase">{month}</span>
        <span className="pt-1 text-2xl leading-none font-extrabold text-slate-900 tabular-nums">{d.getDate()}</span>
        <span className="pb-1.5 text-[11px] text-slate-500 capitalize">{weekday}</span>
      </span>
      <span className="min-w-0">
        <Kicker item={item} />
        <span className={cx(headline, 'mt-0.5 line-clamp-2 block leading-snug')}>{l(item.title)}</span>
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
          {item.time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {item.time}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> {l(item.place)}
          </span>
        </span>
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section furniture                                                          */
/* -------------------------------------------------------------------------- */

/** Section heading with a rule and a "see all" link, newspaper style. */
export function SectionHead({ title, section, className }: { title: string; section?: Section; className?: string }) {
  const { t } = useApp()
  return (
    <div className={cx('mb-4 flex items-end justify-between gap-3 border-b-2 border-slate-900 pb-2', className)}>
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
      {section && (
        <Link to={sectionPath(section)} className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
          {t.news.seeAll} →
        </Link>
      )}
    </div>
  )
}

/** "Jaunākais": timestamped headline list. */
export function LatestList({ items, title }: { items: NewsItem[]; title?: string }) {
  const { t, l } = useApp()
  const when = useWhen()
  return (
    <section>
      <h2 className="flex items-center gap-2 border-b-2 border-slate-900 pb-2 text-lg font-extrabold text-slate-900">
        <span className="size-2 animate-pulse rounded-full bg-red-500" aria-hidden />
        {title ?? t.news.latest}
      </h2>
      <ol className="divide-y divide-slate-200">
        {items.map((n) => (
          <li key={n.id}>
            <Link to={articlePath(n.id)} className="group flex gap-3 py-3">
              <span className="w-14 shrink-0 pt-0.5 text-xs font-bold text-red-700 tabular-nums">{when(n)}</span>
              <span className="min-w-0 text-[15px] leading-snug font-semibold text-slate-800 group-hover:text-brand-700 group-hover:underline">
                {l(n.title)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** "Lasītākais": big numbers + headlines. */
export function MostRead({ items }: { items: NewsItem[] }) {
  const { t, l } = useApp()
  return (
    <section>
      <h2 className="border-b-2 border-slate-900 pb-2 text-lg font-extrabold text-slate-900">{t.news.mostRead}</h2>
      <ol className="divide-y divide-slate-200">
        {items.map((n, i) => (
          <li key={n.id}>
            <Link to={articlePath(n.id)} className="group flex items-start gap-3 py-3">
              <span className="w-7 shrink-0 text-3xl leading-none font-extrabold text-brand-500 tabular-nums dark:text-brand-400">{i + 1}</span>
              <span className="min-w-0 text-[15px] leading-snug font-semibold text-slate-800 group-hover:text-brand-700 group-hover:underline">
                {l(n.title)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Fixed "most read" picks for the prototype (a real site would count views). */
const MOST_READ = ['phishing-wave', 'student-app-win', 'remote-worker-story', 'cyber-phishing-signs', 'saldus-tech-week']
export const mostRead = () => MOST_READ.map((id) => NEWS.find((n) => n.id === id)).filter((n): n is NewsItem => !!n)

/** Horizontal section nav (text links with an underline on the active one). */
export function SectionNav({ active, aside }: { active: Section | null; aside?: ReactNode }) {
  const { t } = useApp()
  return (
    <div className="flex flex-col gap-3 border-y border-slate-200 py-2 md:flex-row md:items-center md:justify-between">
      <nav aria-label={t.news.sectionsLabel} className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
        <ul className="flex gap-1 whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s}>
              <Link
                to={sectionPath(s)}
                aria-current={active === s ? 'page' : undefined}
                className={cx(
                  'inline-block rounded-md px-2.5 py-2 text-sm font-semibold transition-colors',
                  active === s ? 'bg-slate-900 text-slate-50' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                {t.news.sections[s]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {aside}
    </div>
  )
}
