"use client";

import { Building2, ChevronDown, GraduationCap, LayoutDashboard, LogOut, Menu, Plus, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { getRepository } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { dashboardPath, loginPath, useSession } from "@/lib/session";

export function SiteHeader() {
  const { t, locale } = useI18n();
  const { session, ready } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = session?.user.role;

  // Close the mobile menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const nav =
    role === "company"
      ? [
          { href: "/", label: t.nav.idea },
          { href: "/uznemums", label: t.nav.myPlacements },
        ]
      : [
          { href: "/", label: t.nav.idea },
          { href: "/prakses", label: t.nav.placements },
        ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-bg"
      >
        {t.nav.skipToContent}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-md" aria-label={siteConfig.name[locale]}>
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-muted">Saldus</span>
            <span className="text-[0.95rem] font-extrabold tracking-tight text-ink">{siteConfig.shortName[locale]}</span>
          </span>
        </Link>

        <nav aria-label={t.nav.mainNav} className="ml-4 hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative rounded-md px-3 py-2 text-[0.95rem] font-semibold transition-colors hover:bg-surface-muted ${
                    isActive(item.href) ? "text-ink after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:rounded-full after:bg-accent" : "text-ink-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {role === "company" && (
              <li>
                <Link
                  href="/uznemums/prakses/jauna"
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.95rem] font-semibold text-primary hover:bg-primary-soft"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t.nav.addPlacement}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          {ready && !session && (
            <div className="hidden items-center gap-2 lg:flex">
              <LinkButton href={loginPath("company")} variant="secondary" size="sm" className="h-10">
                <Building2 className="size-4" aria-hidden="true" />
                {t.nav.forCompanies}
              </LinkButton>
              <LinkButton href={loginPath("student")} variant="primary" size="sm" className="h-10">
                <GraduationCap className="size-4" aria-hidden="true" />
                {t.nav.forStudents}
              </LinkButton>
            </div>
          )}
          {ready && session && <UserMenu />}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-line md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Role buttons stay visible on small screens as a second row. */}
      {ready && !session && (
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 pb-3 sm:px-6 lg:hidden">
          <LinkButton
            href={loginPath("company")}
            variant="secondary"
            size="sm"
            className="h-auto min-h-10 whitespace-normal py-1.5 text-center leading-tight"
          >
            <Building2 className="size-4 shrink-0" aria-hidden="true" />
            {t.nav.forCompanies}
          </LinkButton>
          <LinkButton
            href={loginPath("student")}
            variant="primary"
            size="sm"
            className="h-auto min-h-10 whitespace-normal py-1.5 text-center leading-tight"
          >
            <GraduationCap className="size-4 shrink-0" aria-hidden="true" />
            {t.nav.forStudents}
          </LinkButton>
        </div>
      )}

      {menuOpen && (
        <nav id="mobile-nav" aria-label={t.nav.mainNav} className="border-t border-line bg-surface md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-3 font-semibold ${isActive(item.href) ? "bg-primary-soft text-primary" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {role === "company" && (
              <li>
                <Link href="/uznemums/prakses/jauna" className="flex items-center gap-2 rounded-md px-3 py-3 font-semibold text-primary">
                  <Plus className="size-4" aria-hidden="true" />
                  {t.nav.addPlacement}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.nav.language} className="flex h-10 items-center rounded-md border border-line p-0.5 text-sm font-bold">
      {(["lv", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          aria-label={l === "lv" ? t.nav.switchToLv : t.nav.switchToEn}
          onClick={() => setLocale(l)}
          className={`h-full rounded-[5px] px-2.5 uppercase transition-colors ${
            locale === l ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function UserMenu() {
  const { t } = useI18n();
  const { session } = useSession();
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

  if (!session) return null;
  const isCompany = session.user.role === "company";
  const name = isCompany
    ? session.company?.name ?? session.user.email
    : [session.student?.firstName, session.student?.lastName].filter(Boolean).join(" ") || session.user.email;

  const logout = async () => {
    setOpen(false);
    await getRepository().logout();
    router.push("/");
  };

  const item = "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[0.95rem] font-semibold text-ink hover:bg-surface-muted";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${t.nav.userMenu}: ${name}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 max-w-[14rem] items-center gap-2 rounded-md border border-line bg-surface pl-2 pr-2 text-sm font-semibold hover:bg-surface-muted"
      >
        <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full ${isCompany ? "bg-accent text-on-accent" : "bg-primary text-white"}`}>
          {isCompany ? <Building2 className="size-4" aria-hidden="true" /> : <GraduationCap className="size-4" aria-hidden="true" />}
        </span>
        <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
          <span className="max-w-[9rem] truncate">{name}</span>
          <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ink-muted">
            {isCompany ? t.roles.company : t.roles.student}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-60 rounded-lg border border-line bg-surface p-1.5 shadow-lift">
          <div className="border-b border-line px-3 pb-2 pt-1.5 sm:hidden">
            <p className="truncate font-bold">{name}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">{isCompany ? t.roles.company : t.roles.student}</p>
          </div>
          <ul className="pt-1">
            <li>
              <Link href={dashboardPath(session.user.role)} className={item} onClick={() => setOpen(false)}>
                <LayoutDashboard className="size-4 text-ink-muted" aria-hidden="true" />
                {t.nav.dashboard}
              </Link>
            </li>
            <li>
              <Link href="/profils" className={item} onClick={() => setOpen(false)}>
                <User className="size-4 text-ink-muted" aria-hidden="true" />
                {t.nav.profile}
              </Link>
            </li>
            <li>
              <button type="button" className={item} onClick={logout}>
                <LogOut className="size-4 text-ink-muted" aria-hidden="true" />
                {t.nav.logout}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
