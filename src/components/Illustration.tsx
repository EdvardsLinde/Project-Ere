/**
 * SEER — lightweight, theme-aware illustrations built from simple shapes and icons
 * (no image files), one scene per career track and per news type.
 * Used as covers on news and career cards and on the welcome page.
 */
import type { ReactNode } from 'react'
import { CalendarDays, FileText, Gamepad2, HandHeart, Headset, Lock, MessageCircle, Newspaper, ShieldCheck, Sparkles, Star, Trophy, TriangleAlert, Wifi, Wrench } from 'lucide-react'
import type { NewsItem, NewsKind, NewsScene, TrackId } from '../data'
import { cx } from './ui'

export type Scene = TrackId | Exclude<NewsKind, 'article' | 'course'> | NewsScene

const BG: Record<Scene, string> = {
  cyber: 'from-brand-200 via-brand-100 to-accent-100',
  'ai-data': 'from-amber-100 via-brand-50 to-accent-100',
  web: 'from-accent-200 via-accent-100 to-brand-100',
  'it-support': 'from-brand-100 via-accent-100 to-accent-200',
  news: 'from-brand-100 via-brand-50 to-accent-50',
  event: 'from-accent-100 via-brand-50 to-amber-100',
  volunteering: 'from-amber-100 via-amber-50 to-accent-100',
  town: 'from-brand-200 via-brand-100 to-amber-100',
  trophy: 'from-amber-200 via-amber-100 to-brand-100',
  people: 'from-accent-200 via-brand-50 to-brand-100',
  laptop: 'from-brand-100 via-accent-50 to-amber-100',
  gaming: 'from-brand-300 via-brand-200 to-accent-200',
  phone: 'from-red-50 via-brand-50 to-brand-100',
  cv: 'from-accent-100 via-brand-50 to-brand-200',
}

