/**
 * Entry point of the single-file preview build (`npm run build:artifact`).
 * Renders the same pages and components as the Next.js app, with an in-memory
 * router instead of Next's (see `artifact/router.tsx` and `artifact/shims/`).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AgendaPage from "@/app/agenda/page";
import NotFound from "@/app/not-found";
import HomePage from "@/app/page";
import PrivacyPage from "@/app/privacy/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import type { Locale, Role } from "@/lib/data/types";
import { I18nProvider } from "@/lib/i18n";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, LOCALE_COOKIE, ROLE_COOKIE, THEME_COOKIE, type Theme } from "@/lib/locale";
import { RoleProvider } from "@/lib/role";
import { isRole } from "@/lib/roles";
import { ThemeProvider } from "@/lib/theme";
import { themeCss } from "@/lib/theme-css";
import { matchRoute, ParamsContext, router, splitHref, startHashSync, useHref } from "./router";

const routes: [string, React.ComponentType][] = [
  ["/", HomePage],
  ["/agenda", AgendaPage],
  ["/privacy", PrivacyPage],
];

(globalThis as { __SDP_ENV__?: unknown }).__SDP_ENV__ = {
  search: () => splitHref(router.current()).search,
};

function RouterView() {
  const href = useHref();
  const { path } = splitHref(href);
  for (const [pattern, Page] of routes) {
    const params = matchRoute(pattern, path);
    if (params) {
      return (
        <ParamsContext.Provider value={params}>
          <Page key={path} />
        </ParamsContext.Provider>
      );
    }
  }
  return <NotFound />;
}

function readLocale(): Locale {
  try {
    const v = window.localStorage.getItem(LOCALE_COOKIE);
    if (v === "lv" || v === "en") return v;
  } catch {
    /* storage blocked */
  }
  return DEFAULT_LOCALE;
}

function readRole(): Role | null {
  try {
    const v = window.localStorage.getItem(ROLE_COOKIE);
    if (isRole(v)) return v;
  } catch {
    /* storage blocked */
  }
  return null;
}

function readTheme(): Theme {
  try {
    const v = window.localStorage.getItem(THEME_COOKIE);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* storage blocked */
  }
  return siteConfig.defaultTheme;
}

const style = document.createElement("style");
style.textContent = themeCss();
document.head.appendChild(style);
const initialTheme = readTheme();
document.documentElement.classList.toggle("dark", initialTheme === "dark");

startHashSync();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider initialLocale={readLocale()}>
      <ThemeProvider initialTheme={initialTheme}>
        <RoleProvider initialRole={readRole()}>
          <ToastProvider>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <main id="main" className="flex-1">
                <RouterView />
              </main>
              <SiteFooter />
            </div>
          </ToastProvider>
        </RoleProvider>
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>,
);
