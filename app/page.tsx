"use client";

import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarRange,
  Check,
  ClipboardList,
  Compass,
  FileCheck2,
  GraduationCap,
  Handshake,
  Hourglass,
  MapPin,
  MessageSquare,
  QrCode,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/button";
import { Chip, Container, Eyebrow, ExternalLink } from "@/components/ui/misc";
import { CertificateIllustration } from "@/components/certificate-illustration";
import { CircuitLeaf } from "@/components/nature";
import { Photo } from "@/components/photo";
import { Seal } from "@/components/seal";
import { fmt, useI18n } from "@/lib/i18n";
import { formatCertificateId, formatScore } from "@/lib/placements";
import { loginPath } from "@/lib/session";

const companyRegister = `${loginPath("company")}&tab=register`;

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyNow />
      <HowItWorks />
      <Benefits />
      <Credential />
      <Comparison />
      <Partners />
      <Week />
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

/** Splits "Headline — highlighted part" so the part after the dash gets the marker. */
function splitTitle(title: string): [string, string] {
  const i = title.lastIndexOf(" — ");
  return i < 0 ? [title, ""] : [`${title.slice(0, i)} —`, title.slice(i + 3)];
}

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  const [headline, highlight] = splitTitle(h.title);
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div
        className="bg-dots absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden="true"
      />
      <Container className="relative grid items-center gap-14 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:pb-20 lg:pt-20">
        <div>
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-5 text-[clamp(2.5rem,7vw,4.75rem)] font-extrabold leading-[1] tracking-[-0.03em] text-ink"
          >
            {headline}
            {highlight && (
              <>
                {" "}
                <span className="marker whitespace-nowrap">{highlight}</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-muted">{h.lead}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <LinkButton href="/prakses" variant="accent" size="lg">
              <Search className="size-5" aria-hidden="true" />
              {h.findCta}
            </LinkButton>
            <LinkButton href={companyRegister} variant="secondary" size="lg">
              <Building2 className="size-5" aria-hidden="true" />
              {h.offerCta}
            </LinkButton>
          </div>
        </div>
        <HeroVisual />
      </Container>
    </section>
  );
}

/**
 * Real Saldus nature around the sample certificate: a round pine photo (forestry)
 * behind it, a small wheat-field sticker, a cut-out oak leaf and wheat ear
 * (agriculture) at its corners, plus a round "3–5 days" sticker.
 */
function HeroVisual() {
  const { t } = useI18n();
  return (
    <div className="relative mx-auto w-full max-w-md py-6" aria-hidden="true">
      <Photo
        name="pine"
        round
        eager
        className="absolute left-1/2 top-1/2 aspect-square w-[118%] max-w-[30rem] -translate-x-1/2 -translate-y-1/2"
      />
      <Photo name="field" round eager className="absolute -right-2 top-0 size-16 sm:size-20" />
      <CertificateIllustration />
      <Photo name="leafGreen" eager className="absolute -bottom-10 -left-3 w-16 -rotate-[32deg] sm:-bottom-12 sm:-left-10 sm:w-24" />
      <Photo name="wheat" eager className="absolute -bottom-8 -right-4 w-36 -rotate-[24deg] sm:-bottom-10 sm:-right-14 sm:w-52" />
      <p className="absolute -left-1 -top-5 z-10 flex size-20 -rotate-12 items-center justify-center rounded-full border-2 border-edge bg-accent p-2 text-center font-display text-[0.8rem] font-extrabold leading-tight text-on-accent shadow-card sm:-left-6 sm:top-2 sm:size-28 sm:text-lg">
        {fmt(t.common.workingDays, { n: "3–5" })}
      </p>
    </div>
  );
}

/** Primary and accent alternate. */
const BUBBLES = ["bg-primary-fill text-white", "bg-accent text-on-accent"];

