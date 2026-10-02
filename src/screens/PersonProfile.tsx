import type { ReactNode } from 'react'
import { ArrowLeft, Check, MapPin, UserPlus } from 'lucide-react'
import { CAREERS, COURSES, INTERESTS, PEOPLE } from '../data'
import { toggle, useApp } from '../state'
import { Button, Card, cx } from '../components/ui'
import { Avatar, CourseCard, ExampleBadge, ExampleNotice, PersonCard, rankPeople } from '../components/cards'

/** Public profile of another person (mentor, professional or peer). */
export function PersonProfile() {
  const { t, l, lang, profile, update, personId, closePerson, goTo } = useApp()
  const person = PEOPLE.find((p) => p.id === personId)

  const backBtn = (
    <button
      type="button"
      onClick={closePerson}
      className="-ml-2 mb-6 inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeft className="size-4" /> {t.people.back}
    </button>
  )

  if (!person) {
    return (
      <>
        {backBtn}
        <p className="text-slate-500">{t.people.notFound}</p>
      </>
    )
  }

  const following = profile.following.includes(person.id)
  const career = CAREERS.find((c) => c.id === person.careerId)
  const interests = INTERESTS.filter((i) => person.interests.includes(i.id))
  const courses = COURSES.filter((c) => c.careerId === person.careerId).slice(0, 2)
  const similar = rankPeople(
    PEOPLE.filter((p) => p.id !== person.id),
    person.careerId,
    person.interests,
  ).slice(0, 3)
  // "Linux" stays as is; "Matemātika / Maths" shows the part for the current language.
  const skillLabel = (s: string) => (s.includes(' / ') ? s.split(' / ')[lang === 'lv' ? 0 : 1] : s)

  return (
    <>
      {backBtn}
      <ExampleNotice />

      <div className="space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-slate-800 via-brand-800 to-brand-600 sm:h-28" />
          <div className="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <span className="-mt-10 self-start rounded-full ring-4 ring-white sm:-mt-12">
                <Avatar name={person.name} size="xl" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{person.name}</h1>
                  <ExampleBadge />
                </div>
                <p className="mt-1 text-slate-600">{l(person.role)}</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" /> {l(person.location)}
                  </span>
                  <span className="tabular-nums">{t.people.followers(person.followers + (following ? 1 : 0))}</span>
                  <span
                    className={cx(
                      'rounded-md px-2 py-0.5 text-xs font-semibold',
                      person.kind === 'mentor' && 'bg-brand-50 text-brand-700',
                      person.kind === 'pro' && 'bg-violet-50 text-violet-700',
                      person.kind === 'peer' && 'bg-accent-50 text-accent-700',
                    )}
                  >
                    {t.people.kindLabel[person.kind]}
                  </span>
                </p>
              </div>
            </div>
            <Button
              size="lg"
              variant={following ? 'secondary' : 'primary'}
              aria-pressed={following}
              onClick={() => update({ following: toggle(profile.following, person.id) })}
              className="w-full sm:w-auto"
            >
              {following ? <Check className="size-5" strokeWidth={2.5} /> : <UserPlus className="size-5" />}
              {following ? t.people.following : t.people.follow}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <Section title={t.people.about}>
              <p className="leading-relaxed text-slate-700">{l(person.bio)}</p>
            </Section>

            <Section title={t.people.journey} hint={t.people.journeyHint}>
              <ol className="relative space-y-5 border-l-2 border-slate-100 pl-5">
                {person.journey.map((j, i) => (
                  <li key={i} className="relative">
                    <span
                      className={cx(
                        'absolute top-1.5 -left-[27px] size-3 rounded-full ring-4 ring-white',
                        i === person.journey.length - 1 ? 'bg-accent-500' : 'bg-brand-600',
                      )}
                    />
                    <p className="text-xs font-semibold text-slate-400 tabular-nums">{l(j.when)}</p>
                    <p className="text-slate-800">{l(j.text)}</p>
                  </li>
                ))}
              </ol>
            </Section>

            {courses.length > 0 && (
              <Section title={t.people.courses}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {courses.map((c) => (
                    <CourseCard key={c.id} course={c} compact />
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="space-y-6">
            <Section title={t.people.skills}>
              <div className="flex flex-wrap gap-2">
                {person.skills.map((s) => (
                  <span key={s} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                    {skillLabel(s)}
                  </span>
                ))}
              </div>
            </Section>

            <Section title={t.people.interests}>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span
                    key={i.id}
                    className={cx(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
                      profile.interests.includes(i.id) ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200' : 'bg-slate-100 text-slate-700',
                    )}
                  >
                    <i.icon className="size-3.5" /> {l(i.label)}
                  </span>
                ))}
              </div>
              {career && (
                <button
                  type="button"
                  onClick={() => goTo('paths')}
                  className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-3 text-left ring-1 ring-slate-200 transition hover:bg-slate-100"
                >
                  <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-lg ring-1', career.tone)}>
                    <career.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-slate-500">{t.people.field}</span>
                    <span className="block font-semibold text-slate-900">{l(career.title)}</span>
                  </span>
                </button>
              )}
            </Section>

            <Section title={t.people.similar}>
              <div className="space-y-4">
                {similar.map((p) => (
                  <PersonCard key={p.id} person={p} compact />
                ))}
              </div>
            </Section>
          </aside>
        </div>
      </div>
    </>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold text-slate-900 sm:text-lg">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}
      <div className="mt-4">{children}</div>
    </Card>
  )
}
