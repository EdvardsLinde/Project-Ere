import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { eventConfig } from "@/config/event";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import type { Locale, Role } from "@/lib/data/types";
import { I18nProvider } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, ROLE_COOKIE, THEME_COOKIE, type Theme } from "@/lib/locale";
import { RoleProvider } from "@/lib/role";
import { isRole } from "@/lib/roles";
import { ThemeProvider } from "@/lib/theme";
import { themeCss } from "@/lib/theme-css";
import en from "@/messages/en";
import lv from "@/messages/lv";

async function readPrefs(): Promise<{ locale: Locale; theme: Theme; role: Role | null }> {
  const jar = await cookies();
  const l = jar.get(LOCALE_COOKIE)?.value;
  const t = jar.get(THEME_COOKIE)?.value;
  const r = jar.get(ROLE_COOKIE)?.value;
  return {
    locale: l === "en" || l === "lv" ? l : DEFAULT_LOCALE,
    theme: t === "dark" || t === "light" ? t : siteConfig.defaultTheme,
    role: isRole(r) ? r : null,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const m = (await readPrefs()).locale === "en" ? en : lv;
  return {
    title: { default: m.meta.title, template: `%s · ${siteConfig.brand}` },
    description: m.meta.description,
    icons: { icon: "/icon.svg" },
    openGraph: { type: "website", siteName: eventConfig.name, title: m.meta.title, description: m.meta.description },
    twitter: { card: "summary_large_image" },
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
  const { locale, theme, role } = await readPrefs();
  return (
    <html lang={locale} className={theme === "dark" ? "dark" : undefined}>
      <head>
        <style>{themeCss()}</style>
      </head>
      <body className="flex min-h-dvh flex-col">
        <I18nProvider initialLocale={locale}>
          <ThemeProvider initialTheme={theme}>
            <RoleProvider initialRole={role}>
              <ToastProvider>
                <SiteHeader />
                <main id="main" className="page-frame flex-1">
                  {children}
                </main>
                <SiteFooter />
              </ToastProvider>
            </RoleProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
