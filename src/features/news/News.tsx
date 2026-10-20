import { useState } from 'react'
import { ArrowRight, BookOpen, CalendarDays, Check, ClipboardCheck, GraduationCap, HandHeart, MapPin, Newspaper, Star, UserRound } from 'lucide-react'
import { CAREERS, NEWS } from '../../data'
import type { NewsItem, NewsKind, TrackId } from '../../data'
import { toggle, useApp } from '../../lib/state'
import { currentTrack, overallProgress } from '../../lib/skills'
import { Button, Card, Chip, Meter, cx } from '../../components/ui'
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
  const [kind, setKind] = useState<NewsKind | 'all'>('all')
  const [topic, setTopic] = useState<TrackId | null>(null)
  const [saldusOnly, setSaldusOnly] = useState(false)

  const items = NEWS.filter(
    (n) => (kind === 'all' || n.kind === kind) && (!topic || n.track === topic) && (!saldusOnly || n.inSaldus),
  )
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
    const [day, month] = fmt.format(new Date(n.date)).split(' ')
    return (
      <Card key={n.id} className="flex h-full gap-4 p-5 sm:p-6">
        <div className="flex w-14 shrink-0 flex-col items-center self-start rounded-xl bg-slate-100 py-2 text-center">
          <span className="text-xl leading-none font-extrabold text-slate-900 tabular-nums">{day.replace('.', '')}</span>
          <span className="mt-1 text-xs font-semibold text-slate-500 uppercase">{month}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', style.tone)}>
              <style.icon className="size-3.5" /> {t.news.kinds[n.kind]}
            </span>
            {career && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                <career.icon className="size-3.5" /> {l(career.title)}
              </span>
            )}
            {isUpcoming(n) && days <= 30 && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {days === 0 ? t.news.today : t.news.inDays(days)}
              </span>
            )}
            <span className="inline-flex shrink-0 items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
              {t.example.badge}
            </span>
          </div>
          <h3 className="mt-2 leading-snug font-bold text-slate-900 sm:text-lg">{l(n.title)}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{l(n.summary)}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-4" /> {l(n.place)}
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
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold tracking-wide text-accent-600 uppercase">{t.news.eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl">{t.news.greeting(profile.name)}</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{t.news.subtitle}</p>
      </div>
      <ExampleNotice />
      <ProfileStrip />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {/* Filters: type, then topic (career track) */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(t.news.kinds) as (NewsKind | 'all')[]).map((k) => (
                <Chip key={k} selected={kind === k} onClick={() => setKind(k)}>
                  {t.news.kinds[k]}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.news.topics}</span>
              <Chip selected={!topic} onClick={() => setTopic(null)}>
                {t.news.allTopics}
              </Chip>
              {CAREERS.map((c) => (
                <Chip key={c.id} selected={topic === c.id} onClick={() => setTopic(topic === c.id ? null : c.id)}>
                  {l(c.title)}
                  {profile.careerId === c.id && ' ★'}
                </Chip>
              ))}
              <Chip selected={saldusOnly} onClick={() => setSaldusOnly(!saldusOnly)}>
                {t.news.inSaldus}
              </Chip>
            </div>
          </div>

          {!items.length && <p className="mt-10 text-center text-slate-500">{t.news.noResults}</p>}

          {upcoming.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{t.news.upcoming}</h2>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{upcoming.map(card)}</div>
            </section>
          )}
          {latest.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{t.news.latest}</h2>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{latest.map(card)}</div>
            </section>
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
