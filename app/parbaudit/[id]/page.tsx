"use client";

import { BadgeCheck, ShieldX } from "lucide-react";
import { useParams } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { Card, Container, Loading, Notice } from "@/components/ui/misc";
import { formatDate, formatRange } from "@/lib/dates";
import { useQuery } from "@/lib/data/hooks";
import { useI18n } from "@/lib/i18n";
import { averageScore, focusLabel, tx } from "@/lib/placements";

export default function VerifyResultPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = decodeURIComponent(rawId).toUpperCase();
  const { t, locale } = useI18n();
  const { data: c, loading } = useQuery((repo) => repo.getCertificate(id), [id]);
  const v = t.verify;

  if (loading) return <Loading label={t.common.loading} />;

  return (
    <div className="bg-dots">
      <Container className="max-w-2xl py-14 sm:py-20">
        {c ? (
          <Card className="overflow-hidden">
            <div className="flex items-start gap-4 bg-success-soft px-6 py-5">
              <BadgeCheck className="size-9 shrink-0 text-success" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-extrabold text-success">{v.valid}</h1>
                <p className="mt-0.5">{v.validText}</p>
              </div>
            </div>
            <dl className="grid gap-x-6 gap-y-4 px-6 py-6 sm:grid-cols-2">
              {[
                [t.certificate.id, <span key="id" className="font-mono">{c.id}</span>],
                [v.participant, c.participantName],
                [v.company, c.companyName],
                [v.placement, `${tx(c.placementTitle, locale)} (${focusLabel(c.focusArea, locale)})`],
                [v.dates, formatRange(c.start, c.end, locale)],
                [v.issued, formatDate(c.issuedAt.slice(0, 10), locale)],
                [v.average, `${averageScore(c.evaluation)} / 5`],
                [t.certificate.mentor, c.mentor.name],
              ].map(([k, val], i) => (
                <div key={i}>
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{k}</dt>
                  <dd className="mt-0.5 font-bold">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2 border-t border-line px-6 py-4">
              <LinkButton href={`/sertifikats/${c.id}`}>{v.openCertificate}</LinkButton>
              <LinkButton href="/parbaudit" variant="secondary">
                {v.another}
              </LinkButton>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="flex items-start gap-4 bg-danger-soft px-6 py-5">
              <ShieldX className="size-9 shrink-0 text-danger" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-extrabold text-danger">{v.invalid}</h1>
                <p className="mt-0.5">{v.invalidText}</p>
                <p className="mt-2 font-mono text-sm font-bold">{id}</p>
              </div>
            </div>
            <div className="px-6 py-4">
              <LinkButton href="/parbaudit" variant="secondary">
                {v.another}
              </LinkButton>
            </div>
          </Card>
        )}
        <Notice tone="neutral" className="mt-6">
          <p className="text-sm">{v.demoNote}</p>
        </Notice>
      </Container>
    </div>
  );
}
