"use client";

import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { formatDate, formatRange } from "@/lib/dates";
import type { Application, Placement } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { focusLabel, freeSpots, industryLabel, nextDeadline, termDeadline, totalFreeSpots, tx, upcomingTerms } from "@/lib/placements";
import { BeginnerBadge, placementLocation, SampleBadge } from "./display";

interface Props {
  placement: Placement;
  applications: Application[];
  /** Builder preview: render without a link and with all terms (drafts may have past dates). */
  preview?: boolean;
  headingLevel?: "h2" | "h3";
}

export function PlacementCard({ placement: p, applications, preview, headingLevel: H = "h2" }: Props) {
  const { t, locale } = useI18n();
  const terms = preview ? [...p.terms].sort((a, b) => a.start.localeCompare(b.start)) : upcomingTerms(p);
  const free = preview ? terms.reduce((s, x) => s + x.spots, 0) : totalFreeSpots(p, applications);
  const title = tx(p.title, locale) || "—";
  const location = placementLocation(p);
  const deadline = preview ? (terms[0]?.start ? termDeadline(terms[0], p) : null) : nextDeadline(p);
  const tags = [...p.tools, ...p.skillsRequired.map((s) => tx(s, locale))].slice(0, 5);

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {p.isSample && <SampleBadge />}
        {p.beginnerFriendly && <BeginnerBadge />}
      </div>
      <p className="mt-3 text-sm font-bold text-ink-muted">{p.company.name || "—"}</p>
      <H className="mt-0.5 text-lg font-extrabold leading-snug text-ink group-hover:text-primary">{title}</H>
      <p className="mt-2 flex flex-wrap gap-x-2 text-sm text-ink-muted">
        {p.focusArea && <span className="font-semibold text-accent-ink">{focusLabel(p.focusArea, locale)}</span>}
        {p.focusArea && p.company.industry && <span aria-hidden="true">·</span>}
        {p.company.industry && <span>{industryLabel(p.company.industry, locale)}</span>}
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm min-[420px]:grid-cols-2">
        <div className="flex items-center gap-2">
          <dt className="sr-only">{t.catalogue.length}</dt>
          <Clock className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <dd>{fmt(t.common.workingDays, { n: p.lengthDays })}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">{t.catalogue.location}</dt>
          <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <dd>{location || t.common.notSpecified}</dd>
        </div>
        <div className="flex items-start gap-2 min-[420px]:col-span-2">
          <dt className="sr-only">{t.catalogue.nextDates}</dt>
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <dd>
            {terms.length === 0 ? (
              <span className="text-ink-muted">{t.catalogue.noUpcoming}</span>
            ) : (
              <ul>
                {terms.slice(0, 2).map((term) => (
                  <li key={term.id}>
                    {formatRange(term.start, term.end, locale)}
                    {!preview && (
                      <span className="text-ink-muted"> · {fmt(t.common.spotsFree, { n: freeSpots(term, applications) })}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
        {terms.length > 0 && (
        <div className="flex items-center gap-2">
          <dt className="sr-only">{t.common.spotsFree}</dt>
          <Users className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <dd className={free === 0 ? "font-semibold text-danger" : "font-semibold"}>
            {free === 0 ? t.common.noSpots : fmt(t.common.spotsFree, { n: free })}
          </dd>
        </div>
        )}
      </dl>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t.detail.tools}>
          {tags.map((tag) => (
            <li key={tag} className="rounded-sm bg-surface-muted px-2 py-0.5 text-xs font-semibold text-ink-muted">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {deadline && (
        <p className="mt-auto border-t border-dashed border-line pt-3 text-sm text-ink-muted">
          {fmt(t.catalogue.deadline, { date: formatDate(deadline, locale) })}
        </p>
      )}
    </>
  );

  const cls =
    "group relative flex h-full flex-col rounded-lg border border-line bg-surface p-5 shadow-card transition duration-150";

  if (preview) return <article className={cls}>{body}</article>;

  return (
    <article className={`${cls} hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lift`}>
      {body}
      <Link
        href={`/prakses/${p.id}`}
        className="absolute inset-0 rounded-lg"
        aria-label={`${t.catalogue.details}: ${title}, ${p.company.name}`}
      />
    </article>
  );
}
