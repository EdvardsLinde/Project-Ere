import { useState } from 'react'
import { Users } from 'lucide-react'
import { CAREERS, PEOPLE } from '../data'
import type { Lang, Person, PersonKind } from '../data'
import { useApp } from '../state'
import { Chip, PageHeader } from '../components/ui'
import { ExampleNotice, PersonCard, SearchBox, rankPeople } from '../components/cards'

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
  ]
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((word) => hay.includes(word))
}

export function People() {
  const { t, profile } = useApp()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<PersonKind | 'all'>('all')

  const ranked = rankPeople(PEOPLE, profile.careerId, profile.interests)
  const filtered = ranked.filter((p) => matchPerson(p, q) && (kind === 'all' || p.kind === kind))
  const browsing = !q && kind === 'all'
  // When not searching, show the top 3 matches as "suggested" and the rest below.
  const suggested = browsing ? filtered.slice(0, 3) : []
  const rest = browsing ? filtered.slice(3) : filtered

  return (
    <>
      <PageHeader eyebrow={t.people.eyebrow} title={t.people.title} subtitle={t.people.subtitle} />
      <ExampleNotice />

      <div className="space-y-4">
        <SearchBox value={q} onChange={setQ} placeholder={t.people.searchPlaceholder} />
        <div className="flex flex-wrap gap-2">
          {(Object.keys(t.people.kinds) as (PersonKind | 'all')[]).map((k) => (
            <Chip key={k} selected={kind === k} onClick={() => setKind(k)}>
              {t.people.kinds[k]}
            </Chip>
          ))}
        </div>
      </div>

      {suggested.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">{t.people.suggested}</h2>
          <p className="mt-1 text-sm text-slate-500">{t.people.suggestedHint}</p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {suggested.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        {browsing && <h2 className="mb-5 text-xl font-bold text-slate-900">{t.people.everyone}</h2>}
        {rest.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        ) : (
          !suggested.length && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
              <Users className="size-8 text-slate-300" />
              <p className="mt-3 text-slate-500">{t.people.noResults}</p>
            </div>
          )
        )}
      </section>
    </>
  )
}
