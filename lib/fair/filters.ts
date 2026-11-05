import type { AmountRangeId, ChallengeField, Sector, Stage, StandSize } from "@/config/event";
import type { Challenge, Exhibitor } from "@/lib/data/fair-types";

export interface ExhibitorFilter {
  sector?: Sector | "";
  size?: StandSize | "";
  /** Only exhibitors looking for investment. */
  seekingInvestment?: boolean;
}

/** Exhibitor directory: everyone except rejected applications, filtered. */
export function filterExhibitors(list: Exhibitor[], f: ExhibitorFilter = {}): Exhibitor[] {
  return list.filter(
    (e) =>
      e.status !== "rejected" &&
      (!f.sector || e.sector === f.sector) &&
      (!f.size || e.stand.size === f.size) &&
      (!f.seekingInvestment || isInShowcase(e)),
  );
}

/** Listed in the investment showcase: has an investment section and is not rejected (auto-approved in the demo). */
export function isInShowcase(e: Exhibitor): e is Exhibitor & { investment: NonNullable<Exhibitor["investment"]> } {
  return !!e.investment && e.status !== "rejected";
}

export interface ShowcaseFilter {
  sector?: Sector | "";
  stage?: Stage | "";
  amount?: AmountRangeId | "";
}

export function filterShowcase(list: Exhibitor[], f: ShowcaseFilter = {}) {
  return list
    .filter(isInShowcase)
    .filter(
      (e) =>
        (!f.sector || e.sector === f.sector) &&
        (!f.stage || e.investment.stage === f.stage) &&
        (!f.amount || e.investment.amountRange === f.amount),
    );
}

export function filterChallenges(list: Challenge[], field?: ChallengeField | ""): Challenge[] {
  return field ? list.filter((c) => c.field === field) : list;
}
