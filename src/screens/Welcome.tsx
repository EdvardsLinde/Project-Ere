import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Compass, Lock, Route, UserRound } from 'lucide-react'
import { useApp } from '../state'
import { Button, Card, Label, cx, inputClass } from '../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Welcome() {
  const { t, profile, update, next } = useApp()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [submitted, setSubmitted] = useState(false)

  const nameError = submitted && !name.trim()
  const emailError = submitted && email.trim() !== '' && !EMAIL_RE.test(email.trim())

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (!name.trim() || (email.trim() && !EMAIL_RE.test(email.trim()))) return
    update({ name: name.trim(), email: email.trim() })
    next()
  }

  const howIcons = [UserRound, Compass, Route]

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        {/* soft brand glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-32 size-[520px] rounded-full bg-brand-100/70 blur-3xl" />
          <div className="absolute -bottom-48 -left-24 size-[420px] rounded-full bg-accent-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto grid grid-cols-1 max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1.5 text-sm font-semibold text-accent-700 ring-1 ring-accent-200">
              <span className="size-1.5 rounded-full bg-accent-500" />
              {t.welcome.eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-6xl">
              {t.brand.tagline.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                {t.brand.tagline.split(' ').slice(-1)}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{t.welcome.intro}</p>
            <ul className="mt-7 space-y-3">
              {t.welcome.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="animate-fade-up p-6 shadow-lift sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">{t.welcome.formTitle}</h2>
            <p className="mt-1 text-sm text-slate-500">{t.welcome.formSubtitle}</p>
            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <Label htmlFor="name">{t.welcome.nameLabel}</Label>
                <input
                  id="name"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.welcome.namePlaceholder}
                  aria-invalid={nameError}
                  className={cx(inputClass, nameError && 'ring-red-400 focus:ring-red-500')}
                />
                {nameError && <p className="mt-1.5 text-sm text-red-600">{t.welcome.nameError}</p>}
              </div>
              <div>
                <Label htmlFor="email" optional={t.common.optional}>
                  {t.welcome.emailLabel}
                </Label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.welcome.emailPlaceholder}
                  aria-invalid={emailError}
                  className={cx(inputClass, emailError && 'ring-red-400 focus:ring-red-500')}
                />
                <p className={cx('mt-1.5 text-sm', emailError ? 'text-red-600' : 'text-slate-500')}>
                  {emailError ? t.welcome.emailError : t.welcome.emailHint}
                </p>
              </div>
              <Button type="submit" size="lg" className="w-full">
                {t.welcome.start} <ArrowRight className="size-5" />
              </Button>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <Lock className="mt-0.5 size-3.5 shrink-0" /> {t.welcome.privacy}
              </p>
            </form>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.welcome.howTitle}</h2>
        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.welcome.how.map((item, i) => {
            const Icon = howIcons[i]
            return (
              <li key={item.title}>
                <Card className="h-full p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-bold text-slate-400">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-slate-600">{item.text}</p>
                </Card>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
