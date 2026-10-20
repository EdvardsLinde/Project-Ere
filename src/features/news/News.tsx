import { useState } from 'react'
import { ArrowRight, BookOpen, CalendarDays, Check, ClipboardCheck, GraduationCap, HandHeart, MapPin, Newspaper, Star, UserRound } from 'lucide-react'
import { CAREERS, NEWS } from '../../data'
import type { NewsItem, NewsKind } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { currentTrack, overallProgress } from '../../lib/skills'
import { Button, Card, Meter, PageHeader, cx } from '../../components/ui'
import { FilterBar } from '../../components/FilterBar'
import type { FilterDef } from '../../components/FilterBar'
import { Illustration, newsScene } from '../../components/Illustration'
import { ExampleNotice } from '../../components/cards'

const KIND_STYLE: Record<NewsKind, { icon: typeof Newspaper; tone: string }> = {
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
const daysUntil = (iso: string) => Math.round((Date.parse(iso) - today()) / DAY)

/**
 * News & events — the home page after onboarding. Articles about AI,
 * cybersecurity, data, web and IT support, local job-market news, events,
 * courses and volunteering, plus a profile card so "Mans profils" is one tap away.
 */
export function News() {
  const { t, l, lang, profile, update } = useApp()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('')
  const [topic, setTopic] = useState('')
  const [place, setPlace] = useState('')
  const [showAll, setShowAll] = useState(false)

  const needle = q.trim().toLowerCase()
  const items = NEWS.filter(
    (n) =>
      (!needle || [n.title.lv, n.title.en, n.summary.lv, n.summary.en].join(' ').toLowerCase().includes(needle)) &&
      (!kind || n.kind === kind) &&
      (!topic || n.track === topic) &&
      (!place || (place === 'saldus' ? n.inSaldus : !n.inSaldus)),
  )
  const hasFilters = !!(q || kind || topic || place)
  const filters: FilterDef[] = [
    {
      id: 'type',
      label: t.filters.type,
      value: kind,
      onChange: setKind,
      options: (['article', 'news', 'event', 'course', 'volunteering'] as NewsKind[]).map((k) => ({ value: k, label: t.news.kinds[k] })),
    },
    {
      id: 'field',
      label: t.filters.field,
      value: topic,
      onChange: setTopic,
      options: CAREERS.map((c) => ({ value: c.id, label: l(c.title) + (profile.careerId === c.id ? ' ★' : '') })),
    },
    {
      id: 'place',
      label: t.filters.place,
      value: place,
      onChange: setPlace,
      options: [
        { value: 'saldus', label: t.filters.saldus },
        { value: 'online', label: t.filters.online },
      ],
    },
  ]
  const isUpcoming = (n: NewsItem) => (n.kind === 'event' || n.kind === 'course' || n.kind === 'volunteering') && daysUntil(n.date) >= 0
  // Upcoming events / courses / volunteering first (soonest first), then news and articles (newest first).
  const upcoming = items.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const latest = items.filter((n) => !isUpcoming(n)).sort((a, b) => b.date.localeCompare(a.date))

  const fmt = new Intl.DateTimeFormat(lang === 'lv' ? 'lv-LV' : 'en-GB', { day: 'numeric', month: 'short' })

  const card = (n: NewsItem) => {
    const style = KIND_STYLE[n.kind]
    const days = daysUntil(n.date)
    const saved = profile.savedNews.includes(n.id)
    const career = CAREERS.find((c) => c.id === n.track)
    return (
      <Card key={n.id} className="flex h-full flex-col overflow-hidden transition hover:shadow-lift">
        <Illustration scene={newsScene(n.kind, n.track)} size="xs">
          <span className={cx('absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm', style.tone)}>
            <style.icon className="size-3.5" /> {t.news.kinds[n.kind]}
          </span>
          <span className="absolute top-3 right-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {isUpcoming(n) && days <= 30 ? (days === 0 ? t.news.today : t.news.inDays(days)) : fmt.format(new Date(n.date))}
          </span>
        </Illustration>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {career && (
              <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                <career.icon className="size-3.5" /> {l(career.title)}
              </span>
            )}
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase">
              {t.example.badge}
            </span>
          </div>
          <h3 className="mt-1.5 leading-snug font-bold text-slate-900">{l(n.title)}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{l(n.summary)}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-4 shrink-0" /> <span className="truncate">{l(n.place)}</span>
            </span>
            {n.kind !== 'news' && n.kind !== 'article' && (
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
      <PageHeader icon={Newspaper} eyebrow={t.news.eyebrow} title={t.news.greeting(profile.name)} subtitle={t.news.subtitle} />
      <ExampleNotice />
      <ProfileStrip />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <FilterBar
            search={{ value: q, onChange: setQ, placeholder: t.news.searchPlaceholder }}
            filters={filters}
            count={t.news.count(items.length)}
            onClear={
              hasFilters
                ? () => {
                    setQ('')
                    setKind('')
                    setTopic('')
                    setPlace('')
                  }
                : undefined
            }
          />

          {!items.length && <p className="mt-10 text-center text-slate-500">{t.news.noResults}</p>}

          {upcoming.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-bold text-slate-900">{t.news.upcoming}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{(showAll ? upcoming : upcoming.slice(0, 4)).map(card)}</div>
            </section>
          )}
          {latest.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-bold text-slate-900">{t.news.latest}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{(showAll ? latest : latest.slice(0, 4)).map(card)}</div>
            </section>
          )}
          {!showAll && upcoming.length + latest.length > 8 && (
            <div className="mt-8 text-center">
              <Button variant="secondary" size="lg" onClick={() => setShowAll(true)}>
                {t.news.showMore(upcoming.length + latest.length - Math.min(4, upcoming.length) - Math.min(4, latest.length))}
              </Button>
            </div>
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <ProfileCard />
        </aside>
      </div>
    </>
  )
}

/** Compact profile summary so the user's profile is always one tap from the home page. */
function ProfileCard() {
  const { t, l, profile, goTo } = useApp()
  const track = currentTrack(profile)
  const ready = overallProgress(profile)
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-hero-from via-hero-via to-hero-to p-5 text-white">
        <p className="text-xs font-semibold tracking-wide text-white/75 uppercase">{t.news.profileCard}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold ring-2 ring-white/40">
            {profile.name.charAt(0).toUpperCase() || <UserRound className="size-5" />}
          </span>
          <p className="min-w-0 truncate text-lg font-bold">{profile.name || t.nav.profile}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        {profile.testResult ? (
          <div>
            <div className="mb-2 flex justify-between gap-2 text-sm">
              <span className="font-medium text-slate-700">{t.news.readiness(l(track.title))}</span>
              <span className="font-bold text-brand-700 tabular-nums">{ready}%</span>
            </div>
            <Meter value={ready} label={t.news.readiness(l(track.title))} />
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600">{t.news.noTestYet}</p>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => goTo('test')}>
              <ClipboardCheck className="size-4" /> {t.me.testCta}
            </Button>
          </div>
        )}
        <Button className="w-full" onClick={() => goTo('me')}>
          {t.news.openProfile} <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  )
}

/** Phones: a one-line profile shortcut instead of the sidebar card. */
function ProfileStrip() {
  const { t, l, profile, goTo } = useApp()
  const ready = overallProgress(profile)
  return (
    <button
      type="button"
      onClick={() => goTo('me')}
      className="mb-6 flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-card ring-1 ring-slate-200 lg:hidden"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-100 font-bold text-accent-800">
        {profile.name.charAt(0).toUpperCase() || <UserRound className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-slate-900">{profile.name || t.nav.profile}</span>
        <span className="block truncate text-xs text-slate-500">
          {profile.testResult ? `${t.news.readiness(l(currentTrack(profile).title))} · ${ready}%` : t.news.noTestYet}
        </span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700">
        {t.news.openProfile} <ArrowRight className="size-4" />
      </span>
    </button>
  )
}
