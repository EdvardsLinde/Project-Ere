"use client";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarRange,
  Compass,
  Factory,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  MapPin,
  PackageSearch,
  Scale,
  Search,
  Sprout,
  Trees,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { eventConfig } from "@/config/event";
import { LinkButton } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/misc";
import { CircuitLeaf, LeafSprig, WheatEar } from "@/components/nature";
import { RoleButtons } from "@/components/role-buttons";
import { useI18n } from "@/lib/i18n";
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
      <h2 id={id} className="mt-4 text-[2.1rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {lead && <p className="mt-3 text-lg text-ink-muted">{lead}</p>}
    </div>
  );
}

function Hero() {
  const { t, locale } = useI18n();
  const h = t.home.hero;
  const words = eventConfig.name.split(" ");
  const highlight = words.length > 1 ? words.pop() : "";
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div
        className="bg-dots absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-8 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:pb-20 lg:pt-20">
        <div>
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-5 text-[clamp(2.75rem,8vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink"
          >
            {words.join(" ")}
            {highlight && (
              <>
                {" "}
                <span className="marker whitespace-nowrap">{highlight}</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[34ch] font-display text-xl font-bold leading-snug sm:text-2xl">
            {tx(eventConfig.subtitle, locale)}
          </p>
          <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-ink-muted">{h.lead}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-line bg-surface px-3 py-1 text-sm font-bold">
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            {tx(eventConfig.datesVenue, locale)}
          </p>
        </div>
        <div>
          <h2 className="sr-only">{h.rolesLabel}</h2>
          <RoleButtons className="lg:grid-cols-1" />
        </div>
      </Container>
    </section>
  );
}

/** Primary and accent alternate. */
const BUBBLES = ["bg-primary-fill text-white", "bg-accent text-on-accent"];

/** The fair in four round bubbles (no statistics: counts of days, sectors and formats). */
function Facts() {
  const { t } = useI18n();
  const f = t.home.facts;
  return (
    <section className="pb-16 pt-4 sm:pb-24 sm:pt-8" aria-labelledby="facts-title">
      <Container className="relative">
        <CircuitLeaf className="pointer-events-none absolute -top-4 right-10 hidden w-32 rotate-12 lg:block" />
        <SectionTitle id="facts-title" eyebrow={f.eyebrow} title={f.title} />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {f.items.map((item, i) => (
            <li
              key={item.label}
              className={`mx-auto flex aspect-square w-full max-w-[16rem] flex-col items-center justify-center rounded-full border-2 border-edge px-4 text-center shadow-card sm:px-8 ${
                BUBBLES[i % BUBBLES.length]
              }`}
            >
              <p className="font-display text-[2.2rem] font-extrabold leading-none tracking-tight sm:text-[3.2rem]">{item.value}</p>
              <p className="mt-2 text-xs font-bold leading-snug sm:mt-3 sm:text-[0.95rem]">{item.label}</p>
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
    <section className="relative overflow-hidden border-y-2 border-edge bg-surface-muted py-16 sm:py-24" aria-labelledby="sectors-title">
      <LeafSprig className="pointer-events-none absolute -right-2 top-4 hidden w-44 -scale-x-100 lg:block" />
      <Container>
        <SectionTitle id="sectors-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {s.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li
                key={item.title}
                className={`flex flex-col rounded-lg border-2 border-edge p-6 shadow-card ${i === 1 ? "bg-primary-fill text-white" : "bg-surface"} lg:odd:-rotate-1 lg:even:rotate-1`}
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-full border-2 border-edge ${i === 1 ? "bg-accent text-on-accent" : "bg-primary-fill text-white"}`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold">{item.title}</h3>
                <p className={`mt-1 ${i === 1 ? "text-white" : "text-ink-muted"}`}>{item.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 flex items-start gap-3 rounded-md border-2 border-line bg-surface px-4 py-3 font-semibold">
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
    <section className="py-16 sm:py-24" aria-labelledby="saldus-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionTitle id="saldus-title" eyebrow={w.eyebrow} title={w.title} />
        <ul className="space-y-4">
          {w.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="flex gap-4 rounded-lg border-2 border-edge bg-surface p-5 shadow-card">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-1 text-ink-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
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
    <section className="border-y-2 border-edge bg-surface-muted py-16 sm:py-24" aria-labelledby="parts-title">
      <Container>
        <SectionTitle id="parts-title" eyebrow={p.eyebrow} title={p.title} />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {p.items.map((item, i) => {
            const { icon: Icon, href } = parts[i];
            const last = i === p.items.length - 1;
            return (
              <li
                key={item.title}
                className={`flex flex-col rounded-lg border-2 border-edge p-5 shadow-card lg:odd:-rotate-1 lg:even:rotate-1 ${
                  last ? "bg-accent text-on-accent" : "bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-extrabold leading-none tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`flex size-10 items-center justify-center rounded-full ${last ? "bg-ink text-bg" : "bg-primary-fill text-white"}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-snug">{item.title}</h3>
                <p className={`mt-1 flex-1 text-[0.95rem] ${last ? "" : "text-ink-muted"}`}>{item.text}</p>
                <LinkButton href={href} variant={last ? "secondary" : "quiet"} size="sm" className="mt-4 self-start whitespace-normal">
                  {item.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </LinkButton>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function Days() {
  const { t } = useI18n();
  const d = t.home.days;
  const icons = [Handshake, Lightbulb, Factory];
  return (
    <section className="py-16 sm:py-24" aria-labelledby="days-title">
      <Container>
        <SectionTitle id="days-title" eyebrow={d.eyebrow} title={d.title} />
        <ol className="mt-10 grid gap-4 md:grid-cols-[1fr_1.4fr_1fr]">
          {d.items.map((day, i) => {
            const Icon = icons[i];
            const middle = i === 1;
            return (
              <li key={day.label} className={`flex flex-col rounded-lg border-2 border-edge p-6 shadow-card ${middle ? "bg-primary-fill text-white" : "bg-surface"}`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${middle ? "bg-accent text-on-accent" : "bg-primary-soft text-primary"}`}
                  >
                    <CalendarRange className="mr-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
                    {day.label}
                  </span>
                  <Icon className={`size-6 ${middle ? "text-accent" : "text-primary"}`} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold">{day.title}</h3>
                <p className={`mt-1 ${middle ? "text-white" : "text-ink-muted"}`}>{day.text}</p>
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
        <div className="rounded-lg border-2 border-edge bg-surface p-6 shadow-lift sm:p-8" aria-labelledby="exhibitors-title">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
              <Building2 className="size-7" aria-hidden="true" />
            </span>
            <div>
              <Eyebrow>{e.eyebrow}</Eyebrow>
              <h2 id="exhibitors-title" className="mt-2 text-3xl font-extrabold tracking-tight">
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

        <div className="rounded-lg border-2 border-edge bg-primary-fill p-6 text-white shadow-lift sm:p-8" aria-labelledby="investors-title">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
              <Landmark className="size-7" aria-hidden="true" />
            </span>
            <div>
              <p className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary-fill">{v.eyebrow}</p>
              <h2 id="investors-title" className="mt-2 text-3xl font-extrabold tracking-tight">
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
                    <p className="text-[0.95rem] text-white">{item.text}</p>
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
    <section className="py-16 sm:py-24" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionTitle id="faq-title" eyebrow={f.eyebrow} title={f.title} />
          <div className="mt-12 hidden items-end gap-3 lg:flex" aria-hidden="true">
            <LeafSprig className="w-36" />
            <WheatEar className="h-40" />
          </div>
        </div>
        <div className="divide-y-2 divide-line rounded-lg border-2 border-edge bg-surface shadow-card">
          {f.items.map((item) => (
            <details key={item.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-bold">
                {item.q}
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent font-sans text-xl leading-none text-on-accent transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
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
    <section className="relative overflow-hidden border-t-2 border-edge bg-primary-fill text-white" aria-labelledby="cta-title">
      <div className="absolute -right-24 -top-32 size-56 rounded-full border-2 border-edge bg-accent lg:-right-20 lg:-top-24 lg:size-96" aria-hidden="true" />
      <CircuitLeaf
        className="pointer-events-none absolute -bottom-10 right-10 hidden w-48 rotate-[20deg] lg:block"
        fill="var(--color-accent)"
        trace="var(--color-on-accent)"
        node="#FFFFFF"
      />
      <Container className="relative flex flex-col items-start gap-8 py-16 sm:py-24">
        <Compass className="size-12 text-accent" aria-hidden="true" />
        <div className="max-w-2xl">
          <h2 id="cta-title" className="text-[2.4rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            {t.home.closing.title}
          </h2>
          <p className="mt-4 text-lg text-white sm:text-xl">{t.home.closing.text}</p>
        </div>
        <RoleButtons onDark className="w-full max-w-3xl" />
      </Container>
    </section>
  );
}
