/**
 * Entry point of the single-file preview build (`npm run build:artifact`).
 * Renders the same pages and components as the Next.js app, with an in-memory
 * router instead of Next's (see `artifact/router.tsx` and `artifact/shims/`).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "@/app/page";
import NotFound from "@/app/not-found";
import VerifyFormPage from "@/app/parbaudit/page";
import VerifyResultPage from "@/app/parbaudit/[id]/page";
import LoginPage from "@/app/pieslegties/page";
import CataloguePage from "@/app/prakses/page";
import PlacementPage from "@/app/prakses/[id]/page";
import ApplyPage from "@/app/prakses/[id]/pieteikties/page";
import PrivacyPage from "@/app/privatums/page";
import ProfilePage from "@/app/profils/page";
import CertificatePage from "@/app/sertifikats/[id]/page";
import StudentDashboard from "@/app/students/page";
import CompanyDashboard from "@/app/uznemums/page";
import NewPlacementPage from "@/app/uznemums/prakses/jauna/page";
import EditPlacementPage from "@/app/uznemums/prakses/[id]/rediget/page";
import ApplicationsPage from "@/app/uznemums/prakses/[id]/pieteikumi/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import type { Locale } from "@/lib/data/types";
import { I18nProvider } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/locale";
import { SessionProvider } from "@/lib/session";
import { matchRoute, ParamsContext, router, splitHref, startHashSync, useHref } from "./router";

declare const __ARTIFACT_URL__: string;

const routes: [string, React.ComponentType][] = [
  ["/", HomePage],
  ["/prakses", CataloguePage],
  ["/prakses/:id", PlacementPage],
  ["/prakses/:id/pieteikties", ApplyPage],
  ["/pieslegties", LoginPage],
  ["/students", StudentDashboard],
  ["/profils", ProfilePage],
  ["/uznemums", CompanyDashboard],
  ["/uznemums/prakses/jauna", NewPlacementPage],
  ["/uznemums/prakses/:id/rediget", EditPlacementPage],
  ["/uznemums/prakses/:id/pieteikumi", ApplicationsPage],
  ["/sertifikats/:id", CertificatePage],
  ["/parbaudit", VerifyFormPage],
  ["/parbaudit/:id", VerifyResultPage],
  ["/privatums", PrivacyPage],
];

(globalThis as { __SDP_ENV__?: unknown }).__SDP_ENV__ = {
  search: () => splitHref(router.current()).search,
  verifyUrl: (id: string) => {
    const base = __ARTIFACT_URL__ || window.location.href.split("#")[0];
    return `${base}#parbaudit-${id}`;
  },
  canPrint: false,
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

startHashSync();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider initialLocale={readLocale()}>
      <SessionProvider>
        <ToastProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              <RouterView />
            </main>
            <SiteFooter />
          </div>
        </ToastProvider>
      </SessionProvider>
    </I18nProvider>
  </StrictMode>,
);
