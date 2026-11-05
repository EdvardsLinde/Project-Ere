"use client";

import { eventConfig } from "@/config/event";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

/** Little stand map on the pass: S/M/L tiles in the fair's colours. Decorative. */
const MAP: { span: string; tone: string }[] = [
  { span: "col-span-2 row-span-2", tone: "bg-primary-fill" },
  { span: "col-span-2", tone: "bg-accent" },
  { span: "col-span-2", tone: "bg-surface-muted" },
  { span: "", tone: "bg-accent" },
  { span: "", tone: "bg-surface-muted" },
  { span: "", tone: "bg-primary-fill" },
  { span: "", tone: "bg-surface-muted" },
];

/** Hero visual: the fair's pass on paper with a double frame. Purely decorative. */
export function ExpoIllustration() {
  const { t, locale } = useI18n();
  const h = t.home.hero;
  const [first, ...rest] = eventConfig.name.split(" ");
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="paper relative -rotate-3 rounded-lg border-2 border-edge bg-surface p-3 shadow-lift">
        <div className="rounded-md border-[3px] border-ink p-1">
          <div className="relative rounded-[9px] border-2 border-primary px-6 pb-7 pt-6 text-center">
            <Corner className="left-1.5 top-1.5" />
            <Corner className="right-1.5 top-1.5" />
            <Corner className="bottom-1.5 left-1.5" />
            <Corner className="bottom-1.5 right-1.5" />
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink-muted">{h.cardKicker}</p>
            <p className="mt-1 font-display text-[1.9rem] font-extrabold uppercase leading-none tracking-[0.06em] text-primary">
              {first} <span className="text-ink">{rest.join(" ")}</span>
            </p>
            <div className="mx-auto mt-3 flex items-center justify-center gap-1.5">
              <span className="h-0.5 w-6 rounded-full bg-primary-fill" />
              <span className="size-2 rounded-full border-[1.5px] border-ink bg-accent" />
              <span className="h-0.5 w-6 rounded-full bg-primary-fill" />
            </div>
            <p className="mx-auto mt-3 w-fit border-b-4 border-accent px-2 font-display text-lg font-extrabold">{h.cardSectors}</p>
            <p className="mt-1.5 text-xs text-ink-muted">{h.cardParts}</p>
            <p className="mt-4 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{h.cardMap}</p>
            <div className="mx-auto mt-1.5 grid max-w-[13rem] grid-cols-6 grid-rows-2 gap-1">
              {MAP.map((m, i) => (
                <span key={i} className={`min-h-5 rounded-[3px] border border-ink/50 ${m.span} ${m.tone}`} />
              ))}
            </div>
            <p className="mt-4 border-t border-ink/30 pt-2 text-[0.65rem] font-semibold text-ink-muted">{tx(eventConfig.datesVenue, locale)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small primary dot with an accent centre in a frame corner. */
function Corner({ className }: { className: string }) {
  return (
    <span className={`absolute flex size-2.5 items-center justify-center rounded-full bg-primary-fill ${className}`}>
      <span className="size-1 rounded-full bg-accent" />
    </span>
  );
}
