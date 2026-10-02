import { ArrowRight, Check } from 'lucide-react'
import { INTERESTS } from '../data'
import { toggle, useApp } from '../state'
import { ActionBar, Button, PageHeader, cx } from '../components/ui'

export function Interests() {
  const { t, l, profile, update, next, editing } = useApp()
  const selected = profile.interests

  return (
    <>
      <PageHeader
        eyebrow={t.interests.eyebrow}
        title={
          profile.name ? `${profile.name}, ${t.interests.title.charAt(0).toLowerCase()}${t.interests.title.slice(1)}` : t.interests.title
        }
        subtitle={t.interests.subtitle}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {INTERESTS.map((item) => {
          const on = selected.includes(item.id)
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => update({ interests: toggle(selected, item.id) })}
              className={cx(
                'group relative flex min-h-32 cursor-pointer flex-col items-start justify-between gap-4 rounded-2xl p-4 text-left transition-all duration-150 sm:min-h-36 sm:p-5',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                on
                  ? 'bg-brand-50 shadow-card ring-2 ring-brand-600'
                  : 'bg-card shadow-card ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-300',
              )}
            >
              <span
                className={cx(
                  'flex size-11 items-center justify-center rounded-xl transition',
                  on ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700',
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className={cx('text-base font-semibold sm:text-lg', on ? 'text-brand-900' : 'text-slate-800')}>
                {l(item.label)}
              </span>
              <span
                className={cx(
                  'absolute top-4 right-4 flex size-6 items-center justify-center rounded-full transition',
                  on ? 'bg-brand-600 text-white' : 'ring-1 ring-slate-300',
                )}
              >
                {on && <Check className="size-4" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <ActionBar hint={selected.length ? t.interests.selected(selected.length) : t.interests.pickOne}>
        <Button size="lg" onClick={() => next()} disabled={!selected.length}>
          {editing ? t.common.save : t.common.next} <ArrowRight className="size-5" />
        </Button>
      </ActionBar>
    </>
  )
}
