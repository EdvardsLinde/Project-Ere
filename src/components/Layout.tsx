import { useState } from 'react'
import { ArrowLeft, MapPin, Menu, RotateCcw, X } from 'lucide-react'
import type { Lang } from '../data'
import { PROGRESS_STEPS, useApp } from '../state'
import type { Step } from '../state'
import { cx } from './ui'

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const { t } = useApp()
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="ere-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d44d8" />
            <stop offset="1" stopColor="#0ea893" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#ere-logo)" />
        <path d="M10 9h12v3.2h-8.4v2.4h7.4v3h-7.4v2.6H22V23H10z" fill="#fff" />
      </svg>
      <span className="flex flex-col items-start text-left leading-none">
        <span className={cx('text-xl font-extrabold tracking-tight', inverted ? 'text-white' : 'text-slate-900')}>
          ERE
        </span>
        <span
          className={cx(
            'mt-0.5 hidden text-[11px] font-medium sm:block',
            inverted ? 'text-slate-400' : 'text-slate-500',
          )}
        >
          {t.brand.tagline}
        </span>
      </span>
    </span>
  )
}

function LangToggle() {
  const { lang, setLang, t } = useApp()
  return (
    <div role="group" aria-label={t.nav.language} className="flex rounded-lg bg-slate-100 p-1 ring-1 ring-slate-200">
      {(['lv', 'en'] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={cx(
            'min-w-10 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-bold uppercase transition',
            lang === code ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { t, step, goTo, profile, restart } = useApp()
  const [open, setOpen] = useState(false)

  const nav: { step: Step; label: string }[] = [
    { step: 'paths', label: t.nav.careers },
    { step: 'training', label: t.nav.training },
    { step: 'saldus', label: t.nav.saldus },
  ]
  const initial = profile.name.trim().charAt(0).toUpperCase()

  const navigate = (s: Step) => {
    setOpen(false)
    goTo(s)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:h-18 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate('welcome')} className="cursor-pointer" aria-label="ERE">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => navigate(item.step)}
              className={cx(
                'relative cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition',
                step === item.step ? 'text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              {item.label}
              {step === item.step && (
                <span className="absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-brand-600 sm:-bottom-[17px]" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangToggle />
          {initial && (
            <span
              title={profile.name}
              className="hidden size-9 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-800 ring-2 ring-white sm:flex"
            >
              {initial}
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-slate-200 bg-white px-4 pt-2 pb-4 md:hidden">
          {nav.map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => navigate(item.step)}
              className={cx(
                'flex h-12 w-full cursor-pointer items-center rounded-lg px-3 text-left text-base font-medium',
                step === item.step ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              restart()
            }}
            className="mt-2 flex h-12 w-full cursor-pointer items-center gap-2 rounded-lg border-t border-slate-100 px-3 text-left text-base font-medium text-slate-500"
          >
            <RotateCcw className="size-4" /> {t.nav.restart}
          </button>
        </div>
      )}
    </header>
  )
}

/** Back button + "Step X of 6" + segmented progress bar. */
export function StepBar() {
  const { t, stepIndex, back } = useApp()
  const current = stepIndex + 1
  return (
    <div className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={back}
          className="-ml-2 flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" /> {t.common.back}
        </button>
        <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:max-w-md">
          <span className="shrink-0 text-xs font-semibold text-slate-500 sm:text-sm">
            {t.common.step(current, PROGRESS_STEPS)}
          </span>
          <ol className="flex w-full max-w-48 gap-1 sm:max-w-none" aria-hidden>
            {t.common.stepNames.map((name, i) => (
              <li
                key={name}
                title={name}
                className={cx(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  i < current ? 'bg-brand-600' : 'bg-slate-200',
                )}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const { t, goTo, restart } = useApp()
  const link = 'cursor-pointer text-sm text-slate-400 transition hover:text-white'
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.footer.about}</p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="size-4 text-accent-400" /> {t.footer.location}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{t.footer.explore}</h3>
          <ul className="mt-4 space-y-3">
            <li><button type="button" className={link} onClick={() => goTo('paths')}>{t.nav.careers}</button></li>
            <li><button type="button" className={link} onClick={() => goTo('training')}>{t.nav.training}</button></li>
            <li><button type="button" className={link} onClick={() => goTo('saldus')}>{t.footer.links.remote}</button></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{t.footer.forYou}</h3>
          <ul className="mt-4 space-y-3">
            <li><button type="button" className={link} onClick={() => goTo('welcome')}>{t.footer.links.how}</button></li>
            <li><button type="button" className={link} onClick={() => goTo('profile')}>{t.footer.links.profile}</button></li>
            <li><button type="button" className={link} onClick={restart}>{t.footer.links.start}</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
