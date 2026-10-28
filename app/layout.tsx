import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import type { Locale } from "@/lib/data/types";
import { I18nProvider } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/locale";
import { SessionProvider } from "@/lib/session";
import en from "@/messages/en";
import lv from "@/messages/lv";

async function readLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return value === "en" || value === "lv" ? value : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const m = (await readLocale()) === "en" ? en : lv;
  return {
    title: { default: m.meta.title, template: `%s · ${m.meta.title}` },
    description: m.meta.description,
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: siteConfig.theme.primary,
  width: "device-width",
  initialScale: 1,
};

/** Colour tokens from config/site.ts → CSS variables used by the Tailwind theme. */
const themeVars = Object.entries(siteConfig.theme)
  .map(([k, v]) => `--c-${k}:${v};`)
  .join("");

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await readLocale();
  return (
    <html lang={locale} style={{ colorScheme: "light" }}>
      <head>
        <style>{`:root{${themeVars}}`}</style>
      </head>
      <body className="flex min-h-dvh flex-col">
        <I18nProvider initialLocale={locale}>
          <SessionProvider>
            <ToastProvider>
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </ToastProvider>
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
