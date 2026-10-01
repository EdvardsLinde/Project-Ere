import { ArrowRight, Globe, HandHeart, House, MapPin } from 'lucide-react'
import { CAREERS } from '../data'
import { useApp } from '../state'
import { Button, Card } from '../components/ui'

const BENEFIT_ICONS = [House, Globe, HandHeart]

export function Saldus() {
  const { t, l, profile, update, next, goTo, onboarded } = useApp()
  const career = CAREERS.find((c) => c.id === profile.careerId)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-12 text-white shadow-lift sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        {/* decorative "map" rings centred on Saldus */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 -right-16 hidden size-[380px] -translate-y-1/2 items-center justify-center xl:flex"
        >
          {[380, 270, 160].map((s) => (
            <span
              key={s}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
              style={{ width: s, height: s }}
            />
          ))}
          <span className="relative flex size-20 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur">
            <MapPin className="size-9" />
          </span>
        </div>

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/25">
            <MapPin className="size-4" /> {t.saldus.eyebrow}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{t.saldus.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/85">{t.saldus.text}</p>

          {career && (
            <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm ring-1 ring-white/20">
              <span className="text-white/70">{t.saldus.yourPath}:</span>
              <span className="font-semibold">{l(career.title)}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button
              size="lg"
              variant="light"
              onClick={() => {
                update({ interested: true })
                if (onboarded) goTo('home')
                else next()
              }}
              className="w-full sm:w-auto"
            >
              {t.saldus.cta} <ArrowRight className="size-5" />
            </Button>
            <p className="text-sm text-white/75">{t.saldus.ctaHint}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {t.saldus.benefits.map((b, i) => {
          const Icon = BENEFIT_ICONS[i]
          return (
            <Card key={b.title} className="p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{b.title}</h2>
              <p className="mt-1 text-slate-600">{b.text}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
