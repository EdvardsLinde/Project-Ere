/**
 * ERE — accessible detail window. Opens as a centred dialog on desktop and a
 * bottom sheet on phones. Closes with Esc, the X button or a click outside.
 */
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useApp } from '../lib/state'
import { cx } from './ui'

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  /** Used as the dialog's accessible name. */
  title: string
  children: ReactNode
  /** Sticky action bar at the bottom (buttons). */
  footer?: ReactNode
}) {
  const { t } = useApp()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'animate-fade-up relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-lift sm:max-w-xl sm:rounded-3xl dark:bg-card-raised dark:ring-1 dark:ring-slate-200',
        )}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-card/90 text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-slate-900 dark:bg-card-raised/90"
        >
          <X className="size-5" />
        </button>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div
            className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-card px-5 py-3 dark:bg-card-raised"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
