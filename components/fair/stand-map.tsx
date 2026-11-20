"use client";

import { Check, Clock, DoorOpen, Lightbulb, Lock, Mic } from "lucide-react";
import Link from "next/link";
import { eventConfig, hallLayout, hallStands, innovatorStandLimit, type HallRect, type StandSize } from "@/config/event";
import type { Exhibitor } from "@/lib/data/types";
import { innovatorSpotsLeft, standStates, type StandState } from "@/lib/fair/stands";
import { fmt, useI18n } from "@/lib/i18n";

/** Taken stands also get an icon, so the state is not shown by colour alone. */
const STATE_ICON: Partial<Record<StandState, typeof Lock>> = { reserved: Clock, sold: Lock };

const STATE_CLASS: Record<StandState, string> = {
  free: "border-primary/50 bg-surface text-ink",
  reserved: "border-accent bg-accent text-on-accent",
  sold: "border-primary-fill bg-primary-fill text-white",
};

/** The grid sits inside the walls with this margin (percent of the hall's width / height). */
const INSET = 1.6;
const { cols, rows } = hallLayout;
const x = (col: number) => `calc(${INSET}% + ${(col / cols) * (100 - 2 * INSET)}%)`;
const y = (row: number) => `calc(${INSET}% + ${(row / rows) * (100 - 2 * INSET)}%)`;
const span = (n: number, of: number) => `${(n / of) * (100 - 2 * INSET)}%`;
const place = (r: HallRect): React.CSSProperties => ({ left: x(r.col), top: y(r.row), width: span(r.w, cols), height: span(r.h, rows) });

interface Props {
  exhibitors: Pick<Exhibitor, "stand" | "status">[];
  /**
   * `link`: free stands link to the booking form (home and stands page).
   * `pick`: free stands of `size` are buttons that call `onPick` (booking form).
   */
  mode: "link" | "pick";
  size?: StandSize | "";
  selected?: number | null;
  onPick?: (number: number) => void;
  /** Show how many innovator places are free, under the plan. */
  showInnovatorZone?: boolean;
}

/**
 * The hall plan at the venue (`hallLayout` in config/event.ts): paid stands along
 * the walls, the stage in the middle, innovator places between the stage and the
 * entrance. Free, reserved and sold come from the bookings.
 */
