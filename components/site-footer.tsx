"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { LogoMark } from "@/components/logo";
import { useToast } from "@/components/toast";
import { getRepository } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  const reset = async () => {
    await getRepository().resetDemoData();
    setConfirming(false);
    toast(t.footer.resetDone);
    router.push("/");
  };

  const link = "text-bg/85 underline-offset-2 hover:text-bg hover:underline";

  return (
    <footer className="no-print mt-auto bg-ink text-bg">
      <div className="hazard h-2" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-extrabold">{siteConfig.name[locale]}</span>
          </div>
          <p className="mt-4 max-w-sm text-bg/80">{t.footer.about}</p>
          <p className="mt-4 text-sm text-bg/60">{t.footer.team}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-accent">{t.footer.contacts}</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <span className="text-bg/60">{t.footer.email}: </span>
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
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-accent">{t.nav.home}</h2>
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
                className="mt-1 inline-flex items-center gap-2 rounded-md border border-bg/25 px-3 py-2 text-sm font-semibold text-bg hover:bg-bg/10"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {t.footer.reset}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bg/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-bg/60 sm:px-6">{t.footer.demo}</p>
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
