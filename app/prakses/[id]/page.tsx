"use client";

import { ArrowLeft, CheckCircle2, Info, SearchX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Container, EmptyState, Loading } from "@/components/ui/misc";
import { PlacementDetailView } from "@/components/placement/placement-detail";
import { useQuery } from "@/lib/data/hooks";
import { useI18n } from "@/lib/i18n";
import { applyBlockReason } from "@/lib/placements";
import { loginPath, useSession } from "@/lib/session";

export default function PlacementPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { ready, session } = useSession();
  const { data, loading } = useQuery(
    async (repo) => {
      const placement = await repo.getPlacement(id);
      if (!placement) return null;
      const [applications, company] = await Promise.all([
        repo.listPlacementApplications(id),
        repo.getCompany(placement.companyId),
      ]);
      return { placement, applications, company };
    },
    [id],
  );

  if (loading || !ready) return <Loading label={t.common.loading} />;

  const isOwner = !!data && session?.company?.id === data.placement.companyId;
  // Drafts are visible only to their owner.
  if (!data || (data.placement.status === "draft" && !isOwner)) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<SearchX className="size-10" aria-hidden="true" />}
          title={t.detail.notFound}
          text={t.detail.notFoundText}
          action={<LinkButton href="/prakses">{t.detail.backToList}</LinkButton>}
        />
      </Container>
    );
  }

  const { placement, applications, company } = data;
  const role = session?.user.role;
  const studentId = role === "student" ? session!.user.id : null;
  const mine = studentId ? applications.find((a) => a.studentId === studentId) : undefined;
  const block = applyBlockReason(placement, applications, studentId);
  const showContact = !!mine && (mine.status === "approved" || mine.status === "completed") && !!company?.confirmed;
  const applyHref = `/prakses/${placement.id}/pieteikties`;
  const d = t.detail;

  const blockText = {
    "not-published": d.notPublished,
    deadline: d.deadlinePassed,
    full: d.full,
    duplicate: d.applied,
  } as const;

  let action: React.ReactNode;
  if (role === "company") {
    action = (
      <p className="flex items-start gap-2 text-sm text-ink-muted">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        {d.companyCannotApply}
      </p>
    );
  } else if (block === "duplicate") {
    action = (
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 font-bold text-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          {d.applied}
        </p>
        <LinkButton href="/students" variant="secondary" className="w-full">
          {d.viewApplication}
        </LinkButton>
      </div>
    );
  } else if (block) {
    action = (
      <div className="flex flex-col gap-2">
        <Button className="w-full" disabled>
          {d.apply}
        </Button>
        <p className="text-center text-sm font-semibold text-danger">{blockText[block]}</p>
      </div>
    );
  } else if (!session) {
    action = (
      <div className="flex flex-col gap-2">
        <LinkButton href={`${loginPath("student", applyHref)}&tab=register`} variant="accent" size="lg" className="w-full">
          {d.apply}
        </LinkButton>
        <p className="text-center text-sm text-ink-muted">{d.loginToApply}</p>
      </div>
    );
  } else {
    action = (
      <LinkButton href={applyHref} variant="accent" size="lg" className="w-full">
        {d.apply}
      </LinkButton>
    );
  }

  return (
    <Container className="pb-32 pt-8 sm:pt-10 lg:pb-16">
      <Link
        href={role === "company" ? "/uznemums" : "/prakses"}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {role === "company" ? t.applications.backToDashboard : d.backToList}
      </Link>
      <PlacementDetailView placement={placement} applications={applications} showContact={showContact} action={action} />
    </Container>
  );
}
