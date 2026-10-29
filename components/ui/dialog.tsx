"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * Accessible modal built on the native <dialog> element (focus trap, Esc to close
 * and inert background come for free).
 */
export function Dialog({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  closeLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg" | "full";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const width = size === "lg" ? "sm:max-w-3xl" : size === "full" ? "sm:max-w-6xl" : "sm:max-w-lg";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`m-0 mt-auto max-h-[92vh] w-full max-w-none rounded-t-lg border-2 border-edge bg-surface p-0 text-ink shadow-lift backdrop:bg-night/60 sm:m-auto sm:rounded-lg ${width}`}
    >
      {open && (
        <div className="flex max-h-[92vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b-2 border-edge px-5 py-4">
            <h2 className="text-xl font-extrabold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 rounded-full p-1.5 text-ink-muted hover:bg-accent hover:text-on-accent"
              aria-label={closeLabel}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-5">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
