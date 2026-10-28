import { useState } from 'react'
import { Factory } from 'lucide-react'
import { FIELDS } from '../../data'
import type { Field, Level } from '../../data'
import { useApp } from '../../lib/state'
import { KNOWN_TOWNS, filterPlacements } from '../../lib/placements'
import type { PlacementFilters } from '../../lib/placements'
import { FilterBar } from '../../components/FilterBar'
import { PageHeader } from '../../components/ui'
import { PlacementCard } from './PlacementCard'

const EMPTY: PlacementFilters = { q: '', companyId: '', field: '', duration: '', level: '', location: '' }
const WEEK = 7 * 864e5

/** Student board: all published placements, with search and dropdown filters. */
export function Board() {
  const { t, placements, companies, companyOf } = useApp()
  const [f, setF] = useState<PlacementFilters>(EMPTY)
  const set = (patch: Partial<PlacementFilters>) => setF((x) => ({ ...x, ...patch }))

  const published = placements.filter((p) => p.status === 'published')
  // Newest user-created placements first, then examples by start date.
  const items = filterPlacements(published, companies, f).sort(
    (a, b) => Number(a.isExample) - Number(b.isExample) || b.createdAt.localeCompare(a.createdAt) || a.dates[0].start.localeCompare(b.dates[0].start),
  )
  const withPlacements = companies.filter((c) => published.some((p) => p.companyId === c.id))

  return (
    <>
      <PageHeader icon={Factory} eyebrow={t.nav.placements} title={t.board.title} subtitle={t.board.subtitle} />
      <FilterBar
        search={{ value: f.q, onChange: (q) => set({ q }), placeholder: t.board.search }}
        filters={[
          { id: 'company', label: t.board.company, value: f.companyId, onChange: (companyId) => set({ companyId }), options: withPlacements.map((c) => ({ value: c.id, label: c.name })) },
          { id: 'field', label: t.board.field, value: f.field, onChange: (v) => set({ field: v as Field | '' }), options: FIELDS.map((x) => ({ value: x, label: t.fields[x] })) },
          { id: 'duration', label: t.board.duration, value: f.duration, onChange: (duration) => set({ duration }), options: ['3', '4', '5'].map((d) => ({ value: d, label: t.common.days(Number(d)) })) },
          { id: 'level', label: t.board.level, value: f.level, onChange: (v) => set({ level: v as Level | '' }), options: (['beginner', 'some'] as Level[]).map((x) => ({ value: x, label: t.levels[x] })) },
          { id: 'location', label: t.board.location, value: f.location, onChange: (location) => set({ location }), options: [...KNOWN_TOWNS.map((x) => ({ value: x, label: x })), { value: 'other', label: t.board.otherTown }] },
        ]}
        count={t.board.count(items.length)}
        onClear={JSON.stringify(f) !== JSON.stringify(EMPTY) ? () => setF(EMPTY) : undefined}
      />
      {!items.length && <p className="py-16 text-center text-slate-500">{t.board.empty}</p>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PlacementCard key={p.id} placement={p} company={companyOf(p)} isNew={!p.isExample && Date.now() - Date.parse(p.createdAt) < WEEK} />
        ))}
      </div>
    </>
  )
}
