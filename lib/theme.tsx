"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { THEME_COOKIE, type Theme } from "@/lib/locale";

interface ThemeValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/** Light/dark mode. The server renders `html.dark` from the cookie, so there is no flash. */
export function ThemeProvider({ initialTheme, children }: { initialTheme: Theme; children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      } catch {
        /* cookies blocked */
      }
      try {
        window.localStorage.setItem(THEME_COOKIE, next);
      } catch {
        /* storage blocked */
      }
      return next;
    });
  }, []);
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
