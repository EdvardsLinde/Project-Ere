"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { LogoMark } from "@/components/logo";
import { useToast } from "@/components/toast";
import { getRepository } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

export function SiteFooter() {
  const { t, locale } = useI18n();
  const { leaveHome } = useSession();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  const reset = async () => {
    setConfirming(false);
    await leaveHome(() => getRepository().resetDemoData());
    toast(t.footer.resetDone);
  };

  const link = "text-on-night/85 underline-offset-4 hover:text-on-night hover:underline";

  return (
    <footer className="no-print mt-auto bg-night text-on-night">
      <div className="scallop h-3" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <p className="font-display text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[1.02] tracking-tight">
          {siteConfig.tagline[locale]}
          <span className="text-accent" aria-hidden="true">.</span>
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-extrabold tracking-tight">{siteConfig.brand}</span>
              <span className="mt-1 text-xs text-on-night/70">{siteConfig.subtitle[locale]}</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-on-night/80">{t.footer.about}</p>
          <p className="mt-4 text-sm text-on-night/60">{t.footer.team}</p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-accent">{t.footer.contacts}</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <span className="text-on-night/60">{t.footer.email}: </span>
              {siteConfig.contacts.email.startsWith("[") ? (
                <span>{siteConfig.contacts.email}</span>
              ) : (
                <a className={link} href={`mailto:${siteConfig.contacts.email}`}>
                  {siteConfig.contacts.email}
                </a>
              )}
            </li>
            <li>
              <a className={link} href={siteConfig.contacts.surveyUrl} target="_blank" rel="noopener noreferrer">
                {t.footer.survey}
                <span className="sr-only"> {t.common.opensInNewTab}</span> ↗
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-accent">{t.nav.home}</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link className={link} href="/privatums">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link className={link} href="/parbaudit">
                {t.footer.verify}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="mt-1 inline-flex items-center gap-2 rounded-full border-2 border-on-night/40 px-4 py-2 text-sm font-bold text-on-night hover:border-accent hover:bg-accent hover:text-on-accent"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {t.footer.reset}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-on-night/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-on-night/60 sm:px-6">{t.footer.demo}</p>
      </div>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={t.footer.reset}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              {t.common.cancel}
            </Button>
            <Button variant="danger" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t.footer.reset}
            </Button>
          </>
        }
      >
        <p>{t.footer.resetConfirm}</p>
      </Dialog>
    </footer>
  );
}
