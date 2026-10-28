"use client";

import { useParams } from "next/navigation";
import { PlacementBuilder } from "@/components/builder/placement-builder";
import { LinkButton } from "@/components/ui/button";
import { Container, EmptyState, Loading } from "@/components/ui/misc";
import { resizeDayPlan, toInput } from "@/lib/builder";
import { useQuery } from "@/lib/data/hooks";
import { useI18n } from "@/lib/i18n";
import { useRoleGuard, useSession } from "@/lib/session";

export default function EditPlacementPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const allowed = useRoleGuard(["company"], "company");
  const { session } = useSession();
  const { data: placement, loading } = useQuery((repo) => repo.getPlacement(id), [id]);

  if (!allowed || loading || !session?.company) return <Loading label={t.common.loading} />;

  if (!placement || placement.companyId !== session.company.id) {
    return (
      <Container className="py-16">
        <EmptyState
          title={placement ? t.builder.notOwner : t.detail.notFound}
          action={<LinkButton href="/uznemums">{t.applications.backToDashboard}</LinkButton>}
        />
      </Container>
    );
  }

  const initial = toInput(placement);
  initial.dayPlan = resizeDayPlan(initial.dayPlan, initial.lengthDays);
  // Keyed by id so the builder keeps its own state while autosave updates storage.
  return <PlacementBuilder key={placement.id} companyId={placement.companyId} initial={initial} placementId={placement.id} status={placement.status} />;
}
