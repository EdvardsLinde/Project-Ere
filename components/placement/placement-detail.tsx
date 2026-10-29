"use client";

import {
  AlertTriangle,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  Coins,
  Globe,
  GraduationCap,
  HardHat,
  Languages,
  ListChecks,
  ListOrdered,
  MapPin,
  Rocket,
  ShieldCheck,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { ExternalLink, Notice } from "@/components/ui/misc";
import { formatDate, formatRange } from "@/lib/dates";
import type { Application, Placement } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import {
  focusLabel,
  freeSpots,
  industryLabel,
  isTermOpen,
  termDeadline,
  mapsUrl,
  opportunityLabel,
  outputLabel,
  tx,
  upcomingTerms,
} from "@/lib/placements";
import { BeginnerBadge, publicText, SampleBadge } from "./display";

interface Props {
  placement: Placement;
  applications: Application[];
  /** Show the contact person (approved participants of confirmed companies only). */
  showContact?: boolean;
  /** Apply button or a message, shown in the sidebar and in the sticky mobile bar. */
  action: React.ReactNode;
  /** Builder preview: show all terms, no sticky bar. */
  preview?: boolean;
}

/**
 * A closed-by-default panel: only its title shows until the student opens it, so
 * the page leads with the task and the dates instead of a wall of text.
 */
function Fold({
  icon,
  title,
  open,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={open}
      className="group rounded-lg border-2 border-edge bg-surface shadow-card [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg px-4 py-3.5 sm:px-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">{icon}</span>
        <h2 className="flex-1 text-lg font-extrabold tracking-tight">{title}</h2>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent font-sans text-xl leading-none text-on-accent transition-transform group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="space-y-5 border-t-2 border-line px-4 pb-5 pt-4 sm:px-5">{children}</div>
    </details>
  );
}

/** One fact in the sidebar: icon and value; the label is for screen readers and the hover title. */
function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5" title={label}>
      <dt className="mt-0.5 text-primary">
        {icon}
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">{title}</h3>
      <div className="mt-1.5 text-[0.98rem] leading-relaxed">{children}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <li key={i} className="rounded-sm border border-line bg-surface px-2.5 py-1 text-sm font-semibold">
          {i}
        </li>
      ))}
    </ul>
  );
}

