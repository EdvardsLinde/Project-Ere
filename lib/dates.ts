import type { Locale } from "@/lib/data/types";

/** e.g. "5. nov. 2026, 14:30" / "5 Nov 2026, 14:30". */
export function formatDateTime(value: string, locale: Locale): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "lv" ? "lv-LV" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Euro amount, e.g. "250 €" / "€250". */
export function formatEuro(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "lv" ? "lv-LV" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
