import { useState } from 'react'
import { ArrowLeft, MapPin, Menu, RotateCcw, Search, UserRound, X } from 'lucide-react'
import { SearchBox } from './cards'
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
  const { t, step, goTo, profile, restart, onboarded, search } = useApp()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  // The main navigation only exists once onboarding (the 6 steps) is done.
  const nav: { step: Step; label: string; also?: Step[] }[] = [
    { step: 'me', label: t.nav.profile },
    { step: 'courses', label: t.nav.courses },
    { step: 'people', label: t.nav.people },
    { step: 'paths', label: t.nav.careers, also: ['training'] },
  ]
  const isActive = (item: (typeof nav)[number]) => step === item.step || !!item.also?.includes(step)
  const initial = profile.name.trim().charAt(0).toUpperCase()

  const navigate = (s: Step) => {
    setOpen(false)
    goTo(s)
  }
  const submitSearch = (value: string) => {
    setOpen(false)
    search(value)
    setQ('')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(onboarded ? 'me' : 'welcome')}
          className="shrink-0 cursor-pointer"
          aria-label="ERE"
        >
          <Logo />
        </button>

        {onboarded && (
          <nav className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => navigate(item.step)}
                className={cx(
                  'relative cursor-pointer rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition',
                  isActive(item) ? 'text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                {item.label}
                {isActive(item) && <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-brand-600" />}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {onboarded && (
            <>
              <div className="hidden w-52 xl:block">
                <SearchBox value={q} onChange={setQ} onSubmit={submitSearch} placeholder={t.nav.search} size="md" />
              </div>
              <button
                type="button"
                onClick={() => navigate('search')}
                aria-label={t.nav.search}
                className={cx(
                  'flex size-11 cursor-pointer items-center justify-center rounded-lg transition xl:hidden',
                  step === 'search' ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                )}
              >
                <Search className="size-5" />
              </button>
            </>
          )}
          <LangToggle />
          {onboarded && (
            <button
              type="button"
              onClick={() => navigate('me')}
              aria-label={t.nav.profile}
              title={profile.name}
              className={cx(
                'hidden size-10 cursor-pointer items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-800 ring-2 transition sm:flex',
                step === 'me' ? 'ring-brand-500' : 'ring-white hover:ring-accent-300',
              )}
            >
              {initial || <UserRound className="size-4" />}
            </button>
          )}
          {onboarded && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
        </div>
      </div>

      {open && onboarded && (
        <div className="animate-fade-up border-t border-slate-200 bg-white px-4 pt-3 pb-4 lg:hidden">
          <div className="mb-2">
            <SearchBox value={q} onChange={setQ} onSubmit={submitSearch} placeholder={t.nav.searchPlaceholder} size="md" />
          </div>
          {[...nav, { step: 'saldus' as Step, label: t.nav.saldus }].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => navigate(item.step)}
              className={cx(
                'flex h-12 w-full cursor-pointer items-center rounded-lg px-3 text-left text-base font-medium',
                isActive(item) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
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
  const { t, stepIndex, back, editing } = useApp()
  const current = stepIndex + 1
  return (
    <div className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={back}
          className="-ml-2 flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" /> {editing ? t.common.backToProfile : t.common.back}
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
  const { t, goTo, restart, onboarded } = useApp()
  const link = 'cursor-pointer text-sm text-slate-400 transition hover:text-white'
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{t.footer.about}</p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="size-4 text-accent-400" /> {t.footer.location}
          </p>
        </div>
        {/* App links only make sense once the user has a profile. */}
        {onboarded && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.footer.explore}</h3>
              <ul className="mt-4 space-y-3">
                <li><button type="button" className={link} onClick={() => goTo('courses')}>{t.nav.courses}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('people')}>{t.nav.people}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('paths')}>{t.nav.careers}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('saldus')}>{t.footer.links.remote}</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.footer.forYou}</h3>
              <ul className="mt-4 space-y-3">
                <li><button type="button" className={link} onClick={() => goTo('me')}>{t.footer.links.profile}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('search')}>{t.nav.search}</button></li>
                <li><button type="button" className={link} onClick={restart}>{t.footer.links.start}</button></li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
