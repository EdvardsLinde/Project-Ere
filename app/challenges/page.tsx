"use client";

import { GraduationCap, Info } from "lucide-react";
import { useState } from "react";
import { challengeFields, type ChallengeField } from "@/config/event";
import { ChallengeCard } from "@/components/fair/challenge-card";
import { FilterBar } from "@/components/fair/filter-bar";
import { Field, Select } from "@/components/ui/form";
import { Container, EmptyState, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { filterChallenges } from "@/lib/fair/filters";
import { useI18n } from "@/lib/i18n";

export default function ChallengesPage() {
  const { t } = useI18n();
  const c = t.challenges;
  const { data: challenges } = useQuery((repo) => repo.listChallenges(), []);
  const [field, setField] = useState<ChallengeField | "">("");
  const list = challenges ? filterChallenges(challenges, field) : [];

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader title={c.title} lead={c.lead} />
      <Notice className="mt-6" icon={<Info className="size-5 text-warning" aria-hidden="true" />}>
        {c.exampleNote}
      </Notice>
      <FilterBar count={list.length} canClear={!!field} onClear={() => setField("")}>
        <Field label={c.filterField}>
          {(p) => (
            <Select id={p.id} value={field} onChange={(e) => setField(e.target.value as ChallengeField | "")}>
              <option value="">{t.common.all}</option>
              {challengeFields.map((f) => (
                <option key={f} value={f}>
                  {t.options.field[f]}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </FilterBar>
      {!challenges ? (
        <Loading label={t.common.loading} />
      ) : list.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={<GraduationCap className="size-7" aria-hidden="true" />} title={c.empty} />
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((ch) => (
            <li key={ch.id}>
              <ChallengeCard challenge={ch} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
