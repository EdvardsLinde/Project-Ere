"use client";

import { Info, Landmark } from "lucide-react";
import { useState } from "react";
import { amountRanges, sectors, stages, type AmountRangeId, type Sector, type Stage } from "@/config/event";
import { FilterBar } from "@/components/fair/filter-bar";
import { ShowcaseCard } from "@/components/fair/showcase-card";
import { LinkButton } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/form";
import { Container, EmptyState, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { filterShowcase } from "@/lib/fair/filters";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

export default function ShowcasePage() {
  const { t, locale } = useI18n();
  const s = t.showcase;
  const { data: exhibitors } = useQuery((repo) => repo.listExhibitors(), []);
  const [sector, setSector] = useState<Sector | "">("");
  const [stage, setStage] = useState<Stage | "">("");
  const [amount, setAmount] = useState<AmountRangeId | "">("");

  const list = exhibitors ? filterShowcase(exhibitors, { sector, stage, amount }).sort((a, b) => Number(a.isExample) - Number(b.isExample)) : [];

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        title={s.title}
        lead={s.lead}
        actions={
          <LinkButton href="/invest-in-latvia" variant="secondary">
            {t.nav.investLatvia}
          </LinkButton>
        }
      />
      <Notice className="mt-6" icon={<Info className="size-5 text-warning" aria-hidden="true" />}>
        {s.exampleNote}
      </Notice>

      <FilterBar
        count={list.length}
        canClear={!!sector || !!stage || !!amount}
        onClear={() => {
          setSector("");
          setStage("");
          setAmount("");
        }}
      >
        <Field label={s.filterSector}>
          {(p) => (
            <Select id={p.id} value={sector} onChange={(e) => setSector(e.target.value as Sector | "")}>
              <option value="">{t.common.all}</option>
              {sectors.map((x) => (
                <option key={x.id} value={x.id}>
                  {tx(x.label, locale)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={s.filterStage}>
          {(p) => (
            <Select id={p.id} value={stage} onChange={(e) => setStage(e.target.value as Stage | "")}>
              <option value="">{t.common.any}</option>
              {stages.map((x) => (
                <option key={x} value={x}>
                  {t.options.stage[x]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={s.filterAmount}>
          {(p) => (
            <Select id={p.id} value={amount} onChange={(e) => setAmount(e.target.value as AmountRangeId | "")}>
              <option value="">{t.common.any}</option>
              {amountRanges.map((r) => (
                <option key={r.id} value={r.id}>
                  {t.options.amount[r.id]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </FilterBar>

      {!exhibitors ? (
        <Loading label={t.common.loading} />
      ) : list.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={<Landmark className="size-7" aria-hidden="true" />} title={s.empty} />
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <li key={e.id}>
              <ShowcaseCard exhibitor={e} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
