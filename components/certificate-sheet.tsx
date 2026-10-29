"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/logo";
import { certificateVerifyUrl } from "@/lib/env";
import { Seal } from "@/components/seal";
import { formatDate, formatRange } from "@/lib/dates";
import type { Certificate } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { averageScore, focusLabel, formatScore, outputLabel, tx } from "@/lib/placements";

const CRITERIA = ["problemSolving", "data", "communication", "independence", "responsibility"] as const;


/** Small orange diamond in a frame corner. */
function Corner({ className }: { className: string }) {
  return <span className={`absolute size-3 rotate-45 bg-accent ${className}`} aria-hidden="true" />;
}

/** The printable A4 Industrial Digital Certificate, laid out like a diploma. */
export function CertificateSheet({ certificate: c }: { certificate: Certificate }) {
  const { t, locale } = useI18n();
  const ct = t.certificate;
  const [qr, setQr] = useState("");
  const url = certificateVerifyUrl(c.id);

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 0, width: 240, color: { dark: "#1F2421", light: "#FFFFFF" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [url]);

  // Safety net for very long content: shrink the sheet to one A4 page right before printing.
  const sheetRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const A4_PX = (297 / 25.4) * 96;
    const fit = () => {
      const el = sheetRef.current;
      if (!el) return;
      el.style.zoom = "";
      const h = el.getBoundingClientRect().height;
      if (h > A4_PX) el.style.zoom = String(Math.floor((A4_PX / h) * 1000) / 1000);
    };
    const reset = () => {
      if (sheetRef.current) sheetRef.current.style.zoom = "";
    };
    const mq = window.matchMedia("print");
    const onChange = (e: MediaQueryListEvent) => (e.matches ? fit() : reset());
    window.addEventListener("beforeprint", fit);
    window.addEventListener("afterprint", reset);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("beforeprint", fit);
      window.removeEventListener("afterprint", reset);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const avg = averageScore(c.evaluation);
  const issued = formatDate(c.issuedAt.slice(0, 10), locale);

  return (
    <article
      ref={sheetRef}
      aria-label={`${ct.fullName}: ${c.participantName}`}
      className="paper print-sheet mx-auto w-full max-w-[210mm] rounded-lg border border-line bg-surface p-3 shadow-lift sm:min-h-[297mm] sm:p-[8mm] print:p-[5mm]"
    >
      {/* Double frame */}
      <div className="flex flex-col rounded-sm border-[3px] border-primary p-1.5 sm:min-h-[calc(297mm-16mm)] print:min-h-[calc(297mm-12mm)]">
        <div className="relative flex flex-1 flex-col items-center rounded-[2px] border border-primary/40 px-5 py-8 text-center sm:px-[14mm] sm:py-[12mm] print:py-[6mm]">
          <Corner className="left-2 top-2" />
          <Corner className="right-2 top-2" />
          <Corner className="bottom-2 left-2" />
          <Corner className="bottom-2 right-2" />
          <div className="bg-dots pointer-events-none absolute inset-x-6 top-6 h-40 opacity-40" aria-hidden="true" />

          <header className="relative flex flex-col items-center">
            <LogoMark className="size-11" />
            <p className="mt-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-muted">{ct.kicker}</p>
          </header>

          <h1 className="relative mt-6 print:mt-3 text-[2.4rem] font-extrabold uppercase leading-none tracking-[0.14em] text-primary sm:text-[3.4rem] print:text-[2.9rem]">
            {ct.title}
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-ink">{ct.fullName}</p>
          <div className="mt-4 flex items-center gap-2 print:mt-3" aria-hidden="true">
            <span className="h-px w-12 bg-primary-fill/40" />
            <span className="size-1.5 rotate-45 bg-accent" />
            <span className="h-px w-12 bg-primary-fill/40" />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-ink-muted print:mt-5">{ct.awardedTo}</p>
          <p className="mt-2 border-b-2 border-accent px-6 pb-2 text-3xl font-extrabold tracking-tight sm:text-[2.6rem] sm:leading-tight print:text-[2.2rem]">
            {c.participantName}
          </p>
          <p className="mt-4 max-w-[34rem] text-lg leading-relaxed print:mt-3 print:text-base">
            {ct.completed} <strong>„{tx(c.placementTitle, locale)}”</strong> {ct.at} <strong>{c.companyName}</strong>.
          </p>

          <dl className="mt-7 print:mt-4 grid w-full grid-cols-1 divide-y divide-line border-y border-line text-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              [ct.focusArea, focusLabel(c.focusArea, locale) || "—"],
              [ct.dates, formatRange(c.start, c.end, locale)],
              [ct.days, fmt(t.common.workingDays, { n: c.days })],
            ].map(([k, v]) => (
              <div key={k} className="px-3 py-3">
                <dt className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{k}</dt>
                <dd className="mt-0.5 font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-[36rem] text-[0.95rem]">
            <span className="font-bold">{ct.output}: </span>
            {c.outputType && <span className="font-semibold">{outputLabel(c.outputType, locale)}. </span>}
            {tx(c.output, locale)}
          </p>

          <section className="mt-7 print:mt-4 w-full max-w-[34rem]" aria-labelledby="eval-title">
            <div className="flex items-baseline justify-center gap-3">
              <h2 id="eval-title" className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-muted">
                {ct.evaluation}
              </h2>
              <p className="whitespace-nowrap text-sm">
                {ct.average}: <span className="text-xl font-extrabold text-primary tabular-nums">{formatScore(avg, locale)}</span>
                <span className="text-ink-muted"> / 5</span>
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-left print:mt-2 print:grid print:grid-cols-5 print:gap-3 print:space-y-0 print:text-center">
              {CRITERIA.map((k) => {
                const v = c.evaluation[k];
                return (
                  <li key={k} className="grid grid-cols-[minmax(0,9rem)_1fr_1.5rem] items-center gap-3 text-sm sm:grid-cols-[11rem_1fr_1.5rem] print:flex print:flex-col print:gap-1 print:text-xs">
                    <span className="font-semibold print:min-h-[2lh] print:leading-tight">{t.applications.criteria[k]}</span>
                    <span className="flex gap-1 print:w-full print:order-last" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={`h-2 flex-1 rounded-[2px] ${n <= v ? "bg-primary-fill" : "bg-surface-muted"}`} />
                      ))}
                    </span>
                    <span className="text-right font-extrabold tabular-nums print:text-center print:text-lg">
                      {v}
                      <span className="sr-only"> / 5</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            {c.evaluation.comment && (
              <blockquote className="mt-4 print:mt-2 italic text-ink-muted">
                <span className="sr-only">{ct.comment}: </span>“{c.evaluation.comment}”
              </blockquote>
            )}
          </section>

          {/* Signatures with the seal in the middle */}
          <div className="mt-auto grid w-full grid-cols-[1fr_auto_1fr] items-end gap-3 pt-10 sm:gap-6 print:pt-4">
            <div className="text-left">
              <div className="h-px bg-ink/50" />
              <p className="mt-1.5 font-bold leading-tight">{c.mentor.name}</p>
              <p className="text-xs text-ink-muted">
                {ct.mentor}
                {tx(c.mentor.position, locale) && `, ${tx(c.mentor.position, locale)}`}
              </p>
            </div>
            <Seal top={ct.sealTop} bottom={ct.sealBottom} year={c.issuedAt.slice(0, 4)} className="h-28 w-24 sm:h-32 sm:w-28 print:h-28 print:w-24" />
            <div className="text-right">
              <div className="h-px bg-ink/50" />
              <p className="mt-1.5 font-bold leading-tight">{c.companyName}</p>
              <p className="text-xs text-ink-muted">{ct.companySignature}</p>
            </div>
          </div>

          <footer className="mt-6 print:mt-3 print:pt-3 flex w-full flex-col items-center gap-4 border-t border-dashed border-line pt-5 text-left sm:flex-row sm:justify-between">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-[auto_auto]">
              <dt className="font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.id}</dt>
              <dd className="whitespace-nowrap font-mono font-bold">{c.id}</dd>
              <dt className="font-bold uppercase tracking-[0.08em] text-ink-muted">{ct.issued}</dt>
              <dd className="font-bold">{issued}</dd>
              <dt className="col-span-2 mt-1 text-ink-muted">
                {ct.verifyAt} <span className="break-all font-mono">{url.replace(/^https?:\/\//, "")}</span>
              </dt>
            </dl>
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element -- generated data URL
              <img src={qr} alt={ct.qrAlt} width={96} height={96} className="size-24 rounded-sm" />
            ) : (
              <div className="size-24 rounded-sm bg-surface-muted" aria-hidden="true" />
            )}
          </footer>
        </div>
      </div>
    </article>
  );
}
