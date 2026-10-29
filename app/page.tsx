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
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/button";
import { Chip, Container, Eyebrow, ExternalLink } from "@/components/ui/misc";
import { CertificateIllustration } from "@/components/certificate-illustration";
import { Seal } from "@/components/seal";
import { useI18n } from "@/lib/i18n";
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
      <h2 id={id} className="mt-2 text-3xl font-extrabold tracking-tight sm:text-[2.25rem] sm:leading-[1.15]">
        {title}
      </h2>
      {lead && <p className="mt-3 text-lg text-ink-muted">{lead}</p>}
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;
  return (
    <section className="relative overflow-hidden border-b border-line" aria-labelledby="hero-title">
      <div className="bg-dots absolute inset-0 opacity-60" aria-hidden="true" />
      <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div>
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink"
          >
            {h.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{h.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
        <CertificateIllustration />
      </Container>
      <Roofline />
    </section>
  );
}

/** Saw-tooth factory roofline along the bottom of the hero. */
function Roofline() {
  return (
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="relative block h-6 w-full text-surface-muted sm:h-10" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 40V24l60-20v20l60-20v20l60-20v20l60-20v20l60-20v20h80V10h24v14l60-20v20l60-20v20l60-20v20l60-20v20l60-20v20h80V14h20v10l60-20v20l60-20v20l60-20v20l52-20v36z"
      />
    </svg>
  );
}

function WhyNow() {
  const { t } = useI18n();
  const w = t.home.why;
  const icons = [Users, Zap, TrendingUp, Sparkles];
  return (
    <section className="bg-surface-muted py-16 sm:py-24" aria-labelledby="why-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle id="why-title" eyebrow={w.eyebrow} title={w.title} lead={w.lead} />
          <ul className="grid gap-4 sm:grid-cols-2">
            {w.cards.map((c, i) => {
              const Icon = icons[i];
              return (
                <li key={c.url} className="flex flex-col rounded-lg border border-line bg-surface p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-4xl font-extrabold tracking-tight text-primary tabular-nums">{c.value}</p>
                    <Icon className="size-6 text-accent" aria-hidden="true" />
                  </div>
                  <p className="mt-2 font-semibold leading-snug">{c.label}</p>
                  <p className="mt-2 text-sm text-ink-muted">{c.note}</p>
                  <p className="mt-auto pt-4 text-sm">
                    <span className="text-ink-muted">{w.source}: </span>
                    <ExternalLink href={c.url} newTabLabel={t.common.opensInNewTab}>
                      {c.source}
                    </ExternalLink>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <ul className="mt-10 grid gap-3 border-t border-line pt-6 text-sm text-ink-muted md:grid-cols-3">
          {w.more.map((m) => (
            <li key={m.url}>
              {m.text}{" "}
              <ExternalLink href={m.url} newTabLabel={t.common.opensInNewTab} className="whitespace-nowrap">
                {m.source}
              </ExternalLink>
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
    <section className="py-16 sm:py-24" aria-labelledby="how-title">
      <Container>
        <SectionTitle id="how-title" eyebrow={h.eyebrow} title={h.title} />
        <ol className="relative mt-12 grid gap-8 md:grid-cols-5 md:gap-4">
          <div className="absolute left-[1.375rem] top-0 h-full w-0.5 bg-line md:left-0 md:top-[1.375rem] md:h-0.5 md:w-full" aria-hidden="true" />
          {h.steps.map((s, i) => {
            const Icon = icons[i];
            return (
              <li key={s.title} className="relative flex gap-4 md:flex-col">
                <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-surface bg-primary-fill text-white ring-1 ring-line">
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[0.7rem] font-extrabold text-on-accent">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="font-bold leading-snug">{s.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-ink-muted">{s.text}</p>
                </div>
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
    <section className="pb-16 sm:pb-24" aria-label={`${s.title} / ${c.title}`}>
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-6 shadow-card sm:p-8" aria-labelledby="students-title">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <div>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h2 id="students-title" className="text-2xl font-extrabold tracking-tight">
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
          <LinkButton href="/prakses" className="mt-8">
            {s.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>

        <div className="rounded-lg bg-night p-6 text-on-night ring-1 ring-on-night/10 sm:p-8" aria-labelledby="companies-title">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-md bg-accent text-on-accent">
              <Building2 className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-accent">{c.eyebrow}</p>
              <h2 id="companies-title" className="text-2xl font-extrabold tracking-tight">
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
                    <p className="text-[0.95rem] text-on-night/75">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <LinkButton href={companyRegister} variant="accent" className="mt-8">
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
    <section className="overflow-hidden border-y border-line bg-surface py-16 sm:py-24" aria-labelledby="credential-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <PhoneVerification />
        <div>
          <SectionTitle id="credential-title" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
          <h3 className="mt-8 font-bold">{p.certifiesTitle}</h3>
          <ul className="mt-3 space-y-2">
            {p.certifies.map((c) => (
              <li key={c} className="flex gap-2.5">
                <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-4 rounded-lg border border-line bg-bg p-5">
            <QrCode className="size-8 shrink-0 text-accent" aria-hidden="true" />
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
      <div className="bg-dots absolute -inset-6 rounded-[2.5rem] opacity-70" aria-hidden="true" />
      <div className="relative rounded-[2.2rem] bg-night p-2.5 shadow-lift ring-1 ring-on-night/15" aria-hidden="true">
        <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-on-night/25" />
        <div className="overflow-hidden rounded-[1.7rem] bg-bg">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <ShieldCheck className="size-4 text-primary" />
            <span className="text-xs font-bold">{v.title}</span>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-start gap-2.5 rounded-md bg-success-soft p-3">
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
        <div className="mt-10 hidden overflow-hidden rounded-lg border border-line bg-surface shadow-card md:block">
          <table className="w-full text-left text-[0.95rem]">
            <caption className="sr-only">{c.caption}</caption>
            <thead className="bg-surface-muted text-sm">
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
              <tr className="border-t-2 border-primary bg-primary-soft align-top">
                <th scope="row" className="relative px-5 py-4 font-extrabold text-primary">
                  <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
                  {c.ours.name}
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
              className={`rounded-lg border p-4 ${r.ours ? "border-primary bg-primary-soft" : "border-line bg-surface"}`}
            >
              <p className={`font-extrabold ${r.ours ? "text-primary" : ""}`}>{r.name}</p>
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

function Partners() {
  const { t } = useI18n();
  const p = t.home.partners;
  return (
    <section className="bg-surface-muted py-16 sm:py-20" aria-labelledby="partners-title">
      <Container>
        <SectionTitle id="partners-title" eyebrow={p.eyebrow} title={p.title} />
        <ul className="mt-8 flex flex-wrap gap-2.5">
          {siteConfig.potentialPartners.map((name) => (
            <li key={name}>
              <Chip className="px-4 py-2 text-base font-bold">{name}</Chip>
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
                className={`flex flex-col rounded-lg border p-5 ${middle ? "border-primary bg-primary-fill text-white" : "border-line bg-surface"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                      middle ? "bg-white/15 text-white" : "bg-accent-soft text-accent-ink"
                    }`}
                  >
                    <CalendarRange className="mr-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
                    {d.label}
                  </span>
                  <Icon className={`size-6 ${middle ? "text-accent" : "text-primary"}`} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold">{d.title}</h3>
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
    <section className="border-t border-line bg-surface py-16 sm:py-24" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionTitle id="faq-title" eyebrow={f.eyebrow} title={f.title} />
        <div className="divide-y divide-line rounded-lg border border-line">
          {f.items.map((item) => (
            <details key={item.q} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold">
                {item.q}
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-lg leading-none text-primary transition-transform group-open:rotate-45"
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
    <section className="bg-primary-fill text-white" aria-labelledby="cta-title">
      <Container className="flex flex-col items-start gap-8 py-14 sm:py-16 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Compass className="mt-1 hidden size-10 text-accent sm:block" aria-hidden="true" />
          <div>
            <h2 id="cta-title" className="text-3xl font-extrabold tracking-tight">
              {t.home.cta.title}
            </h2>
            <p className="mt-2 text-lg text-white/85">{t.home.cta.text}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
