"use client";

import { ArrowRight, Info } from "lucide-react";
import { innovatorStandLimit, standTypes, type StandSize } from "@/config/event";
import { StandMap } from "@/components/fair/stand-map";
import { LinkButton } from "@/components/ui/button";
import { Badge, Card, Container, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { formatEuro } from "@/lib/dates";
import { innovatorSpotsLeft } from "@/lib/fair/stands";
import { fmt, useI18n } from "@/lib/i18n";

const SIZES: StandSize[] = ["S", "M", "L", "innovator"];

export default function StandsPage() {
  const { t, locale } = useI18n();
  const s = t.stands;
  const { data: exhibitors } = useQuery((repo) => repo.listExhibitors(), []);

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        title={s.title}
        lead={s.lead}
        actions={
          <LinkButton href="/apply/stand" variant="accent">
            {s.bookCta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        }
      />

      {!exhibitors ? (
        <Loading label={t.common.loading} />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card as="section" className="p-4 sm:p-6">
            <h2 className="text-2xl font-extrabold tracking-tight">{s.mapTitle}</h2>
            <p className="mb-5 mt-1 text-ink-muted">{s.mapHint}</p>
            <StandMap exhibitors={exhibitors} mode="link" />
          </Card>

          <section aria-labelledby="prices-title">
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-muted px-5 py-4">
                <h2 id="prices-title" className="text-2xl font-extrabold tracking-tight">
                  {s.pricesTitle}
                </h2>
                <Badge tone="warning">{t.common.placeholder}</Badge>
              </div>
              <table className="w-full text-left">
                <caption className="sr-only">{s.pricesTitle}</caption>
                <thead className="text-sm">
                  <tr className="border-b border-line">
                    <th scope="col" className="px-5 py-3 font-bold">{s.colSize}</th>
                    <th scope="col" className="px-3 py-3 font-bold">{s.colArea}</th>
                    <th scope="col" className="px-5 py-3 text-right font-bold">{s.colPrice}</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((size) => {
                    const type = standTypes[size];
                    return (
                      <tr key={size} className="border-b border-line last:border-0">
                        <th scope="row" className="px-5 py-3.5 font-display text-lg font-extrabold">
                          {t.options.standSize[size]}
                        </th>
                        <td className="px-3 py-3.5 tabular-nums">{fmt(s.area, { w: type.width, d: type.depth })}</td>
                        <td className="px-5 py-3.5 text-right font-bold tabular-nums">
                          {type.price === 0 ? (
                            <span>
                              {s.free}
                              <span className="block text-xs font-semibold text-ink-muted">
                                {s.limited} · {fmt(t.innovator.spots, { n: innovatorSpotsLeft(exhibitors), total: innovatorStandLimit })}
                              </span>
                            </span>
                          ) : (
                            formatEuro(type.price, locale)
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
            <Notice tone="warning" className="mt-4" icon={<Info className="size-5 text-warning" aria-hidden="true" />}>
              {s.pricesNote}
            </Notice>
            <div className="mt-6 flex flex-col gap-3">
              <LinkButton href="/apply/stand" variant="accent">
                {s.bookCta}
              </LinkButton>
              <LinkButton href="/apply/innovator" variant="secondary" className="whitespace-normal text-center">
                {s.innovatorCta}
              </LinkButton>
            </div>
          </section>
        </div>
      )}
    </Container>
  );
}
