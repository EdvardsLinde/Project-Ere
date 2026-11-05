"use client";

import { Building2, CalendarClock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/misc";
import type { Challenge } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";
import { ExampleBadge } from "./badges";

/** School challenge card: company, field, problem, what the company provides and the timeline. */
export function ChallengeCard({ challenge: c }: { challenge: Challenge }) {
  const { t, locale } = useI18n();
  const x = t.challenges;
  return (
    <article className="group relative flex h-full flex-col rounded-lg border-2 border-edge bg-surface p-5 shadow-card transition duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex flex-wrap gap-1.5">
        {c.isExample && <ExampleBadge />}
        <Badge tone="primary">{t.options.field[c.field]}</Badge>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-accent-ink">
        <Building2 className="size-4" aria-hidden="true" />
        {tx(c.company, locale)}
      </p>
      <h2 className="mt-1 text-lg font-extrabold leading-snug">{tx(c.problem, locale)}</h2>
      <p className="mt-3 text-[0.95rem] text-ink-muted">
        <span className="font-semibold text-ink">{x.provides}: </span>
        {tx(c.provides, locale)}
      </p>
      <p className="mt-auto flex items-start gap-1.5 border-t border-dashed border-line pt-3 text-sm font-semibold">
        <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <span className="sr-only">{x.timeline}: </span>
          {tx(c.timeline, locale)}
        </span>
      </p>
      <Link href={`/challenges/${c.id}`} className="absolute inset-0 rounded-lg" aria-label={`${t.common.details}: ${tx(c.problem, locale)}`} />
    </article>
  );
}
