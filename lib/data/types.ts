import type {
  AmountRangeId,
  ChallengeField,
  ExhibitorGoal,
  FairDay,
  InnovatorGoal,
  InvestorType,
  Sector,
  Stage,
  StandNeed,
  StandSize,
} from "@/config/event";

export type Locale = "lv" | "en";

/** Front-end only: picked with the role switch, no accounts. `null` = first visit. */
export type Role = "exhibitor" | "innovator" | "investor" | "school";

/** Seed content is bilingual; text typed into a form is a plain string in one language. */
export type Localized = string | { lv: string; en: string };

/** ISO timestamp. */
export type ISODateTime = string;

export type ExhibitorStatus = "submitted" | "approved" | "rejected";

export interface Investment {
  amountRange: AmountRangeId;
  purpose: Localized;
  where: Localized;
  stage: Stage;
  offer: Localized;
}

/**
 * A stand at the fair: a paid stand (S/M/L) or a free innovator stand
 * (`stand.size === "innovator"`, which also uses `team` and `stage`).
 */
export interface Exhibitor {
  id: string;
  name: string;
  regNo?: string;
  address: string;
  sector: Sector;
  /** Which adjacent field, when `sector` is `adjacent`. */
  adjacentNote?: Localized;
  description: Localized;
  website?: string;
  logoDataUrl?: string;
  contactName: string;
  email: string;
  phone?: string;
  stand: { size: StandSize; number?: number; days: FairDay[]; needs: StandNeed[] };
  /** What the stand shows; for innovators, the idea or prototype title. */
  showcase: Localized;
  goals: (ExhibitorGoal | InnovatorGoal)[];
  /** Present when the exhibitor is looking for investment; lists it in the showcase. */
  investment?: Investment;
  /** Innovators: team members. */
  team?: string;
  /** Innovators: how far the idea is. */
  stage?: Stage;
  status: ExhibitorStatus;
  /** Illustrative seed content, shown with "PIEMĒRS". */
  isExample: boolean;
  createdAt: ISODateTime;
}

export type MeetingStatus = "pending" | "accepted" | "declined";

export interface MeetingRequest {
  id: string;
  exhibitorId: string;
  investor: { name: string; organisation: string; type: InvestorType };
  message: string;
  day: FairDay;
  /** Preferred time, e.g. `14:30`. */
  time?: string;
  status: MeetingStatus;
  createdAt: ISODateTime;
}

export interface Challenge {
  id: string;
  /** The company posting the problem (bilingual for generic seed examples). */
  company: Localized;
  problem: Localized;
  field: ChallengeField;
  provides: Localized;
  timeline: Localized;
  isExample: boolean;
}

export type TeamStatus = "applied" | "accepted" | "presenting";

export interface TeamMember {
  name: string;
  age: number;
}

export interface TeamApplication {
  id: string;
  challengeId: string;
  school: string;
  teamName: string;
  members: TeamMember[];
  mentor: string;
  contact: string;
  /** Required when any member is under 18. */
  guardianConsent?: boolean;
  status: TeamStatus;
  createdAt: ISODateTime;
}

export type AgendaType = "panel" | "pitch" | "b2b" | "workshop" | "showcase" | "visit";

export interface AgendaItem {
  id: string;
  day: FairDay;
  time: string;
  title: Localized;
  type: AgendaType;
  isExample: boolean;
}

/** The whole demo database, as stored in this browser. */
export interface FairDatabase {
  version: number;
  exhibitors: Exhibitor[];
  meetings: MeetingRequest[];
  challenges: Challenge[];
  teams: TeamApplication[];
  agenda: AgendaItem[];
  /** What this browser created, so "My dashboard" can show it (there are no accounts). */
  mine: { exhibitors: string[]; meetings: string[]; teams: string[] };
  /** Showcase items the investor saved. */
  saved: string[];
}
