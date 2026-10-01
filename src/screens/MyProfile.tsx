import type { ReactNode } from 'react'
import {
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Circle,
  Heart,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Route,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { CAREERS, EXPERIENCE_TYPES, INTERESTS, MOTIVATION_TAGS, SKILLS, TRAINING } from '../data'
import { useApp } from '../state'
import type { Step } from '../state'
import { Button, Card, cx } from '../components/ui'

/**
 * "Mans profils" — the user's profile page, reachable any time from the header.
 * Every section links back to the flow step where it is edited; after saving,
 * the user returns here (see `edit` in state.tsx).
 */
export function MyProfile() {
  const { t, l, profile, edit, goTo } = useApp()

  if (!profile.name) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <UserRound className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">{t.me.emptyTitle}</h1>
        <p className="mt-2 text-slate-600">{t.me.emptyText}</p>
        <Button size="lg" className="mt-6" onClick={() => goTo('welcome')}>
          {t.me.create} <ArrowRight className="size-5" />
        </Button>
      </Card>
    )
  }

  const career = CAREERS.find((c) => c.id === profile.careerId)
  const interests = INTERESTS.filter((i) => profile.interests.includes(i.id))
  const skills = [...SKILLS.filter((s) => profile.skills.includes(s.id)).map((s) => l(s.label)), ...profile.customSkills]
  const motivationTags = MOTIVATION_TAGS.filter((m) => profile.motivationTags.includes(m.id))

  const todos: { done: boolean; label: string; step: Step }[] = [
    { done: interests.length > 0, label: t.me.todo.interests, step: 'interests' },
    { done: skills.length > 0, label: t.me.todo.skills, step: 'profile' },
    { done: !!profile.motivationText.trim() || motivationTags.length > 0, label: t.me.todo.motivation, step: 'profile' },
    { done: profile.experiences.length > 0, label: t.me.todo.experience, step: 'profile' },
    { done: !!career, label: t.me.todo.career, step: 'paths' },
  ]
  // The name counts as the first completed item.
  const completeness = Math.round(((1 + todos.filter((x) => x.done).length) / (1 + todos.length)) * 100)

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 sm:h-32" />
        <div className="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <span className="-mt-12 flex size-24 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl font-extrabold text-brand-700 shadow-lift ring-4 ring-white sm:-mt-10 sm:size-28">
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-accent-600 uppercase">{t.me.eyebrow}</p>
              <h1 className="text-2xl font-bold tracking-tight break-words text-slate-900 sm:text-3xl">{profile.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {t.me.location}
                </span>
                <span className="inline-flex min-w-0 items-center gap-1.5 break-all">
                  <Mail className="size-4 shrink-0" /> {profile.email || t.me.noEmail}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {career && (
              <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1', career.tone)}>
                <career.icon className="size-4" /> {l(career.title)}
              </span>
            )}
            {profile.interested && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 text-sm font-semibold text-accent-700 ring-1 ring-accent-200">
                <Check className="size-4" strokeWidth={2.5} /> {t.me.interested}
              </span>
            )}
          </div>
        </div>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <Section icon={<Heart className="size-5" />} title={t.me.about} onEdit={() => edit('profile')} editLabel={t.me.edit}>
            {profile.motivationText.trim() ? (
              <p className="leading-relaxed whitespace-pre-line text-slate-700">{profile.motivationText.trim()}</p>
            ) : (
              <EmptyLine text={t.me.aboutEmpty} />
            )}
            {motivationTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {motivationTags.map((m) => (
                  <Pill key={m.id}>{l(m.label)}</Pill>
                ))}
              </div>
            )}
          </Section>

          <Section icon={<Briefcase className="size-5" />} title={t.me.experience} onEdit={() => edit('profile')} editLabel={t.me.edit}>
            {profile.experiences.length ? (
              <ol className="relative space-y-5 border-l-2 border-slate-100 pl-5">
                {profile.experiences.map((x) => {
                  const type = EXPERIENCE_TYPES.find((e) => e.id === x.type)
                  return (
                    <li key={x.id} className="relative">
                      <span className="absolute top-1.5 -left-[27px] size-3 rounded-full bg-brand-600 ring-4 ring-white" />
                      {type && <p className="text-xs font-semibold tracking-wide text-accent-600 uppercase">{l(type.label)}</p>}
                      <p className="font-semibold break-words text-slate-900">{x.title}</p>
                      {x.description && <p className="mt-0.5 text-sm break-words text-slate-600">{x.description}</p>}
                    </li>
                  )
                })}
              </ol>
            ) : (
              <EmptyAction text={t.me.experienceEmpty} action={t.me.add} onClick={() => edit('profile')} />
            )}
          </Section>

          <Section
            icon={<Route className="size-5" />}
            title={t.me.career}
            onEdit={career ? () => edit('paths') : undefined}
            editLabel={t.me.edit}
          >
            {career ? (
              <>
                <p className="text-lg font-semibold text-slate-900">{l(career.title)}</p>
                <p className="mt-1 text-sm text-slate-600">{l(career.description)}</p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                  {TRAINING[career.id].map((step, i) => (
                    <li
                      key={i}
                      className={cx(
                        'rounded-xl p-4 ring-1',
                        i === 0 ? 'bg-brand-50 ring-brand-200' : 'bg-slate-50 ring-slate-200',
                      )}
                    >
                      <p className={cx('text-xs font-semibold', i === 0 ? 'text-brand-700' : 'text-slate-400')}>
                        {i === 0 ? t.me.nextStep : t.me.later}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {i + 1}. {t.training.steps[i]}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{l(step.duration)}</p>
                    </li>
                  ))}
                </ol>
                <Button variant="secondary" className="mt-5" onClick={() => goTo('training')}>
                  {t.me.openPath} <ArrowRight className="size-4" />
                </Button>
              </>
            ) : (
              <EmptyAction text={t.me.careerEmpty} action={t.me.chooseCareer} onClick={() => edit('paths')} />
            )}
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="order-first space-y-6 lg:sticky lg:top-24 lg:order-none">
          <Card className="p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold text-slate-900">{t.me.completeness}</h2>
              <span className="text-lg font-bold text-brand-700 tabular-nums">{completeness}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-500">{t.me.completeHint}</p>
            <ul className="mt-4 space-y-1">
              {todos.map((item) => (
                <li key={item.label}>
                  {item.done ? (
                    <span className="flex min-h-10 items-center gap-2.5 px-1 text-sm text-slate-400 line-through">
                      <CheckCircle2 className="size-5 shrink-0 text-accent-500" /> {item.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => edit(item.step)}
                      className="group flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg px-1 text-left text-sm font-medium text-slate-800 transition hover:bg-brand-50 hover:text-brand-800"
                    >
                      <Circle className="size-5 shrink-0 text-slate-300 group-hover:text-brand-400" />
                      <span className="flex-1">{item.label}</span>
                      <Plus className="size-4 text-slate-400 group-hover:text-brand-600" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Section icon={<Sparkles className="size-5" />} title={t.me.interests} onEdit={() => edit('interests')} editLabel={t.me.edit} compact>
            {interests.length ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <Pill key={i.id} icon={<i.icon className="size-3.5" />}>
                    {l(i.label)}
                  </Pill>
                ))}
              </div>
            ) : (
              <EmptyAction action={t.me.add} onClick={() => edit('interests')} />
            )}
          </Section>

          <Section icon={<Check className="size-5" />} title={t.me.skills} onEdit={() => edit('profile')} editLabel={t.me.edit} compact>
            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>
            ) : (
              <EmptyAction action={t.me.add} onClick={() => edit('profile')} />
            )}
          </Section>
        </aside>
      </div>
    </div>
  )
}

function Section({
  icon,
  title,
  onEdit,
  editLabel,
  compact,
  children,
}: {
  icon: ReactNode
  title: string
  onEdit?: () => void
  editLabel: string
  compact?: boolean
  children: ReactNode
}) {
  return (
    <Card className={compact ? 'p-5 sm:p-6' : 'p-5 sm:p-7'}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-bold text-slate-900 sm:text-lg">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            {icon}
          </span>
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            <Pencil className="size-3.5" /> {editLabel}
          </button>
        )}
      </div>
      {children}
    </Card>
  )
}

function Pill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
      {icon}
      {children}
    </span>
  )
}

function EmptyLine({ text }: { text: string }) {
  return <p className="text-sm text-slate-400">{text}</p>
}

function EmptyAction({ text, action, onClick }: { text?: string; action: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center sm:justify-between">
      {text && <p className="text-sm text-slate-500">{text}</p>}
      <Button variant="secondary" onClick={onClick}>
        <Plus className="size-4" /> {action}
      </Button>
    </div>
  )
}
