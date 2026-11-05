import { hallStands, innovatorStandLimit, standTypes, type StandSize } from "@/config/event";
import type { Exhibitor } from "@/lib/data/types";

export type StandState = "free" | "reserved" | "sold";

type StandHolder = Pick<Exhibitor, "stand" | "status">;

/** Price of a stand for the whole fair, in euros (a placeholder until the organisers set prices). */
export function standPrice(size: StandSize): number {
  return standTypes[size].price;
}

/** Floor area in square metres. */
export function standArea(size: StandSize): number {
  return standTypes[size].width * standTypes[size].depth;
}

/**
 * State of every numbered stand: `sold` when an approved exhibitor holds it,
 * `reserved` when a submitted application asks for it, otherwise `free`.
 * Rejected applications free the stand again.
 */
export function standStates(exhibitors: StandHolder[]): Map<number, StandState> {
  const states = new Map<number, StandState>(hallStands.map((s) => [s.number, "free"]));
  for (const e of exhibitors) {
    const n = e.stand.number;
    if (n === undefined || !states.has(n) || e.status === "rejected") continue;
    if (e.status === "approved") states.set(n, "sold");
    else if (states.get(n) === "free") states.set(n, "reserved");
  }
  return states;
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

/** Free innovator stands left; rejected applications give their place back. */
export function innovatorSpotsLeft(exhibitors: StandHolder[], limit = innovatorStandLimit): number {
  const taken = exhibitors.filter((e) => e.stand.size === "innovator" && e.status !== "rejected").length;
  return Math.max(0, limit - taken);
}
