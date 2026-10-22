/**
 * Building blocks of the news page: picture cards, card rows, section titles
 * and the article sidebar lists. Every card links to its own article page (/news/:id).
 */
import { Link } from 'react-router'
import { ChevronRight, Clock, MapPin, Newspaper, Star } from 'lucide-react'
import { NEWS } from '../../data'
import type { NewsItem } from '../../data'
import { articlePath, useApp } from '../../lib/state'
import { cx } from '../../components/ui'
import { Illustration, newsScene } from '../../components/Illustration'

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

/** Cover picture of a story. */
export function Cover({ item, className, scale }: { item: NewsItem; className?: string; scale?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <Illustration
      scene={newsScene(item)}
      size="auto"
      scale={scale}
      day={new Date(item.date).getDate()}
      className={cx('transition duration-300 group-hover:brightness-[1.03]', className)}
    />
  )
}


/* -------------------------------------------------------------------------- */
/*  Card                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * One story / event as a picture card: type badge and price (or reading time)
 * over the cover, then title, place, date and a "see more" row.
 */
export function NewsCard({ item, className }: { item: NewsItem; className?: string }) {
  const { t, l, lang, profile } = useApp()
  const when = useWhen()
  const s = sectionOf(item)
  const dated = isDated(item)
  const date = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'short' }).format(new Date(item.date))
  const tag = dated ? (item.price ? t.news.from(item.price) : t.news.free) : item.readMin ? t.news.readMin(item.readMin) : null
  return (
    <Link
      to={articlePath(item.id)}
      className={cx(
        'group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-300',
        className,
      )}
    >
      <div className="relative">
        <Cover item={item} scale="sm" className="aspect-[16/9] w-full rounded-none" />
        <span className="absolute top-3 left-3 rounded-md bg-slate-950 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase dark:bg-slate-50 dark:text-slate-950">
          {s === 'all' ? t.news.kinds[item.kind] : t.news.sections[s]}
        </span>
        <span className="absolute right-3 bottom-2 rounded bg-card/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 uppercase">
          {t.example.badge}
        </span>
        {tag && (
          <span className="absolute top-3 right-3 rounded-md bg-accent-500 px-2 py-1 text-[11px] font-bold tracking-wide text-on-accent uppercase">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-3 text-lg leading-snug font-bold tracking-tight text-slate-900 group-hover:text-brand-700">{l(item.title)}</h3>
        <ul className="mt-3 mb-4 space-y-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-accent-600" /> <span className="truncate">{l(item.place)}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-accent-600" />
            {dated ? `${date}${item.time ? ` · ${item.time.split('–')[0]}` : ''}` : when(item)}
            {profile.savedNews.includes(item.id) && <Star className="size-3.5 fill-accent-500 text-accent-500" aria-label={t.news.interestedDone} />}
          </li>
        </ul>
        <span className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
          {t.news.more}
          <ChevronRight className="size-4 text-accent-600 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

/** A row of cards: a grid on larger screens, a swipeable rail on phones. */
export function CardRail({ items }: { items: NewsItem[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {items.map((n) => (
        <NewsCard key={n.id} item={n} className="w-[80%] shrink-0 snap-start sm:w-auto" />
      ))}
    </div>
  )
}

/** Section heading: icon tile, title and a one-line description. */
export function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  section,
}: {
  icon: typeof Newspaper
  title: string
  subtitle?: string
  section?: Section
}) {
  const { t } = useApp()
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-on-accent shadow-sm">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
      {section && (
        <Link to={sectionPath(section)} className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
          {t.news.seeAll} →
        </Link>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section furniture                                                          */
/* -------------------------------------------------------------------------- */

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
