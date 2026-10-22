/**
 * SEER brand: the icon-only mark (an eye on a horizon line — "see ahead") and the
 * wordmark, whose two E's carry orange middle bars like a pair of eyes looking
 * forward. Both are inline SVG so they stay sharp from favicon to header.
 * public/favicon.svg is a static copy of SeerMark — keep the two in sync.
 */
import { useId } from 'react'
import { useApp } from '../lib/state'
import { cx } from './ui'

/** Icon-only mark: rounded orange tile with an eye and its horizon line. */
export function SeerMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#9a3412" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id})`} />
      <path d="M4.5 16C8.5 9.2 23.5 9.2 27.5 16C23.5 22.8 8.5 22.8 4.5 16Z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3.6" fill="#fff" />
      <path d="M1.5 16H4.5M27.5 16H30.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}

/** "SEER" wordmark. Letters use the current text colour; the E bars are orange. */
export function SeerWordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 24" className={className} role="img" aria-label="SEER">
      <g fill="none" stroke="currentColor" strokeWidth="3.4">
        <path d="M13.2 5.6C12.2 3.4 10.2 2.2 7.4 2.2C4.2 2.2 2.2 3.9 2.2 6.4C2.2 9.2 4.6 10.4 7.6 11.2C11 12.1 13.6 13.3 13.6 16.6C13.6 19.6 11.1 21.8 7.5 21.8C4.6 21.8 2.4 20.5 1.4 18" />
        <path d="M30.5 2.2H20.2V21.8H30.5" />
        <path d="M48 2.2H37.7V21.8H48" />
        <path d="M54.2 21.8V2.2H60.6C63.8 2.2 65.6 4.2 65.6 7C65.6 9.8 63.8 11.8 60.6 11.8H54.2M60.2 11.8L66.4 21.8" />
      </g>
      <path d="M21.9 12H28.6M39.4 12H46.1" stroke="var(--color-accent-500)" strokeWidth="3.4" />
    </svg>
  )
}

/**
 * Mark + wordmark + tagline. `compact` shows the mark only (very narrow headers);
 * the wordmark also collapses to the mark on screens under 360px.
 */
export function Logo({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  const { t } = useApp()
  return (
    <span className="flex items-center gap-2.5">
      <SeerMark className="size-9 shrink-0" />
      {!compact && (
        <span className="flex flex-col items-start leading-none max-[359px]:hidden">
          <SeerWordmark className={cx('h-[18px] w-auto', inverted ? 'text-white' : 'text-slate-900')} />
          <span className={cx('mt-1 hidden text-[11px] font-medium sm:block', inverted ? 'text-[#a8a29e]' : 'text-slate-500')}>
            {t.brand.tagline}
          </span>
        </span>
      )}
    </span>
  )
}
