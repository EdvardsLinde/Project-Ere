"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/logo";
import { formatDate, formatRange } from "@/lib/dates";
import type { Certificate } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { averageScore, focusLabel, formatScore, outputLabel, tx } from "@/lib/placements";

const CRITERIA = ["problemSolving", "data", "communication", "independence", "responsibility"] as const;

export function verifyUrl(id: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : siteConfig.siteUrl;
  return `${origin}/parbaudit/${encodeURIComponent(id)}`;
}

/** The printable A4 Industrial Digital Passport. */
export function CertificateSheet({ certificate: c }: { certificate: Certificate }) {
  const { t, locale } = useI18n();
  const ct = t.certificate;
  const [qr, setQr] = useState("");
  const url = verifyUrl(c.id);

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 0, width: 240, color: { dark: "#1F2421", light: "#FFFFFF" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [url]);

  const avg = averageScore(c.evaluation);

  return (
    <article className="print-sheet relative mx-auto flex w-full max-w-[210mm] flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-lift sm:min-h-[297mm]">
      <div className="hazard h-2.5" aria-hidden="true" />
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-2.5 h-48 opacity-50" aria-hidden="true" />

      <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-[16mm] sm:py-[14mm]">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-10" />
            <span className="text-xs font-bold uppercase leading-tight tracking-[0.12em] text-ink-muted">{siteConfig.name[locale]}</span>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ink-muted">{ct.id}</p>
            <p className="whitespace-nowrap font-mono text-sm font-bold">{c.id}</p>
          </div>
        </header>

        <div className="mt-10 sm:mt-14">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-primary sm:text-[2.6rem]">{ct.title}</h1>
          <p className="mt-1 text-ink-muted">{ct.subtitle}</p>
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.1em] text-ink-muted">{ct.awardedTo}</p>
          <p className="mt-2 border-b-2 border-accent pb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{c.participantName}</p>
          <p className="mt-3 text-lg">
            {ct.completed} <strong>„{tx(c.placementTitle, locale)}”</strong> {ct.at} <strong>{c.companyName}</strong>.
          </p>
        </div>

        <dl className="mt-8 grid gap-x-6 gap-y-4 rounded-lg bg-surface-muted p-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.focusArea}</dt>
            <dd className="mt-0.5 font-bold">{focusLabel(c.focusArea, locale) || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.dates}</dt>
            <dd className="mt-0.5 font-bold">{formatRange(c.start, c.end, locale)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.days}</dt>
            <dd className="mt-0.5 font-bold">{fmt(t.common.workingDays, { n: c.days })}</dd>
          </div>
          <div className="sm:col-span-3">
            <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.output}</dt>
            <dd className="mt-0.5">
              {c.outputType && <span className="font-bold">{outputLabel(c.outputType, locale)}. </span>}
              {tx(c.output, locale)}
            </dd>
          </div>
        </dl>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-ink-muted">{ct.evaluation}</h2>
            <p className="whitespace-nowrap text-sm">
              {ct.average}: <span className="text-2xl font-extrabold text-primary tabular-nums">{formatScore(avg, locale)}</span>
              <span className="text-ink-muted"> / 5</span>
            </p>
          </div>
          <ul className="mt-3 space-y-2.5">
            {CRITERIA.map((k) => {
              const v = c.evaluation[k];
              return (
                <li key={k} className="grid grid-cols-[minmax(0,10rem)_1fr_2rem] items-center gap-3 text-sm sm:grid-cols-[12rem_1fr_2rem]">
                  <span className="font-semibold">{t.applications.criteria[k]}</span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={`h-2.5 flex-1 rounded-sm ${n <= v ? "bg-primary" : "bg-surface-muted"}`} />
                    ))}
                  </span>
                  <span className="text-right font-extrabold tabular-nums">
                    {v}
                    <span className="sr-only"> / 5</span>
                  </span>
                </li>
              );
            })}
          </ul>
          {c.evaluation.comment && (
            <blockquote className="mt-5 border-l-4 border-accent pl-4 italic">
              <p className="text-xs font-bold uppercase not-italic tracking-[0.08em] text-ink-muted">{ct.comment}</p>
              <p className="mt-1">“{c.evaluation.comment}”</p>
            </blockquote>
          )}
        </section>

        <footer className="mt-auto grid gap-6 pt-10 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <div className="h-10 border-b border-ink/40" aria-hidden="true" />
            <p className="mt-1.5 font-bold">{c.mentor.name}</p>
            <p className="text-sm text-ink-muted">
              {ct.mentor}
              {tx(c.mentor.position, locale) && `, ${tx(c.mentor.position, locale)}`}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.issued}</p>
            <p className="font-bold">{formatDate(c.issuedAt.slice(0, 10), locale)}</p>
            <p className="mt-2 text-xs text-ink-muted">
              {ct.verifyAt} <span className="break-all font-mono">{url.replace(/^https?:\/\//, "")}</span>
            </p>
          </div>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element -- generated data URL
            <img src={qr} alt={ct.qrAlt} width={112} height={112} className="size-28 justify-self-start rounded-sm sm:justify-self-end" />
          ) : (
            <div className="size-28 rounded-sm bg-surface-muted" aria-hidden="true" />
          )}
        </footer>
      </div>
    </article>
  );
}
