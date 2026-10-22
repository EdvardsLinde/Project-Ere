import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../lib/state'
import { Check } from 'lucide-react'

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'light'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-800 dark:shadow-none dark:hover:bg-brand-500 dark:active:bg-brand-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none',
  accent:
    'bg-accent-500 text-on-accent shadow-sm shadow-accent-600/25 hover:bg-accent-600 active:bg-accent-700 disabled:bg-slate-300 disabled:shadow-none',
  secondary:
    'bg-card text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:ring-slate-400 disabled:text-slate-400',
  // White button on the dark hero gradient — same look in light and dark mode.
  light: 'bg-white text-[#9a3412] shadow-lg shadow-black/20 hover:bg-[#fff4ec] active:bg-[#ffe4d1]',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-3.5 text-sm gap-2 rounded-lg',
  lg: 'h-13 px-6 text-base gap-2.5 rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex shrink-0 cursor-pointer items-center justify-center font-semibold transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

/** Selectable pill used for skills, motivation tags, experience types. */
export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        'inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        selected
          ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 dark:shadow-none dark:hover:bg-brand-500'
          : 'bg-card text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-brand-50 hover:text-brand-800 hover:ring-brand-300',
      )}
    >
      {selected && <Check className="size-4" strokeWidth={2.5} aria-hidden />}
      {children}
    </button>
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx('rounded-2xl bg-card shadow-card ring-1 ring-slate-200/70', className)}>{children}</div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  aside,
  icon: Icon,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  aside?: ReactNode
  /** Small section icon shown in the breadcrumb. */
  icon?: LucideIcon
}) {
  const { t, appNav, goTo } = useApp()
  return (
    // Full-width white band (website-style page header): the box-shadow + clip-path
    // trick paints the band edge to edge while the text stays in the page container.
    <div className="relative -mt-5 mb-6 bg-card py-6 shadow-[0_0_0_100vmax_var(--color-card)] [clip-path:inset(0_-100vmax)] after:absolute after:-inset-x-[100vmax] after:bottom-0 after:h-px after:bg-slate-200 sm:-mt-8 sm:mb-8 sm:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl min-w-0">
          <nav aria-label={t.common.breadcrumb} className="mb-2 flex items-center gap-1.5 text-sm text-slate-500">
            {appNav && (
              <>
                <button type="button" onClick={() => goTo('news')} className="cursor-pointer hover:text-brand-700 hover:underline">
                  {t.common.home}
                </button>
                <span aria-hidden>›</span>
              </>
            )}
            <span className="inline-flex items-center gap-1.5 font-semibold text-accent-600">
              {Icon && <Icon className="size-4" />}
              {eyebrow}
            </span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-slate-600 sm:text-lg">{subtitle}</p>}
        </div>
        {aside}
      </div>
    </div>
  )
}

/** Primary actions at the end of a page, separated by a rule (website-style, not a sticky app bar). */
export function ActionBar({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mt-8 border-t border-slate-200 pt-5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-500">{hint}</div>
        <div className="flex gap-3">{children}</div>
      </div>
    </div>
  )
}

export function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-slate-800">
      {children}
      {optional && <span className="text-xs font-normal text-slate-400">{optional}</span>}
    </label>
  )
}

export const inputClass =
  'block w-full rounded-lg border-0 bg-card px-3.5 py-3 text-base text-slate-900 shadow-xs ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 transition focus:ring-2 focus:ring-inset focus:ring-brand-500 focus:outline-none sm:text-sm'

/** Horizontal level bar (0–100) with an optional target marker. */
export function Meter({
  value,
  target,
  tone = 'brand',
  label,
}: {
  value: number
  target?: number
  tone?: 'brand' | 'accent' | 'sun'
  label?: string
}) {
  const fill = { brand: 'from-brand-600 to-brand-400', accent: 'from-accent-600 to-accent-400', sun: 'from-amber-600 to-amber-400' }[tone]
  return (
    <div
      className="relative h-2.5 rounded-full bg-slate-100"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={label}
    >
      <div
        className={cx('h-2.5 rounded-full bg-gradient-to-r transition-all duration-500', fill)}
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
      {target !== undefined && (
        <span
          aria-hidden
          className="absolute -top-1 h-4.5 w-1 -translate-x-1/2 rounded-full bg-slate-900 ring-2 ring-card"
          style={{ left: `${target}%` }}
        />
      )}
    </div>
  )
}

/** Small "Piemērs" / status pill. */
export function Pill({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold', className)}>
      {children}
    </span>
  )
}
