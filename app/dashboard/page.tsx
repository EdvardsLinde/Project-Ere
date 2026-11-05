"use client";

import { Building2, CalendarClock, Check, GraduationCap, Info, Landmark, Lightbulb, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { StandLine } from "@/components/fair/exhibitor-card";
import { ShowcaseCard } from "@/components/fair/showcase-card";
import { ExhibitorStatusBadge, MeetingStatusBadge, TeamStatusBadge } from "@/components/fair/status-badge";
import { RoleButtons } from "@/components/role-buttons";
import { useToast } from "@/components/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, Container, EmptyState, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { DataError, getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import type { Challenge, Exhibitor, MeetingRequest, TeamApplication } from "@/lib/data/types";
import { formatDateTime } from "@/lib/dates";
import { isInShowcase } from "@/lib/fair/filters";
import { fmt, useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { tx } from "@/lib/text";

interface DashboardData {
  exhibitors: Exhibitor[];
  meetings: MeetingRequest[];
  teams: TeamApplication[];
  challenges: Challenge[];
  mine: { exhibitors: string[]; meetings: string[]; teams: string[] };
  saved: string[];
}

export default function DashboardPage() {
  const { t } = useI18n();
  const d = t.dashboard;
  const { role } = useRole();
  const { data } = useQuery<DashboardData>(
    async (repo) => ({
      exhibitors: await repo.listExhibitors(),
      meetings: await repo.listMeetings(),
      teams: await repo.listTeams(),
      challenges: await repo.listChallenges(),
      mine: await repo.getMine(),
      saved: await repo.listSaved(),
    }),
    [],
  );

  if (!role) {
    return (
      <Container className="py-10 sm:py-14">
        <PageHeader title={d.title} />
        <div className="mt-8">
          <EmptyState title={d.noRoleTitle} text={d.noRoleText} />
        </div>
        <RoleButtons className="mx-auto mt-8 max-w-3xl" />
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <PageHeader title={d.title} eyebrow={t.roles[role]} />
      <Notice tone="neutral" className="mt-6" icon={<Info className="size-5 text-ink-muted" aria-hidden="true" />}>
        {d.note}
      </Notice>
      {!data ? (
        <Loading label={t.common.loading} />
      ) : role === "exhibitor" ? (
        <ExhibitorDashboard data={data} />
      ) : role === "innovator" ? (
        <InnovatorDashboard data={data} />
      ) : role === "investor" ? (
        <InvestorDashboard data={data} />
      ) : (
        <SchoolDashboard data={data} />
      )}
    </Container>
  );
}

function SectionHeading({ icon: Icon, children, id }: { icon: typeof Building2; children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
      <Icon className="size-6 text-primary" aria-hidden="true" />
      {children}
    </h2>
  );
}

function Submitted({ at }: { at: string }) {
  const { t, locale } = useI18n();
  return <p className="text-sm text-ink-muted">{fmt(t.common.submitted, { date: formatDateTime(at, locale) })}</p>;
}

function MeetingWhen({ m }: { m: MeetingRequest }) {
  const { t } = useI18n();
  return (
    <p className="flex items-center gap-1.5 text-sm font-semibold">
      <CalendarClock className="size-4 text-primary" aria-hidden="true" />
      {fmt(t.dashboard.exhibitor.when, { day: fmt(t.common.day, { n: m.day }), time: m.time ? `, ${m.time}` : "" })}
    </p>
  );
}

function ExhibitorDashboard({ data }: { data: DashboardData }) {
  const { t } = useI18n();
  const x = t.dashboard.exhibitor;
  const toast = useToast();
  const stands = data.exhibitors.filter((e) => data.mine.exhibitors.includes(e.id) && e.stand.size !== "innovator");
  const ids = new Set(stands.map((e) => e.id));
  const requests = data.meetings.filter((m) => ids.has(m.exhibitorId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const nameOf = (id: string) => data.exhibitors.find((e) => e.id === id)?.name ?? "—";

  const answer = async (id: string, status: "accepted" | "declined") => {
    try {
      await getRepository().answerMeeting(id, status);
      toast(status === "accepted" ? x.accepted : x.declined);
    } catch (error) {
      toast(error instanceof DataError ? t.errors[error.code] : t.errors.generic, "danger");
    }
  };

  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="stands-title">
        <SectionHeading icon={Building2} id="stands-title">
          {x.stands}
        </SectionHeading>
        {stands.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={x.noStands} action={<LinkButton href="/apply/stand" variant="accent">{x.book}</LinkButton>} />
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {stands.map((e) => (
              <li key={e.id}>
                <Card className="flex h-full flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={`/exhibitors/${e.id}`} className="text-xl font-extrabold leading-snug hover:underline">
                      {e.name}
                    </Link>
                    <ExhibitorStatusBadge status={e.status} />
                  </div>
                  <p className="text-sm font-semibold">
                    <StandLine exhibitor={e} />
                  </p>
                  <Submitted at={e.createdAt} />
                  <p className="mt-auto border-t border-dashed border-line pt-3 text-sm">
                    {isInShowcase(e) ? (
                      <Link href={`/investment/${e.id}`} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                        <Landmark className="size-4" aria-hidden="true" />
                        {x.listing}: {t.options.amount[e.investment.amountRange]}
                      </Link>
                    ) : (
                      <span className="text-ink-muted">{x.notListed}</span>
                    )}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="requests-title">
        <SectionHeading icon={MessageSquare} id="requests-title">
          {x.requests}
        </SectionHeading>
        {requests.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-line bg-surface p-5 text-ink-muted">{x.noRequests}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {requests.map((m) => (
              <li key={m.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold">{fmt(x.from, { name: m.investor.name, organisation: m.investor.organisation })}</p>
                      <p className="text-sm text-ink-muted">
                        {t.options.investorType[m.investor.type]} · {nameOf(m.exhibitorId)}
                      </p>
                    </div>
                    <MeetingStatusBadge status={m.status} />
                  </div>
                  <p className="mt-3 rounded-md bg-surface-muted p-3 leading-relaxed">{m.message}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <MeetingWhen m={m} />
                    {m.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => answer(m.id, "accepted")}>
                          <Check className="size-4" aria-hidden="true" />
                          {x.accept}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => answer(m.id, "declined")}>
                          <X className="size-4" aria-hidden="true" />
                          {x.decline}
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function InnovatorDashboard({ data }: { data: DashboardData }) {
  const { t, locale } = useI18n();
  const x = t.dashboard.innovator;
  const apps = data.exhibitors.filter((e) => data.mine.exhibitors.includes(e.id) && e.stand.size === "innovator");
  return (
    <section className="mt-8" aria-labelledby="apps-title">
      <SectionHeading icon={Lightbulb} id="apps-title">
        {x.applications}
      </SectionHeading>
      {apps.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={x.none} action={<LinkButton href="/apply/innovator" variant="accent">{x.apply}</LinkButton>} />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {apps.map((e) => (
            <li key={e.id}>
              <Card className="flex h-full flex-col gap-2 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link href={`/exhibitors/${e.id}`} className="text-xl font-extrabold leading-snug hover:underline">
                    {tx(e.showcase, locale)}
                  </Link>
                  <ExhibitorStatusBadge status={e.status} />
                </div>
                <p className="font-semibold">{e.name}</p>
                <Submitted at={e.createdAt} />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function InvestorDashboard({ data }: { data: DashboardData }) {
  const { t } = useI18n();
  const x = t.dashboard.investor;
  const sent = data.meetings.filter((m) => data.mine.meetings.includes(m.id)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const saved = data.exhibitors.filter((e) => data.saved.includes(e.id)).filter(isInShowcase);
  const nameOf = (id: string) => data.exhibitors.find((e) => e.id === id)?.name ?? "—";
  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="sent-title">
        <SectionHeading icon={MessageSquare} id="sent-title">
          {x.requests}
        </SectionHeading>
        {sent.length === 0 ? (
          <div className="mt-4">
            <EmptyState title={x.none} action={<LinkButton href="/investment" variant="accent">{x.browse}</LinkButton>} />
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {sent.map((m) => (
              <li key={m.id}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={`/investment/${m.exhibitorId}`} className="font-extrabold hover:underline">
                      {fmt(x.with, { name: nameOf(m.exhibitorId) })}
                    </Link>
                    <MeetingStatusBadge status={m.status} />
                  </div>
                  <p className="mt-2 text-ink-muted">{m.message}</p>
                  <div className="mt-3">
                    <MeetingWhen m={m} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section aria-labelledby="saved-title">
        <SectionHeading icon={Landmark} id="saved-title">
          {x.saved}
        </SectionHeading>
        {saved.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-line bg-surface p-5 text-ink-muted">{x.noSaved}</p>
        ) : (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((e) => (
              <li key={e.id}>
                <ShowcaseCard exhibitor={e} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SchoolDashboard({ data }: { data: DashboardData }) {
  const { t, locale } = useI18n();
  const x = t.dashboard.school;
  const teams = data.teams.filter((team) => data.mine.teams.includes(team.id));
  return (
    <section className="mt-8" aria-labelledby="teams-title">
      <SectionHeading icon={GraduationCap} id="teams-title">
        {x.teams}
      </SectionHeading>
      {teams.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={x.none} action={<LinkButton href="/challenges" variant="accent">{x.browse}</LinkButton>} />
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {teams.map((team) => {
            const ch = data.challenges.find((c) => c.id === team.challengeId);
            return (
              <li key={team.id}>
                <Card className="flex h-full flex-col gap-2 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-xl font-extrabold leading-snug">{team.teamName}</p>
                    <TeamStatusBadge status={team.status} />
                  </div>
                  <p className="text-sm font-semibold">
                    {team.school} · {fmt(x.members, { n: team.members.length })}
                  </p>
                  {ch && (
                    <p className="text-sm text-ink-muted">
                      <span className="font-semibold text-ink">{x.challenge}: </span>
                      <Link href={`/challenges/${ch.id}`} className="text-primary hover:underline">
                        {tx(ch.company, locale)}: {tx(ch.problem, locale)}
                      </Link>
                    </p>
                  )}
                  <Submitted at={team.createdAt} />
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
