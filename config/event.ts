/**
 * Everything about the fair that the team is likely to change: the event name,
 * dates and venue, the stand layout, placeholder prices and the option lists
 * used by the forms and filters. UI text lives in `messages/lv.ts` / `messages/en.ts`.
 */
import type { Bilingual } from "@/config/site";

export type Sector = "agriculture" | "forestry" | "logistics" | "adjacent";
export type StandSize = "S" | "M" | "L" | "innovator";
export type Stage = "idea" | "prototype" | "operating" | "scaling";
export type ChallengeField = "ai" | "it" | "cyber";
export type FairDay = 1 | 2 | 3;

/** Where the fair happens. A proper name, shown as is in both languages. */
const VENUE = "Saldus sporta centrs";

/** The one place for the event's name and practical details. */
export const eventConfig = {
  name: "SEER Expo",
  subtitle: {
    lv: "Saldus lauksaimniecības, mežsaimniecības un loģistikas inovāciju izstāde",
    en: "Saldus Agriculture, Forestry & Logistics Innovation Fair",
  } satisfies Bilingual,
  venue: VENUE,
  /** Shown wherever dates or the venue appear. Dates are not decided yet. */
  datesVenue: { lv: `${VENUE} · datumi tiks precizēti`, en: `${VENUE} · dates to be confirmed` } satisfies Bilingual,
  days: [1, 2, 3] as const satisfies readonly FairDay[],
  /** Partner line on "Investing in Latvia" until partners are confirmed. */
  advicePartner: {
    lv: "Sadarbībā ar LIAA un partneru juridisko biroju (tiks precizēts)",
    en: "In cooperation with LIAA and a partner law firm (to be confirmed)",
  } satisfies Bilingual,
} as const;

export const sectors: { id: Sector; label: Bilingual }[] = [
  { id: "agriculture", label: { lv: "Lauksaimniecība", en: "Agriculture" } },
  { id: "forestry", label: { lv: "Mežsaimniecība", en: "Forestry" } },
  { id: "logistics", label: { lv: "Loģistika", en: "Logistics" } },
  { id: "adjacent", label: { lv: "Saistītā nozare", en: "Adjacent field" } },
];

/**
 * Stand prices are PLACEHOLDERS until the organisers set them (the UI says so).
 * `width`/`depth` in metres; `price` in euros for the whole fair.
 */
export const standTypes: Record<StandSize, { width: number; depth: number; price: number }> = {
  S: { width: 3, depth: 3, price: 250 },
  M: { width: 3, depth: 6, price: 450 },
  L: { width: 6, depth: 6, price: 800 },
  innovator: { width: 2, depth: 2, price: 0 },
};

/** Free innovator stands are limited; the form shows how many are left. */
export const innovatorStandLimit = 16;

/** A rectangle on the hall grid, in cells (one cell ≈ one 3 × 3 m S stand). */
export interface HallRect {
  col: number;
  row: number;
  w: number;
  h: number;
}

/**
 * The hall at the venue, seen from the visitor seating (bottom): a 14 × 12 cell
 * plan, provisional and not to scale until the organisers confirm the real
 * floor plan. The whole floor is divided into stand places with aisles between
 * them; the stage is in the middle; the innovator places sit between the stage
 * and the entrance. L = 2 × 2 cells, M = 2 × 1, S = 1 × 1; innovator places
 * are half a cell each.
 */
export const hallLayout = {
  cols: 14,
  rows: 12,
  stage: { col: 5, row: 5, w: 4, h: 3 } satisfies HallRect,
  /** 16 innovator places: 8 per row, 2 rows, in this rectangle. */
  innovatorZone: { col: 5, row: 9, w: 4, h: 1 } satisfies HallRect,
  /** The doorway in the front wall, through the visitor seating. */
  entrance: { col: 6, w: 2 },
};

type PaidSize = Exclude<StandSize, "innovator">;

/** Where each paid stand stands. Numbers are given by position below. */
const hallPlaces: ({ size: PaidSize } & HallRect)[] = [
  // Back wall: seven medium stands.
  ...[0, 2, 4, 6, 8, 10, 12].map((col) => ({ size: "M" as const, col, row: 0, w: 2, h: 1 })),
  // Four large stands behind the stage, either side of the centre aisle.
  ...[2, 4, 8, 10].map((col) => ({ size: "L" as const, col, row: 2, w: 2, h: 2 })),
  // Side walls: eight small stands each.
  ...[2, 3, 4, 5, 6, 7, 8, 9].flatMap((row) => [
    { size: "S" as const, col: 0, row, w: 1, h: 1 },
    { size: "S" as const, col: 13, row, w: 1, h: 1 },
  ]),
  // Beside the stage: three medium stands on each side.
  ...[5, 6, 7].flatMap((row) => [
    { size: "M" as const, col: 2, row, w: 2, h: 1 },
    { size: "M" as const, col: 10, row, w: 2, h: 1 },
  ]),
  // Beside the innovator places: four small stands.
  ...[2, 3, 10, 11].map((col) => ({ size: "S" as const, col, row: 9, w: 1, h: 1 })),
  // Front wall, either side of the entrance.
  { size: "M", col: 0, row: 11, w: 2, h: 1 },
  { size: "M", col: 2, row: 11, w: 2, h: 1 },
  ...[4, 5, 8, 9].map((col) => ({ size: "S" as const, col, row: 11, w: 1, h: 1 })),
  { size: "M", col: 10, row: 11, w: 2, h: 1 },
  { size: "M", col: 12, row: 11, w: 2, h: 1 },
];

/**
 * The numbered paid stands: numbered row by row from the back-left corner, so
 * nearby stands have nearby numbers.
 */
export const hallStands: ({ number: number; size: PaidSize } & HallRect)[] = [...hallPlaces]
  .sort((a, b) => a.row - b.row || a.col - b.col)
  .map((place, i) => ({ number: i + 1, ...place }));

/** Stand numbers of one size, in number order (handy for examples and tests). */
export const standsOfSize = (size: PaidSize) => hallStands.filter((s) => s.size === size).map((s) => s.number);

export const standNeeds = ["power", "table", "screen"] as const;
export type StandNeed = (typeof standNeeds)[number];

/** What a paid exhibitor wants from the fair. `investment` opens section D. */
export const exhibitorGoals = ["distributors", "productPartners", "adjacentPartners", "recruitment", "investment"] as const;
export type ExhibitorGoal = (typeof exhibitorGoals)[number];

/** What an innovator is looking for. */
export const innovatorGoals = ["partners", "investors", "mentors", "customers"] as const;
export type InnovatorGoal = (typeof innovatorGoals)[number];

export const stages: Stage[] = ["idea", "prototype", "operating", "scaling"];

/** Investment amount ranges in euros; `max: null` = no upper limit. */
export const amountRanges = [
  { id: "upTo50k", min: 0, max: 50_000 },
  { id: "50kTo200k", min: 50_000, max: 200_000 },
  { id: "200kTo1m", min: 200_000, max: 1_000_000 },
  { id: "over1m", min: 1_000_000, max: null },
] as const;
export type AmountRangeId = (typeof amountRanges)[number]["id"];

export const investorTypes = ["angel", "fund", "company", "public"] as const;
export type InvestorType = (typeof investorTypes)[number];

export const challengeFields: ChallengeField[] = ["ai", "it", "cyber"];

/** School teams have 2–5 members; under-18s need guardian consent. */
export const teamSize = { min: 2, max: 5 } as const;
export const memberAge = { min: 12, max: 25 } as const;
export const adultAge = 18;
