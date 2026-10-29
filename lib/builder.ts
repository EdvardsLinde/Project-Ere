import { siteConfig } from "@/config/site";
import type { PlacementInput } from "@/lib/data/repository";
import type { CompanyProfile, DayPlanItem, Locale, Placement } from "@/lib/data/types";
import { endAfterWorkingDays, todayISO } from "@/lib/dates";
import { isTermOpen, tx } from "@/lib/placements";
import { isEmail } from "@/lib/validation";
import type { Messages } from "@/messages/lv";

export const STEP_COUNT = 7;

export function emptyPlacementInput(company: CompanyProfile | null): PlacementInput {
  return {
    company: {
      name: company?.name ?? "",
      regNumber: company?.regNumber ?? "",
      industry: company?.industry ?? "",
      description: company?.description ?? "",
      employees: company?.employees ?? "",
      website: company?.website ?? "",
      logo: company?.logo ?? "",
      address: company ? { ...company.address } : { street: "", town: "", parish: "", postcode: "" },
      directions: company?.directions ?? "",
      contactPerson: company ? { ...company.contactPerson } : { name: "", position: "", email: "", phone: "" },
    },
    title: "",
    focusArea: "",
    lengthDays: 5,
    terms: [],
    hoursFrom: "09:00",
    hoursTo: "16:00",
    format: "onsite",
    languages: ["lv"],
    ageFrom: siteConfig.ageMin,
    ageTo: siteConfig.ageMax,
    educationLevels: ["secondary", "vocational", "university"],
    beginnerFriendly: true,
    problem: "",
    outputType: "",
    outputDescription: "",
    dayPlan: Array.from({ length: 5 }, () => ({ title: "", description: "" })),
    tools: [],
    dataSystems: "",
    ndaRequired: false,
    skillsRequired: [],
    skillsNice: [],
    skillLevel: "none",
    bring: [],
    safetyBriefing: true,
    ppe: "",
    minorRestrictions: "",
    parentalConsentRequired: true,
    mentor: { name: "", position: "", bio: "", isSample: false },
    recognisesCertificate: true,
    compensation: { none: false, stipend: false, stipendAmount: null, meals: false, travel: false },
    opportunities: [],
    opportunitiesOther: "",
    deadlineDays: 10,
    requireCv: false,
    requireMotivation: true,
    questions: [],
    selectionMethod: "review",
  };
}

export function toInput(p: Placement): PlacementInput {
  const { id: _id, companyId: _c, status: _s, isSample: _i, createdAt: _cr, updatedAt: _u, publishedAt: _p, ...input } = p;
  void [_id, _c, _s, _i, _cr, _u, _p];
  return structuredClone(input);
}

/** Resize the day plan to the placement length, keeping what was typed. */
export function resizeDayPlan(plan: DayPlanItem[], length: number): DayPlanItem[] {
  const next = plan.slice(0, length);
  while (next.length < length) next.push({ title: "", description: "" });
  return next;
}

export function samplePlan(length: number, m: Messages): DayPlanItem[] {
  const s = m.builder.s3.samplePlan;
  return Array.from({ length }, (_, i) => {
    const src = i === 0 ? s.first : i === length - 1 ? s.last : s.middle;
    return { title: src.title, description: src.description };
  });
}

export function recalcTerms(input: PlacementInput, lengthDays: number): PlacementInput["terms"] {
  return input.terms.map((t) => ({ ...t, end: t.start ? endAfterWorkingDays(t.start, lengthDays) : "" }));
}

export type MissingKey = keyof Messages["builder"]["missing"];
export interface MissingItem {
  step: number;
  key: MissingKey;
  /** Field id used to show the error inline. */
  field: string;
}

const blank = (v: unknown, locale: Locale) => !tx(v as string, locale).trim();

/** Everything required before publishing. Empty array = ready. */
export function validatePlacement(p: PlacementInput, locale: Locale, today = todayISO()): MissingItem[] {
  const out: MissingItem[] = [];
  const add = (step: number, key: MissingKey, field: string = key) => out.push({ step, key, field });
  const c = p.company;

  if (!c.name.trim()) add(0, "companyName", "name");
  if (!c.industry) add(0, "industry");
  if (blank(c.description, locale)) add(0, "description");
  else if (tx(c.description, locale).length > 600) add(0, "descriptionLong", "description");
  if (!c.address.street.trim() || c.address.street.startsWith("[TODO")) add(0, "street");
  if (!c.address.town.trim()) add(0, "town");
  if (!c.contactPerson.name.trim()) add(0, "contactName");
  if (!c.contactPerson.email.trim()) add(0, "contactEmail");
  else if (!isEmail(c.contactPerson.email)) add(0, "contactEmailInvalid", "contactEmail");
  if (!c.contactPerson.phone.trim()) add(0, "contactPhone");

  if (blank(p.title, locale)) add(1, "title");
  if (!p.focusArea) add(1, "focusArea");
  if (p.terms.length === 0) add(1, "terms");
  p.terms.forEach((t, i) => {
    if (!t.start || t.start < today) add(1, "termStart", `term-start-${i}`);
    if (!t.spots || t.spots < 1) add(1, "termSpots", `term-spots-${i}`);
  });
  if (p.ageFrom < siteConfig.ageMin || p.ageTo > siteConfig.ageMax || p.ageFrom > p.ageTo) add(1, "ages");

  if (blank(p.problem, locale)) add(2, "problem");
  if (!p.outputType) add(2, "outputType");
  if (blank(p.outputDescription, locale)) add(2, "outputDescription");

  if (!p.mentor.name.trim()) add(4, "mentorName");
  if (blank(p.mentor.position, locale)) add(4, "mentorPosition");
  if (p.compensation.stipend && !(p.compensation.stipendAmount && p.compensation.stipendAmount > 0)) add(4, "stipendAmount");

  if (!Number.isInteger(p.deadlineDays) || p.deadlineDays < 0 || p.deadlineDays > 60) add(5, "deadline");
  else if (p.terms.length && p.terms.every((t) => t.start && !isTermOpen(t, p, today))) add(5, "deadlineAfterStart", "deadline");
  p.questions.forEach((q, i) => {
    if (blank(q.text, locale)) add(5, "questionText", `question-${i}`);
  });
  return out;
}
