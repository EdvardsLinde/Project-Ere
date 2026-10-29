/**
 * SEER — small shared pieces: search box, "PIEMĒRS" badge, avatar, field badge and icons.
 */
import type { FormEvent } from 'react'
import { ChartColumn, ClipboardCheck, Gauge, MapPinned, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Field } from '../data'
import { useApp } from '../lib/state'
import { cx } from './ui'

export const FIELD_ICON: Record<Field, LucideIcon> = {
  sensors: Gauge,
  cyber: ShieldCheck,
  quality: ClipboardCheck,
  gps: MapPinned,
  dashboards: ChartColumn,
  other: Sparkles,
}

export function FieldBadge({ field, className }: { field: Field; className?: string }) {
  const { t } = useApp()
  const Icon = FIELD_ICON[field]
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-md bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-800', className)}>
      <Icon className="size-3.5" /> {t.fields[field]}
    </span>
  )
}

/** "PIEMĒRS" tag on every example company, placement and certificate. */
export function ExampleBadge({ withNote = false }: { withNote?: boolean }) {
  const { t } = useApp()
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
      {t.common.example}
      {withNote && <span className="font-medium tracking-normal normal-case">· {t.common.exampleNote}</span>}
    </span>
  )
}

const AVATAR_TONES = ['bg-brand-100 text-brand-800', 'bg-accent-100 text-accent-800', 'bg-amber-100 text-amber-800', 'bg-slate-200 text-slate-800']

/** Initials in a circle (or the company's uploaded logo). */
export function Avatar({ name, logo, size = 'md', square = false }: { name: string; logo?: string; size?: 'sm' | 'md' | 'lg'; square?: boolean }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const tone = AVATAR_TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length]
  const box = cx(
    'flex shrink-0 items-center justify-center overflow-hidden font-bold',
    square ? 'rounded-xl' : 'rounded-full',
    size === 'sm' && 'size-9 text-xs',
    size === 'md' && 'size-12 text-sm',
    size === 'lg' && 'size-16 text-lg',
  )
  if (logo) return <img src={logo} alt="" className={cx(box, 'bg-white object-contain p-1')} />
  return <span className={cx(box, tone)}>{initials}</span>
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const { t } = useApp()
  return (
    <form role="search" onSubmit={(e: FormEvent) => e.preventDefault()} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-xl border-0 bg-card pr-9 pl-9 text-sm text-slate-900 ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t.board.clear}
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  )
}
