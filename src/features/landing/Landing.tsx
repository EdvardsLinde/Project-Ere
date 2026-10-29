import { useState } from 'react'
import type { ReactNode } from 'react'
import { BadgeCheck, Building2, CalendarDays, ChevronDown, CircleCheck, Factory, GraduationCap, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FIELDS } from '../../data'
import square from '../../assets/saldus/square.webp'
import { useApp } from '../../lib/state'
import { FIELD_ICON } from '../../components/cards'
import { cx } from '../../components/ui'
import { PassportCard, usePassport } from '../passport/PassportCard'

/** Page 1 — the idea, for both roles. */
export function Landing() {
  const { t } = useApp()
  return (
    <>
      <Hero />
      <div className="space-y-16 pt-12 sm:space-y-20">
        <Section icon={Factory} title={t.landing.whatTitle} text={t.landing.whatText}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[CalendarDays, Factory, BadgeCheck].map((Icon, i) => (
              <div key={i} className="rounded-2xl bg-card p-5 ring-1 ring-slate-200">
                <Icon className="size-7 text-accent-600" />
                <h3 className="mt-3 text-lg font-bold text-slate-900">{t.landing.what[i].title}</h3>
                <p className="mt-1 text-slate-600">{t.landing.what[i].text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={CircleCheck} title={t.landing.howTitle}>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.landing.how.map((s, i) => (
              <li key={s.title} className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-slate-200">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-500 text-lg font-extrabold text-on-accent tabular-nums">{i + 1}</span>
                <span>
                  <span className="block font-bold text-slate-900">{s.title}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ValueCard icon={GraduationCap} title={t.landing.studentsTitle} items={t.landing.students} />
          <ValueCard icon={Building2} title={t.landing.companiesTitle} items={t.landing.companies} />
        </div>

        <Section icon={ShieldCheck} title={t.landing.tasksTitle} text={t.landing.tasksText}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FIELDS.filter((f) => f !== 'other').map((f) => {
              const Icon = FIELD_ICON[f]
              return (
                <div key={f} className="rounded-2xl bg-card p-5 ring-1 ring-slate-200">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-3 font-bold text-slate-900">{t.fields[f]}</h3>
                  <p className="mt-1 text-sm text-slate-600">{t.landing.fieldTasks[f]}</p>
                </div>
              )
            })}
          </div>
        </Section>

        <PassportSection />
        <CompaniesSection />
        <Faq />
      </div>
    </>
  )
}

/** Full-width Saldus photo behind the title; even veil, short soft fade at the bottom. */
function Hero() {
  const { t } = useApp()
  return (
    <section className="relative -mt-5 pt-12 pb-14 sm:-mt-8 sm:pt-16 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 -z-0 w-screen -translate-x-1/2 overflow-hidden">
        <img src={square} alt="" className="absolute inset-0 size-full object-cover object-[center_45%] saturate-150" />
        <div className="absolute inset-0 bg-white/30 dark:bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-slate-50 sm:h-16" />
      </div>
      <div className="relative max-w-3xl">
        <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-slate-900 sm:text-6xl">{t.landing.heroTitle}</h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-slate-800 sm:text-xl">{t.landing.heroText}</p>
      </div>
    </section>
  )
}

function Section({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text?: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-on-accent shadow-sm">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
          {text && <p className="text-slate-600">{text}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function ValueCard({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <section className="rounded-3xl bg-card p-6 ring-1 ring-slate-200 sm:p-8">
      <span className="flex size-12 items-center justify-center rounded-xl bg-accent-500 text-on-accent">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((x) => (
          <li key={x} className="flex gap-3 text-slate-700">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent-600" /> {x}
          </li>
        ))}
      </ul>
    </section>
  )
}

function PassportSection() {
  const { t } = useApp()
  const example = usePassport('SEER-2026-0042')
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent-500 text-on-accent">
          <BadgeCheck className="size-5" />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t.landing.passportTitle}</h2>
        <p className="mt-2 text-slate-600">{t.landing.passportText}</p>
        <ul className="mt-5 space-y-3">
          {t.landing.proves.map((x) => (
            <li key={x} className="flex gap-3 text-slate-700">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent-600" /> {x}
            </li>
          ))}
        </ul>
      </div>
      {example && (
        <div className="min-w-0 lg:rotate-1">
          <PassportCard data={example} compact />
        </div>
      )}
    </section>
  )
}

function CompaniesSection() {
  const { t, l, companies } = useApp()
  const examples = companies.filter((c) => c.isExample)
  return (
    <Section icon={Building2} title={t.landing.companiesListTitle}>
      <p className="-mt-3 mb-5 inline-flex rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 ring-1 ring-amber-200">{t.landing.companiesListNote}</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {examples.map((c) => (
          <li key={c.id} className="rounded-2xl bg-card p-4 ring-1 ring-slate-200">
            <p className="text-lg font-extrabold tracking-tight text-slate-900">{c.name}</p>
            <p className="text-sm text-slate-600">{l(c.industry)}</p>
            <p className="mt-1 text-xs text-slate-500">{c.town}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Faq() {
  const { t } = useApp()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section icon={CircleCheck} title={t.landing.faqTitle}>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl bg-card ring-1 ring-slate-200">
        {t.landing.faq.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {item.q}
                  <ChevronDown className={cx('size-5 shrink-0 text-slate-500 transition', isOpen && 'rotate-180')} />
                </button>
              </h3>
              <div id={`faq-${i}`} hidden={!isOpen} className="px-5 pb-4 text-slate-600">
                {item.a}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