/** The four statistics: equal round bubbles with the number, a short label and the source inside. */
function WhyNow() {
  const { t } = useI18n();
  const w = t.home.why;
  return (
    <section className="pb-16 pt-4 sm:pb-24 sm:pt-8" aria-labelledby="why-title">
      <Container className="relative">
        <CircuitLeaf className="pointer-events-none absolute -top-4 right-10 hidden w-32 rotate-12 lg:block" />
        <SectionTitle id="why-title" eyebrow={w.eyebrow} title={w.title} lead={w.lead} />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {w.cards.map((c, i) => (
            <li
              key={c.url}
              className={`mx-auto flex aspect-square w-full max-w-[16rem] flex-col items-center justify-center rounded-full border-2 border-edge px-4 text-center shadow-card sm:px-8 ${
                BUBBLES[i % BUBBLES.length]
              }`}
            >
              <p className="font-display text-[1.6rem] font-extrabold leading-none tracking-tight sm:text-[2.4rem]">{c.value}</p>
              <p className="mt-2 text-xs font-bold leading-snug sm:mt-3 sm:text-[0.95rem]">{c.label}</p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${w.source}: ${c.source} ${t.common.opensInNewTab}`}
                className="mt-1.5 text-[0.7rem] font-semibold underline underline-offset-2 hover:no-underline sm:mt-2 sm:text-xs"
              >
                {w.source} ↗
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const h = t.home.how;
  const icons = [ClipboardList, Search, UserCheck, Wrench, Award];
  return (
    <section className="relative overflow-hidden border-y-2 border-edge bg-surface-muted/80 py-16 sm:py-24" aria-labelledby="how-title">
      <Photo name="leafOrange" className="pointer-events-none absolute right-10 top-8 hidden w-28 rotate-[24deg] lg:block" />
      <Container>
        <SectionTitle id="how-title" eyebrow={h.eyebrow} title={h.title} />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {h.steps.map((s, i) => {
            const Icon = icons[i];
            const last = i === h.steps.length - 1;
            return (
              <li
                key={s.title}
                className={`flex flex-col rounded-lg border-2 border-edge p-5 shadow-card lg:odd:-rotate-1 lg:even:rotate-1 ${
                  last ? "bg-accent text-on-accent" : "bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-extrabold leading-none tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`flex size-10 items-center justify-center rounded-full ${
                      last ? "bg-ink text-bg" : "bg-primary-fill text-white"
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-snug">{s.title}</h3>
                <p className={`mt-1 text-[0.95rem] ${last ? "" : "text-ink-muted"}`}>{s.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function Benefits() {
  const { t } = useI18n();
  const s = t.home.students;
  const c = t.home.companies;
  const studentIcons = [Wrench, MessageSquare, BadgeCheck, FileCheck2, Hourglass, MapPin];
  const companyIcons = [UserCheck, FileCheck2, Hourglass, TrendingUp, Handshake, Zap];
  return (
    <section className="py-16 sm:py-24" aria-label={`${s.title} / ${c.title}`}>
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border-2 border-edge bg-surface p-6 shadow-lift sm:p-8" aria-labelledby="students-title">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
              <GraduationCap className="size-7" aria-hidden="true" />
            </span>
            <div>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h2 id="students-title" className="mt-2 text-3xl font-extrabold tracking-tight">
                {s.title}
              </h2>
            </div>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {s.items.map((item, i) => {
              const Icon = studentIcons[i];
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
          <LinkButton href="/prakses" size="lg" className="mt-8">
            {s.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>

        <div className="rounded-lg border-2 border-edge bg-primary-fill p-6 text-white shadow-lift sm:p-8" aria-labelledby="companies-title">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
              <Building2 className="size-7" aria-hidden="true" />
            </span>
            <div>
              <p className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary-fill">{c.eyebrow}</p>
              <h2 id="companies-title" className="mt-2 text-3xl font-extrabold tracking-tight">
                {c.title}
              </h2>
            </div>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {c.items.map((item, i) => {
              const Icon = companyIcons[i];
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
          <LinkButton href={companyRegister} variant="accent" size="lg" className="mt-8">
            {c.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}

function Credential() {
  const { t } = useI18n();
  const p = t.home.credential;
  return (
    <section className="overflow-hidden border-y-2 border-edge bg-surface/85 py-16 sm:py-24" aria-labelledby="credential-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <PhoneVerification />
        <div>
          <SectionTitle id="credential-title" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
          <h3 className="mt-8 font-bold">{p.certifiesTitle}</h3>
          <ul className="mt-3 space-y-2">
            {p.certifies.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-fill text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-4 rounded-lg border-2 border-edge bg-accent-soft p-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
              <QrCode className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-bold">{p.verifyTitle}</h3>
              <p className="mt-1 text-[0.95rem] text-ink-muted">{p.verifyText}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <LinkButton href="/parbaudit" variant="primary" size="sm">
                  {p.verifyCta}
                </LinkButton>
                <LinkButton href={`/sertifikats/${formatCertificateId(2026, 1)}`} variant="secondary" size="sm">
                  {p.sampleCta}
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Illustration of a company checking a certificate on a phone. Static and decorative. */
function PhoneVerification() {
  const { t, locale } = useI18n();
  const v = t.verify;
  return (
    <figure className="relative mx-auto w-full max-w-xs" aria-label={t.home.credential.phoneLabel}>
      <div className="absolute left-1/2 top-1/2 aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-edge bg-accent" aria-hidden="true" />
      <div className="relative rotate-2 rounded-[2.2rem] border-2 border-edge bg-night p-2.5 shadow-lift" aria-hidden="true">
        <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-on-night/25" />
        <div className="overflow-hidden rounded-[1.7rem] bg-bg">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-xs font-bold">{v.title}</span>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-start gap-2.5 rounded-md border-2 border-success/30 bg-success-soft p-3">
              <BadgeCheck className="size-6 shrink-0 text-success" />
              <div>
                <p className="text-sm font-extrabold text-success">{v.valid}</p>
                <p className="font-mono text-[0.65rem] font-bold text-ink-muted">{formatCertificateId(2026, 1)}</p>
              </div>
            </div>
            {[
              [v.participant, "Elza Paraudziņa"],
              [v.company, "Demo Ražotne SIA"],
              [v.average, `${formatScore(4.4, locale)} / 5`],
            ].map(([k, val]) => (
              <div key={k} className="rounded-md border border-line bg-surface px-3 py-2">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-ink-muted">{k}</p>
                <p className="text-sm font-bold">{val}</p>
              </div>
            ))}
            <div className="flex justify-center pt-1">
              <Seal top={t.certificate.sealTop} bottom={t.certificate.sealBottom} className="h-20 w-[4.3rem]" ribbons={false} />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Comparison() {
  const { t } = useI18n();
  const c = t.home.comparison;
  const rows = c.rows;
  return (
    <section className="py-16 sm:py-24" aria-labelledby="compare-title">
      <Container>
        <SectionTitle id="compare-title" eyebrow={c.eyebrow} title={c.title} />

        {/* Desktop: table */}
        <div className="mt-10 hidden overflow-hidden rounded-lg border-2 border-edge bg-surface shadow-lift md:block">
          <table className="w-full text-left text-[0.95rem]">
            <caption className="sr-only">{c.caption}</caption>
            <thead className="border-b-2 border-edge bg-surface-muted text-sm">
              <tr>
                {c.headers.map((h) => (
                  <th key={h} scope="col" className="px-5 py-3.5 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-t border-line align-top">
                  <th scope="row" className="px-5 py-4 font-semibold">
                    {r.name}
                  </th>
                  <td className="px-5 py-4 text-ink-muted">{r.length}</td>
                  <td className="px-5 py-4 text-ink-muted">{r.does}</td>
                  <td className="px-5 py-4 text-ink-muted">{r.output}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-edge bg-accent-soft align-top">
                <th scope="row" className="px-5 py-4 font-display text-lg font-extrabold">
                  <span className="marker">{c.ours.name}</span>
                </th>
                <td className="px-5 py-4 font-bold">{c.ours.length}</td>
                <td className="px-5 py-4 font-bold">{c.ours.does}</td>
                <td className="px-5 py-4 font-bold">{c.ours.output}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <ul className="mt-8 space-y-3 md:hidden">
          {[...rows.map((r) => ({ ...r, ours: false })), { ...c.ours, url: "", ours: true }].map((r) => (
            <li
              key={r.name}
              className={`rounded-lg border-2 p-4 ${r.ours ? "border-edge bg-accent-soft shadow-card" : "border-line bg-surface"}`}
            >
              <p className="font-display text-lg font-extrabold">{r.ours ? <span className="marker">{r.name}</span> : r.name}</p>
              <dl className="mt-2 space-y-1.5 text-[0.95rem]">
                {[
                  [c.headers[1], r.length],
                  [c.headers[2], r.does],
                  [c.headers[3], r.output],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">{k}</dt>
                    <dd className={r.ours ? "font-semibold" : ""}>{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span>{c.sources}:</span>
          {rows
            .filter((r) => r.url)
            .map((r) => (
              <ExternalLink key={r.url} href={r.url} newTabLabel={t.common.opensInNewTab}>
                {r.name.split(" (")[0]}
              </ExternalLink>
            ))}
        </p>
      </Container>
    </section>
  );
}

/** Slight alternating tilts, like stickers on a laptop lid. */
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

function Partners() {
  const { t } = useI18n();
  const p = t.home.partners;
  return (
    <section className="border-y-2 border-edge bg-surface-muted/80 py-16 sm:py-20" aria-labelledby="partners-title">
      <Container>
        <SectionTitle id="partners-title" eyebrow={p.eyebrow} title={p.title} />
        <ul className="mt-10 flex flex-wrap gap-3 sm:gap-4">
          {siteConfig.potentialPartners.map((name, i) => (
            <li key={name} className={TILTS[i % TILTS.length]}>
              <Chip className="px-5 py-2.5 font-display text-lg font-extrabold shadow-card">{name}</Chip>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-ink-muted">{p.note}</p>
      </Container>
    </section>
  );
}

function Week() {
  const { t } = useI18n();
  const w = t.home.week;
  const icons = [BookOpen, Wrench, Award];
  return (
    <section className="py-16 sm:py-24" aria-labelledby="week-title">
      <Container>
        <SectionTitle id="week-title" eyebrow={w.eyebrow} title={w.title} />
        <ol className="mt-10 grid gap-4 md:grid-cols-[1fr_1.6fr_1fr]">
          {w.days.map((d, i) => {
            const Icon = icons[i];
            const middle = i === 1;
            return (
              <li
                key={d.label}
                className={`flex flex-col rounded-lg border-2 border-edge p-6 shadow-card ${middle ? "bg-primary-fill text-white" : "bg-surface"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      middle ? "bg-accent text-on-accent" : "bg-primary-soft text-primary"
                    }`}
                  >
                    <CalendarRange className="mr-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
                    {d.label}
                  </span>
                  <Icon className={`size-6 ${middle ? "text-accent" : "text-primary"}`} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold">{d.title}</h3>
                <p className={`mt-1 ${middle ? "text-white/85" : "text-ink-muted"}`}>{d.text}</p>
              </li>
            );
          })}
        </ol>
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
            <Photo name="leafGreen" className="w-24 -rotate-12" />
            <Photo name="wheat" className="w-52 rotate-[8deg]" />
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
  const h = t.home.hero;
  return (
    <section className="relative overflow-hidden border-t-2 border-edge bg-primary-fill text-white" aria-labelledby="cta-title">
      <Photo name="field" round className="absolute -right-24 -top-32 size-56 lg:-right-20 lg:-top-24 lg:size-96" />
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
            {t.home.cta.title}
          </h2>
          <p className="mt-4 text-lg text-white/85 sm:text-xl">{t.home.cta.text}</p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <LinkButton href="/prakses" variant="accent" size="lg">
            {h.findCta}
          </LinkButton>
          <LinkButton href={companyRegister} variant="inverse" size="lg">
            {h.offerCta}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
