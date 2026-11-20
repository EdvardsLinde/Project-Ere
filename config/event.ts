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
const VENUE = "Saldus sporta skola";

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

/** The hall plan (stands, stage, innovator zone, entrance) is in config/hall.ts. */

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
