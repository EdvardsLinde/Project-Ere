/**
 * Form state, validation and conversion to stored records for the four public
 * forms: paid stand booking, free innovator stand, meeting request, school team.
 * Pure functions: no storage, no React. Errors are codes the UI translates.
 */
import {
  adultAge,
  memberAge,
  teamSize,
  type AmountRangeId,
  type ExhibitorGoal,
  type FairDay,
  type InnovatorGoal,
  type InvestorType,
  type Sector,
  type Stage,
  type StandNeed,
  type StandSize,
} from "@/config/event";
import type { Exhibitor, MeetingRequest, TeamApplication, TeamMember } from "@/lib/data/types";
import { isEmail, isPhone, isUrl } from "@/lib/validation";
import { innovatorSpotsLeft, isStandAvailable } from "./stands";

export type FieldError =
  | "required"
  | "email"
  | "phone"
  | "url"
  | "standTaken"
  | "noDays"
  | "teamSize"
  | "age"
  | "guardianConsent"
  | "noSpots"
  | "time";

export type FormErrors = Record<string, FieldError>;

const blank = (v: string | undefined | null) => !v || !v.trim();
const clean = (v: string) => v.trim();
const optional = (v: string) => (v.trim() ? v.trim() : undefined);

// Paid stand ----------------------------------------------------------------

export interface StandBookingInput {
  // A. Company
  name: string;
  regNo: string;
  address: string;
  sector: Sector | "";
  adjacentNote: string;
  description: string;
  website: string;
  logoDataUrl: string;
  contactName: string;
  email: string;
  phone: string;
  // B. Stand
  size: Exclude<StandSize, "innovator"> | "";
  number: number | null;
  days: FairDay[];
  needs: StandNeed[];
  showcase: string;
  // C. Goals
  goals: ExhibitorGoal[];
  // D. Investment (only when goals include "investment")
  investment: { amountRange: AmountRangeId | ""; purpose: string; where: string; stage: Stage | ""; offer: string };
}

export function emptyStandBooking(): StandBookingInput {
  return {
    name: "",
    regNo: "",
    address: "",
    sector: "",
    adjacentNote: "",
    description: "",
    website: "",
    logoDataUrl: "",
    contactName: "",
    email: "",
    phone: "",
    size: "",
    number: null,
    days: [1, 2, 3],
    needs: [],
    showcase: "",
    goals: [],
    investment: { amountRange: "", purpose: "", where: "", stage: "", offer: "" },
  };
}

export const wantsInvestment = (input: Pick<StandBookingInput, "goals">) => input.goals.includes("investment");

/** Field keys use the section prefix the form scrolls to: `name`, `size`, `investment.purpose`… */
export function validateStandBooking(input: StandBookingInput, exhibitors: Pick<Exhibitor, "stand" | "status">[]): FormErrors {
  const e: FormErrors = {};
  if (blank(input.name)) e.name = "required";
  if (blank(input.address)) e.address = "required";
  if (!input.sector) e.sector = "required";
  else if (input.sector === "adjacent" && blank(input.adjacentNote)) e.adjacentNote = "required";
  if (blank(input.description)) e.description = "required";
  if (!isUrl(input.website)) e.website = "url";
  if (blank(input.contactName)) e.contactName = "required";
  if (blank(input.email)) e.email = "required";
  else if (!isEmail(input.email)) e.email = "email";
  if (!blank(input.phone) && !isPhone(input.phone)) e.phone = "phone";

  if (!input.size) e.size = "required";
  else if (input.number !== null && !isStandAvailable(input.number, input.size, exhibitors)) e.number = "standTaken";
  if (input.days.length === 0) e.days = "noDays";
  if (blank(input.showcase)) e.showcase = "required";

  if (wantsInvestment(input)) {
    const inv = input.investment;
    if (!inv.amountRange) e["investment.amountRange"] = "required";
    if (blank(inv.purpose)) e["investment.purpose"] = "required";
    if (blank(inv.where)) e["investment.where"] = "required";
    if (!inv.stage) e["investment.stage"] = "required";
  }
  return e;
}

/** The stored record. Section D is kept only when "looking for investment" is ticked. */
export function bookingToExhibitor(input: StandBookingInput, id: string, now: string): Exhibitor {
  if (!input.size || !input.sector) throw new Error("Validate the booking before saving it.");
  const inv = input.investment;
  return {
    id,
    name: clean(input.name),
    regNo: optional(input.regNo),
    address: clean(input.address),
    sector: input.sector,
    adjacentNote: input.sector === "adjacent" ? optional(input.adjacentNote) : undefined,
    description: clean(input.description),
    website: optional(input.website),
    logoDataUrl: input.logoDataUrl || undefined,
    contactName: clean(input.contactName),
    email: clean(input.email),
    phone: optional(input.phone),
    stand: {
      size: input.size,
      number: input.number ?? undefined,
      days: [...input.days].sort(),
      needs: [...input.needs],
    },
    showcase: clean(input.showcase),
    goals: [...input.goals],
    investment:
      wantsInvestment(input) && inv.amountRange && inv.stage
        ? {
            amountRange: inv.amountRange,
            purpose: clean(inv.purpose),
            where: clean(inv.where),
            stage: inv.stage,
            offer: clean(inv.offer),
          }
        : undefined,
    status: "submitted",
    isExample: false,
    createdAt: now,
  };
}

// Free innovator stand ------------------------------------------------------

