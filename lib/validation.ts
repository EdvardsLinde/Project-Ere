import { z } from "zod";

const emailSchema = z.email();

export const isEmail = (v: string) => emailSchema.safeParse(v.trim()).success;

/** Accepts Latvian and international numbers: digits, spaces, +, -, (), at least 8 digits. */
export const isPhone = (v: string) => /^\+?[\d\s\-()]{8,20}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 8;

export const isISODate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export const isUrl = (v: string) => {
  const value = v.trim();
  if (!value) return true;
  try {
    const u = new URL(value.startsWith("http") ? value : `https://${value}`);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
};

export type Errors<K extends string = string> = Partial<Record<K, string>>;

/** Move focus to the first invalid control so keyboard and screen-reader users land on it. */
export function focusFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]');
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
