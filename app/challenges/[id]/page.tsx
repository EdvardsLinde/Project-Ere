"use client";

import { ArrowLeft, Building2, CalendarClock, Gift, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExampleBadge } from "@/components/fair/badges";
import { LinkButton } from "@/components/ui/button";
import { Badge, Card, Container, EmptyState, Loading } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

export default function ChallengePage() {
  const { t, locale } = useI18n();
  const c = t.challenges;
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(async (repo) => ({ ch: await repo.getChallenge(id), teams: await repo.listTeams() }), [id]);

  if (loading) return <Loading label={t.common.loading} />;
  const ch = data?.ch;
  if (!ch) {
    return (
      <Container className="py-20">
        <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} action={<LinkButton href="/challenges">{c.backToList}</LinkButton>} />
      </Container>
    );
  }
  const applied = data.teams.filter((team) => team.challengeId === ch.id).length;

  return (
    <Container className="max-w-4xl py-10 sm:py-14">
      <Link href="/challenges" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {c.backToList}
      </Link>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {ch.isExample && <ExampleBadge />}
        <Badge tone="primary">{t.options.field[ch.field]}</Badge>
      </div>
      <p className="mt-4 flex items-center gap-1.5 font-bold text-accent-ink">
        <Building2 className="size-5" aria-hidden="true" />
        {tx(ch.company, locale)}
      </p>
      <h1 className="mt-2 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">{tx(ch.problem, locale)}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">
            <Gift className="size-4 text-primary" aria-hidden="true" />
            {c.provides}
          </h2>
          <p className="mt-2 font-semibold leading-snug">{tx(ch.provides, locale)}</p>
        </Card>
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">
            <CalendarClock className="size-4 text-primary" aria-hidden="true" />
            {c.timeline}
          </h2>
          <p className="mt-2 font-semibold leading-snug">{tx(ch.timeline, locale)}</p>
        </Card>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <LinkButton href={`/challenges/${ch.id}/apply`} variant="accent" size="lg">
          {c.apply}
        </LinkButton>
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
          <Users className="size-4" aria-hidden="true" />
          {fmt(c.teamsApplied, { n: applied })}
        </p>
      </div>
    </Container>
  );
}
