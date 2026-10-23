/**
 * SEER brand: a letter mark (orange tile with a white "S", inline SVG so it stays
 * sharp from favicon to header) next to the name in bold text.
 * public/favicon.svg is a static copy of SeerMark — keep the two in sync.
 */
import { useId } from 'react'
import { useApp } from '../lib/state'
import { cx } from './ui'

/** Icon-only mark: rounded orange tile with a white "S". */
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
      <path d={S_PATH} fill="none" stroke="#fff" strokeWidth="3.4" />
    </svg>
  )
}

/** The "S" letter, drawn as one stroke so it looks the same in every browser (also in the favicon). */
const S_PATH = 'M21 10.4C20.2 8.6 18.5 7.6 16.1 7.6C13.4 7.6 11.6 9 11.6 11.2C11.6 13.6 13.7 14.6 16.2 15.3C19.1 16.1 21.3 17.1 21.3 19.9C21.3 22.5 19.2 24.3 16.1 24.3C13.6 24.3 11.7 23.2 10.9 21.1'

/**
 * Mark + name + tagline. `compact` shows the mark only (very narrow headers);
 * the name also collapses to the mark on screens under 360px.
 */
export function Logo({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) {
  const { t } = useApp()
  return (
    <span className="flex items-center gap-2.5">
      <SeerMark className="size-9 shrink-0" />
      {!compact && (
        <span className="flex flex-col items-start leading-none max-[359px]:hidden">
          <span className={cx('text-xl font-extrabold tracking-tight', inverted ? 'text-white' : 'text-slate-900')}>SEER</span>
          <span className={cx('mt-1 hidden text-[11px] font-medium sm:block', inverted ? 'text-[#a3a6c9]' : 'text-slate-500')}>
            {t.brand.tagline}
          </span>
        </span>
      )}
    </span>
  )
}
