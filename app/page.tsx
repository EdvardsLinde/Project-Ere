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
  MapPin,
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
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-[2.75rem]">
        {title}
      </h2>
      {lead && <p className="mt-3 text-lg text-ink-muted">{lead}</p>}
    </div>
  );
}

/** Light icon disc used in cards and lists. */
function IconDisc({ icon: Icon, className = "" }: { icon: typeof Sprout; className?: string }) {
  return (
    <span className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary ${className}`}>
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

function Hero() {
  const { t, locale } = useI18n();
  const h = t.home.hero;
  const words = eventConfig.name.split(" ");
  const last = words.length > 1 ? words.pop() : "";
  return (
    <section className="overflow-hidden" aria-labelledby="hero-title">
      <Container className="grid items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-20 lg:pt-16">
        <div className="min-w-0">
          <Eyebrow>
            {fmt(h.eyebrow, { n: eventConfig.days.length })} · {tx(eventConfig.datesVenue, locale)}
          </Eyebrow>
          <h1 id="hero-title" className="mt-5 text-[clamp(3rem,9vw,5.75rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-ink">
            {words.join(" ")} {last && <span className="text-primary">{last}</span>}
            <span className="text-accent" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-6 max-w-[30ch] font-display text-xl font-semibold leading-snug sm:text-2xl">{tx(eventConfig.subtitle, locale)}</p>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-muted">{h.lead}</p>
          <h2 className="sr-only">{h.rolesLabel}</h2>
          <HeroRoleActions className="mt-8" />
        </div>
        <div className="min-w-0" aria-hidden="true">
          <KeyVisual width={640} height={520} seed={1} cols={5} rows={4} nodes={4} className="block h-auto w-full" />
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-muted">
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

/** Four real numbers from `config/event.ts`. */
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
    <section className="border-y border-line bg-surface" aria-labelledby="facts-title">
      <h2 id="facts-title" className="sr-only">
        {f.title}
      </h2>
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={`py-7 sm:py-9 ${i % 2 ? "border-l border-line pl-5 sm:pl-8" : "pr-5 sm:pr-8"} ${
                i > 1 ? "border-t border-line lg:border-t-0" : ""
              } lg:px-8 lg:first:pl-0 lg:[&:nth-child(3)]:border-l`}
            >
              <p className="font-display text-[2.4rem] font-extrabold leading-none tracking-tight text-primary tabular-nums sm:text-5xl">{item.value}</p>
              <p className="mt-2 text-sm font-semibold text-ink-muted sm:text-base">{item.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Sectors() {
  const { t } = useI18n();
  const s = t.home.sectors;
  const icons = [Sprout, Trees, Truck];
  return (
    <section className="py-16 sm:py-24" aria-labelledby="sectors-title">
      <Container>
        <SectionTitle id="sectors-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {s.items.map((item, i) => (
            <li key={item.title} className="flex flex-col rounded-lg border border-edge bg-surface p-6">
              <IconDisc icon={icons[i]} />
              <h3 className="mt-5 text-2xl font-extrabold">{item.title}</h3>
              <p className="mt-1 text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex items-start gap-3 text-ink-muted">
          <Scale className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          {s.adjacent}
        </p>
      </Container>
    </section>
  );
}

function WhySaldus() {
  const { t } = useI18n();
  const w = t.home.whySaldus;
  const icons = [Factory, MapPin, TrendingUp];
  return (
    <section className="border-y border-line bg-surface-muted py-16 sm:py-24" aria-labelledby="saldus-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionTitle id="saldus-title" eyebrow={w.eyebrow} title={w.title} />
        <ul className="divide-y divide-line border-y border-line">
          {w.items.map((item, i) => (
            <li key={item.title} className="flex gap-4 py-6">
              <IconDisc icon={icons[i]} className="bg-surface" />
              <div>
                <h3 className="text-xl font-extrabold">{item.title}</h3>
                <p className="mt-1 text-ink-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

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
    <section className="py-16 sm:py-24" aria-labelledby="parts-title">
      <Container>
        <SectionTitle id="parts-title" eyebrow={p.eyebrow} title={p.title} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {p.items.map((item, i) => {
            const { icon, href } = parts[i];
            return (
              <li key={item.title} className="flex flex-col rounded-lg border border-edge bg-surface p-5">
                <IconDisc icon={icon} />
                <h3 className="mt-5 text-lg font-extrabold leading-snug">{item.title}</h3>
                <p className="mt-1 flex-1 text-[0.95rem] text-ink-muted">{item.text}</p>
                <LinkButton href={href} variant="quiet" size="sm" className="-ml-3.5 mt-4 self-start whitespace-normal">
                  {item.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
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
    <section className="border-y border-line bg-surface-muted py-16 sm:py-24" aria-labelledby="days-title">
      <Container>
        <SectionTitle id="days-title" eyebrow={d.eyebrow} title={d.title} />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {d.items.map((day, i) => {
            const Icon = icons[i];
            return (
              <li key={day.label} className="flex flex-col rounded-lg border border-edge bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
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
    <section className="py-16 sm:py-24" aria-label={`${e.title} / ${v.title}`}>
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-edge bg-surface p-6 shadow-card sm:p-8" aria-labelledby="exhibitors-title">
          <div className="flex items-center gap-4">
            <IconDisc icon={Building2} className="size-14" />
            <div>
              <Eyebrow>{e.eyebrow}</Eyebrow>
              <h2 id="exhibitors-title" className="mt-1.5 text-3xl font-extrabold tracking-tight">
                {e.title}
              </h2>
            </div>
          </div>
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

        <div className="rounded-lg bg-primary-fill p-6 text-white shadow-card sm:p-8" aria-labelledby="investors-title">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/12 text-white">
              <Landmark className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">{v.eyebrow}</p>
              <h2 id="investors-title" className="mt-1.5 text-3xl font-extrabold tracking-tight">
                {v.title}
              </h2>
            </div>
          </div>
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
      </Container>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  const f = t.home.faq;
  return (
    <section className="border-t border-line py-16 sm:py-24" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionTitle id="faq-title" eyebrow={f.eyebrow} title={f.title} />
        <div className="divide-y divide-line border-y border-line">
          {f.items.map((item) => (
            <details key={item.q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-bold">
                {item.q}
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary transition-transform group-open:rotate-45"
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

function ClosingCta() {
  const { t } = useI18n();
  return (
    <section className="bg-primary-fill text-white" aria-labelledby="cta-title">
      <Container className="grid items-end gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-w-xl">
          <h2 id="cta-title" className="text-[2.4rem] font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
            {t.home.closing.title}
          </h2>
          <p className="mt-4 text-lg text-white/85 sm:text-xl">{t.home.closing.text}</p>
        </div>
        <RoleButtons onDark />
      </Container>
    </section>
  );
}
