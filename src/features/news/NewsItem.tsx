import { useState } from 'react'
import type { ReactNode } from 'react'
import { BookOpen, CalendarDays, Check, ChevronRight, GraduationCap, HandHeart, Info, MapPin, Newspaper, Star } from 'lucide-react'
import { CAREERS } from '../../data'
import type { NewsItem, NewsKind } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { Button, Card, cx } from '../../components/ui'
import { ExampleBadge } from '../../components/cards'
import { Illustration, newsScene } from '../../components/Illustration'
import { Modal } from '../../components/Modal'

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
export const isUpcoming = (n: NewsItem) =>
  (n.kind === 'event' || n.kind === 'course' || n.kind === 'volunteering') && daysUntil(n.date) >= 0

/** News as a compact list of titles. Tap a row (or its icon) for the full description. */
export function NewsList({ items }: { items: NewsItem[] }) {
  const [open, setOpen] = useState<NewsItem | null>(null)
  return (
    <>
      <Card className="divide-y divide-slate-100 overflow-hidden">
        {items.map((n) => (
          <NewsRow key={n.id} item={n} onOpen={() => setOpen(n)} />
        ))}
      </Card>
      {open && <NewsDetail item={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function useDate() {
  const { lang } = useApp()
  return new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'short' })
}

function NewsRow({ item, onOpen }: { item: NewsItem; onOpen: () => void }) {
  const { t, l, profile } = useApp()
  const fmt = useDate()
  const style = KIND_STYLE[item.kind]
  const days = daysUntil(item.date)
  const saved = profile.savedNews.includes(item.id)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 focus-visible:bg-brand-50 focus-visible:outline-none"
    >
      <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl', style.tone)} title={t.news.kinds[item.kind]}>
        <style.icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-700">{l(item.title)}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
          <span>{t.news.kinds[item.kind]}</span>
          <span aria-hidden>·</span>
          <span>{isUpcoming(item) && days <= 30 ? (days === 0 ? t.news.today : t.news.inDays(days)) : fmt.format(new Date(item.date))}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{l(item.place)}</span>
          {saved && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-accent-700">
              <Star className="size-3 fill-current" />
            </span>
          )}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-slate-300 group-hover:text-brand-600" />
    </button>
  )
}

/** Detail window: full description, when/where and practical info. */
function NewsDetail({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const { t, l, lang, profile, update } = useApp()
  const style = KIND_STYLE[item.kind]
  const career = CAREERS.find((c) => c.id === item.track)
  const saved = profile.savedNews.includes(item.id)
  const actionable = item.kind !== 'news' && item.kind !== 'article'
  const longDate = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(item.date))

  return (
    <Modal
      open
      onClose={onClose}
      title={l(item.title)}
      footer={
        actionable ? (
          <Button
            variant={saved ? 'secondary' : 'primary'}
            aria-pressed={saved}
            onClick={() => update({ savedNews: toggle(profile.savedNews, item.id) })}
          >
            {saved ? <Check className="size-4" strokeWidth={2.5} /> : <Star className="size-4" />}
            {saved ? t.news.interestedDone : t.news.interested}
          </Button>
        ) : undefined
      }
    >
      <Illustration scene={newsScene(item.kind, item.track)} size="sm" day={new Date(item.date).getDate()} />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', style.tone)}>
            <style.icon className="size-3.5" /> {t.news.kinds[item.kind]}
          </span>
          {career && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              <career.icon className="size-3.5" /> {l(career.title)}
            </span>
          )}
          <ExampleBadge />
        </div>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{l(item.title)}</h2>

        <dl className="mt-4 grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200 sm:grid-cols-2">
          <Row icon={<CalendarDays className="size-4" />} label={t.news.when}>
            {longDate}
            {item.time && <span className="text-slate-500"> · {item.time}</span>}
          </Row>
          <Row icon={<MapPin className="size-4" />} label={t.news.where}>
            {l(item.place)}
          </Row>
        </dl>

        <p className="mt-4 leading-relaxed text-slate-700">{l(item.details ?? item.summary)}</p>
        {item.details && <p className="mt-3 text-sm text-slate-500">{l(item.summary)}</p>}

        {item.info && item.info.length > 0 && (
          <section className="mt-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex size-7 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
                <Info className="size-4" />
              </span>
              {t.news.goodToKnow}
            </h3>
            <ul className="mt-2 space-y-1.5 pl-9">
              {item.info.map((x) => (
                <li key={x.lv} className="list-disc text-sm text-slate-700 marker:text-slate-300">
                  {l(x)}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Modal>
  )
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="font-medium text-slate-800 first-letter:uppercase">{children}</dd>
      </div>
    </div>
  )
}

