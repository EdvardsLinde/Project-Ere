"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useRef, useState } from "react";
import { eventConfig, type FairDay } from "@/config/event";
import { Badge, Container, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

export default function AgendaPage() {
  const { t, locale } = useI18n();
  const a = t.agenda;
  const { data: items } = useQuery((repo) => repo.listAgenda(), []);
  const [day, setDay] = useState<FairDay>(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const days = eventConfig.days;

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + days.length) % days.length;
    setDay(days[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader title={a.title} lead={a.lead} />
      <Notice tone="primary" className="mt-6" icon={<CalendarDays className="size-5 text-primary" aria-hidden="true" />}>
        <p className="font-semibold">{tx(eventConfig.datesVenue, locale)}</p>
        <p className="text-sm text-ink-muted">{a.exampleNote}</p>
      </Notice>

      <div role="tablist" aria-label={a.daysLabel} className="mt-8 grid grid-cols-3 rounded-sm border border-rule bg-surface-muted p-1">
        {days.map((d, i) => (
          <button
            key={d}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`day-tab-${d}`}
            aria-selected={day === d}
            aria-controls={`day-panel-${d}`}
            tabIndex={day === d ? 0 : -1}
            onClick={() => setDay(d)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={`h-10 rounded-[2px] text-[0.95rem] font-bold transition-colors ${day === d ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"}`}
          >
            {fmt(t.common.day, { n: d })}
          </button>
        ))}
      </div>

      <section role="tabpanel" id={`day-panel-${day}`} aria-labelledby={`day-tab-${day}`} className="animate-step mt-8">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {fmt(t.common.day, { n: day })}: {a.dayTitles[day - 1]}
        </h2>
        {!items ? (
          <Loading label={t.common.loading} />
        ) : (
          <ol className="mt-6 space-y-3">
            {items
              .filter((item) => item.day === day)
              .map((item) => (
                <li key={item.id} className="flex flex-col gap-3 rounded-lg border border-edge bg-surface p-5 shadow-card sm:flex-row sm:items-center">
                  <span className="flex w-24 shrink-0 items-center gap-1.5 font-display text-2xl font-extrabold tabular-nums">
                    <Clock className="size-5 text-primary" aria-hidden="true" />
                    {item.time}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold leading-snug">{tx(item.title, locale)}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge tone="primary">{t.options.agendaType[item.type]}</Badge>
                      {item.isExample && <Badge tone="warning">{t.common.example}</Badge>}
                    </div>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </section>
    </Container>
  );
}
