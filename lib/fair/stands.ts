import { standTypes, type StandSize } from "@/config/event";
import { hallPlan, hallStands, type PlaceStatus } from "@/config/hall";
import type { Exhibitor } from "@/lib/data/types";

export type StandState = PlaceStatus;

type StandHolder = Pick<Exhibitor, "stand" | "status"> & Partial<Pick<Exhibitor, "name">>;

/** free < reserved < sold: bookings can only make a place more taken. */
const RANK: Record<StandState, number> = { free: 0, reserved: 1, sold: 2 };
const moreTaken = (a: StandState, b: StandState) => (RANK[b] > RANK[a] ? b : a);
const bookingState = (status: Exhibitor["status"]): StandState => (status === "approved" ? "sold" : "reserved");

/** Price of a stand for the whole fair, in euros (a placeholder until the organisers set prices). */
export function standPrice(size: StandSize): number {
  return standTypes[size].price;
}

/** Floor area in square metres. */
export function standArea(size: StandSize): number {
  return standTypes[size].width * standTypes[size].depth;
}

/**
 * State of every numbered stand: the organisers' status from config/hall.ts,
 * made more taken by bookings — `sold` when an approved exhibitor holds it,
 * `reserved` when a submitted application asks for it. Rejected applications
 * do not count. Innovator places are separate (see `innovatorSlotStates`).
 */
export function standStates(exhibitors: StandHolder[]): Map<number, StandState> {
  const states = new Map<number, StandState>(hallStands.map((s) => [s.number, s.status]));
  for (const e of exhibitors) {
    const n = e.stand.number;
    if (e.stand.size === "innovator" || n === undefined || !states.has(n) || e.status === "rejected") continue;
    states.set(n, moreTaken(states.get(n)!, bookingState(e.status)));
  }
  return states;
}

/**
 * Who holds each sold stand (organiser's name first, else the approved
 * exhibitor). Reserved stands are not named: the application is not confirmed.
 */
export function standHolders(exhibitors: StandHolder[]): Map<number, string> {
  const names = new Map<number, string>();
  for (const s of hallStands) if (s.status === "sold" && s.exhibitorName) names.set(s.number, s.exhibitorName);
  for (const e of exhibitors) {
    const n = e.stand.number;
    if (e.stand.size === "innovator" || n === undefined || e.status !== "approved" || !e.name || names.has(n)) continue;
    names.set(n, e.name);
  }
  return names;
}

/** Whether `number` exists, has the given size and is free. */
export function isStandAvailable(number: number, size: StandSize, exhibitors: StandHolder[]): boolean {
  const stand = hallStands.find((s) => s.number === number);
  return !!stand && stand.size === size && standStates(exhibitors).get(number) === "free";
}

/** Free stand numbers of one size, in order. */
export function freeStands(size: StandSize, exhibitors: StandHolder[]): number[] {
  const states = standStates(exhibitors);
  return hallStands.filter((s) => s.size === size && states.get(s.number) === "free").map((s) => s.number);
}

/** Size of a numbered stand, or `undefined` if there is no such stand. */
export function standSizeOf(number: number): StandSize | undefined {
  return hallStands.find((s) => s.number === number)?.size;
}

export interface SlotState {
  /** 1–16. */
  index: number;
  status: StandState;
  /** Shown when sold. */
  name?: string;
}

/**
 * State of the 16 innovator places. Start from the organisers' status; an
 * application that names a place (`stand.number` = 1–16) takes that place if it
 * is free; applications without a place (the innovator form) fill the first
 * free places in order.
 */
export function innovatorSlotStates(exhibitors: StandHolder[]): SlotState[] {
  const slots: SlotState[] = hallPlan.innovatorSlots.map((s) => ({
    index: s.index,
    status: s.status,
    name: s.status === "sold" ? s.exhibitorName : undefined,
  }));
  const take = (slot: SlotState, e: StandHolder) => {
    slot.status = moreTaken(slot.status, bookingState(e.status));
    if (e.status === "approved" && !slot.name) slot.name = e.name;
  };
  const active = exhibitors.filter((e) => e.stand.size === "innovator" && e.status !== "rejected");
  const waiting: StandHolder[] = [];
  for (const e of active) {
    const slot = slots.find((s) => s.index === e.stand.number);
    if (slot && slot.status === "free") take(slot, e);
    else waiting.push(e);
  }
  for (const e of waiting) {
    const slot = slots.find((s) => s.status === "free");
    if (!slot) break;
    take(slot, e);
  }
  return slots;
}

/** Free innovator places left. */
export function innovatorSpotsLeft(exhibitors: StandHolder[]): number {
  return innovatorSlotStates(exhibitors).filter((s) => s.status === "free").length;
}

/** Whether innovator place `index` (1–16) is free. */
export function isSlotAvailable(index: number, exhibitors: StandHolder[]): boolean {
  return innovatorSlotStates(exhibitors).find((s) => s.index === index)?.status === "free";
}
