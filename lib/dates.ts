import type { ISODate, Locale } from "@/lib/data/types";

/** Dates are handled as UTC calendar days so time zones never shift them. */
export function parseISODate(date: ISODate): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function toISODate(date: Date): ISODate {
  return date.toISOString().slice(0, 10);
}

export function todayISO(): ISODate {
  const now = new Date();
  return toISODate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function addDays(date: ISODate, days: number): ISODate {
  const d = parseISODate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function isWeekend(date: ISODate): boolean {
  const day = parseISODate(date).getUTCDay();
  return day === 0 || day === 6;
}

/** End date of a placement that starts on `start` and lasts `workingDays` working days (Mon–Fri). */
export function endAfterWorkingDays(start: ISODate, workingDays: number): ISODate {
  let current = start;
  // A start on a weekend moves to the next Monday.
  while (isWeekend(current)) current = addDays(current, 1);
  let counted = 1;
  while (counted < workingDays) {
    current = addDays(current, 1);
    if (!isWeekend(current)) counted++;
  }
  return current;
}

/** Age in full years on `on` (default: today). */
export function ageOn(birthDate: ISODate, on: ISODate = todayISO()): number {
  const b = parseISODate(birthDate);
  const o = parseISODate(on);
  let age = o.getUTCFullYear() - b.getUTCFullYear();
  const m = o.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && o.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

const intlLocale: Record<Locale, string> = { lv: "lv-LV", en: "en-GB" };

export function formatDate(date: ISODate, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(parseISODate(date));
}

export function formatDateTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Compact date range: "2026. gada 23.–27. novembris" / "23–27 November 2026". */
export function formatRange(start: ISODate, end: ISODate, locale: Locale): string {
  const s = parseISODate(start);
  const e = parseISODate(end);
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const sameMonth = sameYear && s.getUTCMonth() === e.getUTCMonth();
  const fmt = (d: ISODate, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intlLocale[locale], { timeZone: "UTC", ...o }).format(parseISODate(d));
  if (locale === "lv") {
    const year = `${e.getUTCFullYear()}. gada`;
    if (sameMonth) return `${year} ${s.getUTCDate()}.–${fmt(end, { day: "numeric", month: "long" })}`;
    if (sameYear) return `${year} ${fmt(start, { day: "numeric", month: "short" })} – ${fmt(end, { day: "numeric", month: "short" })}`;
    return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
  }
  if (sameMonth) return `${s.getUTCDate()}–${fmt(end, { day: "numeric", month: "long", year: "numeric" })}`;
  if (sameYear) return `${fmt(start, { day: "numeric", month: "short" })} – ${fmt(end, { day: "numeric", month: "short", year: "numeric" })}`;
  return `${formatDate(start, locale)} – ${formatDate(end, locale)}`;
}

export function monthKey(date: ISODate): string {
  return date.slice(0, 7);
}

export function formatMonth(key: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(
    parseISODate(`${key}-01`),
  );
}
