import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'light'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-300 disabled:shadow-none',
  accent:
    'bg-accent-500 text-on-accent shadow-sm shadow-accent-600/25 hover:bg-accent-600 active:bg-accent-700 disabled:bg-slate-300 disabled:shadow-none',
  secondary:
    'bg-card text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:ring-slate-400 disabled:text-slate-400',
  // White button on the dark hero gradient — same look in light and dark mode.
  light: 'bg-white text-[#006c9b] shadow-lg shadow-black/20 hover:bg-[#e3f3f9] active:bg-[#d0ecf5]',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-4 text-sm gap-2 rounded-lg',
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
        'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        selected
          ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700'
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
}: {
  eyebrow: string
  title: string
  subtitle?: string
  aside?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-sm font-semibold tracking-wide text-accent-600 uppercase">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-slate-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{subtitle}</p>}
      </div>
      {aside}
    </div>
  )
}

/**
 * Primary actions at the bottom of a screen. On mobile it sticks to the bottom
 * of the viewport so the main button is always within thumb reach.
 */
export function ActionBar({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-10 border-t border-slate-200 bg-card/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-12 sm:border-t sm:bg-transparent sm:px-0 sm:pt-6 sm:pb-0 sm:backdrop-blur-none">
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
