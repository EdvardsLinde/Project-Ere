"use client";

import { CheckCircle2, Clock, DoorOpen, Lock, MapPin, Mic } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { eventConfig, innovatorStandLimit, sectors, standNeeds, type StandNeed, type StandSize } from "@/config/event";
import { hallPlan, hallStands, type HallRect, type PaidSize, type PlaceStatus } from "@/config/hall";
import { useToast } from "@/components/toast";
import { Button, buttonClass } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/misc";
import { getRepository } from "@/lib/data";
import { DataError } from "@/lib/data/repository";
import type { Exhibitor } from "@/lib/data/types";
import { formatEuro } from "@/lib/dates";
import { emptyStandRequest, validateStandRequest, type FormErrors, type PlanPlace, type StandRequestInput } from "@/lib/fair/forms";
import { innovatorSlotRect, placeHighlights } from "@/lib/fair/hall";
import { innovatorSlotStates, standHolders, standStates } from "@/lib/fair/stands";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";
import { focusFirstError } from "@/lib/validation";

/*
 * The SEER Expo floor plan: the Saldus sporta skola hall drawn as SVG from
 * config/hall.ts, with live free / reserved / sold places from the bookings.
 * `book` mode: filters, tooltips and a drawer with the application form.
 * `pick` mode (booking form): free stands of the chosen size are buttons.
 */

/** SVG units per plan cell. */
const U = 10;
const { cols, rows, curtainRow, stage, innovatorZone, entrance } = hallPlan.hall;
const W = cols * U;
const H = rows * U;
/** Room around the hall for the side seating, and below it for the main seating and stairs. */
const SIDE = 15;
const TOP = 3;
const BOTTOM = 19;
const VB = { x: -SIDE, y: -TOP, w: W + 2 * SIDE, h: H + TOP + BOTTOM };

const FILL: Record<PlaceStatus, string> = {
  free: "var(--color-surface)",
  reserved: "var(--color-stand-reserved)",
  sold: "var(--color-stand-sold)",
};
const TEXT: Record<PlaceStatus, string> = { free: "var(--color-ink)", reserved: "#FFFFFF", sold: "#FFFFFF" };
const STATE_ICON: Partial<Record<PlaceStatus, typeof Lock>> = { reserved: Clock, sold: Lock };

type Filter = "all" | "free" | PaidSize | "innovator";
const FILTERS: Filter[] = ["all", "free", "L", "M", "S", "innovator"];

interface Place {
  key: string;
  place: PlanPlace;
  /** "12" or "I3". */
  label: string;
  size: StandSize;
  rect: HallRect;
  status: PlaceStatus;
  holder?: string;
  dimensions: string;
  areaM2: number;
  priceEUR: number;
}

interface Props {
  exhibitors: Pick<Exhibitor, "stand" | "status" | "name">[];
  mode?: "book" | "pick";
  /** pick mode: only free stands of this size can be picked. */
  size?: StandSize | "";
  selected?: number | null;
  onPick?: (number: number) => void;
}

