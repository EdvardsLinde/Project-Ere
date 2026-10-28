"use client";

import { Check } from "lucide-react";
import { useI18n, fmt } from "@/lib/i18n";

/** Hero visual: a stylised Industrial Digital Passport with day stamps. Purely decorative. */
export function PassportIllustration() {
  const { t } = useI18n();
  const h = t.home.hero;
  const bars = [5, 4, 4, 4, 5];
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="absolute -right-3 -top-3 h-full w-full rotate-3 rounded-lg border border-line bg-surface-muted" />
      <div className="relative -rotate-1 overflow-hidden rounded-lg border border-line bg-surface shadow-lift">
        <div className="flex items-center justify-between bg-primary px-5 py-4 text-white">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/70">Saldus</p>
            <p className="text-base font-extrabold leading-tight">{h.passportLabel}</p>
          </div>
          <span className="rounded-sm bg-accent px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-on-accent">
            {h.passportSample}
          </span>
        </div>
        <div className="space-y-5 px-5 py-5">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{h.passportDays}</p>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <span
                  key={d}
                  className="relative flex size-11 items-center justify-center rounded-full border-2 border-dashed border-accent text-xs font-extrabold text-accent-ink"
                  style={{ transform: `rotate(${(d % 2 ? -1 : 1) * (6 + d * 2)}deg)` }}
                >
                  {fmt(h.dayShort, { n: d })}
                  <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{h.passportTask}</p>
            <p className="mt-1 font-bold">{h.passportTaskValue}</p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{h.passportMentor}</p>
              <div className="mt-2 space-y-1.5">
                {bars.map((v, i) => (
                  <div key={i} className="h-1.5 rounded-full bg-surface-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${v * 20}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <QrGlyph />
          </div>
          <p className="border-t border-dashed border-line pt-3 font-mono text-xs text-ink-muted">SDP-2026-0001</p>
        </div>
      </div>
    </div>
  );
}

/** Decorative QR-like grid (not a real code). */
function QrGlyph() {
  const cells = "1110111100101101011111001010110101101110100101111".split("");
  return (
    <div className="grid size-16 shrink-0 grid-cols-7 gap-px rounded-sm border border-line p-1">
      {cells.map((c, i) => (
        <span key={i} className={c === "1" ? "bg-ink" : "bg-transparent"} />
      ))}
    </div>
  );
}
