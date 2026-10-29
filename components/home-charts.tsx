"use client";

import { TrendingUp } from "lucide-react";
import { ExternalLink } from "@/components/ui/misc";
import type { Locale } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";

/*
 * Small charts for the home page "Why now" section. Emphasis form: the point
 * of each chart (Latvia, Saldus) is the fill blue, context is muted grey, a
 * target is a gold dashed line. Values are labelled directly at the bar ends;
 * each figure carries a text summary for screen readers.
 */

const nf = (locale: Locale, digits = 0) =>
  new Intl.NumberFormat(locale === "lv" ? "lv-LV" : "en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function ChartCard({
  title,
  summary,
  source,
  url,
  children,
  className = "",
}: {
  title: string;
  summary: string;
  source: string;
  url: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <figure className={`flex flex-col rounded-lg border border-line bg-surface p-5 shadow-card ${className}`}>
      <figcaption className="font-bold leading-snug">
        {title}
        <span className="sr-only">. {summary}</span>
      </figcaption>
      <div className="mt-5 flex-1" aria-hidden="true">
        {children}
      </div>
      <p className="mt-4 text-xs text-ink-muted">
        {t.home.why.source}:{" "}
        <ExternalLink href={url} newTabLabel={t.common.opensInNewTab}>
          {source}
        </ExternalLink>
      </p>
    </figure>
  );
}

/** Grid: label column, bar track, value column. Bars are drawn to scale within the track. */
const BAR_GRID = "grid grid-cols-[8.25rem_1fr_3.75rem] items-center gap-3";
/** Left edge of the track and its width, for placing marks such as a target line. */
const TRACK_LEFT = "9rem"; // 8.25rem label + 0.75rem gap
const TRACK_WIDTH = "(100% - 13.5rem)"; // minus label, value column and two gaps

/** Horizontal bar; `share` is 0–1 of the track. */
function Bar({ share, label, value, strong }: { share: number; label: string; value: string; strong?: boolean }) {
  return (
    <div className={`${BAR_GRID} text-sm`} title={`${label}: ${value}`}>
      <span className={`truncate ${strong ? "font-bold" : "text-ink-muted"}`}>{label}</span>
      <div className="h-3.5">
        <div className={`h-full rounded-r-[4px] ${strong ? "bg-primary-fill" : "bg-ink-muted/35"}`} style={{ width: `${share * 100}%` }} />
      </div>
      <span className={`tabular-nums ${strong ? "font-extrabold" : "font-semibold text-ink-muted"}`}>{value}</span>
    </div>
  );
}

export function SkillsChart() {
  const { t, locale } = useI18n();
  const s = t.home.why.skills;
  const pct = (v: number) => `${nf(locale, 2).format(v)}%`;
  return (
    <ChartCard title={s.title} summary={s.summary} source={s.sourceName} url={s.url}>
      <div className="relative space-y-3">
        <Bar share={0.4843} label={s.latvia} value={pct(48.43)} strong />
        <Bar share={0.604} label={s.eu} value={pct(60.4)} />
        {/* 2030 target: 80% along the same track the bars use. */}
        <div
          className="pointer-events-none absolute -bottom-2 -top-2 border-l-2 border-dashed border-accent"
          style={{ left: `calc(${TRACK_LEFT} + ${TRACK_WIDTH} * 0.8)` }}
        />
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent-ink">
        <span className="inline-block h-3 border-l-2 border-dashed border-accent" />
        {s.target}: 80%
      </p>
    </ChartCard>
  );
}

export function YouthChart() {
  const { t, locale } = useI18n();
  const y = t.home.why.youth;
  const max = Math.max(...y.values);
  return (
    <ChartCard title={y.title} summary={y.summary} source={y.sourceName} url={y.url}>
      <div className="space-y-2.5">
        {y.places.map((place, i) => (
          <Bar key={place} share={y.values[i] / max} label={place} value={nf(locale).format(y.values[i])} strong={i === 0} />
        ))}
      </div>
    </ChartCard>
  );
}

export function IctMeter() {
  const { t, locale } = useI18n();
  const m = t.home.why.ict;
  const now = 4.5;
  const target = 10;
  return (
    <ChartCard title={m.title} summary={m.summary} source={m.sourceName} url={m.url}>
      <div className="flex items-end justify-between">
        <p className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-primary tabular-nums">{nf(locale, 1).format(now)}%</span>
          <span className="text-sm font-semibold text-ink-muted">{m.now}</span>
        </p>
        <p className="pb-1 text-sm font-semibold text-accent-ink">
          {m.target}: {nf(locale).format(target)}%
        </p>
      </div>
      <div className="relative mt-3 h-3.5 rounded-[4px] bg-surface-muted" title={m.summary}>
        <div className="h-full rounded-[4px] bg-primary-fill" style={{ width: `${(now / target) * 100}%` }} />
        <div className="absolute -bottom-1.5 -top-1.5 right-0 border-l-2 border-dashed border-accent" />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-muted tabular-nums">
        <span>0%</span>
        <span>{nf(locale).format(target)}%</span>
      </div>
    </ChartCard>
  );
}

export function SupportStat() {
  const { t } = useI18n();
  const s = t.home.why.support;
  return (
    <ChartCard title={s.label} summary={s.value} source={s.sourceName} url={s.url} className="justify-between">
      <div className="flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft">
          <TrendingUp className="size-8 text-accent-ink" />
        </span>
        <p className="text-5xl font-extrabold tracking-tight text-primary tabular-nums">{s.value}</p>
      </div>
    </ChartCard>
  );
}
