"use client";

import { Seal } from "@/components/seal";
import { useI18n } from "@/lib/i18n";
import { formatCertificateId } from "@/lib/placements";

/** Hero visual: a small diploma-style certificate with a seal. Purely decorative. */
export function CertificateIllustration() {
  const { t } = useI18n();
  const h = t.home.hero;
  const bars = [5, 4, 4, 4, 5];
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="paper relative -rotate-3 rounded-lg border-2 border-edge bg-surface p-3 shadow-lift">
        <div className="rounded-md border-[3px] border-ink p-1">
          <div className="relative rounded-[9px] border-2 border-primary px-6 pb-10 pt-6 text-center">
            <Corner className="left-1.5 top-1.5" />
            <Corner className="right-1.5 top-1.5" />
            <Corner className="bottom-1.5 left-1.5" />
            <Corner className="bottom-1.5 right-1.5" />
            <span className="absolute right-3 top-3 rounded-full bg-warning-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase text-warning">
              {h.certSample}
            </span>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-ink-muted">{h.certKicker}</p>
            <p className="mt-1 font-display text-[1.7rem] font-extrabold uppercase leading-none tracking-[0.08em] text-primary">{h.certTitle}</p>
            <div className="mx-auto mt-3 flex items-center justify-center gap-1.5">
              <span className="h-0.5 w-6 rounded-full bg-primary-fill" />
              <span className="size-2 rounded-full border-[1.5px] border-ink bg-accent" />
              <span className="h-0.5 w-6 rounded-full bg-primary-fill" />
            </div>
            <p className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink-muted">{h.certAwardedTo}</p>
            <p className="mx-auto mt-1 w-fit border-b-4 border-accent px-2 font-display text-lg font-extrabold">Elza Paraudziņa</p>
            <p className="mt-1 text-xs text-ink-muted">{h.certTaskValue}</p>
            <div className="mx-auto mt-4 max-w-[12rem] space-y-1.5 text-left">
              <p className="text-center text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{h.certMentor}</p>
              {bars.map((v, i) => (
                <div key={i} className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= v ? "bg-primary-fill" : "bg-surface-muted"}`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-end justify-between gap-3 text-left">
              <div className="flex-1">
                <div className="h-px bg-ink/40" />
                <p className="mt-1 font-mono text-[0.6rem] text-ink-muted">{formatCertificateId(2026, 1)}</p>
              </div>
              <div className="w-16" />
              <div className="flex-1">
                <div className="h-px bg-ink/40" />
                <p className="mt-1 text-right text-[0.6rem] text-ink-muted">{t.certificate.mentor}</p>
              </div>
            </div>
          </div>
        </div>
        <Seal top={t.certificate.sealTop} bottom={t.certificate.sealBottom} year={2026} className="absolute -bottom-6 left-1/2 h-28 w-24 -translate-x-1/2" />
      </div>
    </div>
  );
}

/** Small primary dot with an accent centre in a frame corner. */
function Corner({ className }: { className: string }) {
  return (
    <span className={`absolute flex size-2.5 items-center justify-center rounded-full bg-primary-fill ${className}`}>
      <span className="size-1 rounded-full bg-accent" />
    </span>
  );
}
