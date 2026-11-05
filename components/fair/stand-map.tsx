"use client";

import { Check, Clock, DoorOpen, Lightbulb, Lock } from "lucide-react";
import Link from "next/link";
import { hallStands, innovatorStandLimit, type StandSize } from "@/config/event";
import type { Exhibitor } from "@/lib/data/types";
import { innovatorSpotsLeft, standStates, type StandState } from "@/lib/fair/stands";
import { fmt, useI18n } from "@/lib/i18n";

/** L takes 2×2 cells, M 2×1, S 1×1 on a 6-column grid. */
const SPAN: Record<Exclude<StandSize, "innovator">, string> = {
  L: "col-span-2 row-span-2 min-h-24",
  M: "col-span-2 min-h-11",
  S: "min-h-11",
};

/** Taken stands also get an icon, so the state is not shown by colour alone. */
const STATE_ICON: Partial<Record<StandState, typeof Lock>> = { reserved: Clock, sold: Lock };

const STATE_CLASS: Record<StandState, string> = {
  free: "border-primary/50 bg-surface text-ink",
  reserved: "border-accent bg-accent text-on-accent",
  sold: "border-primary-fill bg-primary-fill text-white",
};

interface Props {
  exhibitors: Pick<Exhibitor, "stand" | "status">[];
  /**
   * `link`: free stands link to the booking form (stands page).
   * `pick`: free stands of `size` are buttons that call `onPick` (booking form).
   */
  mode: "link" | "pick";
  size?: StandSize | "";
  selected?: number | null;
  onPick?: (number: number) => void;
  /** Show the innovator zone with its free places. */
  showInnovatorZone?: boolean;
}

export function StandMap({ exhibitors, mode, size, selected, onPick, showInnovatorZone = true }: Props) {
  const { t } = useI18n();
  const s = t.stands;
  const states = standStates(exhibitors);
  const spotsLeft = innovatorSpotsLeft(exhibitors);

  return (
    <div>
      <ul className="grid grid-flow-dense grid-cols-6 gap-1.5 sm:gap-2" aria-label={s.mapTitle}>
        {hallStands.map((stand) => {
          const state = states.get(stand.number) ?? "free";
          const label = fmt(s.standAria, {
            n: stand.number,
            size: t.options.standSize[stand.size],
            state: t.options.standState[state].toLowerCase(),
          });
          const isSelected = selected === stand.number;
          const pickable = mode === "pick" && state === "free" && (!size || size === stand.size);
          const dimmed = mode === "pick" && size && size !== stand.size;
          const tile = `relative flex h-full w-full flex-col items-center justify-center rounded-md border-[1.5px] p-1 text-center transition ${STATE_CLASS[state]} ${
            dimmed ? "opacity-35" : ""
          } ${isSelected ? "outline-3 outline-offset-2 outline-primary" : ""}`;
          const StateIcon = STATE_ICON[state];
          const content = (
            <>
              {StateIcon && <StateIcon className="absolute left-1 top-1 size-3 opacity-80" aria-hidden="true" />}
              <span className="font-display text-base font-extrabold leading-none sm:text-lg">{stand.number}</span>
              <span className="mt-0.5 text-[0.65rem] font-bold uppercase leading-none opacity-80">{stand.size}</span>
              {isSelected && (
                <Check className="absolute right-0.5 top-0.5 size-3.5 rounded-full bg-primary-fill p-0.5 text-white" aria-hidden="true" />
              )}
            </>
          );
          return (
            <li key={stand.number} className={SPAN[stand.size]}>
              {mode === "link" && state === "free" ? (
                <Link href={`/apply/stand?stand=${stand.number}`} aria-label={label} className={`${tile} hover:-translate-y-0.5 hover:shadow-card`}>
                  {content}
                </Link>
              ) : pickable ? (
                <button
                  type="button"
                  aria-label={label}
                  aria-pressed={isSelected}
                  onClick={() => onPick?.(stand.number)}
                  className={`${tile} hover:-translate-y-0.5 hover:shadow-card`}
                >
                  {content}
                </button>
              ) : (
                <span role="img" aria-label={label} className={tile}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-2 grid grid-cols-6 gap-1.5 sm:gap-2">
        <p className="col-span-2 flex items-center justify-center gap-1.5 rounded-md border border-dashed border-line py-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
          <DoorOpen className="size-4" aria-hidden="true" />
          {s.entrance}
        </p>
        {showInnovatorZone && (
          <p className="col-span-4 flex items-center gap-2 rounded-md border border-edge bg-primary-soft px-3 py-2 text-sm">
            <Lightbulb className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="font-bold">{s.innovatorZone}</span>
              <span className="text-ink-muted"> · {fmt(s.innovatorZoneText, { n: spotsLeft, total: innovatorStandLimit })}</span>
            </span>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label={s.legend} role="group">
        {(["free", "reserved", "sold"] as const).map((state) => {
          const Icon = STATE_ICON[state];
          return (
            <span key={state} className="inline-flex items-center gap-1.5 font-semibold">
              <span className={`flex size-5 items-center justify-center rounded-[4px] border ${STATE_CLASS[state]}`} aria-hidden="true">
                {Icon && <Icon className="size-3" />}
              </span>
              {t.options.standState[state]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
