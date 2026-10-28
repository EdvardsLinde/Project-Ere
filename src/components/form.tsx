/**
 * SEER — form building blocks: label above the field, optional hint,
 * plain-language error below, all wired up for screen readers.
 */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { CircleAlert } from 'lucide-react'
import type { ErrorKey } from '../lib/placements'
import { useApp } from '../lib/state'
import { cx, inputClass } from './ui'

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: ErrorKey
  children: ReactNode
  className?: string
}) {
  const { t } = useApp()
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-slate-800">
        <span>
          {label}
          {required && <span className="text-red-600" aria-label={t.form.required}> *</span>}
        </span>
        {!required && <span className="text-xs font-normal text-slate-500">{t.common.optional}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-center gap-1 text-sm font-medium text-red-700">
          <CircleAlert className="size-4 shrink-0" /> {t.errors[error]}
        </p>
      )}
    </div>
  )
}

/** aria props that connect a control to its hint / error text. */
export const described = (id: string, error?: ErrorKey, hint?: string) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
})

const invalid = (error?: ErrorKey) => (error ? 'ring-red-500 ring-2' : '')

export function TextInput({ error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: ErrorKey }) {
  return <input {...props} className={cx(inputClass, invalid(error), className)} />
}

export function TextArea({ error, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: ErrorKey }) {
  return <textarea rows={3} {...props} className={cx(inputClass, 'resize-y', invalid(error), className)} />
}

export function Select({ error, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { error?: ErrorKey }) {
  return (
    <select {...props} className={cx(inputClass, 'cursor-pointer pr-8', invalid(error), className)}>
      {children}
    </select>
  )
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  error,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  error?: ErrorKey
}) {
  const { t } = useApp()
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-slate-800">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--color-brand-600)]"
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1 ml-8 flex items-center gap-1 text-sm font-medium text-red-700">
          <CircleAlert className="size-4 shrink-0" /> {t.errors[error]}
        </p>
      )}
    </div>
  )
}
