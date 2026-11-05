"use client";

import { ArrowLeft, ArrowRight, CalendarDays, Globe, Presentation, Sparkles, Target, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StandLine } from "@/components/fair/exhibitor-card";
import { ExhibitorBadges } from "@/components/fair/badges";
import { LinkButton } from "@/components/ui/button";
import { Card, Chip, Container, EmptyState, ExternalLink, Loading } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import type { Exhibitor } from "@/lib/data/types";
import { sectorLabel } from "@/lib/fair/labels";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

/** Goal ids of either kind (paid exhibitor or innovator) to their label. */
function goalLabel(goal: Exhibitor["goals"][number], t: ReturnType<typeof useI18n>["t"]): string {
  return goal in t.options.exhibitorGoal
    ? t.options.exhibitorGoal[goal as keyof typeof t.options.exhibitorGoal]
    : t.options.innovatorGoal[goal as keyof typeof t.options.innovatorGoal];
}

export default function ExhibitorPage() {
  const { t, locale } = useI18n();
  const x = t.exhibitors;
  const { id } = useParams<{ id: string }>();
  const { data: e, loading } = useQuery((repo) => repo.getExhibitor(id), [id]);

  if (loading) return <Loading label={t.common.loading} />;
  if (!e || e.status === "rejected") {
    return (
      <Container className="py-20">
        <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} action={<LinkButton href="/exhibitors">{x.backToList}</LinkButton>} />
      </Container>
    );
  }

  const row = "flex items-start gap-3";
  return (
    <Container className="py-10 sm:py-14">
      <Link href="/exhibitors" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {x.backToList}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <ExhibitorBadges exhibitor={e} />
          <p className="mt-4 font-bold text-accent-ink">{sectorLabel(e, locale)}</p>
          <div className="mt-1 flex items-center gap-4">
            {e.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- uploaded data URL
              <img src={e.logoDataUrl} alt="" className="size-16 rounded-full border border-edge bg-white object-contain" />
            )}
            <h1 className="text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{e.name}</h1>
          </div>

          <section className="mt-8" aria-labelledby="showcase-title">
            <h2 id="showcase-title" className="flex items-center gap-2 text-xl font-extrabold">
              <Presentation className="size-5 text-primary" aria-hidden="true" />
              {x.showcase}
            </h2>
            <p className="mt-2 text-lg leading-relaxed">{tx(e.showcase, locale)}</p>
          </section>
          <section className="mt-8" aria-labelledby="about-title">
            <h2 id="about-title" className="flex items-center gap-2 text-xl font-extrabold">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              {x.about}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-muted">{tx(e.description, locale)}</p>
          </section>
          {e.goals.length > 0 && (
            <section className="mt-8" aria-labelledby="goals-title">
              <h2 id="goals-title" className="flex items-center gap-2 text-xl font-extrabold">
                <Target className="size-5 text-primary" aria-hidden="true" />
                {x.goals}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {e.goals.map((g) => (
                  <li key={g}>
                    <Chip>{goalLabel(g, t)}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4 p-5">
            <p className="font-semibold">
              <StandLine exhibitor={e} />
            </p>
            <p className={row}>
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="sr-only">{x.days}: </span>
                {e.stand.days.map((d) => fmt(t.common.day, { n: d })).join(", ")}
              </span>
            </p>
            {e.team && (
              <p className={row}>
                <Users className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{x.team}: </span>
                  {e.team}
                </span>
              </p>
            )}
            {e.stage && (
              <p className={row}>
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{x.stage}: </span>
                  {t.options.stage[e.stage]}
                </span>
              </p>
            )}
            {e.website && (
              <p className={row}>
                <Globe className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <ExternalLink href={e.website.startsWith("http") ? e.website : `https://${e.website}`} newTabLabel={t.common.opensInNewTab}>
                  {e.website.replace(/^https?:\/\//, "")}
                </ExternalLink>
              </p>
            )}
            {e.investment && (
              <LinkButton href={`/investment/${e.id}`} className="w-full whitespace-normal">
                {x.toShowcase}
                <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
            )}
          </Card>
        </aside>
      </div>
    </Container>
  );
}
