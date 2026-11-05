"use client";

import { FlaskConical, Hourglass, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/misc";
import type { Exhibitor } from "@/lib/data/types";
import { isUnconfirmedExample } from "@/lib/fair/labels";
import { useI18n } from "@/lib/i18n";

/** "PIEMĒRS" on every piece of example content. */
export function ExampleBadge() {
  const { t } = useI18n();
  return (
    <Badge tone="warning">
      <FlaskConical className="size-3.5" aria-hidden="true" />
      {t.common.example}
    </Badge>
  );
}

/** Example badge, "participation not yet confirmed" for real companies, and "looking for investment". */
export function ExhibitorBadges({ exhibitor: e, showSeeking = true }: { exhibitor: Exhibitor; showSeeking?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-1.5">
      {e.isExample && <ExampleBadge />}
      {isUnconfirmedExample(e) && (
        <Badge tone="neutral">
          <Hourglass className="size-3.5" aria-hidden="true" />
          {t.common.notConfirmed}
        </Badge>
      )}
      {showSeeking && e.investment && (
        <Badge tone="primary">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          {t.exhibitors.seeking}
        </Badge>
      )}
    </div>
  );
}
