"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmt, useI18n } from "@/lib/i18n";

/** A row of filter controls with a result count and "clear filters". */
export function FilterBar({ count, onClear, canClear, children }: { count: number; onClear: () => void; canClear: boolean; children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <section aria-label={t.common.filtersLabel} className="mt-8 rounded-lg border-2 border-edge bg-surface p-4 shadow-card sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">{children}</div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <p className="flex items-center gap-2 text-sm font-bold" aria-live="polite">
          <Filter className="size-4 text-primary" aria-hidden="true" />
          {fmt(t.common.found, { n: count })}
        </p>
        {canClear && (
          <Button variant="quiet" size="sm" onClick={onClear}>
            {t.common.clearFilters}
          </Button>
        )}
      </div>
    </section>
  );
}
