import { Link } from 'react-router'
import { Award, CalendarDays, ClipboardList, Hourglass } from 'lucide-react'
import type { ApplicationStatus } from '../../data'
import { ROUTES, path, useApp } from '../../lib/state'
import { formatRange } from '../../lib/format'
import { Avatar, ExampleBadge } from '../../components/cards'
import { PageHeader, cx } from '../../components/ui'
import { CertificateCard, useCertificate } from '../certificate/CertificateCard'

const ORDER: ApplicationStatus[] = ['applied', 'accepted', 'in_progress', 'completed', 'declined']

export const STATUS_TONE: Record<ApplicationStatus, string> = {
  applied: 'bg-amber-100 text-amber-800',
  accepted: 'bg-brand-100 text-brand-800',
  in_progress: 'bg-accent-100 text-accent-800',
  completed: 'bg-accent-500 text-on-accent',
  declined: 'bg-slate-200 text-slate-700',
}

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const { t } = useApp()
  return <span className={cx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold', STATUS_TONE[status])}>{t.status[status]}</span>
}

/** Student: everything they applied for, grouped by status. */
export function MyPlacements() {
  const { t, l, lang, applications, placements, certificates, companyOf } = useApp()
  const mine = applications.filter((a) => a.mine).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <>
      <PageHeader icon={ClipboardList} eyebrow={t.nav.myPlacements} title={t.mine.title} subtitle={t.mine.subtitle} />
      {!mine.length && (
        <div className="py-12 text-center">
          <p className="text-slate-600">{t.mine.empty}</p>
          <Link to={ROUTES.board} className="mt-4 inline-flex font-semibold text-brand-700 hover:underline">
            {t.mine.emptyCta} →
          </Link>
        </div>
      )}
      <div className="space-y-8">
        {ORDER.map((status) => {
          const group = mine.filter((a) => a.status === status)
          if (!group.length) return null
          return (
            <section key={status}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                {t.status[status]} <span className="text-sm font-semibold text-slate-500">({group.length})</span>
              </h2>
              <ul className="space-y-3">
                {group.map((a) => {
                  const p = placements.find((x) => x.id === a.placementId)
                  const c = p && companyOf(p)
                  const certificate = certificates.find((x) => x.applicationId === a.id)
                  return (
                    <li key={a.id} className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:p-5">
                      <Avatar name={c?.name ?? '?'} logo={c?.logoDataUrl} square />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={a.status} />
                          {a.isExample && <ExampleBadge />}
                        </div>
                        <Link to={p ? path(ROUTES.placement, p.id) : ROUTES.board} className="mt-1 block font-bold text-slate-900 hover:text-brand-700 hover:underline">
                          {p ? l(p.title) : '—'}
                        </Link>
                        <p className="text-sm text-slate-600">
                          {c?.name} · <CalendarDays className="inline size-3.5 align-[-2px]" /> {formatRange(a.dates, lang)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{t.mine.next[a.status]}</p>
                      </div>
                      {a.status === 'completed' &&
                        (certificate ? (
                          <Link to={path(ROUTES.certificate, certificate.id)} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
                            <Award className="size-4" /> {t.mine.openCertificate}
                          </Link>
                        ) : (
                          <p className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Hourglass className="size-4" /> {t.mine.waitingCertificate}
                          </p>
                        ))}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}

/** Student: their certificates, newest first, shown as compact certificates. */
export function MyCertificate() {
  const { t, certificates, applications } = useApp()
  const mine = certificates
    .filter((p) => applications.some((a) => a.id === p.applicationId && a.mine))
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
  return (
    <>
      <PageHeader icon={Award} eyebrow={t.nav.myCertificate} title={t.certificate.myTitle} subtitle={t.certificate.myText} />
      {!mine.length && (
        <div className="py-12 text-center">
          <p className="text-slate-600">{t.certificate.myEmpty}</p>
          <Link to={ROUTES.board} className="mt-4 inline-flex font-semibold text-brand-700 hover:underline">
            {t.mine.emptyCta} →
          </Link>
        </div>
      )}
      <div className="mx-auto max-w-3xl space-y-8">
        {mine.map((p) => (
          <CertificatePreview key={p.id} id={p.id} />
        ))}
      </div>
    </>
  )
}

function CertificatePreview({ id }: { id: string }) {
  const { t } = useApp()
  const data = useCertificate(id)
  if (!data) return null
  return (
    <div>
      <CertificateCard data={data} compact />
      <div className="mt-3 flex justify-end">
        <Link to={path(ROUTES.certificate, id)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
          <Award className="size-4" /> {t.certificate.open}
        </Link>
      </div>
    </div>
  )
}
