import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Compass, Lock, Route, UserRound } from 'lucide-react'
import { useApp } from '../../lib/state'
import { CAREERS } from '../../data'
import { Illustration } from '../../components/Illustration'
import { Button, Card, Label, cx, inputClass } from '../../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Welcome() {
  const { t, l, profile, update, next } = useApp()
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
      {/* Teal + blue radial glows (see .hero-glow in index.css) */}
      <section className="hero-glow relative overflow-hidden">

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
            <ul className="mt-6 flex flex-wrap gap-2">
              {t.welcome.points.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs ring-1 ring-slate-200"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-accent-500" />
                  {p}
                </li>
              ))}
            </ul>
            {/* The four digital paths at a glance */}
            <div className="mt-8 hidden grid-cols-4 gap-3 lg:grid">
              {CAREERS.map((c) => (
                <figure key={c.id} className="overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/70">
                  <Illustration scene={c.id} size="xs" />
                  <figcaption className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800">
                    <c.icon className="size-3.5 shrink-0 text-brand-600" />
                    <span className="truncate">{l(c.title)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
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
            {/* Phones: paths shown below the sign-up form, so "Sākt" stays near the top */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden">
              {CAREERS.map((c) => (
                <figure key={c.id} className="overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/70">
                  <Illustration scene={c.id} size="xs" />
                  <figcaption className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800">
                    <c.icon className="size-3.5 shrink-0 text-brand-600" />
                    <span className="truncate">{l(c.title)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.welcome.howTitle}</h2>
        <ol className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-5">
          {t.welcome.how.map((item, i) => {
            const Icon = howIcons[i]
            return (
              <li key={item.title}>
                <Card className="h-full p-3 text-center transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6 sm:text-left">
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <Icon className="size-5" />
                    </span>
                    <span className="hidden text-sm font-bold text-slate-400 sm:inline">0{i + 1}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 sm:mt-4 sm:text-lg">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 sm:text-base">{item.text}</p>
                </Card>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
