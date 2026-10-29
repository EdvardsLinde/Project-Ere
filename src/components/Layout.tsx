/**
 * SEER — site shell: header (website-style top navigation that depends on the role),
 * role picker, toast and footer.
 */
import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { Building2, Check, ChevronRight, GraduationCap, MapPin, Menu, Moon, Plus, Repeat, Sun, X } from 'lucide-react'
import type { Lang, Role } from '../data'
import { ROUTES, useApp } from '../lib/state'
import { Logo } from './Brand'
import { Avatar, ExampleBadge } from './cards'
import { Modal } from './Modal'
import { cx } from './ui'

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
            'min-w-9 cursor-pointer rounded-md px-2 py-1.5 text-xs font-bold uppercase transition',
            lang === code ? 'bg-card text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

function ThemeToggle({ className }: { className?: string }) {
  const { t, dark, toggleDark } = useApp()
  const label = dark ? t.nav.lightMode : t.nav.darkMode
  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={label}
      title={label}
      className={cx('size-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900', className ?? 'flex')}
    >
      {dark ? <Sun className="size-5 text-amber-500" /> : <Moon className="size-5" />}
    </button>
  )
}

interface NavItem {
  to: string
  label: string
  /** Exact match only (for "/"). */
  end?: boolean
}

/** Main destinations for the current role. */
function useNavItems(): NavItem[] {
  const { t, role } = useApp()
  const idea = { to: ROUTES.landing, label: t.nav.idea, end: true }
  if (role === 'student')
    return [idea, { to: ROUTES.board, label: t.nav.placements }, { to: ROUTES.mine, label: t.nav.myPlacements }, { to: ROUTES.myCertificate, label: t.nav.myCertificate }]
  if (role === 'company')
    return [
      idea,
      { to: ROUTES.company, label: t.nav.ourPlacements, end: true },
      { to: ROUTES.newPlacement, label: t.nav.addPlacement },
      { to: ROUTES.allApplications, label: t.nav.applications },
    ]
  return [idea, { to: ROUTES.board, label: t.nav.placements }]
}