export function HallFloorPlan({ exhibitors, mode = "book", size = "", selected = null, onPick }: Props) {
  const { t, locale } = useI18n();
  const p = t.stands.plan;
  const [filter, setFilter] = useState<Filter>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [open, setOpen] = useState<Place | null>(null);

  const places = useMemo<Place[]>(() => {
    const states = standStates(exhibitors);
    const holders = standHolders(exhibitors);
    const stands: Place[] = hallStands.map((s) => ({
      key: `s${s.id}`,
      place: { kind: "stand", number: s.id },
      label: String(s.id),
      size: s.size,
      rect: s,
      status: states.get(s.id) ?? "free",
      holder: holders.get(s.id),
      dimensions: s.dimensions,
      areaM2: s.areaM2,
      priceEUR: s.priceEUR,
    }));
    const slots: Place[] = innovatorSlotStates(exhibitors).map((slot) => {
      const conf = hallPlan.innovatorSlots[slot.index - 1];
      return {
        key: `i${slot.index}`,
        place: { kind: "innovator", index: slot.index },
        label: conf.id,
        size: "innovator",
        rect: innovatorSlotRect(slot.index),
        status: slot.status,
        holder: slot.name,
        dimensions: conf.dimensions,
        areaM2: conf.areaM2,
        priceEUR: conf.priceEUR,
      };
    });
    return [...stands, ...slots];
  }, [exhibitors]);

  const isInnovator = (pl: Place) => pl.place.kind === "innovator";
  const placeName = (pl: Place) =>
    pl.place.kind === "stand" ? fmt(p.stand, { n: pl.place.number }) : fmt(p.innovatorPlace, { n: pl.place.index });

  const matches = (pl: Place): boolean => {
    if (mode === "pick") return !isInnovator(pl) && pl.status === "free" && (!size || size === pl.size);
    if (filter === "all") return true;
    if (filter === "free") return pl.status === "free";
    if (filter === "innovator") return isInnovator(pl);
    return pl.size === filter;
  };

  const activate = (pl: Place) => {
    if (!matches(pl)) return;
    if (mode === "pick") {
      if (pl.place.kind === "stand") onPick?.(pl.place.number);
      return;
    }
    if (pl.status === "free") {
      setPinned(null);
      setOpen(pl);
    } else setPinned((k) => (k === pl.key ? null : pl.key));
  };

  const paid = places.filter((pl) => !isInnovator(pl));
  const count = (status: PlaceStatus) => paid.filter((pl) => pl.status === status).length;
  const innovatorFree = places.filter((pl) => isInnovator(pl) && pl.status === "free").length;
  const freeMatches = places.filter((pl) => matches(pl) && pl.status === "free");
  const tip = places.find((pl) => pl.key === (pinned ?? hovered));

  return (
    <div>
      {mode === "book" && (
        <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label={p.filtersLabel}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setPinned(null);
              }}
              className={`rounded-sm border px-2.5 py-1 text-sm font-semibold transition-colors ${
                filter === f ? "border-primary-fill bg-primary-fill text-white" : "border-line bg-surface text-ink hover:border-rule"
              }`}
            >
              {p.filters[f]}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="block h-auto w-full select-none" role="group" aria-label={p.title}>
          <Venue labels={p} />

          {/* Paid stands and innovator places. */}
          {places.map((pl) => {
            const interactive = matches(pl);
            const isSel = mode === "pick" && pl.place.kind === "stand" && pl.place.number === selected;
            const lit = interactive && (hovered === pl.key || pinned === pl.key);
            const inset = isInnovator(pl) ? 0.35 : 0.9;
            const x = pl.rect.col * U + inset;
            const y = pl.rect.row * U + inset;
            const w = pl.rect.w * U - 2 * inset;
            const h = pl.rect.h * U - 2 * inset;
            const Icon = STATE_ICON[pl.status];
            const state = t.options.standState[pl.status].toLowerCase();
            const label = fmt(p.aria, { place: placeName(pl), size: p.sizeNames[pl.size], state });
            return (
              <g
                key={pl.key}
                role="button"
                tabIndex={interactive ? 0 : -1}
                aria-label={label}
                aria-disabled={interactive ? undefined : true}
                aria-pressed={mode === "pick" ? isSel : undefined}
                onClick={() => activate(pl)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activate(pl);
                  }
                }}
                onMouseEnter={() => setHovered(pl.key)}
                onMouseLeave={() => setHovered((k) => (k === pl.key ? null : k))}
                onFocus={() => setHovered(pl.key)}
                onBlur={() => setHovered((k) => (k === pl.key ? null : k))}
                className="outline-none [&:focus-visible>rect:first-child]:stroke-primary [&:focus-visible>rect:first-child]:[stroke-width:1.4]"
                style={{
                  cursor: interactive ? "pointer" : "default",
                  opacity: interactive || mode === "pick" ? (interactive || pl.status !== "free" ? 1 : 0.35) : 0.22,
                  transform: lit && pl.status === "free" ? "translateY(-0.7px)" : undefined,
                  transition: "transform 150ms ease-out, opacity 150ms",
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={isInnovator(pl) ? 0.6 : 1.1}
                  fill={FILL[pl.status]}
                  stroke={isSel || lit ? "var(--color-primary)" : pl.status === "free" ? "var(--color-ink)" : FILL[pl.status]}
                  strokeOpacity={isSel || lit ? 1 : pl.status === "free" ? 0.35 : 1}
                  strokeWidth={isSel ? 1.4 : lit ? 1 : 0.45}
                  style={{ filter: lit && pl.status === "free" ? "drop-shadow(0 1.2px 1.2px rgb(16 28 21 / 0.25))" : undefined }}
                />
                {!isInnovator(pl) && (
                  <>
                    {Icon && <Icon x={x + 0.6} y={y + 0.6} width={2.1} height={2.1} color={TEXT[pl.status]} strokeWidth={2.8} aria-hidden="true" />}
                    {isSel && <CheckCircle2 x={x + w - 3.6} y={y + 0.8} width={2.8} height={2.8} color="var(--color-primary)" strokeWidth={2.6} aria-hidden="true" />}
                    <text
                      x={x + w / 2}
                      y={pl.size === "L" ? y + h / 2 + 1.2 : y + h * 0.62}
                      textAnchor="middle"
                      fontSize={pl.size === "L" ? 5 : 4}
                      fontWeight={800}
                      fill={TEXT[pl.status]}
                      className="font-display"
                    >
                      {pl.label}
                    </text>
                    <text
                      x={x + w / 2}
                      y={pl.size === "L" ? y + h / 2 + 4.6 : y + h * 0.9}
                      textAnchor="middle"
                      fontSize={pl.size === "L" ? 2.4 : 1.9}
                      fontWeight={700}
                      fill={TEXT[pl.status]}
                      opacity={0.8}
                    >
                      {pl.size}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {tip && <Tooltip place={tip} name={placeName(tip)} labels={p} mode={mode} />}
      </div>

      {/* Legend and live counters. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group" aria-label={t.stands.legend}>
        {(["free", "reserved", "sold"] as const).map((status) => {
          const Icon = STATE_ICON[status];
          return (
            <span key={status} className="inline-flex items-center gap-1.5 font-semibold">
              <span
                className="flex size-5 items-center justify-center rounded-[4px] border"
                style={{ background: FILL[status], borderColor: status === "free" ? "var(--color-edge)" : FILL[status], color: TEXT[status] }}
                aria-hidden="true"
              >
                {Icon && <Icon className="size-3" />}
              </span>
              {t.options.standState[status]}
              <span className="font-normal tabular-nums text-ink-muted">{count(status)}</span>
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <span className="flex size-5 items-center justify-center rounded-[4px] border border-dashed border-primary/60 bg-primary-soft" aria-hidden="true" />
          {fmt(p.innovatorCounter, { n: innovatorFree, total: innovatorStandLimit })}
        </span>
      </div>

      <p className="mt-2 text-xs text-ink-muted">
        {eventConfig.venue} · {t.stands.planNote}
      </p>

      {/* On phones the places are small: list the free ones as buttons too. */}
      <div className="mt-4 md:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">{p.freeList}</p>
        {freeMatches.length ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {freeMatches.map((pl) => {
              const isSel = mode === "pick" && pl.place.kind === "stand" && pl.place.number === selected;
              return (
                <li key={pl.key}>
                  <button
                    type="button"
                    onClick={() => activate(pl)}
                    aria-pressed={mode === "pick" ? isSel : undefined}
                    className={`min-h-9 rounded-sm border px-2.5 text-sm font-bold ${
                      isSel ? "border-primary-fill bg-primary-fill text-white" : "border-line bg-surface text-ink"
                    }`}
                  >
                    {pl.label}
                    <span className="ml-1 font-normal opacity-75">{pl.size === "innovator" ? "" : pl.size}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">{p.noMatches}</p>
        )}
      </div>

      {mode === "book" && (
        <BookingDrawer place={open} name={open ? placeName(open) : ""} exhibitors={exhibitors} onClose={() => setOpen(null)} locale={locale} />
      )}
    </div>
  );
}

/** Walls, seating, stairs, curtain, stage and the innovator zone outline: everything that is not a place. */
function Venue({ labels: p }: { labels: ReturnType<typeof useI18n>["t"]["stands"]["plan"] }) {
  const doorL = entrance.col * U;
  const doorR = (entrance.col + entrance.w) * U;
  const seatTop = H + 2.5;
  const seatH = 13;
  const stripes = (x: number, w: number, y: number, h: number, step: number, vertical = false) =>
    Array.from({ length: Math.floor((vertical ? w : h) / step) - 1 }, (_, i) =>
      vertical ? (
        <line key={i} x1={x + (i + 1) * step} x2={x + (i + 1) * step} y1={y + 0.6} y2={y + h - 0.6} />
      ) : (
        <line key={i} x1={x + 0.6} x2={x + w - 0.6} y1={y + (i + 1) * step} y2={y + (i + 1) * step} />
      ),
    );
  const halo = { stroke: "var(--color-bg)", strokeWidth: 1.4, paintOrder: "stroke" as const };
  const zoneX = innovatorZone.col * U;
  const zoneY = innovatorZone.row * U;
  return (
    <g aria-hidden="true">
      {/* Floor and walls, with the doorway in the front wall. */}
      <rect x={0} y={0} width={W} height={H} fill="var(--color-plan-floor)" />
      <g stroke="var(--color-rule)" strokeWidth={0.9} strokeLinecap="square">
        <line x1={0} y1={0} x2={W} y2={0} />
        <line x1={0} y1={0} x2={0} y2={H} />
        <line x1={W} y1={0} x2={W} y2={H} />
        <line x1={0} y1={H} x2={doorL} y2={H} />
        <line x1={doorR} y1={H} x2={W} y2={H} />
      </g>

      {/* Main spectator seating either side of the stairs, and the side seating along the front half. */}
      <g fill="var(--color-surface-muted)" stroke="var(--color-line)" strokeWidth={0.4}>
        <rect x={0} y={seatTop} width={doorL - 2} height={seatH} rx={1} />
        <rect x={doorR + 2} y={seatTop} width={W - doorR - 2} height={seatH} rx={1} />
        <rect x={-SIDE + 2} y={curtainRow * U + 8} width={SIDE - 4.5} height={H - curtainRow * U - 8} rx={1} />
        <rect x={W + 2.5} y={curtainRow * U + 8} width={SIDE - 4.5} height={H - curtainRow * U - 8} rx={1} />
      </g>
      <g stroke="var(--color-edge)" strokeWidth={0.35}>
        {stripes(0, doorL - 2, seatTop, seatH, 2.2)}
        {stripes(doorR + 2, W - doorR - 2, seatTop, seatH, 2.2)}
        {stripes(-SIDE + 2, SIDE - 4.5, curtainRow * U + 8, H - curtainRow * U - 8, 2.2, true)}
        {stripes(W + 2.5, SIDE - 4.5, curtainRow * U + 8, H - curtainRow * U - 8, 2.2, true)}
        {/* Stairs down from the entrance. */}
        {stripes(doorL + 1, doorR - doorL - 2, seatTop, seatH, 1.6)}
      </g>
      <g fontSize={2.3} fontWeight={700} fill="var(--color-ink-muted)" textAnchor="middle" letterSpacing={0.25}>
        <text x={(doorL - 2) / 2} y={seatTop + seatH / 2 + 0.8} {...halo}>
          {p.seating.toUpperCase()}
        </text>
        <text x={doorR + 2 + (W - doorR - 2) / 2} y={seatTop + seatH / 2 + 0.8} {...halo}>
          {p.seating.toUpperCase()}
        </text>
        <text x={(doorL + doorR) / 2} y={seatTop + seatH + 3.2} fontSize={2.6} fill="var(--color-ink)">
          {p.entrance.toUpperCase()}
        </text>
      </g>
      <DoorOpen x={(doorL + doorR) / 2 - 1.6} y={H - 1.8} width={3.2} height={3.2} color="var(--color-ink-muted)" strokeWidth={2.2} />

      {/* The curtain, open for the fair: the hall behind it is the same size. */}
      <line x1={0.8} x2={W - 0.8} y1={curtainRow * U} y2={curtainRow * U} stroke="var(--color-ink-muted)" strokeOpacity={0.7} strokeWidth={0.45} strokeDasharray="2.2 1.6" />
      <text x={U * 1.3} y={curtainRow * U + 0.8} fontSize={2.2} fontWeight={700} letterSpacing={0.25} fill="var(--color-ink-muted)" stroke="var(--color-plan-floor)" strokeWidth={1.6} paintOrder="stroke">
        {p.curtain.toUpperCase()}
      </text>

      {/* Main stage. */}
      <rect x={stage.col * U + 0.6} y={stage.row * U} width={stage.w * U - 1.2} height={stage.h * U} rx={1.6} fill="var(--color-night)" />
      <Mic x={stage.col * U + (stage.w * U) / 2 - 2} y={stage.row * U + stage.h * U * 0.22} width={4} height={4} color="var(--color-on-night)" strokeWidth={2.2} />
      <text
        x={stage.col * U + (stage.w * U) / 2}
        y={stage.row * U + stage.h * U * 0.72}
        textAnchor="middle"
        fontSize={2.9}
        fontWeight={800}
        letterSpacing={0.35}
        fill="var(--color-on-night)"
      >
        {p.stage.toUpperCase()}
      </text>

      {/* Innovator zone outline and label. */}
      <rect
        x={zoneX - 0.6}
        y={zoneY - 0.6}
        width={innovatorZone.w * U + 1.2}
        height={innovatorZone.h * U + 1.2}
        rx={1}
        fill="var(--color-primary-soft)"
        stroke="var(--color-primary)"
        strokeOpacity={0.5}
        strokeWidth={0.4}
        strokeDasharray="1.4 1"
      />
      <text x={zoneX + (innovatorZone.w * U) / 2} y={zoneY + innovatorZone.h * U + 3.6} textAnchor="middle" fontSize={2.3} fontWeight={700} letterSpacing={0.25} fill="var(--color-primary)">
        {p.innovatorZone.toUpperCase()}
      </text>
    </g>
  );
}

function Tooltip({
  place: pl,
  name,
  labels: p,
  mode,
}: {
  place: Place;
  name: string;
  labels: ReturnType<typeof useI18n>["t"]["stands"]["plan"];
  mode: "book" | "pick";
}) {
  const { t } = useI18n();
  const cx = ((pl.rect.col + pl.rect.w / 2) * U - VB.x) / VB.w;
  const top = (pl.rect.row * U - VB.y) / VB.h;
  const below = top < 0.18;
  const y = below ? ((pl.rect.row + pl.rect.h) * U - VB.y) / VB.h : top;
  const hint = pl.status === "free" ? (mode === "book" ? p.tooltipFree : null) : pl.status === "sold" ? p.tooltipSold : p.tooltipReserved;
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 w-max max-w-[15rem] rounded-sm border border-edge bg-surface px-3 py-2 text-sm text-ink shadow-pop"
      style={{
        left: `${Math.min(88, Math.max(12, cx * 100))}%`,
        top: `${y * 100}%`,
        transform: below ? "translate(-50%, 6px)" : "translate(-50%, calc(-100% - 6px))",
      }}
    >
      <p className="font-bold">
        {name} · {pl.size === "innovator" ? p.sizeNames.innovator : pl.size} · {pl.dimensions}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-ink-muted">
        <span className="size-2.5 rounded-full" style={{ background: FILL[pl.status], border: "1px solid var(--color-edge)" }} aria-hidden="true" />
        {t.options.standState[pl.status]}
        {hint && <span>· {hint}</span>}
      </p>
      {pl.status === "sold" && pl.holder && <p className="mt-0.5 font-semibold">{pl.holder}</p>}
    </div>
  );
}

function BookingDrawer({
  place,
  name,
  exhibitors,
  onClose,
  locale,
}: {
  place: Place | null;
  name: string;
  exhibitors: Pick<Exhibitor, "stand" | "status">[];
  onClose: () => void;
  locale: "lv" | "en";
}) {
  const { t } = useI18n();
  const p = t.stands.plan;
  const d = p.drawer;
  const toast = useToast();
  const [input, setInput] = useState<StandRequestInput | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // A new place starts a fresh form.
  if (place && place.key !== lastKey) {
    setLastKey(place.key);
    setInput(emptyStandRequest(place.place));
    setErrors({});
    setFailure(null);
    setDone(false);
  }
  if (!place && lastKey !== null) setLastKey(null);

  const set = (patch: Partial<StandRequestInput>) => setInput((i) => (i ? { ...i, ...patch } : i));
  const err = (k: string) => (errors[k] ? t.fieldErrors[errors[k]] : undefined);
  const toggleNeed = (n: StandNeed) => set({ needs: input?.needs.includes(n) ? input.needs.filter((x) => x !== n) : [...(input?.needs ?? []), n] });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !place) return;
    const found = validateStandRequest(input, exhibitors);
    setErrors(found);
    setFailure(found.place ? t.errors[found.place === "noSpots" ? "noSpots" : "standTaken"] : null);
    if (Object.keys(found).length) {
      focusFirstError();
      return;
    }
    setSending(true);
    try {
      await getRepository().requestStand(input);
      setDone(true);
      toast(fmt(d.toast, { place: name }));
    } catch (error) {
      const code = error instanceof DataError ? error.code : "generic";
      setFailure(t.errors[code as keyof typeof t.errors] ?? t.errors.generic);
    } finally {
      setSending(false);
    }
  };

  const highlights = place ? placeHighlights(place.rect, place.place.kind === "innovator") : [];

  return (
    <Dialog
      open={!!place}
      onClose={onClose}
      title={name}
      closeLabel={d.close}
      side="right"
      footer={
        done ? (
          <Button onClick={onClose}>{d.close}</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              {d.cancel}
            </Button>
            <button type="submit" form="plan-request" disabled={sending} className={buttonClass("accent")}>
              {sending ? d.sending : `${d.submit} · ${name}`}
            </button>
          </>
        )
      }
    >
      {place && input && (
        <div className="space-y-6">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border border-line bg-surface-muted p-4 text-sm">
            <div>
              <dt className="text-ink-muted">{d.size}</dt>
              <dd className="font-bold">{p.sizeNames[place.size]}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">{d.dimensions}</dt>
              <dd className="font-bold">{fmt(d.area, { dims: place.dimensions, area: place.areaM2 })}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-ink-muted">{d.price}</dt>
              <dd className="font-bold">
                {place.priceEUR > 0 ? (
                  <>
                    {formatEuro(place.priceEUR, locale)} <span className="font-normal text-ink-muted">({d.priceNote})</span>
                  </>
                ) : (
                  d.free
                )}
              </dd>
            </div>
            {highlights.length > 0 && (
              <div className="col-span-2">
                <dt className="text-ink-muted">{d.location}</dt>
                <dd>
                  <ul className="mt-1 space-y-1">
                    {highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 font-semibold">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        {p.highlights[h]}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          {done ? (
            <div className="flex flex-col items-start gap-3" role="status">
              <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
              <h3 className="text-2xl font-extrabold">{d.successTitle}</h3>
              <p>{fmt(d.successText, { place: name })}</p>
              <p className="text-sm text-ink-muted">{d.demo}</p>
            </div>
          ) : (
            <form id="plan-request" onSubmit={submit} noValidate className="space-y-4">
              <h3 className="text-lg font-extrabold">{d.form}</h3>
              {failure && <Notice tone="danger">{failure}</Notice>}
              <Field label={d.company} required error={err("company")}>
                {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} value={input.company} onChange={(e) => set({ company: e.target.value })} autoComplete="organization" />}
              </Field>
              <Field label={d.regNo} hint={d.regNoHint} error={err("regNo")}>
                {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} value={input.regNo} onChange={(e) => set({ regNo: e.target.value })} inputMode="numeric" />}
              </Field>
              <Field label={d.sector} required error={err("sector")}>
                {(f) => (
                  <Select id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} value={input.sector} onChange={(e) => set({ sector: e.target.value as StandRequestInput["sector"] })}>
                    <option value="">{d.choose}</option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {tx(s.label, locale)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label={d.contact} required error={err("contactName")}>
                {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} value={input.contactName} onChange={(e) => set({ contactName: e.target.value })} autoComplete="name" />}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={d.email} required error={err("email")}>
                  {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} type="email" value={input.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" />}
                </Field>
                <Field label={d.phone} required error={err("phone")}>
                  {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} type="tel" value={input.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" />}
                </Field>
              </div>
              <fieldset>
                <legend className="text-sm font-bold">{d.needs}</legend>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {standNeeds.map((n) => (
                    <Checkbox key={n} label={t.options.need[n]} checked={input.needs.includes(n)} onChange={() => toggleNeed(n)} />
                  ))}
                </div>
              </fieldset>
              <p className="text-sm text-ink-muted">{d.note}</p>
              {place.place.kind === "stand" && (
                <Link href={`/apply/stand?stand=${place.place.number}`} className="inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline">
                  {d.fullForm} →
                </Link>
              )}
            </form>
          )}
        </div>
      )}
    </Dialog>
  );
}
