import type { Bilingual } from "@/config/site";
import type { Locale, Localized } from "@/lib/data/fair-types";

/** Resolve bilingual text. Plain strings (typed into a form) are shown as-is. */
export function tx(text: Localized | Bilingual | undefined | null, locale: Locale): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.lv || text.en || "";
}

/** Label of an option in a `{ id, label }` list, e.g. `sectors`. */
export function optionLabel<T extends { id: string; label: Bilingual }>(
  list: readonly T[],
  id: string | undefined,
  locale: Locale,
): string {
  return list.find((o) => o.id === id)?.label[locale] ?? "";
}
