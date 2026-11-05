"use client";

import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { eventConfig } from "@/config/event";
import { siteConfig } from "@/config/site";
import { buttonClass } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { roleIcon } from "@/components/role-icon";
import type { Role } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { navFor, navHref, roleHome, ROLES } from "@/lib/roles";
import { useTheme } from "@/lib/theme";

export function SiteHeader() {
  const { t } = useI18n();
  const { role } = useRole();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const nav = navFor(role);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="no-print sticky top-0 z-40 border-b-2 border-edge bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        {t.nav.skipToContent}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-md" aria-label={eventConfig.name}>
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-extrabold tracking-tight text-ink">{siteConfig.brand}</span>
            <span className="mt-1 hidden text-[11px] font-medium text-ink-muted xl:block">{eventConfig.name}</span>
          </span>
        </Link>

        <nav aria-label={t.nav.mainNav} className="ml-3 hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((key) => {
              const href = navHref[key];
              return (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`whitespace-nowrap rounded-full border-2 px-3 py-1.5 text-[0.95rem] font-bold transition-colors ${
                      isActive(href) ? "border-edge bg-accent text-on-accent" : "border-transparent text-ink-muted hover:border-line hover:text-ink"
                    }`}
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* On phones the toggles live in the menu, so everything fits at 360px. */}
          <ThemeToggle className="hidden sm:inline-flex" />
          <LanguageToggle className="hidden sm:flex" />
          <RoleMenu />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border-2 border-edge bg-surface lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label={t.nav.mainNav} className="border-t-2 border-edge bg-surface lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {nav.map((key) => {
              const href = navHref[key];
              return (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`block rounded-full px-4 py-3 font-bold ${isActive(href) ? "bg-accent text-on-accent" : "text-ink"}`}
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              );
            })}
            <li className="flex items-center justify-between gap-3 px-3 py-3 sm:hidden">
              <span className="font-semibold">{t.nav.language}</span>
              <LanguageToggle />
            </li>
            <li className="flex items-center justify-between gap-3 px-3 py-2 sm:hidden">
              <span className="font-semibold">{t.nav.theme}</span>
              <ThemeToggle withLabel />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function ThemeToggle({ className = "inline-flex", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const { t } = useI18n();
  const { theme, toggle } = useTheme();
  const label = theme === "dark" ? t.nav.lightMode : t.nav.darkMode;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={withLabel ? undefined : label}
      title={label}
      className={`${className} h-10 items-center justify-center gap-2 rounded-full border-2 border-edge bg-surface px-2.5 text-sm font-bold text-ink hover:bg-accent hover:text-on-accent`}
    >
      {theme === "dark" ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
      {withLabel && <span>{label}</span>}
    </button>
  );
}

function LanguageToggle({ className = "flex" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.nav.language} className={`${className} h-10 items-center rounded-full border-2 border-edge bg-surface p-0.5 text-sm font-bold`}>
      {(["lv", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          aria-label={l === "lv" ? t.nav.switchToLv : t.nav.switchToEn}
          onClick={() => setLocale(l)}
          className={`h-full rounded-full px-2.5 uppercase transition-colors sm:px-3 ${
            locale === l ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** The role switch: pick a role on the first visit, then switch or leave it. No accounts. */
function RoleMenu() {
  const { t } = useI18n();
  const { role, setRole } = useRole();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Role) => {
    setOpen(false);
    setRole(next);
    router.push(roleHome[next]);
  };
  const leave = () => {
    setOpen(false);
    setRole(null);
    router.push("/");
  };

  const item = "flex w-full items-center gap-2.5 rounded-full px-3 py-2.5 text-left text-[0.95rem] font-semibold text-ink hover:bg-accent hover:text-on-accent";
  const Current = role ? roleIcon[role] : null;

  return (
    <div className="relative" ref={ref}>
      {role && Current ? (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={`${t.nav.roleMenu}: ${t.roles[role]}`}
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 items-center gap-2 rounded-full border-2 border-edge bg-surface px-1 text-sm font-semibold hover:bg-surface-muted sm:pr-3"
        >
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-fill text-white">
            <Current className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
            <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ink-muted">{t.nav.youAre}</span>
            <span className="max-w-[9rem] truncate">{t.roles[role]}</span>
          </span>
          <ChevronDown className="hidden size-4 shrink-0 text-ink-muted sm:block" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((o) => !o)}
          className={buttonClass("primary", "sm", "h-10")}
        >
          <UserRound className="size-4" aria-hidden="true" />
          {t.nav.chooseRole}
        </button>
      )}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-lg border-2 border-edge bg-surface p-1.5 shadow-lift">
          {role && (
            <ul className="border-b border-line pb-1.5">
              <li>
                <Link href="/dashboard" className={item} onClick={() => setOpen(false)}>
                  <LayoutDashboard className="size-4 text-ink-muted" aria-hidden="true" />
                  {t.nav.dashboard}
                </Link>
              </li>
            </ul>
          )}
          {role && <p className="px-3 pb-1 pt-2.5 text-xs font-bold uppercase tracking-wide text-ink-muted">{t.nav.switchRole}</p>}
          <ul className="pt-1">
            {ROLES.filter((r) => r !== role).map((r) => {
              const Icon = roleIcon[r];
              return (
                <li key={r}>
                  <button type="button" className={item} onClick={() => choose(r)}>
                    <Icon className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    {t.roleButtons[r]}
                  </button>
                </li>
              );
            })}
          </ul>
          {role && (
            <ul className="mt-1 border-t border-line pt-1">
              <li>
                <button type="button" className={item} onClick={leave}>
                  <LogOut className="size-4 text-ink-muted" aria-hidden="true" />
                  {t.nav.clearRole}
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
