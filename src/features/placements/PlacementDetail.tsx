import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, BadgeCheck, CalendarDays, CircleHelp, Clock, Coins, HardHat, Lock, Mail, MapPin, Bus, PackageCheck, Phone, Users, Utensils, UserRound, Languages, Wrench, Backpack } from 'lucide-react'
import { ROUTES, path, todayIso, useApp } from '../../lib/state'
import { spotsLeft } from '../../lib/placements'
import { formatDate, formatRange } from '../../lib/format'
import { Avatar, ExampleBadge, FieldBadge } from '../../components/cards'
import { Button, Card } from '../../components/ui'

export function PlacementDetail() {
  const { id = '' } = useParams()
  const { t, l, lang, role, placements, applications, companyOf, openRolePicker } = useApp()
  const navigate = useNavigate()
  const p = placements.find((x) => x.id === id)

  if (!p)
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-slate-600">{t.detail.notFound}</p>
        <Link to={ROUTES.board} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
          <ArrowLeft className="size-4" /> {t.detail.allPlacements}
        </Link>
      </div>
    )

  const company = companyOf(p)
  const left = spotsLeft(p, applications)
  const mine = applications.find((a) => a.mine && a.placementId === p.id && a.status !== 'declined')
  const closed = p.status !== 'published' || p.deadline < todayIso()
  const applyPath = path(ROUTES.apply, p.id)
  const apply = () => (role === 'student' ? navigate(applyPath) : openRolePicker('student', applyPath))

  return (
    <>
      <Link to={ROUTES.board} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="size-4" /> {t.detail.allPlacements}
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <FieldBadge field={p.field} />
            {p.isExample && <ExampleBadge withNote />}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl">{l(p.title)}</h1>
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={company?.name ?? '?'} logo={company?.logoDataUrl} size="md" square />
            <div>
              <p className="font-bold text-slate-900">{company?.name}</p>
              <p className="text-sm text-slate-500">{company && `${l(company.industry)} · ${company.town}`}</p>
            </div>
          </div>
          {role === 'company' && <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">{t.detail.companyView}</p>}

          <Section title={t.detail.task}>
            <p className="text-[17px] leading-8 text-slate-800">{l(p.task)}</p>
            {p.tools.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Wrench className="size-4 text-slate-400" aria-label={t.detail.tools} />
                {p.tools.map((tool) => (
                  <span key={tool} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </Section>

          <Section title={t.detail.plan}>
            <ol className="space-y-3">
              {p.dayPlan.map((d, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 shrink-0 items-center rounded-md bg-accent-500 px-2 text-xs font-bold text-on-accent">{t.common.day(i + 1)}</span>
                  <span className="pt-0.5 text-slate-700">{l(d)}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title={t.detail.deliverable}>
            <p className="flex gap-2 text-slate-800">
              <PackageCheck className="mt-0.5 size-5 shrink-0 text-accent-600" /> {l(p.deliverable)}
            </p>
            <h3 className="mt-5 text-sm font-bold text-slate-900">{t.detail.passportSkills}</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {p.passportSkills.map((s, i) => (
                <li key={i} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-sm font-medium text-brand-800 ring-1 ring-brand-200">
                  <BadgeCheck className="size-4" /> {l(s)}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t.detail.requirements}>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Fact icon={<CircleHelp className="size-4" />} label={t.detail.prerequisites}>
                {l(p.prerequisites)} <span className="text-slate-500">· {t.levels[p.level]} · {t.detail.minAge(p.minAge)}</span>
              </Fact>
              <Fact icon={<Languages className="size-4" />} label={t.detail.languages}>
                {p.languages.map((x) => t.workLangs[x]).join(', ')}
              </Fact>
              <Fact icon={<Backpack className="size-4" />} label={t.detail.bring}>
                {l(p.bring)}
              </Fact>
              <Fact icon={<HardHat className="size-4" />} label={t.detail.safety}>
                {l(p.safety)}
              </Fact>
              <Fact icon={<Lock className="size-4" />} label={t.detail.data}>
                {l(p.dataNote)}
              </Fact>
              <Fact icon={<UserRound className="size-4" />} label={t.detail.mentor}>
                {p.mentor.name} · {l(p.mentor.role)}
              </Fact>
            </dl>
          </Section>

          {company && (
            <Section title={t.detail.about}>
              <p className="text-slate-700">{l(company.description)}</p>
              <p className="mt-2 text-sm text-slate-500">{company.address}</p>
            </Section>
          )}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <h2 className="font-bold text-slate-900">{t.detail.logistics}</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <Fact icon={<CalendarDays className="size-4" />} label={t.detail.dates}>
                {p.dates.map((d) => (
                  <span key={d.start} className="block">
                    {formatRange(d, lang)}
                  </span>
                ))}
                <span className="text-slate-500">{t.common.days(p.durationDays)}</span>
              </Fact>
              <Fact icon={<Clock className="size-4" />} label={t.detail.hours}>
                {p.hours}
              </Fact>
              <Fact icon={<MapPin className="size-4" />} label={t.detail.location}>
                {l(p.location)}
              </Fact>
              <Fact icon={<Bus className="size-4" />} label={t.detail.transport}>
                {l(p.transport)}
              </Fact>
              <Fact icon={<Utensils className="size-4" />} label={t.detail.lunch}>
                {p.lunch ? t.detail.lunchYes : t.detail.lunchNo}
              </Fact>
              <Fact icon={<Coins className="size-4" />} label={t.detail.stipend}>
                {p.stipend ? t.common.eur(p.stipend) : t.detail.unpaid}
              </Fact>
              <Fact icon={<Users className="size-4" />} label={t.detail.deadline}>
                {formatDate(p.deadline, lang, true)} · {t.card.spotsLeft(left)}
              </Fact>
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-slate-900">{t.detail.applyTitle}</h2>
            {mine ? (
              <>
                <p className="mt-2 text-sm text-slate-600">{t.detail.alreadyApplied}</p>
                <Link to={ROUTES.mine} className="mt-4 inline-flex font-semibold text-brand-700 hover:underline">
                  {t.detail.seeMine} →
                </Link>
              </>
            ) : closed ? (
              <p className="mt-2 text-sm text-slate-600">{t.detail.closed}</p>
            ) : left === 0 ? (
              <p className="mt-2 text-sm text-slate-600">{t.detail.full}</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-slate-600">{role === 'student' ? t.detail.applyText : t.detail.needStudent}</p>
                <Button className="mt-4 w-full" size="lg" onClick={apply}>
                  {role === 'student' ? t.card.apply : t.detail.asStudent}
                </Button>
              </>
            )}
          </Card>

          {company && (
            <Card className="p-5 text-sm">
              <h2 className="font-bold text-slate-900">{t.detail.contact}</h2>
              <p className="mt-2 text-slate-700">{company.contactName}</p>
              <p className="mt-1 flex items-center gap-1.5 text-slate-600 select-all">
                <Mail className="size-4" /> {company.contactEmail}
              </p>
              {company.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-slate-600 select-all">
                  <Phone className="size-4" /> {company.phone}
                </p>
              )}
            </Card>
          )}
        </aside>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="mb-3 text-xl font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

export function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-accent-600">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="text-slate-800">{children}</dd>
      </div>
    </div>
  )
}
