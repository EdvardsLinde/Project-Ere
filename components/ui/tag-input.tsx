"use client";

import { Plus, X } from "lucide-react";
import { useId, useState } from "react";
import { FieldError, RequiredMark } from "./form";

interface TagInputProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  removeLabel: string;
  addLabel: string;
  error?: string;
  required?: boolean;
  /** How a stored value is shown (e.g. bilingual seed tags). */
  display?: (value: string) => string;
}

/** Free-text tags with optional suggestion chips. Enter or comma adds a tag. */
export function TagInput({
  label,
  hint,
  value,
  onChange,
  suggestions = [],
  placeholder,
  removeLabel,
  addLabel,
  error,
  required,
  display = (v) => v,
}: TagInputProps) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "");
    if (!tag) return;
    if (!value.some((v) => v.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  };
  const remaining = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
        {required && <RequiredMark />}
      </label>
      <div
        className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border-2 bg-surface px-2 py-1.5 focus-within:border-edge focus-within:outline-3 focus-within:outline-offset-1 focus-within:outline-primary ${
          error ? "border-danger" : "border-line"
        }`}
      >
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2.5 pr-1 text-sm font-semibold text-primary">
            {display(tag)}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== tag))}
              className="rounded-full p-0.5 hover:bg-primary-fill/10"
              aria-label={`${removeLabel}: ${display(tag)}`}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => {
            if (e.target.value.endsWith(",")) add(e.target.value);
            else setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          className="h-8 min-w-[8rem] flex-1 bg-transparent px-1 text-ink outline-none placeholder:text-ink-muted/70"
        />
      </div>
      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label={addLabel}>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-2.5 py-1 text-sm text-ink-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{addLabel}: </span>
              {s}
            </button>
          ))}
        </div>
      )}
      {hint && <p className="text-sm text-ink-muted">{hint}</p>}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
