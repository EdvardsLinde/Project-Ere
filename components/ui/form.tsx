"use client";

import { AlertCircle } from "lucide-react";
import { useId } from "react";

const control =
  "w-full rounded-md border bg-surface px-3 text-ink placeholder:text-ink-muted/70 transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 disabled:bg-surface-muted";

function controlClass(invalid: boolean, extra = "") {
  return `${control} ${invalid ? "border-danger" : "border-line hover:border-ink/30"} ${extra}`;
}

interface FieldProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  example?: string;
  exampleLabel?: string;
  counter?: React.ReactNode;
  className?: string;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
}

/** Label above, control, hint/example below, error with icon. Wires up aria attributes. */
export function Field({ label, hint, error, required, example, exampleLabel, counter, className = "", children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint || example ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {counter && <span className="text-xs tabular-nums text-ink-muted">{counter}</span>}
      </div>
      {children({ id, describedBy, invalid: !!error })}
      {(hint || example) && (
        <div id={hintId} className="text-sm text-ink-muted">
          {hint}
          {example && (
            <span className="mt-0.5 block">
              <span className="font-semibold">{exampleLabel}:</span> {example}
            </span>
          )}
        </div>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-danger" role="alert">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };
export function Input({ invalid = false, className = "", ...props }: InputProps) {
  return <input aria-invalid={invalid || undefined} className={controlClass(invalid, `h-11 ${className}`)} {...props} />;
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };
export function Textarea({ invalid = false, className = "", rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={controlClass(invalid, `py-2.5 leading-relaxed ${className}`)}
      {...props}
    />
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };
export function Select({ invalid = false, className = "", children, ...props }: SelectProps) {
  return (
    <select aria-invalid={invalid || undefined} className={controlClass(invalid, `h-11 pr-8 ${className}`)} {...props}>
      {children}
    </select>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
}

export function Checkbox({ label, hint, error, className = "", id, ...props }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errId = `${inputId}-error`;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line accent-[var(--color-primary)]"
          {...props}
        />
        <label htmlFor={inputId} className="cursor-pointer text-[0.95rem] leading-snug text-ink">
          {label}
          {hint && <span className="mt-0.5 block text-sm text-ink-muted">{hint}</span>}
        </label>
      </div>
      {error && (
        <div className="mt-1.5 pl-8">
          <FieldError id={errId}>{error}</FieldError>
        </div>
      )}
    </div>
  );
}

interface ChoiceGroupProps<T extends string | number> {
  legend: React.ReactNode;
  options: { value: T; label: React.ReactNode }[];
  value: T | T[];
  onChange: (value: T) => void;
  multiple?: boolean;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  name?: string;
}

/** Segmented pill choices: radio (single) or checkbox (multiple) semantics. */
export function ChoiceGroup<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  multiple,
  required,
  error,
  hint,
  name,
}: ChoiceGroupProps<T>) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const selected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-semibold text-ink">
        {legend}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected(o.value);
          return (
            <label
              key={String(o.value)}
              className={`relative inline-flex min-h-10 cursor-pointer items-center rounded-md border px-3.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                on ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-ink hover:border-ink/30"
              }`}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={groupName}
                className="sr-only"
                checked={on}
                onChange={() => onChange(o.value)}
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {hint && <p className="text-sm text-ink-muted">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </fieldset>
  );
}