const ROOF = '[clip-path:polygon(50%_0,100%_100%,0_100%)]'

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
    case 'town':
      return (
        <div className="relative flex items-end gap-1.5">
          <span className="absolute -top-10 right-0 size-9 rounded-full bg-amber-400 shadow-lift" />
          {[
            { w: 'w-10', h: 'h-10', roof: 'bg-brand-600' },
            { w: 'w-8', h: 'h-16', roof: 'bg-accent-600', spire: true },
            { w: 'w-12', h: 'h-12', roof: 'bg-brand-500' },
            { w: 'w-9', h: 'h-9', roof: 'bg-accent-500' },
          ].map((b, i) => (
            <span key={i} className="flex flex-col items-center">
              <span className={cx(b.spire ? 'h-10 w-5' : 'h-5', b.spire ? '' : b.w, b.roof, ROOF)} />
              <span className={cx('flex flex-wrap content-start justify-center gap-1 bg-card p-1.5 shadow-lift', b.w, b.h)}>
                <span className="size-2 rounded-[2px] bg-amber-300" />
                <span className="size-2 rounded-[2px] bg-brand-200" />
              </span>
            </span>
          ))}
          <span className="absolute -bottom-1.5 -inset-x-6 h-1.5 rounded-full bg-accent-500/60" />
        </div>
      )
    case 'trophy':
      return (
        <div className="relative">
          <span className="flex size-24 items-center justify-center rounded-full bg-amber-500 text-on-sun shadow-lift ring-8 ring-white/40 dark:ring-white/5">
            <Trophy className="size-12" />
          </span>
          <Star className="absolute -top-2 -left-8 size-6 fill-amber-400 text-amber-400" />
          <Star className="absolute top-2 -right-9 size-5 fill-brand-400 text-brand-400" />
          <Sparkles className="absolute -bottom-1 -right-6 size-6 text-accent-500" />
        </div>
      )
    case 'people':
      return (
        <div className="relative flex items-end">
          {['bg-brand-500', 'bg-accent-500', 'bg-amber-500'].map((c, i) => (
            <span key={c} className={cx('flex flex-col items-center', i > 0 && '-ml-3')}>
              <span className={cx('size-9 rounded-full ring-4 ring-card', c)} />
              <span className={cx('mt-1 h-10 w-14 rounded-t-full opacity-80', c)} />
            </span>
          ))}
          <Box className="absolute -top-9 -right-10 flex items-center gap-1 rounded-xl px-2.5 py-1.5">
            <MessageCircle className="size-4 text-brand-600" />
            <span className="h-1.5 w-8 rounded bg-slate-300" />
          </Box>
        </div>
      )
    case 'laptop':
      return (
        <div className="relative flex items-end gap-3">
          <div className="flex flex-col items-center">
            <Box className="h-20 w-32 space-y-1.5 rounded-b-none p-2.5">
              <div className="h-2 w-1/2 rounded bg-brand-400" />
              <div className="h-1.5 w-full rounded bg-slate-200" />
              <div className="h-1.5 w-4/5 rounded bg-slate-200" />
              <div className="flex gap-1 pt-1">
                <span className="h-4 flex-1 rounded bg-accent-200" />
                <span className="h-4 flex-1 rounded bg-amber-200" />
              </div>
            </Box>
            <span className="h-2 w-40 rounded-b-lg bg-slate-300" />
          </div>
          <span className="mb-0.5 flex h-9 w-8 items-start justify-center rounded-b-xl bg-amber-500 shadow-lift">
            <span className="mt-1 h-1 w-5 rounded bg-white/50" />
          </span>
          <Wifi className="absolute -top-6 -left-4 size-6 text-brand-600" />
        </div>
      )
    case 'gaming':
      return (
        <div className="relative">
          <span className="flex h-20 w-32 items-center justify-center rounded-[2rem] bg-brand-700 text-white shadow-lift">
            <Gamepad2 className="size-12" />
          </span>
          <span className="absolute -top-4 -right-5 flex size-9 items-center justify-center rounded-full bg-amber-500 text-on-sun shadow-lift">
            <Trophy className="size-4" />
          </span>
          <span className="absolute -bottom-2 -left-6 size-4 rotate-45 rounded-sm bg-accent-400" />
        </div>
      )
    case 'phone':
      return (
        <div className="relative">
          <Box className="flex h-36 w-20 flex-col gap-1.5 rounded-2xl p-2 pt-4">
            <span className="mx-auto mb-1 h-1 w-6 rounded bg-slate-300" />
            <span className="h-6 rounded-lg bg-slate-100" />
            <span className="h-8 rounded-lg bg-red-50 ring-1 ring-red-400/50" />
            <span className="h-5 w-2/3 rounded-lg bg-slate-100" />
          </Box>
          <span className="absolute top-8 -right-8 flex size-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lift">
            <TriangleAlert className="size-5" />
          </span>
        </div>
      )
    case 'cv':
      return (
        <div className="relative">
          <Box className="w-28 space-y-1.5 p-3">
            <div className="flex items-center gap-2">
              <span className="size-7 rounded-full bg-accent-300" />
              <span className="h-2 flex-1 rounded bg-brand-400" />
            </div>
            <div className="h-1.5 w-full rounded bg-slate-200" />
            <div className="h-1.5 w-5/6 rounded bg-slate-200" />
            <div className="h-1.5 w-full rounded bg-slate-200" />
            <div className="h-1.5 w-2/3 rounded bg-slate-200" />
          </Box>
          <span className="absolute -right-6 -bottom-3 flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lift">
            <FileText className="size-5" />
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
  scale,
  className,
  children,
  day,
}: {
  scene: Scene
  /** Day of month for the event scene's calendar. */
  day?: number
  /** Fixed height; `auto` leaves the height to `className` (e.g. an aspect ratio). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'auto'
  /** Size of the drawing inside; defaults to match `size`. */
  scale?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children?: ReactNode
}) {
  const art = scale ?? (size === 'auto' ? 'md' : size)
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
      <div
        className={cx(
          'relative',
          art === '2xs' && 'scale-[0.4]',
          art === 'xs' && 'scale-[0.6]',
          art === 'sm' && 'scale-75',
          art === 'lg' && 'scale-125',
          art === 'xl' && 'scale-150',
        )}
      >
        <SceneArt scene={scene} day={day} />
      </div>
      {children}
    </div>
  )
}

/** Scene for a news item: its own scene, else its track, else its type. */
export function newsScene({ kind, track, scene }: Pick<NewsItem, 'kind' | 'track' | 'scene'>): Scene {
  if (scene) return scene
  if (track && (kind === 'article' || kind === 'course' || kind === 'news')) return track
  if (kind === 'event' || kind === 'volunteering' || kind === 'news') return kind
  return track ?? 'news'
}
