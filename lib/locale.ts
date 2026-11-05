import type { Locale } from "@/lib/data/types";

/** Shared by the server layout and the client providers — keep this file free of "use client". */
export const LOCALE_COOKIE = "sdp-locale";
export const DEFAULT_LOCALE: Locale = "lv";

export type Theme = "dark" | "light";
export const THEME_COOKIE = "seer-theme";

/** Front-end role (no accounts); the server reads it so the right menu renders first time. */
export const ROLE_COOKIE = "seer-role";
