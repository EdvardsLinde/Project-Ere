import type { ReactNode } from 'react'
import { Mail, PartyPopper, RotateCcw, UserRound } from 'lucide-react'
import { CAREERS, INTERESTS, MOTIVATION_TAGS, SKILLS } from '../data'
import { useApp } from '../state'
import { Button, Card } from '../components/ui'

export function Thanks() {
  const { t, l, profile, restart, goTo } = useApp()
  const career = CAREERS.find((c) => c.id === profile.careerId)
  const join = (items: string[]) => (items.length ? items.join(', ') : t.thanks.none)

  const rows: [string, ReactNode][] = [
    [t.thanks.career, career ? l(career.title) : t.thanks.none],
    [t.thanks.interests, join(INTERESTS.filter((i) => profile.interests.includes(i.id)).map((i) => l(i.label)))],
    [
      t.thanks.skills,
      join([...SKILLS.filter((s) => profile.skills.includes(s.id)).map((s) => l(s.label)), ...profile.customSkills]),
    ],
    [
      t.thanks.motivation,
      join(
        [
          profile.motivationText.trim() && `“${profile.motivationText.trim()}”`,
          ...MOTIVATION_TAGS.filter((m) => profile.motivationTags.includes(m.id)).map((m) => l(m.label)),
        ].filter(Boolean) as string[],
      ),
    ],
    [t.thanks.experience, join(profile.experiences.map((e) => e.title))],
  ]

  return (
    <div className="mx-auto max-w-2xl py-4 text-center sm:py-8">
      <span className="animate-fade-up mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lift">
        <PartyPopper className="size-9" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {t.thanks.title(profile.name || '👋')}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">{t.thanks.text}</p>
      {profile.email && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-medium text-accent-800 ring-1 ring-accent-200">
          <Mail className="size-4" /> {t.thanks.contact(profile.email)}
        </p>
      )}

      <Card className="mt-10 text-left">
        <h2 className="border-b border-slate-100 px-6 py-4 text-base font-bold text-slate-900">{t.thanks.summaryTitle}</h2>
        <dl className="divide-y divide-slate-100">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-[150px_1fr] sm:gap-4">
              <dt className="text-sm font-medium text-slate-500">{label}</dt>
              <dd className="text-sm break-words text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => goTo('me')}>
            <UserRound className="size-4" /> {t.nav.profile}
          </Button>
          <Button variant="secondary" size="lg" onClick={restart}>
            <RotateCcw className="size-4" /> {t.thanks.restart}
          </Button>
        </div>
        <p className="text-xs text-slate-400">{t.thanks.prototype}</p>
      </div>
    </div>
  )
}
