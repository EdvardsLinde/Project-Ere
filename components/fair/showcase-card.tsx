"use client";

import { Coins, MapPin, Sprout, Target } from "lucide-react";
import Link from "next/link";
import type { Exhibitor, Investment } from "@/lib/data/types";
import { sectorLabel } from "@/lib/fair/labels";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";
import { ExhibitorBadges } from "./badges";

/** Investment showcase card: project, sector, stage, amount, purpose and location. */
export function ShowcaseCard({ exhibitor: e }: { exhibitor: Exhibitor & { investment: Investment } }) {
  const { t, locale } = useI18n();
  const s = t.showcase;
  const inv = e.investment;
  const row = "flex items-start gap-2";
  return (
    <article className="group relative flex h-full flex-col rounded-lg border-2 border-edge bg-surface p-5 shadow-card transition duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift">
      <ExhibitorBadges exhibitor={e} showSeeking={false} />
      <p className="mt-2 text-sm font-semibold text-accent-ink">{sectorLabel(e, locale)}</p>
      <h2 className="mt-1 text-xl font-extrabold leading-snug">{e.name}</h2>
      <p className="mt-3 w-fit rounded-full bg-primary-fill px-3 py-1 font-display text-lg font-extrabold text-white">
        <span className="sr-only">{s.amount}: </span>
        {t.options.amount[inv.amountRange]}
      </p>
      <dl className="mt-4 space-y-2 text-[0.95rem]">
        <div className={row}>
          <dt>
            <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="sr-only">{s.purpose}</span>
          </dt>
          <dd>{tx(inv.purpose, locale)}</dd>
        </div>
        <div className={row}>
          <dt>
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="sr-only">{s.where}</span>
          </dt>
          <dd>{tx(inv.where, locale)}</dd>
        </div>
        <div className={row}>
          <dt>
            <Sprout className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="sr-only">{s.stage}</span>
          </dt>
          <dd>{t.options.stage[inv.stage]}</dd>
        </div>
        {tx(inv.offer, locale) && (
          <div className={row}>
            <dt>
              <Coins className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="sr-only">{s.offer}</span>
            </dt>
            <dd className="text-ink-muted">{tx(inv.offer, locale)}</dd>
          </div>
        )}
      </dl>
      <Link href={`/investment/${e.id}`} className="absolute inset-0 rounded-lg" aria-label={`${t.common.details}: ${e.name}`} />
    </article>
  );
}
