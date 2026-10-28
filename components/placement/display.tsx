"use client";

import { FlaskConical, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/misc";
import type { Placement, PlacementStatus } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";

/** Hide internal placeholders such as `[TODO: confirm address]` from the public UI. */
export function publicText(value: string | undefined | null): string {
  if (!value) return "";
  return value.trim().startsWith("[TODO") ? "" : value;
}

export function placementLocation(p: Pick<Placement, "company">): string {
  const a = p.company.address;
  return [publicText(a.town), publicText(a.parish)].filter(Boolean).join(", ");
}

export function SampleBadge() {
  const { t } = useI18n();
  return (
    <Badge tone="warning">
      <FlaskConical className="size-3.5" aria-hidden="true" />
      {t.common.illustrative}
    </Badge>
  );
}

export function BeginnerBadge() {
  const { t } = useI18n();
  return (
    <Badge tone="primary">
      <Sprout className="size-3.5" aria-hidden="true" />
      {t.common.beginnerFriendly}
    </Badge>
  );
}

export function PlacementStatusBadge({ status }: { status: PlacementStatus }) {
  const { t } = useI18n();
  const tone = { draft: "neutral", published: "success", closed: "warning", finished: "ink" } as const;
  return <Badge tone={tone[status]}>{t.status[status]}</Badge>;
}

export function ApplicationStatusBadge({ status }: { status: "new" | "approved" | "rejected" | "completed" }) {
  const { t } = useI18n();
  const tone = { new: "accent", approved: "success", rejected: "danger", completed: "ink" } as const;
  return <Badge tone={tone[status]}>{t.status.app[status]}</Badge>;
}
