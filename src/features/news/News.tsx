import { useState } from 'react'
import { ArrowRight, ClipboardCheck, Newspaper, UserRound } from 'lucide-react'
import { CAREERS, NEWS } from '../../data'
import type { NewsKind } from '../../data'
import { useApp } from '../../lib/state'
import { currentTrack, overallProgress } from '../../lib/skills'
import { Button, Card, Meter, PageHeader } from '../../components/ui'
import { FilterBar } from '../../components/FilterBar'
import type { FilterDef } from '../../components/FilterBar'
import { ExampleNotice } from '../../components/cards'
import { NewsList, isUpcoming } from './NewsItem'
import { NextStepCard } from '../../components/NextStepCard'

/**
 * News & events — the home page after onboarding. Articles about AI,
 * cybersecurity, data, web and IT support, local job-market news, events,
 * courses and volunteering, plus a profile card so "Mans profils" is one tap away.
 */
export function News() {
  const { t, l, profile } = useApp()
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
  // Upcoming events / courses / volunteering first (soonest first), then news and articles (newest first).
  const upcoming = items.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const latest = items.filter((n) => !isUpcoming(n)).sort((a, b) => b.date.localeCompare(a.date))


  return (
    <>
      <PageHeader icon={Newspaper} eyebrow={t.news.eyebrow} title={t.news.greeting(profile.name)} subtitle={t.news.subtitle} />
      <NextStepCard />
      <ExampleNotice />

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
              <NewsList items={showAll ? upcoming : upcoming.slice(0, 4)} />
            </section>
          )}
          {latest.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-bold text-slate-900">{t.news.latest}</h2>
              <NewsList items={showAll ? latest : latest.slice(0, 6)} />
            </section>
          )}
          {!showAll && (upcoming.length > 4 || latest.length > 6) && (
            <div className="mt-8 text-center">
              <Button variant="secondary" size="lg" onClick={() => setShowAll(true)}>
                {t.news.showMore(upcoming.length + latest.length - Math.min(4, upcoming.length) - Math.min(6, latest.length))}
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

