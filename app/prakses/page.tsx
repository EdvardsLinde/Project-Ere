"use client";

import { AlertTriangle, SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Checkbox, Input, Select } from "@/components/ui/form";
import { Container, EmptyState, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { placementLocation } from "@/components/placement/display";
import { PlacementCard } from "@/components/placement/placement-card";
import { formatMonth, monthKey } from "@/lib/dates";
import { useQuery } from "@/lib/data/hooks";
import type { Application, Placement } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { nextStart, placementSearchText, upcomingTerms } from "@/lib/placements";
import { useRoleGuard } from "@/lib/session";

interface Filters {
  q: string;
  focus: string;
  industry: string;
  length: string;
  month: string;
  location: string;
  beginner: boolean;
  sort: "soonest" | "newest";
}

const EMPTY: Filters = { q: "", focus: "", industry: "", length: "", month: "", location: "", beginner: false, sort: "soonest" };

export default function CataloguePage() {
  const { t, locale } = useI18n();
  const allowed = useRoleGuard(["guest", "student"]);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [showFilters, setShowFilters] = useState(false);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters((f) => ({ ...f, [k]: v }));

  const { data, loading } = useQuery(async (repo) => {
    const placements = await repo.listPublishedPlacements();
    const apps = await Promise.all(placements.map((p) => repo.listPlacementApplications(p.id)));
    const byPlacement: Record<string, Application[]> = {};
    placements.forEach((p, i) => (byPlacement[p.id] = apps[i]));
    return { placements, byPlacement };
  }, []);

  const placements = useMemo(() => data?.placements ?? [], [data]);

  const months = useMemo(() => {
    const set = new Set<string>();
    placements.forEach((p) => upcomingTerms(p).forEach((term) => set.add(monthKey(term.start))));
    return [...set].sort();
  }, [placements]);

  const locations = useMemo(
    () => [...new Set(placements.map((p) => placementLocation(p)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "lv")),
    [placements],
  );

  const results = useMemo(() => {
    const q = filters.q.trim().toLocaleLowerCase();
    const list = placements.filter((p: Placement) => {
      if (filters.focus && p.focusArea !== filters.focus) return false;
      if (filters.industry && p.company.industry !== filters.industry) return false;
      if (filters.length && String(p.lengthDays) !== filters.length) return false;
      if (filters.location && placementLocation(p) !== filters.location) return false;
      if (filters.beginner && !p.beginnerFriendly) return false;
      if (filters.month && !upcomingTerms(p).some((term) => monthKey(term.start) === filters.month)) return false;
      if (q && !placementSearchText(p).includes(q)) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (filters.sort === "newest") return (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt);
      const an = nextStart(a) ?? "9999";
      const bn = nextStart(b) ?? "9999";
      return an.localeCompare(bn);
    });
  }, [placements, filters]);

  if (!allowed || loading || !data) return <Loading label={t.common.loading} />;

  const c = t.catalogue;
  const active = JSON.stringify({ ...filters, sort: "soonest" }) !== JSON.stringify(EMPTY);
  const hasSamples = placements.some((p) => p.isSample);

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader title={c.title} lead={c.lead} />

      {hasSamples && (
        <Notice className="mt-6" icon={<AlertTriangle className="size-5 text-warning" aria-hidden="true" />}>
          {c.sampleNotice}
        </Notice>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <Button
            variant="secondary"
            className="w-full lg:hidden"
            aria-expanded={showFilters}
            aria-controls="filters"
            onClick={() => setShowFilters((s) => !s)}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {showFilters ? c.hideFilters : c.showFilters}
          </Button>
          <form
            id="filters"
            role="search"
            aria-label={c.filters}
            onSubmit={(e) => e.preventDefault()}
            className={`${showFilters ? "mt-4 flex" : "hidden"} flex-col gap-4 lg:mt-0 lg:flex`}
          >
            <FilterSelect label={c.focusArea} value={filters.focus} onChange={(v) => set("focus", v)} anyLabel={t.common.all}>
              {siteConfig.focusAreas.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label[locale]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={c.industry} value={filters.industry} onChange={(v) => set("industry", v)} anyLabel={t.common.all}>
              {siteConfig.industries.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label[locale]}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={c.length} value={filters.length} onChange={(v) => set("length", v)} anyLabel={t.common.any}>
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {fmt(t.common.days, { n })}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={c.month} value={filters.month} onChange={(v) => set("month", v)} anyLabel={t.common.any}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatMonth(m, locale)}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={c.location} value={filters.location} onChange={(v) => set("location", v)} anyLabel={t.common.any}>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </FilterSelect>
            <Checkbox label={c.beginnerOnly} checked={filters.beginner} onChange={(e) => set("beginner", e.target.checked)} />
            {active && (
              <Button variant="quiet" size="sm" className="self-start" onClick={() => setFilters(EMPTY)}>
                {c.clearFilters}
              </Button>
            )}
          </form>
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="q" className="text-sm font-semibold">
                {c.searchLabel}
              </label>
              <Input
                id="q"
                type="search"
                className="mt-1.5"
                placeholder={c.searchPlaceholder}
                value={filters.q}
                onChange={(e) => set("q", e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <label htmlFor="sort" className="text-sm font-semibold">
                {c.sort}
              </label>
              <Select id="sort" className="mt-1.5" value={filters.sort} onChange={(e) => set("sort", e.target.value as Filters["sort"])}>
                <option value="soonest">{c.sortSoonest}</option>
                <option value="newest">{c.sortNewest}</option>
              </Select>
            </div>
          </div>

          <p className="mt-5 text-sm font-semibold text-ink-muted" aria-live="polite">
            {fmt(c.results, { n: results.length })}
          </p>

          {results.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={<SearchX className="size-10" aria-hidden="true" />}
                title={c.emptyTitle}
                text={c.emptyText}
                action={
                  <Button variant="secondary" onClick={() => setFilters(EMPTY)}>
                    {c.clearFilters}
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {results.map((p) => (
                <li key={p.id}>
                  <PlacementCard placement={p} applications={data.byPlacement[p.id] ?? []} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  anyLabel,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  anyLabel: string;
  children: React.ReactNode;
}) {
  const id = `f-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <Select id={id} className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{anyLabel}</option>
        {children}
      </Select>
    </div>
  );
}
