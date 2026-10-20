import { useState } from 'react'
import { CalendarDays, Check, GraduationCap, HandHeart, MapPin, Newspaper, Star } from 'lucide-react'
import { CAREERS, NEWS } from '../../data'
import type { NewsItem, NewsKind } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { Button, Card, Chip, PageHeader, cx } from '../../components/ui'
import { ExampleNotice } from '../../components/cards'

const KIND_STYLE: Record<NewsKind, { icon: typeof Newspaper; tone: string }> = {
  news: { icon: Newspaper, tone: 'bg-brand-50 text-brand-700' },
  event: { icon: CalendarDays, tone: 'bg-accent-100 text-accent-800' },
  course: { icon: GraduationCap, tone: 'bg-brand-100 text-brand-800' },
  volunteering: { icon: HandHeart, tone: 'bg-amber-50 text-amber-800' },
}

const DAY = 864e5
const today = () => {
  const d = new Date()
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
}
const daysUntil = (iso: string) => Math.round((Date.parse(iso) - today()) / DAY)

/** News & events feed: local job-market news, events, courses and volunteering. */
export function News() {
  const { t, l, lang, profile, update } = useApp()
  const [kind, setKind] = useState<NewsKind | 'all'>('all')
  const [saldusOnly, setSaldusOnly] = useState(false)
  const [myPath, setMyPath] = useState(false)

  const items = NEWS.filter(
    (n) =>
      (kind === 'all' || n.kind === kind) &&
      (!saldusOnly || n.inSaldus) &&
      (!myPath || !profile.careerId || n.track === profile.careerId),
  )
  // Upcoming events / courses / volunteering first (soonest first), then news (newest first).
  const upcoming = items.filter((n) => n.kind !== 'news' && daysUntil(n.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))
  const latest = items.filter((n) => !upcoming.includes(n)).sort((a, b) => b.date.localeCompare(a.date))

  const fmt = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'short' })
  const myCareer = CAREERS.find((c) => c.id === profile.careerId)

  const card = (n: NewsItem) => {
    const style = KIND_STYLE[n.kind]
    const days = daysUntil(n.date)
    const saved = profile.savedNews.includes(n.id)
    const [day, month] = fmt.format(new Date(n.date)).split(' ')
    return (
      <Card key={n.id} className="flex h-full gap-4 p-5 sm:p-6">
        <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-slate-100 py-2 text-center">
          <span className="text-xl leading-none font-extrabold text-slate-900 tabular-nums">{day.replace('.', '')}</span>
          <span className="mt-1 text-xs font-semibold text-slate-500 uppercase">{month}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', style.tone)}>
              <style.icon className="size-3.5" /> {t.news.kinds[n.kind]}
            </span>
            {n.kind !== 'news' && days >= 0 && days <= 30 && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {days === 0 ? t.news.today : t.news.inDays(days)}
              </span>
            )}
            <span className="inline-flex shrink-0 items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
              {t.example.badge}
            </span>
          </div>
          <h3 className="mt-2 font-bold leading-snug text-slate-900 sm:text-lg">{l(n.title)}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{l(n.summary)}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-4" /> {l(n.place)}
            </span>
            {n.kind !== 'news' && (
              <Button
                variant={saved ? 'secondary' : 'primary'}
                className="h-9 px-3"
                aria-pressed={saved}
                onClick={() => update({ savedNews: toggle(profile.savedNews, n.id) })}
              >
                {saved ? <Check className="size-4" strokeWidth={2.5} /> : <Star className="size-4" />}
                {saved ? t.news.interestedDone : t.news.interested}
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <PageHeader eyebrow={t.news.eyebrow} title={t.news.title} subtitle={t.news.subtitle} />
      <ExampleNotice />

      <div className="flex flex-wrap gap-2">
        {(Object.keys(t.news.kinds) as (NewsKind | 'all')[]).map((k) => (
          <Chip key={k} selected={kind === k} onClick={() => setKind(k)}>
            {t.news.kinds[k]}
          </Chip>
        ))}
        <span className="mx-1 hidden w-px self-stretch bg-slate-200 sm:block" />
        <Chip selected={saldusOnly} onClick={() => setSaldusOnly(!saldusOnly)}>
          {t.news.inSaldus}
        </Chip>
        {myCareer && (
          <Chip selected={myPath} onClick={() => setMyPath(!myPath)}>
            {t.news.forMyPath}: {l(myCareer.title)}
          </Chip>
        )}
      </div>

      {!items.length && <p className="mt-10 text-center text-slate-500">{t.news.noResults}</p>}

      {upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">{t.news.upcoming}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{upcoming.map(card)}</div>
        </section>
      )}
      {latest.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">{t.news.latest}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{latest.map(card)}</div>
        </section>
      )}
    </>
  )
}
