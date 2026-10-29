"use client";

import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  Compass,
  FileCheck2,
  GraduationCap,
  Handshake,
  Hourglass,
  MapPin,
  MessageSquare,
  Minus,
  QrCode,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/button";
import { Chip, Container, Eyebrow, ExternalLink } from "@/components/ui/misc";
import { CertificateIllustration } from "@/components/certificate-illustration";
import { IctMeter, SkillsChart, SupportStat, YouthChart } from "@/components/home-charts";
import { LogoMark } from "@/components/logo";
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
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-muted">{h.lead}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {h.chips.map((chip, i) => {
              const Icon = [Clock, UserRound, Award][i];
              return (
                <li key={chip} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-bold">
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                  {chip}
                </li>
              );
            })}
          </ul>
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
  return (
    <section className="bg-surface-muted py-16 sm:py-24" aria-labelledby="why-title">
      <Container>
        <SectionTitle id="why-title" eyebrow={w.eyebrow} title={w.title} />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <SkillsChart />
          <YouthChart />
          <IctMeter />
          <SupportStat />
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {w.more.map((m) => (
            <li key={m.url} className="rounded-lg border border-line bg-surface px-5 py-4">
              <p className="text-2xl font-extrabold tracking-tight text-primary tabular-nums">{m.value}</p>
              <p className="mt-1 text-sm font-semibold leading-snug">{m.label}</p>
              <p className="mt-2 text-xs text-ink-muted">
                {w.source}:{" "}
                <ExternalLink href={m.url} newTabLabel={t.common.opensInNewTab}>
                  {m.source}
                </ExternalLink>
              </p>
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
        <ol className="relative mt-12 grid gap-6 sm:grid-cols-5 sm:gap-3">
          <div className="absolute left-7 top-0 h-full w-0.5 bg-line sm:left-[10%] sm:right-[10%] sm:top-7 sm:h-0.5 sm:w-auto" aria-hidden="true" />
          {h.steps.map((step, i) => {
            const Icon = icons[i];
            const last = i === h.steps.length - 1;
            return (
              <li key={step} className="relative flex items-center gap-4 sm:flex-col sm:text-center">
                <span
                  className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-4 border-bg ${
                    last ? "bg-accent text-on-accent" : "bg-primary-fill text-white"
                  }`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-surface text-xs font-extrabold text-ink ring-1 ring-line">
                    {i + 1}
                  </span>
                </span>
                <p className="font-bold leading-snug sm:max-w-[10rem]">{step}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function BenefitTiles({ items, icons, dark }: { items: string[]; icons: typeof Award[]; dark?: boolean }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, i) => {
        const Icon = icons[i];
        return (
          <li
            key={item}
            className={`flex flex-col items-start gap-3 rounded-md p-3.5 ${dark ? "bg-on-night/[0.06] ring-1 ring-on-night/10" : "bg-bg ring-1 ring-line"}`}
          >
            <span className={`flex size-10 items-center justify-center rounded-md ${dark ? "bg-accent text-on-accent" : "bg-primary-soft text-primary"}`}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold leading-snug">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Benefits() {
  const { t } = useI18n();
  const s = t.home.students;
  const c = t.home.companies;
  return (
    <section className="pb-16 sm:pb-24" aria-label={`${s.title} / ${c.title}`}>
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-6 shadow-card sm:p-8" aria-labelledby="students-title">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-md bg-primary-fill text-white">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <div>
              <Eyebrow>{s.eyebrow}</Eyebrow>
              <h2 id="students-title" className="text-2xl font-extrabold tracking-tight">
                {s.title}
              </h2>
            </div>
          </div>
          <BenefitTiles items={s.items} icons={[Wrench, MessageSquare, BadgeCheck, FileCheck2, CalendarDays, MapPin]} />
          <LinkButton href="/prakses" className="mt-6">
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
          <BenefitTiles items={c.items} icons={[UserCheck, FileCheck2, Hourglass, TrendingUp, Handshake, Zap]} dark />
          <LinkButton href={companyRegister} variant="accent" className="mt-6">
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
  const certIcons = [ClipboardList, FileCheck2, Star, CalendarDays];
  const flowIcons = [Award, QrCode, BadgeCheck];
  return (
    <section className="overflow-hidden border-y border-line bg-surface py-16 sm:py-24" aria-labelledby="credential-title">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <PhoneVerification />
        <div>
          <SectionTitle id="credential-title" eyebrow={p.eyebrow} title={p.title} />
          <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.08em] text-ink-muted">{p.certifiesTitle}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {p.certifies.map((c, i) => {
              const Icon = certIcons[i];
              return (
                <li key={c} className="flex flex-col items-center gap-2 rounded-md bg-bg px-2 py-3 text-center ring-1 ring-line">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <span className="text-sm font-bold leading-tight">{c}</span>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.08em] text-ink-muted">{p.flowTitle}</h3>
          <ol className="mt-3 flex items-start gap-1">
            {p.flow.map((step, i) => {
              const Icon = flowIcons[i];
              return (
                <li key={step} className="flex flex-1 items-start gap-1">
                  <div className="flex flex-1 flex-col items-center gap-2 text-center">
                    <span
                      className={`flex size-12 items-center justify-center rounded-full ${
                        i === 2 ? "bg-success-soft text-success" : "bg-primary-soft text-primary"
                      }`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-tight">{step}</span>
                  </div>
                  {i < p.flow.length - 1 && <ArrowRight className="mt-3.5 size-5 shrink-0 text-ink-muted" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>
          <div className="mt-8 flex flex-wrap gap-2">
            <LinkButton href="/parbaudit" variant="primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {p.verifyCta}
            </LinkButton>
            <LinkButton href={`/sertifikats/${formatCertificateId(2026, 1)}`} variant="secondary">
              {p.sampleCta}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

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
  const ours = c.programs.length - 1;
  // From the programmes' own descriptions: only SEER has a real task, a result the company keeps and a credential.
  const has = (col: number) => col === ours;
  return (
    <section className="py-16 sm:py-24" aria-labelledby="compare-title">
      <Container>
        <SectionTitle id="compare-title" eyebrow={c.eyebrow} title={c.title} />
        <div className="relative mt-10 overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
          <table className="w-full min-w-[36rem] table-fixed text-sm">
            <caption className="sr-only">{c.caption}</caption>
            <colgroup>
              <col className="w-[30%]" />
              {c.programs.map((p) => (
                <col key={p} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <td />
                {c.programs.map((p, i) => (
                  <th key={p} scope="col" className={`px-3 pb-3 pt-5 text-center align-bottom ${i === ours ? "bg-primary-soft" : ""}`}>
                    {i === ours && <LogoMark className="mx-auto mb-1.5 size-8" />}
                    <span className={`block font-extrabold ${i === ours ? "text-primary" : ""}`}>{p}</span>
                    <span className="block text-xs font-medium text-ink-muted">{c.programNotes[i]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="px-4 py-3.5 text-left font-semibold">
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    {c.lengthLabel}
                  </span>
                </th>
                {c.lengths.map((l, i) => (
                  <td key={i} className={`px-3 py-3.5 text-center ${i === ours ? "bg-primary-soft font-extrabold text-primary" : "text-ink-muted"}`}>
                    {l}
                  </td>
                ))}
              </tr>
              {c.rows.map((row) => (
                <tr key={row} className="border-t border-line">
                  <th scope="row" className="px-4 py-3.5 text-left font-semibold">
                    {row}
                  </th>
                  {c.programs.map((p, i) => (
                    <td key={p} className={`px-3 py-3.5 text-center ${i === ours ? "bg-primary-soft" : ""}`}>
                      {has(i) ? (
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-success-soft text-success">
                          <Check className="size-5" strokeWidth={3} aria-hidden="true" />
                          <span className="sr-only">{c.yes}</span>
                        </span>
                      ) : (
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
                          <Minus className="size-4" aria-hidden="true" />
                          <span className="sr-only">{c.no}</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span>{c.sources}:</span>
          {c.sourceLinks.map((l) => (
            <ExternalLink key={l.url} href={l.url} newTabLabel={t.common.opensInNewTab}>
              {l.name}
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
  const spans = ["sm:col-span-1", "sm:col-span-3", "sm:col-span-1"];
  const days = ["1", "2–4", "5"];
  return (
    <section className="py-16 sm:py-24" aria-labelledby="week-title">
      <Container>
        <SectionTitle id="week-title" eyebrow={w.eyebrow} title={w.title} />
        <div className="mt-10 hidden grid-cols-5 gap-2 sm:grid" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((d) => (
            <span key={d} className="rounded-sm bg-surface-muted py-1.5 text-center text-xs font-bold uppercase tracking-wide text-ink-muted">
              {fmt(w.dayShort, { n: d })}
            </span>
          ))}
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-5">
          {w.phases.map((phase, i) => {
            const Icon = icons[i];
            const middle = i === 1;
            return (
              <li
                key={phase}
                className={`${spans[i]} flex items-center gap-3 rounded-lg p-4 sm:flex-col sm:items-start ${
                  middle ? "bg-primary-fill text-white" : "border border-line bg-surface"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-md ${
                    middle ? "bg-white/15 text-white" : i === 2 ? "bg-accent text-on-accent" : "bg-primary-soft text-primary"
                  }`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wide sm:hidden ${middle ? "text-white/80" : "text-ink-muted"}`}>
                    {fmt(w.dayShort, { n: days[i] })}
                  </span>
                  <p className="font-bold leading-snug">{phase}</p>
                </div>
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
