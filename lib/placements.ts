import { siteConfig, type Bilingual } from "@/config/site";
import { addDays, ageOn, todayISO } from "@/lib/dates";
import type { Application, Locale, Placement, PlacementTerm, Text } from "@/lib/data/types";

/** Resolve bilingual text. Plain strings (typed by a company) are shown as-is. */
export function tx(text: Text | Bilingual | undefined | null, locale: Locale): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.lv || text.en || "";
}

export function optionLabel<T extends { id: string; label: Bilingual }>(
  list: readonly T[],
  id: string | undefined,
  locale: Locale,
): string {
  return list.find((o) => o.id === id)?.label[locale] ?? "";
}

export const industryLabel = (id: string, l: Locale) => optionLabel(siteConfig.industries, id, l);
export const focusLabel = (id: string, l: Locale) => optionLabel(siteConfig.focusAreas, id, l);
export const outputLabel = (id: string, l: Locale) => optionLabel(siteConfig.outputTypes, id, l);
export const opportunityLabel = (id: string, l: Locale) => optionLabel(siteConfig.opportunities, id, l);
export const schoolLabel = (id: string, other: string, l: Locale) =>
  id === "other" ? other || optionLabel(siteConfig.schools, id, l) : optionLabel(siteConfig.schools, id, l);

/** Applications that hold a spot (approved or already completed). */
export function takenSpots(termId: string, applications: Application[]): number {
  return applications.filter((a) => a.termId === termId && (a.status === "approved" || a.status === "completed"))
    .length;
}

export function freeSpots(term: PlacementTerm, applications: Application[]): number {
  return Math.max(0, term.spots - takenSpots(term.id, applications));
}

/** Last day to apply for a date range: `deadlineDays` before its start. */
export function termDeadline(term: Pick<PlacementTerm, "start">, placement: Pick<Placement, "deadlineDays">): string {
  return addDays(term.start, -Math.max(0, placement.deadlineDays || 0));
}

export function isTermOpen(term: PlacementTerm, placement: Pick<Placement, "deadlineDays">, today = todayISO()): boolean {
  return !!term.start && termDeadline(term, placement) >= today;
}

/** Terms that have not started yet, soonest first. */
export function upcomingTerms(placement: Pick<Placement, "terms">, today = todayISO()): PlacementTerm[] {
  return [...placement.terms].filter((t) => t.start >= today).sort((a, b) => a.start.localeCompare(b.start));
}

export function totalFreeSpots(placement: Placement, applications: Application[], today = todayISO()): number {
  return upcomingTerms(placement, today).reduce((sum, t) => sum + freeSpots(t, applications), 0);
}

export function nextStart(placement: Placement, today = todayISO()): string | null {
  return upcomingTerms(placement, today)[0]?.start ?? null;
}

/** Date ranges that can still be applied for, soonest first. */
export function openTerms(placement: Placement, today = todayISO()): PlacementTerm[] {
  return upcomingTerms(placement, today).filter((t) => isTermOpen(t, placement, today));
}

/** The soonest application deadline that hasn't passed, if any. */
export function nextDeadline(placement: Placement, today = todayISO()): string | null {
  const term = openTerms(placement, today)[0];
  return term ? termDeadline(term, placement) : null;
}

export type ApplyBlock = "not-published" | "deadline" | "full" | "duplicate" | null;

/** Why a student can't apply (or `null` if they can). */
export function applyBlockReason(
  placement: Placement,
  placementApplications: Application[],
  studentId: string | null,
  today = todayISO(),
): ApplyBlock {
  if (placement.status !== "published") return "not-published";
  if (studentId && placementApplications.some((a) => a.studentId === studentId)) return "duplicate";
  const open = openTerms(placement, today);
  if (open.length === 0) return "deadline";
  if (open.every((t) => freeSpots(t, placementApplications) === 0)) return "full";
  return null;
}

export function isMinor(birthDate: string, on?: string): boolean {
  if (!birthDate) return false;
  return ageOn(birthDate, on) < 18;
}

export function averageScore(e: {
  problemSolving: number;
  data: number;
  communication: number;
  independence: number;
  responsibility: number;
}): number {
  const v = (e.problemSolving + e.data + e.communication + e.independence + e.responsibility) / 5;
  return Math.round(v * 10) / 10;
}

export function formatScore(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "lv" ? "lv-LV" : "en-GB", { maximumFractionDigits: 1 }).format(value);
}

export function formatCertificateId(year: number, seq: number): string {
  return `${siteConfig.certificatePrefix}-${year}-${String(seq).padStart(4, "0")}`;
}

export function mapsUrl(parts: string[]): string {
  const q = parts.filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function placementSearchText(p: Placement): string {
  const bits: string[] = [p.company.name, p.company.address.town, ...p.tools];
  for (const t of [p.title, p.problem, p.outputDescription, ...p.skillsRequired, ...p.skillsNice]) {
    if (typeof t === "string") bits.push(t);
    else bits.push(t.lv, t.en);
  }
  return bits.join(" ").toLocaleLowerCase();
}
