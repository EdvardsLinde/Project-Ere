import type { FormEvent } from 'react'
import { Bookmark, BookmarkCheck, Check, Clock, Info, MapPin, Search, Star, UserPlus, X } from 'lucide-react'
import { CAREERS, INTERESTS, PROVIDERS } from '../data'
import type { Course, Person } from '../data'
import { toggle, useApp } from '../state'
import { Button, Card, cx } from './ui'

/** Page-level banner: everything on the page is a made-up example. */
export function ExampleNotice() {
  const { t } = useApp()
  return (
    <div className="mb-8 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
      <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
      <p>{t.example.notice}</p>
    </div>
  )
}

/** Small "Piemērs" tag shown on every fictional company, course and person. */
export function ExampleBadge() {
  const { t } = useApp()
  return (
    <span className="inline-flex shrink-0 items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
      {t.example.badge}
    </span>
  )
}

const AVATAR_TONES = [
  'bg-brand-100 text-brand-800',
  'bg-accent-100 text-accent-800',
  'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-800',
  'bg-sky-100 text-sky-800',
  'bg-rose-100 text-rose-800',
]

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const tone = AVATAR_TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length]
  return (
    <span
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full font-bold',
        tone,
        size === 'sm' && 'size-9 text-xs',
        size === 'md' && 'size-12 text-sm',
        size === 'lg' && 'size-16 text-lg',
      )}
    >
      {initials}
    </span>
  )
}

export function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder,
  autoFocus,
  size = 'lg',
}: {
  value: string
  onChange: (v: string) => void
  onSubmit?: (v: string) => void
  placeholder: string
  autoFocus?: boolean
  size?: 'md' | 'lg'
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }
  return (
    <form onSubmit={submit} role="search" className="relative">
      <Search
        className={cx(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400',
          size === 'lg' ? 'left-4 size-5' : 'left-3 size-4',
        )}
      />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cx(
          'block w-full rounded-xl border-0 bg-white text-slate-900 ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden',
          size === 'lg' ? 'h-14 pr-12 pl-12 text-base shadow-card' : 'h-10 pr-9 pl-9 text-sm',
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="✕"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  )
}

/** Does this course fit the user's chosen career or interests? */
export function useIsRecommended() {
  const { profile } = useApp()
  return (course: Course) => {
    if (profile.careerId) return course.careerId === profile.careerId
    const career = CAREERS.find((c) => c.id === course.careerId)
    return !!career && career.interests.some((i) => profile.interests.includes(i))
  }
}

export function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  const { t, l, profile, update } = useApp()
  const isRecommended = useIsRecommended()
  const provider = PROVIDERS.find((p) => p.id === course.providerId)!
  const career = CAREERS.find((c) => c.id === course.careerId)
  const saved = profile.savedCourses.includes(course.id)
  const applied = profile.appliedCourses.includes(course.id)

  return (
    <Card className="flex h-full flex-col p-5 transition hover:shadow-lift sm:p-6">
      <div className="flex items-start gap-3">
        <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold', provider.tone)}>
          {provider.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-slate-800">{provider.name}</p>
            <ExampleBadge />
          </div>
          <p className="truncate text-xs text-slate-500">{l(provider.kind)}</p>
        </div>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? t.courses.saved : t.courses.save}
          title={saved ? t.courses.saved : t.courses.save}
          onClick={() => update({ savedCourses: toggle(profile.savedCourses, course.id) })}
          className={cx(
            'flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition',
            saved ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
          )}
        >
          {saved ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span
          className={cx(
            'rounded-md px-2 py-0.5 text-xs font-semibold',
            course.type === 'job' && 'bg-slate-900 text-white',
            course.type === 'internship' && 'bg-accent-50 text-accent-700',
            (course.type === 'course' || course.type === 'bootcamp') && 'bg-brand-50 text-brand-700',
          )}
        >
          {t.courses.types[course.type]}
        </span>
        {career && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{l(career.title)}</span>}
        {isRecommended(course) && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            <Star className="size-3 fill-current" /> {t.courses.forYou}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg leading-snug font-bold text-slate-900">{l(course.title)}</h3>
      {!compact && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{l(course.description)}</p>}

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">{l(course.duration)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">{t.courses.formats[course.format]}</span>
        </div>
        {!compact && (
          <>
            <div className="truncate text-slate-500">{t.courses.levels[course.level]}</div>
            <div className="truncate text-slate-500">{l(course.start)}</div>
          </>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        {course.type === 'job' || course.type === 'internship' ? (
          <span className={cx('text-base font-bold', course.paid ? 'text-accent-700' : 'text-slate-500')}>
            {course.paid ? t.courses.paid : t.courses.unpaid}
          </span>
        ) : (
          <span className={cx('text-base font-bold', course.price === 0 ? 'text-accent-700' : 'text-slate-900')}>
            {course.price === 0 ? t.courses.free : `€${course.price}`}
          </span>
        )}
        <Button
          variant={applied ? 'secondary' : 'primary'}
          onClick={() => update({ appliedCourses: toggle(profile.appliedCourses, course.id) })}
          title={t.courses.appliedHint}
        >
          {applied && <Check className="size-4" strokeWidth={2.5} />}
          {applied ? t.courses.applied : t.courses.apply}
        </Button>
      </div>
    </Card>
  )
}

export function PersonCard({ person, compact = false }: { person: Person; compact?: boolean }) {
  const { t, l, profile, update } = useApp()
  const following = profile.following.includes(person.id)
  const shared = person.interests.filter((i) => profile.interests.includes(i))
  const followBtn = (
    <Button
      variant={following ? 'secondary' : 'primary'}
      onClick={() => update({ following: toggle(profile.following, person.id) })}
      aria-pressed={following}
      className={compact ? 'h-9 px-3' : ''}
    >
      {following ? <Check className="size-4" strokeWidth={2.5} /> : <UserPlus className="size-4" />}
      {following ? t.people.following : t.people.follow}
    </Button>
  )

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar name={person.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{person.name}</p>
          <p className="truncate text-xs text-slate-500">{l(person.role)}</p>
        </div>
        {followBtn}
      </div>
    )
  }

  return (
    <Card className="flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar name={person.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-bold text-slate-900">{person.name}</h3>
            <ExampleBadge />
          </div>
          <p className="mt-0.5 text-sm text-slate-600">{l(person.role)}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {l(person.location)}
            </span>
            <span>{t.people.followers(person.followers + (following ? 1 : 0))}</span>
          </p>
        </div>
      </div>
      <span
        className={cx(
          'mt-4 self-start rounded-md px-2 py-0.5 text-xs font-semibold',
          person.kind === 'mentor' && 'bg-brand-50 text-brand-700',
          person.kind === 'pro' && 'bg-violet-50 text-violet-700',
          person.kind === 'peer' && 'bg-accent-50 text-accent-700',
        )}
      >
        {t.people.kindLabel[person.kind]}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{l(person.bio)}</p>
      {shared.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          {t.people.shared}
          {shared.map((id) => (
            <span key={id} className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
              {l(INTERESTS.find((x) => x.id === id)!.label)}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto pt-5">{followBtn}</div>
    </Card>
  )
}

/** People sorted by relevance: same career first, then shared interests. */
export function rankPeople(people: Person[], careerId: string | null, interests: string[]) {
  const score = (p: Person) => (p.careerId === careerId ? 10 : 0) + p.interests.filter((i) => interests.includes(i)).length
  return [...people].sort((a, b) => score(b) - score(a))
}
