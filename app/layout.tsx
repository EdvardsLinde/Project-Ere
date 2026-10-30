import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteBackground } from "@/components/site-background";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import type { Locale } from "@/lib/data/types";
import { I18nProvider } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, THEME_COOKIE, type Theme } from "@/lib/locale";
import { SessionProvider } from "@/lib/session";
import { ThemeProvider } from "@/lib/theme";
import { themeCss } from "@/lib/theme-css";
import en from "@/messages/en";
import lv from "@/messages/lv";

async function readPrefs(): Promise<{ locale: Locale; theme: Theme }> {
  const jar = await cookies();
  const l = jar.get(LOCALE_COOKIE)?.value;
  const t = jar.get(THEME_COOKIE)?.value;
  return {
    locale: l === "en" || l === "lv" ? l : DEFAULT_LOCALE,
    theme: t === "dark" || t === "light" ? t : siteConfig.defaultTheme,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const m = (await readPrefs()).locale === "en" ? en : lv;
  return {
    title: { default: m.meta.title, template: `%s · ${siteConfig.brand}` },
    description: m.meta.description,
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.theme.light.bg },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.theme.dark.bg },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, theme } = await readPrefs();
  return (
    <html lang={locale} className={theme === "dark" ? "dark" : undefined}>
      <head>
        <style>{themeCss()}</style>
      </head>
      <body className="flex min-h-dvh flex-col">
        <I18nProvider initialLocale={locale}>
          <ThemeProvider initialTheme={theme}>
            <SessionProvider>
              <ToastProvider>
                <SiteBackground />
                <SiteHeader />
                <main id="main" className="flex-1">
                  {children}
                </main>
                <SiteFooter />
              </ToastProvider>
            </SessionProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
