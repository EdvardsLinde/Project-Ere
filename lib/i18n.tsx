"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/messages/en";
import lv, { type Messages } from "@/messages/lv";
import type { Locale } from "@/lib/data/types";
import { LOCALE_COOKIE } from "@/lib/locale";

const dictionaries: Record<Locale, Messages> = { lv, en };

interface I18nValue {
  locale: Locale;
  t: Messages;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* cookies blocked (e.g. sandboxed preview) */
    }
    try {
      window.localStorage.setItem(LOCALE_COOKIE, l);
    } catch {
      /* storage blocked */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = document.title.replace(dictionaries[locale === "lv" ? "en" : "lv"].meta.title, dictionaries[locale].meta.title);
  }, [locale]);

  const value = useMemo(() => ({ locale, t: dictionaries[locale], setLocale }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Fill `{name}` placeholders. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function formatBytes(bytes: number, locale: Locale): string {
  const nf = new Intl.NumberFormat(locale === "lv" ? "lv-LV" : "en-GB", { maximumFractionDigits: 1 });
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${nf.format(bytes / 1024)} KB`;
  return `${nf.format(bytes / (1024 * 1024))} MB`;
}
