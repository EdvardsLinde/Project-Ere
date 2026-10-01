import { ArrowRight, Check, Star, Wifi } from 'lucide-react'
import { CAREERS, INTERESTS } from '../data'
import { useApp } from '../state'
import { Card, PageHeader, cx } from '../components/ui'

/** Careers sorted by how many of the user's interests they match. */
export function useRankedCareers() {
  const { profile } = useApp()
  return CAREERS.map((career) => ({
    career,
    matched: career.interests.filter((id) => profile.interests.includes(id)),
  })).sort((a, b) => b.matched.length - a.matched.length)
}

export function Paths() {
  const { t, l, update, next } = useApp()
  const ranked = useRankedCareers()

  const choose = (id: string) => {
    update({ careerId: id })
    next('training')
  }

  return (
    <>
      <PageHeader eyebrow={t.paths.eyebrow} title={t.paths.title} subtitle={t.paths.subtitle} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
        {ranked.map(({ career, matched }, i) => {
          const Icon = career.icon
          const best = i === 0 && matched.length > 0
          return (
            <button
              key={career.id}
              type="button"
              onClick={() => choose(career.id)}
              className={cx(
                'group animate-fade-up cursor-pointer text-left focus-visible:outline-none',
                '[&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-brand-500',
              )}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Card
                className={cx(
                  'flex h-full flex-col p-6 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lift',
                  best && 'ring-2 ring-brand-600',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={cx('flex size-14 items-center justify-center rounded-2xl ring-1', career.tone)}>
                    <Icon className="size-7" />
                  </span>
                  {best && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
                      <Star className="size-3.5 fill-current" /> {t.paths.bestMatch}
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">{l(career.title)}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{l(career.description)}</p>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{t.paths.dayToDay}</p>
                  <ul className="mt-3 space-y-2">
                    {career.dayToDay.map((d) => (
                      <li key={d.lv} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-500" strokeWidth={2.5} />
                        {l(d)}
                      </li>
                    ))}
                  </ul>
                </div>

                {matched.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-medium text-slate-500">{t.paths.matches}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {matched.map((id) => {
                        const interest = INTERESTS.find((x) => x.id === id)
                        return (
                          interest && (
                            <span
                              key={id}
                              className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100"
                            >
                              {l(interest.label)}
                            </span>
                          )
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-700">
                    <Wifi className="size-4" /> {t.paths.remote}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    {t.paths.seePath}
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Card>
            </button>
          )
        })}
      </div>
    </>
  )
}
