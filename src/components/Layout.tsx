import { useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, GraduationCap, MapPin, Menu, Moon, Newspaper, RotateCcw, Search, Sun, Target, UserRound, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SearchBox } from './cards'
import { overallProgress } from '../lib/skills'
import type { Lang } from '../data'
import { PROGRESS_STEPS, useApp } from '../lib/state'
import type { Step } from '../lib/state'
import { cx } from './ui'

export function Logo({ inverted = false }: { inverted?: boolean }) {
  const { t } = useApp()
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="ere-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#006c9b" />
            <stop offset="1" stopColor="#00a0a8" />
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
            inverted ? 'text-[#9db8c4]' : 'text-slate-500',
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
            lang === code ? 'bg-card text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

function ThemeToggle() {
  const { t, dark, toggleDark } = useApp()
  const label = dark ? t.nav.lightMode : t.nav.darkMode
  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={label}
      title={label}
      className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {dark ? <Sun className="size-5 text-amber-500" /> : <Moon className="size-5" />}
    </button>
  )
}

interface NavItem {
  step: Step
  label: string
  icon: LucideIcon
  /** Other pages that belong to this item (keeps it highlighted). */
  also?: Step[]
}

/** Main destinations after onboarding — shared by the header and the phone tab bar. */
function useNavItems(): NavItem[] {
  const { t } = useApp()
  return [
    { step: 'news', label: t.nav.news, icon: Newspaper },
    { step: 'match', label: t.nav.myPath, icon: Target, also: ['test', 'paths', 'training'] },
    { step: 'courses', label: t.nav.coursesShort, icon: GraduationCap },
    { step: 'jobs', label: t.nav.jobs, icon: BriefcaseBusiness },
    { step: 'people', label: t.nav.people, icon: Users, also: ['person'] },
    { step: 'me', label: t.nav.profileShort, icon: UserRound },
  ]
}

/** Phone/tablet bottom tab bar: the five main places, always one tap away. */
export function TabBar() {
  const { t, step, goTo } = useApp()
  const items = useNavItems().filter((i) => i.step !== 'people')
  return (
    <nav
      aria-label={t.nav.mainNav}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-card/95 backdrop-blur-md xl:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {items.map((item) => {
          const on = step === item.step || !!item.also?.includes(step)
          return (
            <li key={item.step}>
              <button
                type="button"
                onClick={() => goTo(item.step)}
                aria-current={on ? 'page' : undefined}
                className={cx(
                  'flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-[11px] font-semibold transition',
                  on ? 'text-brand-700' : 'text-slate-500 hover:text-slate-800',
                )}
              >
                <span className={cx('flex h-7 w-12 items-center justify-center rounded-full transition', on && 'bg-brand-100')}>
                  <item.icon className="size-5" />
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function Header() {
  const { t, step, goTo, profile, restart, appNav, search, dark, toggleDark } = useApp()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  // The main navigation only exists once onboarding (the 6 steps) is done.
  const nav = useNavItems()
  const progress = overallProgress(profile)
  const isActive = (item: { step: Step; also?: Step[] }) => step === item.step || !!item.also?.includes(step)
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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(appNav ? 'news' : 'welcome')}
          className="shrink-0 cursor-pointer"
          aria-label="ERE"
        >
          <Logo />
        </button>

        {appNav && (
          <nav className="hidden items-center gap-0.5 xl:flex">
            {nav.filter((item) => item.step !== 'people').map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => navigate(item.step)}
                className={cx(
                  'relative cursor-pointer rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition',
                  isActive(item) ? 'text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <item.icon className="size-4" /> {item.label}
                </span>
                {isActive(item) && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-600" />}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {appNav && (
            <>
              <div className="hidden w-48 2xl:block">
                <SearchBox value={q} onChange={setQ} onSubmit={submitSearch} placeholder={t.nav.search} size="md" />
              </div>
              <button
                type="button"
                onClick={() => navigate('search')}
                aria-label={t.nav.search}
                className={cx(
                  'flex size-11 cursor-pointer items-center justify-center rounded-lg transition 2xl:hidden',
                  step === 'search' ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                )}
              >
                <Search className="size-5" />
              </button>
            </>
          )}
          <span className={appNav ? 'hidden sm:contents' : 'contents'}>
            <ThemeToggle />
          </span>
          <LangToggle />
          {appNav && (
            <button
              type="button"
              onClick={() => navigate('me')}
              aria-label={`${t.nav.profile} · ${t.nav.progress(progress)}`}
              title={`${profile.name} · ${t.nav.progress(progress)}`}
              className="group relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full"
            >
              {/* Progress ring = readiness for the user's current path */}
              <svg viewBox="0 0 44 44" className="absolute inset-0 size-11 -rotate-90" aria-hidden>
                <circle cx="22" cy="22" r="20" fill="none" strokeWidth="3" className="stroke-slate-200" />
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="stroke-accent-500 transition-all duration-700"
                  strokeDasharray={`${(progress / 100) * 125.66} 125.66`}
                />
              </svg>
              <span
                className={cx(
                  'flex size-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-800 transition',
                  step === 'me' ? 'ring-2 ring-brand-500' : 'group-hover:bg-accent-200',
                )}
              >
                {initial || <UserRound className="size-4" />}
              </span>
            </button>
          )}
          {appNav && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 xl:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}
        </div>
      </div>

      {open && appNav && (
        <div className="animate-fade-up border-t border-slate-200 bg-card px-4 pt-3 pb-4 xl:hidden">
          <div className="mb-2">
            <SearchBox value={q} onChange={setQ} onSubmit={submitSearch} placeholder={t.nav.searchPlaceholder} size="md" />
          </div>
          {[...nav, { step: 'saldus' as Step, label: t.nav.saldus, icon: MapPin }].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => navigate(item.step)}
              className={cx(
                'flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-base font-medium',
                isActive(item) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              <item.icon className="size-5" /> {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleDark}
            className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-base font-medium text-slate-700 hover:bg-slate-50 sm:hidden"
          >
            {dark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4" />}
            {dark ? t.nav.lightMode : t.nav.darkMode}
          </button>
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
    <div className="border-b border-slate-200/70 bg-card">
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
  const { t, goTo, restart, appNav } = useApp()
  const link = 'cursor-pointer text-sm text-[#9db8c4] transition hover:text-white'
  return (
    <footer className="mt-auto bg-ink text-[#c9dde5]">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-[#9db8c4]">{t.footer.about}</p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-[#9db8c4]">
            <MapPin className="size-4 text-[#3ebfc6]" /> {t.footer.location}
          </p>
        </div>
        {/* App links only make sense once the user has a profile. */}
        {appNav && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.footer.explore}</h3>
              <ul className="mt-4 space-y-3">
                <li><button type="button" className={link} onClick={() => goTo('news')}>{t.nav.news}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('match')}>{t.nav.myPath}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('courses')}>{t.nav.coursesShort}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('jobs')}>{t.nav.jobs}</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.footer.forYou}</h3>
              <ul className="mt-4 space-y-3">
                <li><button type="button" className={link} onClick={() => goTo('me')}>{t.footer.links.profile}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('people')}>{t.nav.people}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('search')}>{t.nav.search}</button></li>
                <li><button type="button" className={link} onClick={() => goTo('privacy')}>{t.privacy.link}</button></li>
                <li><button type="button" className={link} onClick={restart}>{t.footer.links.start}</button></li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-[#7f9aa7] sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
