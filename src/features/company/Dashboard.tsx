import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Archive, Award, Building2, CopyPlus, Inbox, Pencil, Plus, RotateCcw, Users } from 'lucide-react'
import type { Placement } from '../../data'
import { ROUTES, newId, path, useApp } from '../../lib/state'
import { spotsLeft } from '../../lib/placements'
import { Avatar, ExampleBadge, FieldBadge } from '../../components/cards'
import { Button, Card, PageHeader, cx } from '../../components/ui'

/** Shown on company pages when the visitor hasn't chosen the company role yet. */
export function NeedCompany() {
  const { t, openRolePicker } = useApp()
  return (
    <div className="py-16 text-center">
      <p className="text-lg text-slate-600">{t.company.noCompany}</p>
      <Button className="mt-4" onClick={() => openRolePicker('company')}>
        <Building2 className="size-4" /> {t.roles.companyCta}
      </Button>
    </div>
  )
}

export function Dashboard() {
  const { t, l, role, company, companyId, placements, applications, certificates, savePlacement, notify } = useApp()
  const navigate = useNavigate()
  if (role !== 'company') return <NeedCompany />

  const ours = placements.filter((p) => companyId && p.companyId === companyId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const ourApps = applications.filter((a) => ours.some((p) => p.id === a.placementId))
  const stats = [
    { icon: Building2, label: t.company.stats.active, value: ours.filter((p) => p.status === 'published').length },
    { icon: Users, label: t.company.stats.spots, value: ours.filter((p) => p.status === 'published').reduce((s, p) => s + spotsLeft(p, applications), 0) },
    { icon: Inbox, label: t.company.stats.applications, value: ourApps.filter((a) => a.status === 'applied').length },
    { icon: Award, label: t.company.stats.certificates, value: certificates.filter((p) => ourApps.some((a) => a.id === p.applicationId)).length },
  ]

  const duplicate = (p: Placement) => {
    savePlacement({
      ...p,
      id: newId('pl'),
      title: { lv: p.title.lv + t.company.copySuffix, en: p.title.en + t.company.copySuffix },
      status: 'draft',
      isExample: false,
      createdAt: new Date().toISOString(),
    })
    notify(t.company.duplicated)
  }

  return (
    <>
      <PageHeader
        icon={Building2}
        eyebrow={t.nav.ourPlacements}
        title={company?.name ?? t.roles.newCompany}
        subtitle={company ? `${l(company.industry)} · ${company.town}` : t.roles.newCompanyHint}
        aside={
          <Button size="lg" onClick={() => navigate(ROUTES.newPlacement)}>
            <Plus className="size-5" /> {t.company.add}
          </Button>
        }
      />
      {company?.isExample && (
        <p className="-mt-2 mb-6">
          <ExampleBadge withNote />
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <s.icon className="size-5 text-accent-600" />
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold text-slate-900">{t.company.title}</h2>
      {!ours.length && (
        <Card className="p-8 text-center">
          <p className="text-slate-600">{t.company.empty}</p>
          <Button className="mt-4" onClick={() => navigate(ROUTES.newPlacement)}>
            <Plus className="size-4" /> {t.company.emptyCta}
          </Button>
        </Card>
      )}
      <ul className="space-y-3">
        {ours.map((p) => {
          const apps = applications.filter((a) => a.placementId === p.id)
          const capacity = p.spots * p.dates.length
          const taken = capacity - spotsLeft(p, applications)
          return (
            <li key={p.id} className="rounded-2xl bg-card p-4 ring-1 ring-slate-200 sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Avatar name={company?.name ?? '?'} logo={company?.logoDataUrl} square />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cx(
                        'rounded-full px-2.5 py-0.5 text-xs font-bold',
                        p.status === 'published' ? 'bg-accent-500 text-on-accent' : p.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700',
                      )}
                    >
                      {t.placementStatus[p.status]}
                    </span>
                    <FieldBadge field={p.field} />
                    {p.isExample && <ExampleBadge />}
                  </div>
                  <Link to={path(ROUTES.placement, p.id)} className="mt-1 block font-bold text-slate-900 hover:text-brand-700 hover:underline">
                    {l(p.title)}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {t.company.filled(taken, capacity)} · {t.company.applicationsCount(apps.length)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Action to={path(ROUTES.applications, p.id)} icon={<Inbox className="size-4" />}>
                    {t.company.viewApplications}
                  </Action>
                  <Action to={path(ROUTES.editPlacement, p.id)} icon={<Pencil className="size-4" />}>
                    {t.common.edit}
                  </Action>
                  <Button variant="secondary" onClick={() => duplicate(p)}>
                    <CopyPlus className="size-4" /> {t.company.duplicate}
                  </Button>
                  {p.status === 'published' ? (
                    <Button variant="secondary" onClick={() => (savePlacement({ ...p, status: 'closed' }), notify(t.company.closed))}>
                      <Archive className="size-4" /> {t.company.close}
                    </Button>
                  ) : (
                    p.status === 'closed' && (
                      <Button variant="secondary" onClick={() => (savePlacement({ ...p, status: 'published' }), notify(t.company.reopened))}>
                        <RotateCcw className="size-4" /> {t.company.reopen}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function Action({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex h-10 items-center gap-2 rounded-lg bg-card px-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 hover:ring-slate-400">
      {icon} {children}
    </Link>
  )
}