export function StandMap({ exhibitors, mode, size, selected, onPick, showInnovatorZone = true }: Props) {
  const { t } = useI18n();
  const s = t.stands;
  const states = standStates(exhibitors);
  const spotsLeft = innovatorSpotsLeft(exhibitors);
  const taken = innovatorStandLimit - spotsLeft;
  const { entrance, stage, innovatorZone } = hallLayout;

  return (
    <div>
      <div className={mode === "pick" ? "-mx-1 overflow-x-auto px-1 pb-2" : ""}>
        <div className={`@container relative ${mode === "pick" ? "min-w-[30rem]" : ""}`}>
          <div className="relative rounded-[4px] bg-surface-muted" style={{ aspectRatio: `${cols + 0.5} / ${rows + 0.5}` }}>
            {/* Walls, with a gap in the bottom wall for the entrance. */}
            <span className="absolute inset-x-0 top-0 h-0.5 bg-rule" aria-hidden="true" />
            <span className="absolute inset-y-0 left-0 w-0.5 bg-rule" aria-hidden="true" />
            <span className="absolute inset-y-0 right-0 w-0.5 bg-rule" aria-hidden="true" />
            <span className="absolute bottom-0 left-0 h-0.5 bg-rule" style={{ width: x(entrance.col) }} aria-hidden="true" />
            <span className="absolute bottom-0 right-0 h-0.5 bg-rule" style={{ left: x(entrance.col + entrance.w) }} aria-hidden="true" />

            {/* Stage. */}
            <div className="absolute p-[0.4cqw]" style={place(stage)}>
              <div className="flex h-full w-full flex-col items-center justify-center gap-[0.6cqw] rounded-[4px] bg-night text-on-night">
                <Mic className="size-[clamp(12px,2.4cqw,28px)]" aria-hidden="true" />
                <span className="text-[clamp(9px,1.7cqw,17px)] font-extrabold uppercase tracking-[0.08em]">{s.stage}</span>
              </div>
            </div>

            {/* Innovator places: filled squares are taken. */}
            <div
              className={`absolute p-[0.4cqw] ${mode === "pick" ? "opacity-40" : ""}`}
              style={place(innovatorZone)}
              role="img"
              aria-label={`${s.innovatorZone}: ${fmt(s.innovatorZoneText, { n: spotsLeft, total: innovatorStandLimit })}`}
            >
              <div className="grid h-full w-full grid-cols-8 grid-rows-2 gap-[0.3cqw]">
                {Array.from({ length: innovatorStandLimit }, (_, i) => (
                  <span
                    key={i}
                    className={`rounded-[2px] border ${i < taken ? "border-primary-fill bg-primary-fill" : "border-primary/50 bg-primary-soft"}`}
                  />
                ))}
              </div>
            </div>

            {/* Paid stands. */}
            <ul aria-label={s.mapTitle}>
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
                const tile = `relative flex h-full w-full flex-col items-center justify-center rounded-[4px] border-[1.5px] text-center transition ${STATE_CLASS[state]} ${
                  dimmed ? "opacity-35" : ""
                } ${isSelected ? "outline-3 outline-offset-1 outline-primary" : ""}`;
                const StateIcon = STATE_ICON[state];
                const content = (
                  <>
                    {StateIcon && (
                      <StateIcon className="absolute left-[8%] top-[8%] size-[clamp(7px,1.15cqw,13px)] opacity-80" aria-hidden="true" />
                    )}
                    <span className="font-display text-[clamp(10px,2.3cqw,20px)] font-extrabold leading-none">{stand.number}</span>
                    <span className="mt-[0.3cqw] text-[clamp(7px,1.15cqw,11px)] font-bold uppercase leading-none opacity-80">{stand.size}</span>
                    {isSelected && (
                      <Check
                        className="absolute right-[6%] top-[6%] size-[clamp(9px,1.4cqw,15px)] rounded-full bg-primary-fill p-[1px] text-white"
                        aria-hidden="true"
                      />
                    )}
                  </>
                );
                return (
                  <li key={stand.number} className="absolute p-[0.4cqw]" style={place(stand)}>
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
          </div>

          {/* Visitor seating along the front, with the entrance passage through it. */}
          <div className="relative mt-1.5 h-[clamp(26px,5.5cqw,48px)]">
            <span
              className="absolute inset-y-0 left-0 flex items-center justify-center overflow-hidden rounded-[3px] border border-line bg-[repeating-linear-gradient(to_bottom,var(--color-line)_0_1.5px,transparent_1.5px_6px)]"
              style={{ width: x(entrance.col) }}
            >
              <span className="whitespace-nowrap rounded-[2px] bg-bg px-1.5 text-[clamp(8px,1.1cqw,12px)] font-bold uppercase tracking-wide text-ink-muted">
                {s.seating}
              </span>
            </span>
            <span
              className="absolute inset-y-0 right-0 rounded-[3px] border border-line bg-[repeating-linear-gradient(to_bottom,var(--color-line)_0_1.5px,transparent_1.5px_6px)]"
              style={{ left: x(entrance.col + entrance.w) }}
              aria-hidden="true"
            />
            <span
              className="absolute inset-y-0 flex items-center justify-center gap-1 text-[clamp(8px,1.1cqw,12px)] font-bold uppercase tracking-wide text-ink-muted"
              style={{ left: x(entrance.col), width: span(entrance.w, cols) }}
            >
              <DoorOpen className="size-[clamp(10px,1.4cqw,15px)] shrink-0" aria-hidden="true" />
              {s.entrance}
            </span>
          </div>
        </div>
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
        {showInnovatorZone && (
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Lightbulb className="size-4 text-primary" aria-hidden="true" />
            {s.innovatorZone}: <span className="font-normal text-ink-muted">{fmt(s.innovatorPlacesShort, { n: spotsLeft, total: innovatorStandLimit })}</span>
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {eventConfig.venue} · {s.planNote}
      </p>
    </div>
  );
}
