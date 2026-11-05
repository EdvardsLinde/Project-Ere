import { sectors } from "@/config/event";
import type { Exhibitor, Locale } from "@/lib/data/types";
import { optionLabel, tx } from "@/lib/text";

/** "Mežsaimniecība", or the adjacent field when there is one ("Saistītā nozare: Kiberdrošība"). */
export function sectorLabel(e: Pick<Exhibitor, "sector" | "adjacentNote">, locale: Locale): string {
  const label = optionLabel(sectors, e.sector, locale);
  const note = tx(e.adjacentNote, locale);
  return e.sector === "adjacent" && note ? `${label}: ${note}` : label;
}

/**
 * Real local companies in the seed are examples whose participation is not
 * confirmed (status `submitted`); fictional examples are `approved`.
 */
export const isUnconfirmedExample = (e: Pick<Exhibitor, "isExample" | "status">) => e.isExample && e.status === "submitted";
