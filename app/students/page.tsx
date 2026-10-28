"use client";

import { Award, CalendarDays, ClipboardList, Mail, Phone, Search, User } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Card, Container, EmptyState, Loading, PageHeader } from "@/components/ui/misc";
import { ApplicationStatusBadge } from "@/components/placement/display";
import { formatDate, formatDateTime, formatRange } from "@/lib/dates";
import { useQuery } from "@/lib/data/hooks";
import { fmt, useI18n } from "@/lib/i18n";
import { averageScore, focusLabel, formatScore, schoolLabel, tx } from "@/lib/placements";
import { useRoleGuard, useSession } from "@/lib/session";

export default function StudentDashboard() {
  const { t, locale } = useI18n();
  const allowed = useRoleGuard(["student"], "student");
  const { session } = useSession();
  const studentId = session?.user.role === "student" ? session.user.id : null;

  const { data, loading } = useQuery(
    async (repo) => {
      if (!studentId) return null;
      const [applications, certificates] = await Promise.all([
        repo.listStudentApplications(studentId),
        repo.listStudentCertificates(studentId),
      ]);
      const placements = await Promise.all(applications.map((a) => repo.getPlacement(a.placementId)));
      const companies = await Promise.all(placements.map((p) => (p ? repo.getCompany(p.companyId) : null)));
      return {
        certificates,
        rows: applications.map((a, i) => ({ application: a, placement: placements[i], company: companies[i] })),
      };
    },
    [studentId],
  );

  if (!allowed || loading || !data || !session?.student) return <Loading label={t.common.loading} />;
  const s = t.student;
  const profile = session.student;

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        eyebrow={s.title}
        title={fmt(s.hello, { name: profile.firstName })}
        actions={
          <LinkButton href="/prakses" variant="accent">
            <Search className="size-4" aria-hidden="true" />
            {s.findPlacement}
          </LinkButton>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section aria-labelledby="apps-title">
            <h2 id="apps-title" className="flex items-center gap-2 text-xl font-extrabold">
              <ClipboardList className="size-5 text-primary" aria-hidden="true" />
              {s.applications}
            </h2>
            {data.rows.length === 0 ? (
              <div className="mt-4">
                <EmptyState title={s.noApplications} action={<LinkButton href="/prakses">{s.findPlacement}</LinkButton>} />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.rows.map(({ application: a, placement: p, company }) => {
                  const term = p?.terms.find((x) => x.id === a.termId);
                  const showContact =
                    (a.status === "approved" || a.status === "completed") && company?.confirmed && p?.company.contactPerson.name;
                  return (
                    <Card as="li" key={a.id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink-muted">{p?.company.name}</p>
                          {p ? (
                            <Link href={`/prakses/${p.id}`} className="text-lg font-extrabold leading-snug hover:text-primary hover:underline">
                              {tx(p.title, locale)}
                            </Link>
                          ) : (
                            <p className="font-semibold text-ink-muted">{s.placementRemoved}</p>
                          )}
                        </div>
                        <ApplicationStatusBadge status={a.status} />
                      </div>
                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        {term && (
                          <div className="flex items-center gap-1.5">
                            <dt className="sr-only">{s.dates}</dt>
                            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                            <dd>{formatRange(term.start, term.end, locale)}</dd>
                          </div>
                        )}
                        <div className="flex gap-1.5 text-ink-muted">
                          <dt>{s.submitted}:</dt>
                          <dd>{formatDateTime(a.submittedAt, locale)}</dd>
                        </div>
                      </dl>
                      {(a.status === "approved" || a.status === "completed") && p && (
                        <div className="mt-4 rounded-md bg-surface-muted p-3 text-sm">
                          <p className="font-bold">{s.contactPerson}</p>
                          {showContact ? (
                            <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-5">
                              <span className="flex items-center gap-1.5">
                                <User className="size-4 text-ink-muted" aria-hidden="true" />
                                {p.company.contactPerson.name}
                                {p.company.contactPerson.position && `, ${p.company.contactPerson.position}`}
                              </span>
                              {p.company.contactPerson.email && (
                                <a href={`mailto:${p.company.contactPerson.email}`} className="flex items-center gap-1.5 font-semibold text-primary hover:underline">
                                  <Mail className="size-4" aria-hidden="true" />
                                  {p.company.contactPerson.email}
                                </a>
                              )}
                              {p.company.contactPerson.phone && (
                                <a href={`tel:${p.company.contactPerson.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 font-semibold text-primary hover:underline">
                                  <Phone className="size-4" aria-hidden="true" />
                                  {p.company.contactPerson.phone}
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="mt-1 text-ink-muted">{s.contactPending}</p>
                          )}
                        </div>
                      )}
                      {a.certificateId && (
                        <LinkButton href={`/sertifikats/${a.certificateId}`} variant="secondary" size="sm" className="mt-4">
                          <Award className="size-4" aria-hidden="true" />
                          {s.openCertificate}
                        </LinkButton>
                      )}
                    </Card>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="certs-title">
            <h2 id="certs-title" className="flex items-center gap-2 text-xl font-extrabold">
              <Award className="size-5 text-primary" aria-hidden="true" />
              {s.certificates}
            </h2>
            {data.certificates.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-line bg-surface p-5 text-ink-muted">{s.noCertificates}</p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {data.certificates.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/sertifikats/${c.id}`}
                      className="group block overflow-hidden rounded-lg border border-line bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <div className="hazard h-1.5" aria-hidden="true" />
                      <div className="p-5">
                        <p className="font-mono text-xs font-bold text-ink-muted">{c.id}</p>
                        <p className="mt-1 font-extrabold leading-snug group-hover:text-primary">{tx(c.placementTitle, locale)}</p>
                        <p className="text-sm text-ink-muted">
                          {c.companyName} · {focusLabel(c.focusArea, locale)}
                        </p>
                        <p className="mt-3 text-sm">
                          {formatDate(c.issuedAt.slice(0, 10), locale)} ·{" "}
                          <span className="font-bold text-primary">
                            {t.certificate.average}: {formatScore(averageScore(c.evaluation), locale)}
                          </span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside aria-labelledby="profile-title">
          <Card className="p-5">
            <h2 id="profile-title" className="flex items-center gap-2 font-extrabold">
              <User className="size-5 text-primary" aria-hidden="true" />
              {s.profile}
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {[
                [t.profile.firstName, `${profile.firstName} ${profile.lastName}`],
                [t.profile.email, profile.email],
                [t.profile.phone, profile.phone || "—"],
                [t.profile.birthDate, profile.birthDate ? formatDate(profile.birthDate, locale) : "—"],
                [t.profile.school, schoolLabel(profile.schoolId, profile.schoolOther, locale)],
                [t.profile.grade, profile.grade || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="font-semibold break-words">{v}</dd>
                </div>
              ))}
            </dl>
            {profile.interests.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t.profile.interests}>
                {profile.interests.map((i) => (
                  <li key={i} className="rounded-sm bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
                    {i}
                  </li>
                ))}
              </ul>
            )}
            <LinkButton href="/profils" variant="secondary" size="sm" className="mt-5 w-full">
              {s.editProfile}
            </LinkButton>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
