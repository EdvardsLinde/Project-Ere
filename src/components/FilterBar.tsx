/**
 * SEER — one compact filter bar for list pages: a search box plus dropdowns
 * ("Joma: Visi", "Ilgums: 3 dienas"…) instead of rows of buttons.
 */
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { useApp } from '../lib/state'
import { cx } from './ui'
import { SearchBox } from './cards'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterDef {
  id: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

export function FilterBar({
  search,
  filters,
  count,
  onClear,
}: {
  search?: { value: string; onChange: (v: string) => void; placeholder: string }
  filters: FilterDef[]
  /** e.g. "12 rezultāti" */
  count?: string
  /** Shown only when something is filtered. */
  onClear?: () => void
}) {
  const { t } = useApp()
  return (
    <div className="mb-5 rounded-2xl bg-card p-3 shadow-card ring-1 ring-slate-200/70">
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
        {search && (
          <div className="col-span-2 md:min-w-56 md:flex-1">
            <SearchBox value={search.value} onChange={search.onChange} placeholder={search.placeholder} />
          </div>
        )}
        {filters.map((f) => {
          const active = f.value !== ''
          return (
            <label key={f.id} className="relative block min-w-0">
              <span className="sr-only">{f.label}</span>
              <select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className={cx(
                  'h-10 w-full cursor-pointer appearance-none truncate rounded-xl border-0 py-0 pr-8 pl-3 text-sm font-medium ring-1 ring-inset transition focus:ring-2 focus:ring-brand-500 focus:outline-none md:w-auto',
                  active ? 'bg-brand-50 text-brand-800 ring-brand-300' : 'bg-card text-slate-700 ring-slate-300 hover:ring-slate-400',
                )}
              >
                <option value="">
                  {f.label}: {t.board.all}
                </option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {f.label}: {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400" />
            </label>
          )
        })}
      </div>
      {(count || onClear) && (
        <div className="mt-2 flex items-center justify-between gap-3 px-1 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
            <SlidersHorizontal className="size-3.5" /> {count}
          </span>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 font-semibold text-brand-700 hover:bg-brand-50"
            >
              <X className="size-3.5" /> {t.board.clear}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
