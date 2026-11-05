"use client";

import { Info, Store } from "lucide-react";
import { useState } from "react";
import { sectors, type Sector, type StandSize } from "@/config/event";
import { ExhibitorCard } from "@/components/fair/exhibitor-card";
import { FilterBar } from "@/components/fair/filter-bar";
import { LinkButton } from "@/components/ui/button";
import { Checkbox, Field, Select } from "@/components/ui/form";
import { Container, EmptyState, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { filterExhibitors } from "@/lib/fair/filters";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

const SIZES: StandSize[] = ["S", "M", "L", "innovator"];

export default function ExhibitorsPage() {
  const { t, locale } = useI18n();
  const x = t.exhibitors;
  const { data: exhibitors } = useQuery((repo) => repo.listExhibitors(), []);
  const [sector, setSector] = useState<Sector | "">("");
  const [size, setSize] = useState<StandSize | "">("");
  const [seeking, setSeeking] = useState(false);

  // Visitors' own entries first, then the examples.
  const list = exhibitors
    ? filterExhibitors(exhibitors, { sector, size, seekingInvestment: seeking }).sort((a, b) => Number(a.isExample) - Number(b.isExample))
    : [];

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        title={x.title}
        lead={x.lead}
        actions={
          <LinkButton href="/stands" variant="accent">
            {t.stands.bookCta}
          </LinkButton>
        }
      />
      <Notice className="mt-6" icon={<Info className="size-5 text-warning" aria-hidden="true" />}>
        {x.exampleNote}
      </Notice>

      <FilterBar
        count={list.length}
        canClear={!!sector || !!size || seeking}
        onClear={() => {
          setSector("");
          setSize("");
          setSeeking(false);
        }}
      >
        <Field label={x.filterSector}>
          {(p) => (
            <Select id={p.id} value={sector} onChange={(e) => setSector(e.target.value as Sector | "")}>
              <option value="">{t.common.all}</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {tx(s.label, locale)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={x.filterSize}>
          {(p) => (
            <Select id={p.id} value={size} onChange={(e) => setSize(e.target.value as StandSize | "")}>
              <option value="">{t.common.any}</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {t.options.standSize[s]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Checkbox className="lg:col-span-2 lg:pb-3" label={x.filterSeeking} checked={seeking} onChange={(e) => setSeeking(e.target.checked)} />
      </FilterBar>

      {!exhibitors ? (
        <Loading label={t.common.loading} />
      ) : list.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={<Store className="size-7" aria-hidden="true" />} title={x.empty} />
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <li key={e.id}>
              <ExhibitorCard exhibitor={e} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
