"use client";

import {
  Award,
  Building2,
  CalendarDays,
  CheckCheck,
  Copy,
  ExternalLink as ExternalIcon,
  FileText,
  Inbox,
  Lock,
  LockOpen,
  MapPin,
  Pencil,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { OverflowMenu, type MenuItem } from "@/components/ui/menu";
import { Card, Container, EmptyState, Loading, PageHeader } from "@/components/ui/misc";
import { PlacementStatusBadge, publicText } from "@/components/placement/display";
import { useToast } from "@/components/toast";
import { formatDate, formatRange } from "@/lib/dates";
import { getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import type { Placement } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { industryLabel, tx } from "@/lib/placements";
import { useRoleGuard, useSession } from "@/lib/session";

export default function CompanyDashboard() {
  const { t, locale } = useI18n();
  const allowed = useRoleGuard(["company"], "company");
  const { session } = useSession();
  const toast = useToast();
  const companyId = session?.company?.id ?? null;
  const [toDelete, setToDelete] = useState<Placement | null>(null);

  const { data, loading } = useQuery(
    async (repo) => {
      if (!companyId) return null;
      const [placements, applications] = await Promise.all([
        repo.listCompanyPlacements(companyId),
        repo.listCompanyApplications(companyId),
      ]);
      return { placements, applications };
    },
    [companyId],
  );

  if (!allowed || loading || !data || !session?.company) return <Loading label={t.common.loading} />;

  const c = t.company;
  const company = session.company;
  const { placements, applications } = data;
  const stats = [
    { label: c.stats.published, value: placements.filter((p) => p.status === "published").length, icon: Send },
    { label: c.stats.newApplications, value: applications.filter((a) => a.status === "new").length, icon: Inbox },
    { label: c.stats.completed, value: placements.filter((p) => p.status === "finished").length, icon: CheckCheck },
    { label: c.stats.certificates, value: applications.filter((a) => a.certificateId).length, icon: Award },
  ];
  const repo = getRepository();

  const actionsFor = (p: Placement): MenuItem[] => {
    const items: MenuItem[] = [
      {
        label: c.actions.duplicate,
        icon: <Copy className="size-4" aria-hidden="true" />,
        onSelect: async () => {
          await repo.duplicatePlacement(p.id);
          toast(c.duplicated);
        },
      },
    ];
    if (p.status !== "draft") items.push({ label: c.actions.view, icon: <ExternalIcon className="size-4" aria-hidden="true" />, href: `/prakses/${p.id}` });
    if (p.status === "published")
      items.push({ label: c.actions.close, icon: <Lock className="size-4" aria-hidden="true" />, onSelect: () => repo.setPlacementStatus(p.id, "closed") });
    if (p.status === "closed")
      items.push({ label: c.actions.reopen, icon: <LockOpen className="size-4" aria-hidden="true" />, onSelect: () => repo.setPlacementStatus(p.id, "published") });
    if (p.status === "published" || p.status === "closed")
      items.push({ label: c.actions.finish, icon: <CheckCheck className="size-4" aria-hidden="true" />, onSelect: () => repo.setPlacementStatus(p.id, "finished") });
    items.push({ label: c.actions.delete, icon: <Trash2 className="size-4" aria-hidden="true" />, danger: true, onSelect: () => setToDelete(p) });
    return items;
  };

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow={company.name}
        title={c.title}
        lead={c.lead}
        actions={
          <LinkButton href="/uznemums/prakses/jauna" variant="accent" size="lg">
            <Plus className="size-5" aria-hidden="true" />
            {c.addPlacement}
          </LinkButton>
        }
      />

      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card as="li" key={s.label} className="p-4 sm:p-5">
            <s.icon className="size-5 text-accent-ink" aria-hidden="true" />
            <p className="mt-3 text-3xl font-extrabold tabular-nums">{s.value}</p>
            <p className="text-sm font-semibold text-ink-muted">{s.label}</p>
          </Card>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-labelledby="list-title">
          <h2 id="list-title" className="text-xl font-extrabold">
            {c.listTitle}
          </h2>
          {placements.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={<FileText className="size-10" aria-hidden="true" />}
                title={c.empty}
                action={
                  <LinkButton href="/uznemums/prakses/jauna" variant="accent">
                    <Plus className="size-4" aria-hidden="true" />
                    {c.addPlacement}
                  </LinkButton>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {placements.map((p) => {
                const apps = applications.filter((a) => a.placementId === p.id);
                const newCount = apps.filter((a) => a.status === "new").length;
                const terms = [...p.terms].sort((a, b) => a.start.localeCompare(b.start));
                return (
                  <Card as="li" key={p.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <PlacementStatusBadge status={p.status} />
                        <h3 className="mt-2 text-lg font-extrabold leading-snug">{tx(p.title, locale) || "—"}</h3>
                      </div>
                      <OverflowMenu label={`${c.actions.more}: ${tx(p.title, locale)}`} items={actionsFor(p)} />
                    </div>
                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">{c.columns.dates}</dt>
                        <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                        <dd>{terms.length ? terms.map((x) => formatRange(x.start, x.end, locale)).join("; ") : c.noDates}</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">{c.columns.applications}</dt>
                        <Users className="size-4 text-primary" aria-hidden="true" />
                        <dd>
                          {fmt(c.applicationsCount, { n: apps.length, new: newCount })}
                        </dd>
                      </div>
                      <div className="flex gap-1.5 text-ink-muted">
                        <dt>{c.columns.updated}:</dt>
                        <dd>{formatDate(p.updatedAt.slice(0, 10), locale)}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <LinkButton href={`/uznemums/prakses/${p.id}/rediget`} variant="secondary" size="sm">
                        <Pencil className="size-4" aria-hidden="true" />
                        {c.actions.edit}
                      </LinkButton>
                      {p.status !== "draft" && (
                        <LinkButton href={`/uznemums/prakses/${p.id}/pieteikumi`} variant={newCount ? "primary" : "secondary"} size="sm">
                          <Inbox className="size-4" aria-hidden="true" />
                          {c.actions.applications}
                          {newCount > 0 && (
                            <span className="rounded-full bg-accent px-1.5 text-xs font-extrabold text-on-accent">{newCount}</span>
                          )}
                        </LinkButton>
                      )}
                    </div>
                  </Card>
                );
              })}
            </ul>
          )}
        </section>

        <aside aria-labelledby="company-title">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- base64 data URL
                <img src={company.logo} alt="" className="size-12 rounded-md border border-line object-contain p-1" />
              ) : (
                <span className="flex size-12 items-center justify-center rounded-md bg-accent-soft text-accent-ink">
                  <Building2 className="size-6" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <h2 id="company-title" className="truncate font-extrabold">
                  {company.name}
                </h2>
                {company.industry && <p className="text-sm text-ink-muted">{industryLabel(company.industry, locale)}</p>}
              </div>
            </div>
            {tx(company.description, locale) && <p className="mt-4 line-clamp-4 text-sm">{tx(company.description, locale)}</p>}
            {company.address.town && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin className="size-4" aria-hidden="true" />
                {[publicText(company.address.street), company.address.town].filter(Boolean).join(", ")}
              </p>
            )}
            <LinkButton href="/profils" variant="secondary" size="sm" className="mt-5 w-full">
              {c.editProfile}
            </LinkButton>
          </Card>
        </aside>
      </div>

      <Dialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title={c.actions.delete}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)}>
              {t.common.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (toDelete) await repo.deletePlacement(toDelete.id);
                setToDelete(null);
              }}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {t.common.delete}
            </Button>
          </>
        }
      >
        <p>{toDelete && fmt(c.deleteConfirm, { title: tx(toDelete.title, locale) })}</p>
      </Dialog>
    </Container>
  );
}
