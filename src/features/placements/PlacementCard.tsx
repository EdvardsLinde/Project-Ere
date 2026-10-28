import { Link } from 'react-router'
import { ArrowRight, CalendarDays, Clock, MapPin, PackageCheck, Users } from 'lucide-react'
import type { Company, Placement } from '../../data'
import { ROUTES, path, todayIso, useApp } from '../../lib/state'
import { nextDates, spotsLeft } from '../../lib/placements'
import { formatRange } from '../../lib/format'
import { Avatar, ExampleBadge, FieldBadge } from '../../components/cards'
import { cx } from '../../components/ui'

/**
 * One placement on the student board (also used as the live preview in the
 * company builder, where `preview` disables the links).
 */
export function PlacementCard({ placement: p, company, preview = false, isNew = false }: { placement: Placement; company?: Company; preview?: boolean; isNew?: boolean }) {
  const { t, l, lang, applications } = useApp()
  const left = spotsLeft(p, applications)
  const next = nextDates(p, todayIso())
  const name = company?.name || t.roles.newCompany

  const body = (
    <>
      <div className="flex items-start gap-3">
        <Avatar name={name} logo={company?.logoDataUrl} size="sm" square />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">{name}</p>
          <p className="truncate text-xs text-slate-500">{company ? l(company.industry) : '—'}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {isNew && <span className="rounded-md bg-accent-500 px-1.5 py-0.5 text-[11px] font-bold text-on-accent uppercase">{t.common.new}</span>}
          {p.isExample && <ExampleBadge />}
        </div>
      </div>

      <h3 className={cx('mt-4 text-lg leading-snug font-bold text-balance text-slate-900', !preview && 'group-hover:text-brand-700')}>
        {l(p.title) || t.form.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600">{l(p.task) || t.form.task}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <FieldBadge field={p.field} />
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{t.common.days(p.durationDays)}</span>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{t.levels[p.level]}</span>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
        <li className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-accent-600" /> <span className="truncate">{l(p.location) || company?.town}</span>
        </li>
        {next && (
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-accent-600" /> {formatRange(next, lang) || '—'}
          </li>
        )}
        <li className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-accent-600" /> {p.hours}
        </li>
        <li className={cx('flex items-center gap-2', left === 0 && 'font-semibold text-red-700')}>
          <Users className="size-4 shrink-0 text-accent-600" /> {t.card.spotsLeft(left)}
        </li>
        {(l(p.deliverable) || preview) && (
          <li className="flex items-start gap-2">
            <PackageCheck className="mt-0.5 size-4 shrink-0 text-accent-600" />
            <span className="line-clamp-2">
              <span className="font-semibold text-slate-800">{t.card.deliverable}:</span> {l(p.deliverable) || '—'}
            </span>
          </li>
        )}
      </ul>
      {company && <p className="mt-3 line-clamp-2 text-xs text-slate-500">{l(company.description)}</p>}

      <span className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900 [margin-top:max(1rem,auto)]">
        {t.card.details}
        <span className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-white">
          {t.card.apply} <ArrowRight className="size-4" />
        </span>
      </span>
    </>
  )

  const box = 'group flex flex-col rounded-2xl bg-card p-5 ring-1 ring-slate-200 transition'
  if (preview) return <div className={cx(box, 'shadow-card')}>{body}</div>
  // On the board, cards in a row share one height.
  return (
    <Link to={path(ROUTES.placement, p.id)} className={cx(box, 'h-full hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-300')}>
      {body}
    </Link>
  )
}