export interface InnovatorInput {
  name: string;
  team: string;
  title: string;
  description: string;
  sector: Sector | "";
  adjacentNote: string;
  stage: Stage | "";
  lookingFor: InnovatorGoal[];
  email: string;
  phone: string;
}

export function emptyInnovator(): InnovatorInput {
  return {
    name: "",
    team: "",
    title: "",
    description: "",
    sector: "",
    adjacentNote: "",
    stage: "",
    lookingFor: [],
    email: "",
    phone: "",
  };
}

export function validateInnovator(input: InnovatorInput, exhibitors: Pick<Exhibitor, "stand" | "status">[]): FormErrors {
  const e: FormErrors = {};
  if (innovatorSpotsLeft(exhibitors) === 0) e.spots = "noSpots";
  if (blank(input.name)) e.name = "required";
  if (blank(input.title)) e.title = "required";
  if (blank(input.description)) e.description = "required";
  if (!input.sector) e.sector = "required";
  else if (input.sector === "adjacent" && blank(input.adjacentNote)) e.adjacentNote = "required";
  if (blank(input.email)) e.email = "required";
  else if (!isEmail(input.email)) e.email = "email";
  if (!blank(input.phone) && !isPhone(input.phone)) e.phone = "phone";
  return e;
}

export function innovatorToExhibitor(input: InnovatorInput, id: string, now: string): Exhibitor {
  if (!input.sector) throw new Error("Validate the application before saving it.");
  return {
    id,
    name: clean(input.name),
    address: "",
    sector: input.sector,
    adjacentNote: input.sector === "adjacent" ? optional(input.adjacentNote) : undefined,
    description: clean(input.description),
    contactName: clean(input.name),
    email: clean(input.email),
    phone: optional(input.phone),
    stand: { size: "innovator", days: [2], needs: [] },
    showcase: clean(input.title),
    goals: [...input.lookingFor],
    team: optional(input.team),
    stage: input.stage || undefined,
    status: "submitted",
    isExample: false,
    createdAt: now,
  };
}

// Meeting request -------------------------------------------------------------

export interface MeetingInput {
  name: string;
  organisation: string;
  type: InvestorType;
  message: string;
  day: FairDay;
  time: string;
}

export function emptyMeeting(): MeetingInput {
  return { name: "", organisation: "", type: "angel", message: "", day: 1, time: "" };
}

export function validateMeeting(input: MeetingInput): FormErrors {
  const e: FormErrors = {};
  if (blank(input.name)) e.name = "required";
  if (blank(input.organisation)) e.organisation = "required";
  if (blank(input.message)) e.message = "required";
  if (input.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) e.time = "time";
  return e;
}

export function meetingFromInput(input: MeetingInput, exhibitorId: string, id: string, now: string): MeetingRequest {
  return {
    id,
    exhibitorId,
    investor: { name: clean(input.name), organisation: clean(input.organisation), type: input.type },
    message: clean(input.message),
    day: input.day,
    time: optional(input.time),
    status: "pending",
    createdAt: now,
  };
}

// School team -------------------------------------------------------------------

export interface TeamInput {
  school: string;
  teamName: string;
  /** `age` is the text typed into the field. */
  members: { name: string; age: string }[];
  mentor: string;
  contact: string;
  guardianConsent: boolean;
}

export function emptyTeam(): TeamInput {
  return {
    school: "",
    teamName: "",
    members: [
      { name: "", age: "" },
      { name: "", age: "" },
    ],
    mentor: "",
    contact: "",
    guardianConsent: false,
  };
}

const parsedAge = (v: string) => (/^\d{1,2}$/.test(v.trim()) ? Number(v.trim()) : NaN);

/** Any member under 18 means a parent or guardian must agree. */
export function needsGuardianConsent(members: { age: string | number }[]): boolean {
  return members.some((m) => {
    const age = typeof m.age === "number" ? m.age : parsedAge(m.age);
    return Number.isFinite(age) && age < adultAge;
  });
}

export function validateTeam(input: TeamInput): FormErrors {
  const e: FormErrors = {};
  if (blank(input.school)) e.school = "required";
  if (blank(input.teamName)) e.teamName = "required";
  if (input.members.length < teamSize.min || input.members.length > teamSize.max) e.members = "teamSize";
  input.members.forEach((m, i) => {
    if (blank(m.name)) e[`members.${i}.name`] = "required";
    const age = parsedAge(m.age);
    if (blank(m.age)) e[`members.${i}.age`] = "required";
    else if (!Number.isFinite(age) || age < memberAge.min || age > memberAge.max) e[`members.${i}.age`] = "age";
  });
  if (blank(input.mentor)) e.mentor = "required";
  if (blank(input.contact)) e.contact = "required";
  else if (!isEmail(input.contact)) e.contact = "email";
  if (needsGuardianConsent(input.members) && !input.guardianConsent) e.guardianConsent = "guardianConsent";
  return e;
}

export function teamFromInput(input: TeamInput, challengeId: string, id: string, now: string): TeamApplication {
  const members: TeamMember[] = input.members.map((m) => ({ name: clean(m.name), age: parsedAge(m.age) }));
  return {
    id,
    challengeId,
    school: clean(input.school),
    teamName: clean(input.teamName),
    members,
    mentor: clean(input.mentor),
    contact: clean(input.contact),
    guardianConsent: needsGuardianConsent(members) ? input.guardianConsent : undefined,
    status: "applied",
    createdAt: now,
  };
}
