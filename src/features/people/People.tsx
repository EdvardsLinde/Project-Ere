import { useState } from 'react'
import { Users } from 'lucide-react'
import { CAREERS, PEOPLE } from '../../data'
import type { Lang, Person, PersonKind } from '../../data'
import { useApp } from '../../lib/state'
import { PageHeader } from '../../components/ui'
import { FilterBar } from '../../components/FilterBar'
import type { FilterDef } from '../../components/FilterBar'
import { ExampleNotice, PersonCard, rankPeople } from '../../components/cards'

export function matchPerson(person: Person, q: string) {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const career = CAREERS.find((c) => c.id === person.careerId)
  const hay = [
    person.name,
    ...(['lv', 'en'] as Lang[]).flatMap((lang) => [
      person.role[lang],
      person.location[lang],
      person.bio[lang],
      career?.title[lang] ?? '',
    ]),
    person.kind === 'mentor' ? 'mentors mentor' : '',
    ...person.skills,
    ...person.journey.flatMap((j) => [j.text.lv, j.text.en]),
  ]
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((word) => hay.includes(word))
}

export function People() {
  const { t, l, profile } = useApp()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('')
  const [field, setField] = useState('')
  const [place, setPlace] = useState('')

  const ranked = rankPeople(PEOPLE, profile.careerId, profile.interests)
  const filtered = ranked.filter(
    (p) =>
      matchPerson(p, q) &&
      (!kind || p.kind === kind) &&
      (!field || p.careerId === field) &&
      (!place || (place === 'saldus') === p.location.lv.includes('Saldus')),
  )
  const browsing = !q && !kind && !field && !place
  // When not filtering, show the top 3 matches as "suggested" and the rest below.
  const suggested = browsing ? filtered.slice(0, 3) : []
  const rest = browsing ? filtered.slice(3) : filtered

  const filters: FilterDef[] = [
    {
      id: 'who',
      label: t.filters.who,
      value: kind,
      onChange: setKind,
      options: (['mentor', 'pro', 'peer'] as PersonKind[]).map((k) => ({ value: k, label: t.people.kinds[k] })),
    },
    { id: 'field', label: t.filters.field, value: field, onChange: setField, options: CAREERS.map((c) => ({ value: c.id, label: l(c.title) })) },
    {
      id: 'place',
      label: t.filters.place,
      value: place,
      onChange: setPlace,
      options: [
        { value: 'saldus', label: t.filters.saldus },
        { value: 'other', label: t.people.elsewhere },
      ],
    },
  ]

  return (
    <>
      <PageHeader icon={Users} eyebrow={t.people.eyebrow} title={t.people.title} subtitle={t.people.subtitle} />
      <ExampleNotice />
      <FilterBar
        search={{ value: q, onChange: setQ, placeholder: t.people.searchPlaceholder }}
        filters={filters}
        count={t.people.count(filtered.length)}
        onClear={
          browsing
            ? undefined
            : () => {
                setQ('')
                setKind('')
                setField('')
                setPlace('')
              }
        }
      />

      {suggested.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-slate-900">{t.people.suggested}</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggested.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        {browsing && <h2 className="mb-3 text-lg font-bold text-slate-900">{t.people.everyone}</h2>}
        {rest.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        ) : (
          !suggested.length && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center">
              <Users className="size-8 text-slate-300" />
              <p className="mt-3 text-slate-500">{t.people.noResults}</p>
            </div>
          )
        )}
      </section>
    </>
  )
}