export function PlacementDetailView({ placement: p, applications, showContact, action, preview }: Props) {
  const { t, locale } = useI18n();
  const d = t.detail;
  const c = p.company;
  const terms = preview ? [...p.terms].sort((a, b) => a.start.localeCompare(b.start)) : upcomingTerms(p);
  const street = publicText(c.address.street);
  const addressLine = [street, publicText(c.address.town), publicText(c.address.parish), publicText(c.address.postcode)]
    .filter(Boolean)
    .join(", ");
  const directions = tx(c.directions, locale);
  const comp = p.compensation;
  const compensation = [
    comp.none && t.options.compensation.none,
    comp.stipend && (comp.stipendAmount ? fmt(t.options.stipendAmount, { n: comp.stipendAmount }) : t.options.compensation.stipend),
    comp.meals && t.options.compensation.meals,
    comp.travel && t.options.compensation.travel,
  ].filter(Boolean) as string[];
  const opportunities = [
    ...p.opportunities.filter((o) => o !== "other").map((o) => opportunityLabel(o, locale)),
    tx(p.opportunitiesOther, locale),
  ].filter(Boolean);
  const dash = <span className="text-ink-muted">{t.common.notSpecified}</span>;
  const title = tx(p.title, locale) || "—";

  return (
    <div className="@container">
    <div className="grid gap-10 @4xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <header>
          <div className="flex flex-wrap gap-1.5">
            {p.isSample && <SampleBadge />}
            {p.beginnerFriendly && <BeginnerBadge />}
          </div>
          <p className="mt-4 font-bold text-ink-muted">{c.name || "—"}</p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h1>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
            {p.focusArea && (
              <li className="rounded-full bg-accent-soft px-3 py-1 text-accent-ink">{focusLabel(p.focusArea, locale)}</li>
            )}
            <li className="flex items-center gap-1.5 rounded-full border-2 border-line bg-surface px-3 py-1">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              {fmt(t.common.workingDays, { n: p.lengthDays })}
            </li>
            {publicText(c.address.town) && (
              <li className="flex items-center gap-1.5 rounded-full border-2 border-line bg-surface px-3 py-1">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {publicText(c.address.town)}
              </li>
            )}
          </ul>
          {p.isSample && (
            <Notice className="mt-5" icon={<AlertTriangle className="size-5 text-warning" aria-hidden="true" />}>
              {d.sampleNotice}
            </Notice>
          )}
        </header>

        <section className="mt-8" aria-labelledby="task-title">
          <h2 id="task-title" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
            <ClipboardList className="size-5 text-primary" aria-hidden="true" />
            {d.task}
          </h2>
          <div className="mt-4 space-y-5">
            <Sub title={d.problem}>{tx(p.problem, locale) || dash}</Sub>
            <Sub title={d.output}>
              {p.outputType && (
                <p className="mb-1.5 w-fit rounded-full bg-primary-fill px-3 py-1 text-sm font-bold text-white">
                  {outputLabel(p.outputType, locale)}
                </p>
              )}
              <p>{tx(p.outputDescription, locale) || (!p.outputType && dash)}</p>
            </Sub>
            {p.tools.length > 0 && (
              <Sub title={d.tools}>
                <TagList items={p.tools} />
              </Sub>
            )}
          </div>
        </section>

        <div className="mt-8 space-y-3">
          {p.dayPlan.length > 0 && (
            <Fold icon={<ListOrdered className="size-5" aria-hidden="true" />} title={d.dayPlan} open={preview}>
              <ol className="space-y-3">
                {p.dayPlan.map((day, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-extrabold text-accent-ink">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold">{tx(day.title, locale) || fmt(d.dayN, { n: i + 1 })}</p>
                      {tx(day.description, locale) && <p className="text-ink-muted">{tx(day.description, locale)}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </Fold>
          )}

          <Fold icon={<Wrench className="size-5" aria-hidden="true" />} title={d.requirements} open={preview}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Sub title={d.skillsRequired}>
                {p.skillsRequired.length ? <TagList items={p.skillsRequired.map((s) => tx(s, locale))} /> : dash}
              </Sub>
              <Sub title={d.skillsNice}>
                {p.skillsNice.length ? <TagList items={p.skillsNice.map((s) => tx(s, locale))} /> : dash}
              </Sub>
            </div>
            <Sub title={d.level}>{t.options.skillLevel[p.skillLevel]}</Sub>
            {tx(p.dataSystems, locale) && <Sub title={d.dataSystems}>{tx(p.dataSystems, locale)}</Sub>}
            {p.ndaRequired && (
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                {d.nda}
              </p>
            )}
            {p.bring.length > 0 && (
              <Sub title={d.bring}>
                <ul className="space-y-1">
                  {p.bring.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                      {tx(b, locale)}
                    </li>
                  ))}
                </ul>
              </Sub>
            )}
            <div className="rounded-md border-2 border-line bg-surface-muted p-4">
              <h3 className="flex items-center gap-2 font-bold">
                <HardHat className="size-5 text-accent-ink" aria-hidden="true" />
                {d.safety}
              </h3>
              <ul className="mt-2 space-y-1.5 text-[0.95rem]">
                {p.safetyBriefing && <li>{d.safetyBriefing}</li>}
                {tx(p.ppe, locale) && (
                  <li>
                    <span className="font-semibold">{d.ppe}: </span>
                    {tx(p.ppe, locale)}
                  </li>
                )}
                {tx(p.minorRestrictions, locale) && (
                  <li>
                    <span className="font-semibold">{d.minors}: </span>
                    {tx(p.minorRestrictions, locale)}
                  </li>
                )}
                {p.parentalConsentRequired && <li>{d.parentalConsent}</li>}
              </ul>
            </div>
          </Fold>

          <Fold icon={<Award className="size-5" aria-hidden="true" />} title={d.whatYouGet} open={preview}>
            <div className="flex gap-4 rounded-md border-2 border-primary/25 bg-primary-soft p-4">
              <BadgeCheck className="size-7 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-extrabold text-primary">{d.credential}</p>
                <p className="text-[0.95rem]">{d.credentialText}</p>
                {p.recognisesCertificate && <p className="mt-1 text-[0.95rem] font-semibold">{d.recognises}</p>}
              </div>
            </div>
            <Sub title={d.mentor}>
              {p.mentor.name ? (
                <div className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted">
                    <User className="size-5 text-ink-muted" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-bold">
                      {p.mentor.name}
                      {p.mentor.isSample && (
                        <span className="ml-2 rounded-full bg-warning-soft px-2 py-0.5 align-middle text-xs font-bold text-warning">
                          {t.common.sampleMentor}
                        </span>
                      )}
                    </p>
                    <p className="text-ink-muted">{tx(p.mentor.position, locale)}</p>
                    {tx(p.mentor.bio, locale) && <p className="mt-1">{tx(p.mentor.bio, locale)}</p>}
                  </div>
                </div>
              ) : (
                dash
              )}
            </Sub>
            <div className="grid gap-5 sm:grid-cols-2">
              <Sub title={d.compensation}>
                <span className="flex items-start gap-2">
                  <Coins className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {compensation.length ? compensation.join(", ") : t.common.toBeConfirmed}
                </span>
              </Sub>
              <Sub title={d.opportunities}>
                <span className="flex items-start gap-2">
                  <Rocket className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {opportunities.length ? opportunities.join("; ") : t.common.toBeConfirmed}
                </span>
              </Sub>
            </div>
          </Fold>

          <Fold icon={<Building2 className="size-5" aria-hidden="true" />} title={d.aboutCompany} open={preview}>
            <p className="text-[0.98rem] leading-relaxed">{tx(c.description, locale) || dash}</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              {c.industry && (
                <div>
                  <dt className="text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">{t.catalogue.industry}</dt>
                  <dd className="mt-1">{industryLabel(c.industry, locale)}</dd>
                </div>
              )}
              {c.employees && (
                <div>
                  <dt className="text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">{d.employees}</dt>
                  <dd className="mt-1">{c.employees}</dd>
                </div>
              )}
              {c.website && (
                <div>
                  <dt className="text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">{d.website}</dt>
                  <dd className="mt-1 flex items-center gap-1.5">
                    <Globe className="size-4 text-primary" aria-hidden="true" />
                    <ExternalLink href={c.website.startsWith("http") ? c.website : `https://${c.website}`} newTabLabel={t.common.opensInNewTab}>
                      {c.website.replace(/^https?:\/\//, "")}
                    </ExternalLink>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">{d.address}</dt>
                <dd className="mt-1">
                  <span className="flex items-start gap-1.5">
                    <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {addressLine || dash}
                  </span>
                  {addressLine && (
                    <ExternalLink
                      href={mapsUrl([street, c.address.town, c.address.parish, "Latvija"].map(publicText))}
                      newTabLabel={t.common.opensInNewTab}
                      className="mt-1 inline-block text-sm"
                    >
                      {d.openMap}
                    </ExternalLink>
                  )}
                </dd>
              </div>
            </dl>
            {directions && <Sub title={d.directions}>{directions}</Sub>}
            {showContact && c.contactPerson.name ? (
              <Sub title={t.student.contactPerson}>
                <p className="font-bold">{c.contactPerson.name}</p>
                {c.contactPerson.position && <p className="text-ink-muted">{c.contactPerson.position}</p>}
                {c.contactPerson.email && (
                  <a className="block font-semibold text-primary hover:underline" href={`mailto:${c.contactPerson.email}`}>
                    {c.contactPerson.email}
                  </a>
                )}
                {c.contactPerson.phone && (
                  <a className="block font-semibold text-primary hover:underline" href={`tel:${c.contactPerson.phone.replace(/\s/g, "")}`}>
                    {c.contactPerson.phone}
                  </a>
                )}
              </Sub>
            ) : (
              !p.isSample && <p className="text-sm text-ink-muted">{d.contactAfterApproval}</p>
            )}
          </Fold>
        </div>
      </div>

      <aside className="@4xl:sticky @4xl:top-24 @4xl:self-start" aria-label={d.datesTitle}>
        <div className="rounded-lg border-2 border-edge bg-surface p-5 shadow-card">
          <h2 className="flex items-center gap-2 font-extrabold">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
            {d.datesTitle}
          </h2>
          {terms.length ? (
            <ul className="mt-3 divide-y divide-line">
              {terms.map((term) => {
                const free = preview ? term.spots : freeSpots(term, applications);
                const open = preview || isTermOpen(term, p);
                return (
                  <li key={term.id} className="flex items-start justify-between gap-3 py-2.5 text-[0.95rem]">
                    <span>
                      <span className="block font-semibold">{term.start ? formatRange(term.start, term.end, locale) : "—"}</span>
                      {term.start && (
                        <span className={`block text-xs ${open ? "text-ink-muted" : "font-semibold text-danger"}`}>
                          {open ? fmt(d.applyBy, { date: formatDate(termDeadline(term, p), locale) }) : d.termClosed}
                        </span>
                      )}
                    </span>
                    <span className={`shrink-0 text-sm ${free === 0 ? "font-bold text-danger" : "text-ink-muted"}`}>
                      {free === 0 ? t.common.noSpots : fmt(t.common.spotsFree, { n: free })}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-ink-muted">{t.catalogue.noUpcoming}</p>
          )}
          {/* The deadline rule is left out: each date above already shows its own deadline. */}
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t-2 border-line pt-4 text-sm">
            <Fact icon={<Clock className="size-4" aria-hidden="true" />} label={d.hours} value={p.hoursFrom && p.hoursTo ? `${p.hoursFrom}–${p.hoursTo}` : "—"} />
            <Fact icon={<Users className="size-4" aria-hidden="true" />} label={d.age} value={`${p.ageFrom}–${p.ageTo}`} />
            <Fact icon={<Building2 className="size-4" aria-hidden="true" />} label={d.format} value={t.options.format[p.format]} />
            <Fact
              icon={<Languages className="size-4" aria-hidden="true" />}
              label={d.languages}
              value={p.languages.map((l) => t.options.languages[l]).join(", ") || "—"}
            />
            <Fact
              icon={<GraduationCap className="size-4" aria-hidden="true" />}
              label={d.education}
              value={p.educationLevels.map((e) => t.options.education[e]).join(", ") || "—"}
            />
            <Fact icon={<ListChecks className="size-4" aria-hidden="true" />} label={d.selection} value={t.options.selection[p.selectionMethod]} />
          </dl>
          <div className={preview ? "mt-5" : "mt-5 hidden lg:block"}>{action}</div>
        </div>
      </aside>

      {/* Sticky apply bar on small screens. */}
      {!preview && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-edge bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
          {action}
        </div>
      )}
    </div>
    </div>
  );
}