/** Small pill: current role, click to switch. Without a role: the two entry buttons. */
function RoleControl({ compact = false }: { compact?: boolean }) {
  const { t, role, company, openRolePicker } = useApp()
  if (!role)
    return (
      <div className={cx('items-center gap-2', compact ? 'flex' : 'hidden md:flex')}>
        <button
          type="button"
          onClick={() => openRolePicker('student')}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-accent-500 px-3 text-sm font-semibold text-on-accent hover:bg-accent-600"
        >
          <GraduationCap className="size-4" /> {t.roles.studentCta}
        </button>
        <button
          type="button"
          onClick={() => openRolePicker('company')}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 ring-inset hover:bg-slate-100"
        >
          <Building2 className="size-4" /> {t.roles.companyCta}
        </button>
      </div>
    )
  const Icon = role === 'student' ? GraduationCap : Building2
  const name = role === 'student' ? t.nav.student : (company?.name ?? t.roles.newCompany)
  return (
    <button
      type="button"
      onClick={() => openRolePicker()}
      title={t.nav.switchRole}
      className={cx(
        'h-10 max-w-48 cursor-pointer items-center gap-1.5 rounded-full bg-slate-100 pr-3 pl-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:ring-brand-300',
        compact ? 'flex' : 'hidden sm:flex',
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-accent-500 text-on-accent">
        <Icon className="size-4" />
      </span>
      <span className="truncate">{name}</span>
      <Repeat className="size-3.5 shrink-0 text-slate-500" aria-label={t.nav.switchRole} />
    </button>
  )
}

export function Header() {
  const { t } = useApp()
  const nav = useNavItems()
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      'relative rounded-lg px-3 py-2 text-[15px] font-medium whitespace-nowrap transition',
      isActive ? 'text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.landing} className="shrink-0" aria-label="SEER" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label={t.nav.mainNav} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-600" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <RoleControl />
          <ThemeToggle className="hidden sm:flex" />
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Phones & tablets: the main sections as a scrollable tab row */}
      <nav aria-label={t.nav.mainNav} className="border-t border-slate-200/80 lg:hidden">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 [scrollbar-width:none] sm:px-4">
          {nav.map((item) => (
            <li key={item.to} className="shrink-0">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cx('relative flex h-11 items-center px-3 text-sm font-semibold whitespace-nowrap', isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900')
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-600" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <div className="animate-fade-up space-y-3 border-t border-slate-200 bg-card px-4 pt-3 pb-4 lg:hidden">
          <RoleControl compact />
          <ThemeToggleRow />
          <Link to={ROUTES.privacy} onClick={() => setOpen(false)} className="block rounded-lg px-1 py-2 text-base font-medium text-slate-700">
            {t.nav.privacy}
          </Link>
        </div>
      )}
    </header>
  )
}

function ThemeToggleRow() {
  const { t, dark, toggleDark } = useApp()
  return (
    <button type="button" onClick={toggleDark} className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-1 text-left text-base font-medium text-slate-700">
      {dark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4" />}
      {dark ? t.nav.lightMode : t.nav.darkMode}
    </button>
  )
}

/** Choose student or company (and which company). Opened from the header, the landing page or "Apply". */
export function RolePicker() {
  const { t, rolePicker, closeRolePicker } = useApp()
  return (
    <Modal open={rolePicker.open} onClose={closeRolePicker} title={t.roles.pickTitle}>
      {/* Mounted only while open, so each opening starts at the requested step. */}
      <PickerBody />
    </Modal>
  )
}

function PickerBody() {
  const { t, rolePicker, closeRolePicker, chooseRole, companies, role, companyId } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState<'role' | 'company'>(rolePicker.preferred === 'company' ? 'company' : 'role')

  const finish = (r: Role, company?: string | null) => {
    chooseRole(r, company)
    closeRolePicker()
    const target = rolePicker.redirect ?? (r === 'student' ? ROUTES.board : company ? ROUTES.company : ROUTES.newPlacement)
    if (target !== location.pathname) navigate(target)
  }

  const options: { r: Role; icon: typeof GraduationCap; title: string; hint: string }[] = [
    { r: 'student', icon: GraduationCap, title: t.roles.studentCta, hint: t.roles.studentHint },
    { r: 'company', icon: Building2, title: t.roles.companyCta, hint: t.roles.companyHint },
  ]

  return (
    <div className="p-5 sm:p-6">
        {step === 'role' ? (
          <>
            <h2 className="pr-10 text-xl font-bold text-slate-900">{t.roles.pickTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">{t.roles.pickText}</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((o) => (
                <button
                  key={o.r}
                  type="button"
                  onClick={() => (o.r === 'student' ? finish('student') : setStep('company'))}
                  className={cx(
                    'group flex cursor-pointer flex-col items-start gap-3 rounded-2xl p-4 text-left ring-1 transition hover:ring-brand-400',
                    role === o.r ? 'bg-brand-50 ring-brand-300' : 'bg-card ring-slate-200',
                  )}
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent-500 text-on-accent">
                    <o.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-slate-900">{o.title}</span>
                    <span className="block text-sm text-slate-600">{o.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="pr-10 text-xl font-bold text-slate-900">{t.roles.pickCompanyTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">{t.roles.pickCompanyText}</p>
            <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              {companies.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => finish('company', c.id)}
                    className="flex w-full cursor-pointer items-center gap-3 bg-card px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <Avatar name={c.name} logo={c.logoDataUrl} size="sm" square />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                        {c.name} {c.isExample && <ExampleBadge />}
                      </span>
                      <span className="block truncate text-xs text-slate-500">{c.town}</span>
                    </span>
                    {role === 'company' && companyId === c.id ? <Check className="size-4 text-brand-700" /> : <ChevronRight className="size-4 text-slate-400" />}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => finish('company', null)}
                  className="flex w-full cursor-pointer items-center gap-3 bg-card px-4 py-3 text-left hover:bg-slate-50"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-accent-500 text-on-accent">
                    <Plus className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold text-slate-900">{t.roles.newCompany}</span>
                    <span className="block text-xs text-slate-500">{t.roles.newCompanyHint}</span>
                  </span>
                </button>
              </li>
            </ul>
            <button type="button" onClick={() => setStep('role')} className="mt-4 cursor-pointer text-sm font-semibold text-brand-700 hover:underline">
              ← {t.common.back}
            </button>
          </>
        )}
    </div>
  )
}

/** Short confirmation at the bottom of the screen ("Pieteikums nosūtīts!"). */
export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
      <p className="animate-fade-up inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-50 shadow-lift">
        <Check className="size-4 text-accent-500" /> {toast}
      </p>
    </div>
  )
}

export function Footer() {
  const { t } = useApp()
  const nav = useNavItems()
  const link = 'text-sm text-[#a8a29e] transition hover:text-white'
  return (
    <footer className="mt-auto bg-ink text-[#d6d3d1]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:grid-cols-[2fr_1fr] lg:px-8">
        <div className="max-w-md">
          <Logo inverted />
          <p className="mt-4 text-sm leading-relaxed text-[#a8a29e]">{t.footer.about}</p>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-[#a8a29e]">
            <MapPin className="size-4 text-[#c9a960]" /> {t.footer.location}
          </p>
        </div>
        <ul className="space-y-3">
          {nav.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={link}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to={ROUTES.privacy} className={link}>
              {t.nav.privacy}
            </Link>
          </li>
        </ul>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-[#a8a29e] sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {t.footer.rights}. {t.footer.prototype}
        </p>
      </div>
    </footer>
  )
}
