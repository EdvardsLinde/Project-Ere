"use client";

import { MapPin, Presentation } from "lucide-react";
import Link from "next/link";
import type { Exhibitor } from "@/lib/data/types";
import { sectorLabel } from "@/lib/fair/labels";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";
import { ExhibitorBadges } from "./badges";

/** Stand number and size, e.g. "Stends 12 · S stends". */
export function StandLine({ exhibitor: e }: { exhibitor: Exhibitor }) {
  const { t } = useI18n();
  const x = t.exhibitors;
  const size = fmt(x.sizeLabel, { size: t.options.standSize[e.stand.size] });
  return (
    <span className="inline-flex items-center gap-1.5">
      <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
      {e.stand.number !== undefined ? fmt(x.stand, { n: e.stand.number }) : x.standNoNumber}
      <span aria-hidden="true">·</span>
      {size}
    </span>
  );
}

/** Exhibitor directory card. `preview` = the booking form's live preview (no link). */
export function ExhibitorCard({ exhibitor: e, preview = false, headingLevel = "h2" }: { exhibitor: Exhibitor; preview?: boolean; headingLevel?: "h2" | "h3" }) {
  const { t, locale } = useI18n();
  const Heading = headingLevel;
  const showcase = tx(e.showcase, locale);
  return (
    <article
      className={`group relative flex h-full flex-col rounded-lg border border-edge bg-surface p-5 shadow-card transition duration-150 ${
        preview ? "" : "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift"
      }`}
    >
      <div className="flex items-start gap-3">
        {e.logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- uploaded data URL
          <img src={e.logoDataUrl} alt="" className="size-12 shrink-0 rounded-full border border-edge bg-white object-contain" />
        ) : null}
        <div className="min-w-0 flex-1">
          <ExhibitorBadges exhibitor={e} />
          <p className="mt-2 text-sm font-semibold text-accent-ink">{sectorLabel(e, locale) || "—"}</p>
          <Heading className="mt-1 text-xl font-extrabold leading-snug">{e.name || "—"}</Heading>
        </div>
      </div>
      {showcase && (
        <p className="mt-3 flex gap-2 text-[0.95rem] text-ink-muted">
          <Presentation className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="sr-only">{t.exhibitors.showcase}: </span>
            {showcase}
          </span>
        </p>
      )}
      <p className="mt-auto border-t border-dashed border-line pt-3 text-sm font-semibold">
        <StandLine exhibitor={e} />
      </p>
      {!preview && (
        <Link href={`/exhibitors/${e.id}`} className="absolute inset-0 rounded-lg" aria-label={`${t.common.details}: ${e.name}`} />
      )}
    </article>
  );
}
