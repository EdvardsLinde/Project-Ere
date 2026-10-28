"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type MenuItem =
  | { label: string; icon?: React.ReactNode; onSelect: () => void; danger?: boolean }
  | { label: string; icon?: React.ReactNode; href: string };

/** Small overflow menu (disclosure pattern): Esc and outside click close it. */
export function OverflowMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cls = (danger?: boolean) =>
    `flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-semibold hover:bg-surface-muted ${danger ? "text-danger" : "text-ink"}`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-line bg-surface text-ink hover:bg-surface-muted"
      >
        <MoreHorizontal className="size-5" aria-hidden="true" />
      </button>
      {open && (
        <ul id={menuId} className="absolute right-0 top-11 z-30 w-56 rounded-lg border border-line bg-surface p-1.5 shadow-lift">
          {items.map((item) => (
            <li key={item.label}>
              {"href" in item ? (
                <Link href={item.href} className={cls()} onClick={() => setOpen(false)}>
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className={cls(item.danger)}
                  onClick={() => {
                    setOpen(false);
                    item.onSelect();
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
