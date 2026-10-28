/**
 * SEER — the Industrial Digital Passport certificate. One component for the real
 * passport page, the student's list and the preview on the landing page.
 */
import type { ReactNode } from 'react'
import { BadgeCheck, Quote, ShieldCheck } from 'lucide-react'
import type { Application, Company, Passport, Placement } from '../../data'
import { useApp } from '../../lib/state'
import { daysIn } from '../../lib/placements'
import { formatDate, formatRange } from '../../lib/format'
import { SeerMark } from '../../components/Brand'
import { cx } from '../../components/ui'

export interface PassportData {
  passport: Passport
  application: Application
  placement: Placement
  company?: Company
}

/** Find everything a passport needs, by passport id. */
export function usePassport(id: string): PassportData | undefined {
  const { passports, applications, placements, companies } = useApp()
  const passport = passports.find((p) => p.id === id)
  const application = passport && applications.find((a) => a.id === passport.applicationId)
  const placement = application && placements.find((p) => p.id === application.placementId)
  if (!passport || !application || !placement) return undefined
  return { passport, application, placement, company: companies.find((c) => c.id === placement.companyId) }
}

export function PassportCard({ data, compact = false }: { data: PassportData; compact?: boolean }) {
  const { t, l, lang } = useApp()
  const { passport, application, placement, company } = data
  const companyName = company?.name ?? '—'

  return (
    <article
      aria-label={`${t.passport.title} ${passport.id}`}
      className="relative isolate overflow-hidden rounded-3xl bg-card shadow-lift ring-1 ring-slate-200 print:shadow-none"
    >
      {passport.isExample && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] text-[5.5rem] font-black tracking-[0.2em] whitespace-nowrap text-slate-200/60 select-none sm:text-[8rem]"
        >
          {t.passport.watermark}
        </span>
      )}

      {/* Header band */}
      <header className="relative bg-gradient-to-br from-hero-from via-hero-via to-hero-to px-5 py-5 text-white sm:px-8 sm:py-6">
        <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,transparent_0_14px,rgb(255_255_255/0.15)_14px_15px)]" aria-hidden />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SeerMark className="size-12 shrink-0 drop-shadow" />
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/80 uppercase">{t.passport.subtitle}</p>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{t.passport.title}</h2>
            </div>
          </div>
          <dl className="text-right text-sm">
            <dt className="text-[11px] tracking-wide text-white/75 uppercase">{t.passport.id}</dt>
            <dd className="font-mono text-base font-bold tabular-nums">{passport.id}</dd>
            <dt className="mt-1 text-[11px] tracking-wide text-white/75 uppercase">{t.passport.issued}</dt>
            <dd className="font-semibold">{formatDate(passport.issuedAt, lang, true)}</dd>
          </dl>
        </div>
      </header>

      <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        {/* Who, where, when */}
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.passport.student}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{application.student.name}</p>
          <p className="text-slate-600">{application.student.school}</p>
        </div>

        <dl className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:grid-cols-3">
          <Item label={t.passport.company}>{companyName}</Item>
          <Item label={t.passport.placement}>{l(placement.title)}</Item>
          <Item label={t.passport.period}>
            {formatRange(application.dates, lang)}
            <span className="block text-sm text-slate-500">{t.common.days(daysIn(application.dates))}</span>
          </Item>
        </dl>

        {!compact && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Item label={t.passport.task}>{l(placement.task)}</Item>
            <Item label={t.passport.deliverable}>{l(placement.deliverable)}</Item>
          </div>
        )}

        {/* Skills with mentor-set levels */}
        <section>
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.passport.skills}</h3>
          <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {passport.skills.map((s) => (
              <li key={s.label.lv} className="flex items-center justify-between gap-3" aria-label={t.passport.levelOf(l(s.label), t.passport.levels[s.level - 1])}>
                <span className="font-semibold text-slate-800">{l(s.label)}</span>
                <span className="flex shrink-0 items-center gap-2" aria-hidden>
                  <span className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={cx('size-3 rounded-full', n <= s.level ? 'bg-accent-500' : 'bg-slate-200')} />
                    ))}
                  </span>
                  <span className="w-20 text-xs font-medium text-slate-500">{t.passport.levels[s.level - 1]}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Mentor feedback */}
        <figure className="relative rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <Quote className="absolute top-4 right-4 size-8 text-accent-500/40" aria-hidden />
          <figcaption className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.passport.feedback}</figcaption>
          <blockquote className="mt-2 pr-8 text-[17px] leading-relaxed text-slate-800">“{passport.feedback}”</blockquote>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {passport.mentorName} <span className="font-normal text-slate-500">· {l(passport.mentorRole)}, {companyName}</span>
          </p>
        </figure>

        {/* Recognition, signature, seal */}
        <div className="flex flex-col gap-6 border-t border-dashed border-slate-300 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-bold text-slate-900">
              <BadgeCheck className="size-5 shrink-0 text-accent-600" /> {t.passport.recognised(companyName)}
            </p>
            <p className="mt-6 font-serif text-2xl text-slate-800 italic">{passport.mentorName}</p>
            <p className="mt-1 w-56 max-w-full border-t border-slate-400 pt-1 text-xs text-slate-500">{t.passport.signature}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl p-3 ring-1 ring-slate-200">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-accent-500 text-accent-600">
              <ShieldCheck className="size-7" />
            </span>
            <div className="text-xs">
              <p className="font-bold tracking-wide text-slate-900 uppercase">{t.passport.verifyTitle}</p>
              <p className="mt-0.5 max-w-52 text-slate-600">{t.passport.verifyText(passport.id)}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{children}</dd>
    </div>
  )
}
