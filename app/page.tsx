"use client";

import {
  ArrowRight,
  Building2,
  CalendarRange,
  Factory,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  PackageSearch,
  Plus,
  Scale,
  Search,
  Sprout,
  Trees,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { eventConfig, hallStands, innovatorStandLimit, sectors, standTypes } from "@/config/event";
import { KeyVisual } from "@/components/key-visual";
import { HeroRoleActions, RoleButtons } from "@/components/role-buttons";
import { LinkButton } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/misc";
import { Notched } from "@/components/ui/notched";
import { formatEuro } from "@/lib/dates";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Facts />
      <Sectors />
      <WhySaldus />
      <Parts />
      <Days />
      <ForWhom />
      <Faq />
      <ClosingCta />
    </>
  );
}

function SectionTitle({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="caps mt-3 text-[2.8rem] sm:text-[4.2rem]">
        {title}
      </h2>
      {lead && <p className="mt-4 max-w-2xl text-lg text-ink-muted">{lead}</p>}
    </div>
  );
}

/** Light icon disc used in lists and panels. */
function IconDisc({ icon: Icon, className = "" }: { icon: typeof Sprout; className?: string }) {
  return (
    <span className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary ${className}`}>
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

/** Two columns split by a rule: left text, right the key visual and the role actions. */
function Hero() {
  const { t, locale } = useI18n();
  const h = t.home.hero;
  const words = eventConfig.name.split(" ");
  const last = words.length > 1 ? words.pop() : "";
  return (
    <section className="border-b border-rule" aria-labelledby="hero-title">
      <Container className="grid lg:grid-cols-2">
        <div className="min-w-0 pb-10 pt-10 sm:pt-14 lg:py-16 lg:pr-10">
          <Eyebrow>
            {fmt(h.eyebrow, { n: eventConfig.days.length })} · {tx(eventConfig.datesVenue, locale)}
          </Eyebrow>
          <h1 id="hero-title" className="caps mt-6 text-[clamp(4rem,14vw,8rem)] text-ink">
            {words.join(" ")} {last && <span className="text-primary">{last}</span>}
            <span className="text-accent" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-7 max-w-[30ch] font-display text-xl font-semibold leading-snug sm:text-2xl">{tx(eventConfig.subtitle, locale)}</p>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-muted">{h.lead}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-6 border-t border-rule py-8 lg:border-l lg:border-t-0 lg:py-16 lg:pl-10">
          <div className="order-2 lg:order-1" aria-hidden="true">
            <Notched>
              <KeyVisual width={640} height={500} seed={1} cols={5} rows={4} nodes={4} radius={0} className="block h-auto w-full" />
            </Notched>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.72rem] font-semibold uppercase text-ink-muted">
              {sectors
                .filter((s) => s.id !== "adjacent")
                .map((s) => (
                  <li key={s.id} className="inline-flex items-center gap-2">
                    <LegendSwatch kind={s.id} />
                    {tx(s.label, locale)}
                  </li>
                ))}
              <li className="inline-flex items-center gap-2">
                <span className="size-3.5 rounded-full border-2 border-night bg-on-night shadow-[inset_0_0_0_2.5px_var(--color-on-night),inset_0_0_0_7px_var(--color-accent)]" />
                {h.innovation}
              </li>
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="sr-only">{h.rolesLabel}</h2>
            <HeroRoleActions />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Small key for the visual: crop rows, tree crowns, the road. */
function LegendSwatch({ kind }: { kind: string }) {
  if (kind === "agriculture")
    return <span className="h-3 w-5 rounded-[3px] bg-[repeating-linear-gradient(90deg,var(--color-land-row)_0_2px,var(--color-land-crop)_2px_5px)]" />;
  if (kind === "forestry")
    return (
      <span className="h-3 w-5 rounded-[3px] bg-land-forest bg-[radial-gradient(circle_at_30%_50%,var(--color-primary-fill)_0_3px,transparent_3.5px),radial-gradient(circle_at_75%_50%,var(--color-primary-fill)_0_3px,transparent_3.5px)]" />
    );
  return <span className="h-1.5 w-5 rounded-full bg-accent ring-[1.5px] ring-night" />;
}

/** Four real numbers from `config/event.ts`, on notched green cards. */
function Facts() {
  const { t, locale } = useI18n();
  const f = t.home.facts;
  const smallest = Math.min(...Object.entries(standTypes).filter(([size]) => size !== "innovator").map(([, s]) => s.price));
  const items = [
    { value: String(eventConfig.days.length), label: f.days },
    { value: String(hallStands.length), label: f.stands },
    { value: String(innovatorStandLimit), label: f.innovator },
    { value: formatEuro(smallest, locale), label: f.price },
  ];
  return (
    <section className="border-b border-rule" aria-labelledby="facts-title">
      <h2 id="facts-title" className="sr-only">
        {f.title}
      </h2>
      <Container className="py-8 sm:py-10">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.label}>
              <Notched className="bg-primary-fill text-white" options={{ widthRatio: 0.42, depthRatio: 0.18, maxDepth: 52 }}>
                <div className="flex aspect-[4/4.3] flex-col items-center justify-end px-3 pb-5 text-center sm:pb-7">
                  <p className="font-mono text-[2.5rem] font-semibold leading-none tracking-[-0.04em] tabular-nums sm:text-6xl">{item.value}</p>
                  <p className="mt-5 text-[0.7rem] font-bold uppercase leading-snug tracking-[0.04em] sm:mt-7 sm:text-sm">{item.label}</p>
                </div>
              </Notched>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** The three sectors in ruled columns that step down, like the road climbing in the key visual. */
function Sectors() {
  const { t } = useI18n();
  const s = t.home.sectors;
  const icons = [Sprout, Trees, Truck];
  const step = ["", "lg:pt-28", "lg:pt-56"];
  return (
    <section className="border-b border-rule" aria-labelledby="sectors-title">
      <Container className="pt-14 sm:pt-20">
        <SectionTitle id="sectors-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      </Container>
      <Container className="mt-10">
        <ul className="grid border-t border-rule lg:grid-cols-3">
          {s.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li
                key={item.title}
                className={`min-w-0 border-rule py-8 lg:min-h-[27rem] lg:px-6 lg:first:pl-0 lg:last:pr-0 ${i ? "border-t lg:border-l lg:border-t-0" : ""} ${step[i]}`}
              >
                <Icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="caps mt-4 text-[2.4rem] sm:text-[2.8rem] lg:text-[2.15rem] xl:text-[2.6rem]">{item.title}</h3>
                <p className="mt-3 max-w-[34ch] text-ink-muted">{item.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="flex items-start gap-3 border-t border-rule py-6 text-ink-muted">
          <Scale className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          {s.adjacent}
        </p>
      </Container>
    </section>
  );
}

/** Bold lead-ins on the left, a second view of the key visual on the right. */
function WhySaldus() {
  const { t } = useI18n();
  const w = t.home.whySaldus;
  return (
    <section className="border-b border-rule" aria-labelledby="saldus-title">
      <Container className="grid lg:grid-cols-2">
        <div className="min-w-0 py-14 sm:py-20 lg:pr-10">
          <SectionTitle id="saldus-title" eyebrow={w.eyebrow} title={w.title} />
          <div className="mt-8 space-y-5 text-lg leading-relaxed">
            {w.items.map((item) => (
              <p key={item.title}>
                <b className="font-bold text-ink">{/[.!?]$/.test(item.title) ? item.title : `${item.title}.`}</b>{" "}
                <span className="text-ink-muted">{item.text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 items-center border-t border-rule py-10 lg:border-l lg:border-t-0 lg:py-20 lg:pl-10" aria-hidden="true">
          <Notched corner="br" className="w-full">
            <KeyVisual width={640} height={520} seed={4} cols={5} rows={4} nodes={3} radius={0} className="block h-auto w-full" />
          </Notched>
        </div>
      </Container>
    </section>
  );
}

/**
 * Rules and padding for the four parts: one column on phones, 2 × 2 from `sm`, a row of four from `lg`.
 * Each column has a rule on its left except the first in a row, and space on the side facing a rule.
 */
const PART_CELL = [
  "sm:pr-5 lg:pr-6",
  "border-t sm:border-t-0 sm:border-l sm:pl-5 lg:px-6",
  "border-t sm:pr-5 lg:border-t-0 lg:border-l lg:px-6",
  "border-t sm:border-l sm:pl-5 lg:border-t-0 lg:pl-6",
];

function Parts() {
  const { t } = useI18n();
  const p = t.home.parts;
  const parts = [
    { icon: Building2, href: "/stands" },
    { icon: Lightbulb, href: "/apply/innovator" },
    { icon: Landmark, href: "/investment" },
    { icon: GraduationCap, href: "/challenges" },
  ];
  return (
    <section className="border-b border-rule" aria-labelledby="parts-title">
      <Container className="pt-14 sm:pt-20">
        <SectionTitle id="parts-title" eyebrow={p.eyebrow} title={p.title} />
      </Container>
      <Container className="mt-10">
        <ul className="grid border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
          {p.items.map((item, i) => {
            const { icon, href } = parts[i];
            return (
              <li key={item.title} className={`flex min-w-0 flex-col border-rule py-8 ${PART_CELL[i]}`}>
                <IconDisc icon={icon} />
                <h3 className="mt-5 text-xl font-extrabold leading-snug">{item.title}</h3>
                <p className="mt-1 flex-1 text-[0.95rem] text-ink-muted">{item.text}</p>
                <LinkButton href={href} variant="quiet" size="sm" className="-ml-3.5 mt-4 self-start whitespace-normal text-left">
                  {item.cta}
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </LinkButton>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function Days() {
  const { t } = useI18n();
  const d = t.home.days;
  const icons = [Handshake, Lightbulb, Factory];
  return (
    <section className="border-b border-rule py-14 sm:py-20" aria-labelledby="days-title">
      <Container>
        <SectionTitle id="days-title" eyebrow={d.eyebrow} title={d.title} />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {d.items.map((day, i) => {
            const Icon = icons[i];
            return (
              <li key={day.label} className="flex flex-col rounded-lg border border-edge bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[0.78rem] font-semibold uppercase text-primary">
                    <CalendarRange className="size-3.5" aria-hidden="true" />
                    {day.label}
                  </span>
                  <Icon className="size-5 text-ink-muted" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold">{day.title}</h3>
                <p className="mt-1 text-ink-muted">{day.text}</p>
              </li>
            );
          })}
        </ol>
        <LinkButton href="/agenda" variant="secondary" className="mt-8">
          {d.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </LinkButton>
      </Container>
    </section>
  );
}

function ForWhom() {
  const { t } = useI18n();
  const e = t.home.forExhibitors;
  const v = t.home.forInvestors;
  const exhibitorIcons = [PackageSearch, Lightbulb, Scale, TrendingUp];
  const investorIcons = [Trees, Search, Users, Factory];
  return (
    <section className="border-b border-rule py-14 sm:py-20" aria-label={`${e.title} / ${v.title}`}>
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[18px] border border-edge bg-surface p-6 sm:p-8" aria-labelledby="exhibitors-title">
          <Eyebrow>{e.eyebrow}</Eyebrow>
          <h2 id="exhibitors-title" className="caps mt-2 text-[2.4rem] sm:text-[2.8rem]">
            {e.title}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {e.items.map((item, i) => {
              const Icon = exhibitorIcons[i];
              return (
                <li key={item.title} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-bold leading-snug">{item.title}</p>
                    <p className="text-[0.95rem] text-ink-muted">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <LinkButton href="/apply/stand" size="lg" variant="accent" className="mt-8">
            {e.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>

        <Notched className="bg-primary-fill text-white" options={{ widthRatio: 0.3, maxDepth: 44 }}>
          <div className="p-6 pt-16 sm:p-8 sm:pt-16" aria-labelledby="investors-title">
            <p className="font-mono text-[0.78rem] font-semibold uppercase tracking-[0.04em] text-white/80">{v.eyebrow}</p>
            <h2 id="investors-title" className="caps mt-2 text-[2.4rem] sm:text-[2.8rem]">
              {v.title}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {v.items.map((item, i) => {
                const Icon = investorIcons[i];
                return (
                  <li key={item.title} className="flex gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <p className="font-bold leading-snug">{item.title}</p>
                      <p className="text-[0.95rem] text-white/85">{item.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <LinkButton href="/investment" variant="accent" size="lg" className="mt-8">
              {v.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </Notched>
      </Container>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  const f = t.home.faq;
  return (
    <section className="border-b border-rule py-14 sm:py-20" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <SectionTitle id="faq-title" eyebrow={f.eyebrow} title={f.title} />
        <div className="divide-y divide-rule border-y border-rule">
          {f.items.map((item) => (
            <details key={item.q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-bold">
                {item.q}
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-rule text-ink transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="pb-5 text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Big claim on the left, the four role buttons on the right, split by a rule. */
function ClosingCta() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="cta-title">
      <Container className="grid lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0 py-14 sm:py-20 lg:pr-10">
          <h2 id="cta-title" className="caps text-[clamp(2.8rem,7vw,5.5rem)]">
            {t.home.closing.title}
            <span className="text-accent" aria-hidden="true">
              .
            </span>
          </h2>
          <p className="mt-4 text-lg text-ink-muted sm:text-xl">{t.home.closing.text}</p>
        </div>
        <div className="flex min-w-0 items-end border-t border-rule py-10 lg:border-l lg:border-t-0 lg:py-20 lg:pl-10">
          <RoleButtons className="w-full" />
        </div>
      </Container>
    </section>
  );
}
