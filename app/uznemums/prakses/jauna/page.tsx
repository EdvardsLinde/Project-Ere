"use client";

import { PlacementBuilder } from "@/components/builder/placement-builder";
import { Loading } from "@/components/ui/misc";
import { emptyPlacementInput } from "@/lib/builder";
import { useI18n } from "@/lib/i18n";
import { useRoleGuard, useSession } from "@/lib/session";

export default function NewPlacementPage() {
  const { t } = useI18n();
  const allowed = useRoleGuard(["company"], "company");
  const { session } = useSession();
  if (!allowed || !session?.company) return <Loading label={t.common.loading} />;
  return (
    <PlacementBuilder
      companyId={session.company.id}
      initial={emptyPlacementInput(session.company)}
      placementId={null}
      status="draft"
    />
  );
}
