/**
 * ERE — lightweight, theme-aware illustrations built from simple shapes and icons
 * (no image files), one scene per career track and per news type.
 * Used as covers on news and career cards and on the welcome page.
 */
import type { ReactNode } from 'react'
import { CalendarDays, HandHeart, Headset, Lock, Newspaper, ShieldCheck, Sparkles, Wrench } from 'lucide-react'
import type { NewsKind, TrackId } from '../data'
import { cx } from './ui'

export type Scene = TrackId | Exclude<NewsKind, 'article' | 'course'>

const BG: Record<Scene, string> = {
  cyber: 'from-brand-200 via-brand-100 to-accent-100',
  'ai-data': 'from-amber-100 via-brand-50 to-accent-100',
  web: 'from-accent-200 via-accent-100 to-brand-100',
  'it-support': 'from-brand-100 via-accent-100 to-accent-200',
  news: 'from-brand-100 via-brand-50 to-accent-50',
  event: 'from-accent-100 via-brand-50 to-amber-100',
  volunteering: 'from-amber-100 via-amber-50 to-accent-100',
}

const Box = ({ className, children }: { className?: string; children?: ReactNode }) => (
  <div className={cx('rounded-lg bg-card shadow-lift ring-1 ring-slate-200/60', className)}>{children}</div>
)

function SceneArt({ scene, day }: { scene: Scene; day?: number }) {
  switch (scene) {
    case 'web':
      return (
        <Box className="w-44 overflow-hidden">
          <div className="flex gap-1 bg-slate-100 px-2 py-1.5">
            <span className="size-1.5 rounded-full bg-red-400" />
            <span className="size-1.5 rounded-full bg-amber-500" />
            <span className="size-1.5 rounded-full bg-accent-500" />
          </div>
          <div className="space-y-1.5 p-2.5">
            <div className="h-2.5 w-2/3 rounded bg-brand-300" />
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-8 rounded bg-accent-200" />
              <div className="h-8 rounded bg-brand-100" />
              <div className="h-8 rounded bg-amber-200" />
            </div>
            <div className="h-1.5 w-full rounded bg-slate-200" />
            <div className="h-1.5 w-4/5 rounded bg-slate-200" />
            <div className="h-3 w-12 rounded-full bg-brand-600" />
          </div>
        </Box>
      )
    case 'ai-data':
      return (
        <div className="relative">
          <Box className="flex h-24 w-44 items-end gap-2 px-3 pt-3 pb-2.5">
            {[40, 62, 48, 86, 70].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-accent-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </Box>
          <span className="absolute -top-4 -right-4 flex size-10 items-center justify-center rounded-xl bg-amber-500 text-on-sun shadow-lift">
            <Sparkles className="size-5" />
          </span>
        </div>
      )
    case 'cyber':
      return (
        <div className="relative flex items-center gap-3">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-lift">
            <ShieldCheck className="size-11" />
          </span>
          <Box className="flex items-center gap-2 px-3 py-2">
            <Lock className="size-4 text-accent-600" />
            <span className="font-bold tracking-[0.25em] text-slate-700">••••••</span>
          </Box>
        </div>
      )
    case 'it-support':
      return (
        <div className="relative flex flex-col items-center">
          <Box className="flex h-20 w-36 items-center justify-center rounded-b-none">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-500 text-on-accent">
              <Wrench className="size-6" />
            </span>
          </Box>
          <span className="h-2.5 w-44 rounded-b-lg bg-slate-300" />
          <span className="absolute -top-3 -right-6 flex size-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift">
            <Headset className="size-5" />
          </span>
        </div>
      )
    case 'event':
      return (
        <Box className="w-28 overflow-hidden text-center">
          <div className="bg-accent-500 py-1 text-xs font-bold text-on-accent">
            <CalendarDays className="mx-auto size-4" />
          </div>
          <div className="py-2 text-3xl font-extrabold text-slate-900 tabular-nums">{day ?? <CalendarDays className="mx-auto size-8 text-accent-600" />}</div>
        </Box>
      )
    case 'volunteering':
      return (
        <div className="flex items-center gap-2">
          <span className="flex size-16 items-center justify-center rounded-full bg-amber-500 text-on-sun shadow-lift">
            <HandHeart className="size-8" />
          </span>
          <span className="flex -space-x-2">
            {['bg-brand-300', 'bg-accent-300', 'bg-amber-300'].map((c) => (
              <span key={c} className={cx('size-8 rounded-full ring-2 ring-card', c)} />
            ))}
          </span>
        </div>
      )
    default:
      return (
        <Box className="w-40 space-y-1.5 p-3">
          <div className="flex items-center gap-2">
            <Newspaper className="size-5 text-brand-600" />
            <div className="h-2.5 flex-1 rounded bg-slate-300" />
          </div>
          <div className="h-10 rounded bg-brand-100" />
          <div className="h-1.5 w-full rounded bg-slate-200" />
          <div className="h-1.5 w-3/4 rounded bg-slate-200" />
        </Box>
      )
  }
}

/**
 * A decorative cover. `size` sets the height; the scene scales with it.
 * Purely visual — hidden from screen readers.
 */
export function Illustration({
  scene,
  size = 'md',
  className,
  children,
  day,
}: {
  scene: Scene
  /** Day of month for the event scene's calendar. */
  day?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      aria-hidden={!children}
      className={cx(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        BG[scene],
        size === 'xs' && 'h-24',
        size === 'sm' && 'h-28',
        size === 'md' && 'h-40',
        size === 'lg' && 'h-56',
        className,
      )}
    >
      <span className="absolute -top-8 -left-6 size-24 rounded-full bg-white/40 dark:bg-white/[0.04]" />
      <span className="absolute -right-8 -bottom-10 size-32 rounded-full bg-white/30 dark:bg-white/[0.03]" />
      <span className="absolute top-4 right-10 size-3 rounded-full bg-accent-400/60" />
      <span className="absolute bottom-6 left-12 size-2 rounded-full bg-brand-400/60" />
      <div className={cx('relative', size === 'xs' && 'scale-[0.6]', size === 'sm' && 'scale-75', size === 'lg' && 'scale-125')}>
        <SceneArt scene={scene} day={day} />
      </div>
      {children}
    </div>
  )
}

/** Scene for a news item: its track if it has one, otherwise its type. */
export function newsScene(kind: NewsKind, track?: TrackId): Scene {
  if (track && (kind === 'article' || kind === 'course' || kind === 'news')) return track
  if (kind === 'event' || kind === 'volunteering' || kind === 'news') return kind
  return track ?? 'news'
}
