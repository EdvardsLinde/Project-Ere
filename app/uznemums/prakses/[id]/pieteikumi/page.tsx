"use client";

import { ArrowLeft, Award, Check, FileText, Mail, Phone, RotateCcw, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Select, Textarea } from "@/components/ui/form";
import { Badge, Card, Container, EmptyState, Loading, Notice } from "@/components/ui/misc";
import { ApplicationStatusBadge, PlacementStatusBadge } from "@/components/placement/display";
import { useToast } from "@/components/toast";
import { ageOn, formatDateTime, formatRange } from "@/lib/dates";
import { DataError, getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import type { Application, ApplicationStatus, Placement } from "@/lib/data/types";
import { fmt, formatBytes, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/placements";
import { useRoleGuard, useSession } from "@/lib/session";

const COMMENT_MAX = 300;
const CRITERIA = ["problemSolving", "data", "communication", "independence", "responsibility"] as const;

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const allowed = useRoleGuard(["company"], "company");
  const { session } = useSession();
  const [filter, setFilter] = useState<ApplicationStatus | "">("");
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, loading } = useQuery(
    async (repo) => {
      const placement = await repo.getPlacement(id);
      if (!placement) return null;
      return { placement, applications: await repo.listPlacementApplications(id) };
    },
    [id],
  );

  if (!allowed || loading || !session?.company) return <Loading label={t.common.loading} />;
  const a = t.applications;

  if (!data || data.placement.companyId !== session.company.id) {
    return (
      <Container className="py-16">
        <EmptyState title={a.noPlacement} action={<LinkButton href="/uznemums">{a.backToDashboard}</LinkButton>} />
      </Container>
    );
  }

  const { placement, applications } = data;
  const rows = filter ? applications.filter((x) => x.status === filter) : applications;
  const open = applications.find((x) => x.id === openId) ?? null;
  const termLabel = (termId: string) => {
    const term = placement.terms.find((x) => x.id === termId);
    return term ? formatRange(term.start, term.end, locale) : "—";
  };

  return (
    <Container className="py-10 sm:py-14">
      <Link href="/uznemums" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {a.backToDashboard}
      </Link>
      <div className="mt-4 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <PlacementStatusBadge status={placement.status} />
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{a.title}</h1>
          <p className="mt-1 text-lg text-ink-muted">{tx(placement.title, locale)}</p>
        </div>
        <div className="sm:w-56">
          <label htmlFor="status-filter" className="text-sm font-semibold">
            {a.filterStatus}
          </label>
          <Select id="status-filter" className="mt-1.5" value={filter} onChange={(e) => setFilter(e.target.value as ApplicationStatus | "")}>
            <option value="">{t.common.all}</option>
            {(["new", "approved", "rejected", "completed"] as const).map((s) => (
              <option key={s} value={s}>
                {t.status.app[s]} ({applications.filter((x) => x.status === s).length})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8">
          <EmptyState title={filter ? a.emptyFiltered : a.empty} />
        </div>
      ) : (
        <>
          {/* Table on wider screens */}
          <div className="mt-8 hidden overflow-hidden rounded-lg border border-line bg-surface shadow-card md:block">
            <table className="w-full text-left text-[0.95rem]">
              <caption className="sr-only">{a.title}</caption>
              <thead className="bg-surface-muted text-sm">
                <tr>
                  {[a.columns.name, a.columns.school, a.columns.age, a.columns.dates, a.columns.submitted, a.columns.status].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-bold">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">{t.common.actions}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((app) => {
                  const age = app.applicant.birthDate ? ageOn(app.applicant.birthDate) : null;
                  return (
                    <tr key={app.id} className="border-t border-line">
                      <th scope="row" className="px-4 py-3 font-bold">
                        {app.applicant.firstName} {app.applicant.lastName}
                      </th>
                      <td className="px-4 py-3">{app.applicant.school}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {age ?? "—"}
                        {age !== null && age < 18 && (
                          <Badge tone="accent" className="ml-2">
                            {a.minor}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">{termLabel(app.termId)}</td>
                      <td className="px-4 py-3 text-ink-muted">{formatDateTime(app.submittedAt, locale)}</td>
                      <td className="px-4 py-3">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="secondary" size="sm" onClick={() => setOpenId(app.id)}>
                          {a.open}
                          <span className="sr-only">
                            : {app.applicant.firstName} {app.applicant.lastName}
                          </span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards on phones */}
          <ul className="mt-6 space-y-3 md:hidden">
            {rows.map((app) => (
              <Card as="li" key={app.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold">
                      {app.applicant.firstName} {app.applicant.lastName}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {app.applicant.school}
                      {app.applicant.birthDate && ` · ${ageOn(app.applicant.birthDate)}`}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>
                <p className="mt-2 text-sm">{termLabel(app.termId)}</p>
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => setOpenId(app.id)}>
                  {a.open}
                </Button>
              </Card>
            ))}
          </ul>
        </>
      )}

      {open && (
        <ApplicationDialog
          key={open.id}
          application={open}
          placement={placement}
          termLabel={termLabel(open.termId)}
          onClose={() => setOpenId(null)}
        />
      )}
    </Container>
  );
}

function ApplicationDialog({
  application: app,
  placement,
  termLabel,
  onClose,
}: {
  application: Application;
  placement: Placement;
  termLabel: string;
  onClose: () => void;
}) {
  const { t, locale } = useI18n();
  const a = t.applications;
  const toast = useToast();
  const [mode, setMode] = useState<"view" | "evaluate">("view");
  const [scores, setScores] = useState<Record<(typeof CRITERIA)[number], number>>({
    problemSolving: 0,
    data: 0,
    communication: 0,
    independence: 0,
    responsibility: 0,
  });
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const repo = getRepository();

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof DataError ? t.errors[e.code] : t.errors.generic);
    } finally {
      setBusy(false);
    }
  };

  const issue = () => {
    if (CRITERIA.some((c) => !scores[c]) || comment.length > COMMENT_MAX) {
      setShowErrors(true);
      return;
    }
    act(async () => {
      const cert = await repo.completeApplication(app.id, { ...scores, comment: comment.trim() });
      toast(fmt(a.issued, { id: cert.id }));
      setMode("view");
    });
  };

  const name = `${app.applicant.firstName} ${app.applicant.lastName}`;
  const age = app.applicant.birthDate ? ageOn(app.applicant.birthDate) : null;

  const footer =
    mode === "evaluate" ? (
      <>
        <Button variant="secondary" onClick={() => setMode("view")}>
          {t.common.cancel}
        </Button>
        <Button variant="accent" onClick={issue} disabled={busy}>
          <Award className="size-4" aria-hidden="true" />
          {a.issue}
        </Button>
      </>
    ) : (
      <>
        {app.status === "new" && (
          <>
            <Button variant="danger" onClick={() => act(() => repo.setApplicationStatus(app.id, "rejected"))} disabled={busy}>
              <X className="size-4" aria-hidden="true" />
              {a.reject}
            </Button>
            <Button onClick={() => act(() => repo.setApplicationStatus(app.id, "approved"))} disabled={busy}>
              <Check className="size-4" aria-hidden="true" />
              {a.approve}
            </Button>
          </>
        )}
        {(app.status === "approved" || app.status === "rejected") && (
          <Button variant="secondary" onClick={() => act(() => repo.setApplicationStatus(app.id, "new"))} disabled={busy}>
            <RotateCcw className="size-4" aria-hidden="true" />
            {a.backToNew}
          </Button>
        )}
        {app.status === "approved" && (
          <Button variant="accent" onClick={() => setMode("evaluate")}>
            <Award className="size-4" aria-hidden="true" />
            {a.complete}
          </Button>
        )}
        {app.certificateId && (
          <LinkButton href={`/sertifikats/${app.certificateId}`}>
            <Award className="size-4" aria-hidden="true" />
            {a.viewCertificate}
          </LinkButton>
        )}
      </>
    );

  return (
    <Dialog open onClose={onClose} title={`${a.detailTitle}: ${name}`} closeLabel={t.common.close} size="lg" footer={footer}>
      {mode === "view" ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <ApplicationStatusBadge status={app.status} />
            <span className="text-sm text-ink-muted">{termLabel}</span>
          </div>
          <dl className="grid gap-3 text-[0.95rem] sm:grid-cols-2">
            {[
              [t.apply.school, `${app.applicant.school}${app.applicant.grade ? `, ${app.applicant.grade}` : ""}`],
              [a.columns.age, age !== null ? `${age}${age < 18 ? ` (${a.minor})` : ""}` : "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm font-bold text-ink-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold text-ink-muted">{a.contact}</dt>
              <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                <a href={`mailto:${app.applicant.email}`} className="flex items-center gap-1.5 font-semibold text-primary hover:underline">
                  <Mail className="size-4" aria-hidden="true" />
                  {app.applicant.email}
                </a>
                {app.applicant.phone && (
                  <a href={`tel:${app.applicant.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 font-semibold text-primary hover:underline">
                    <Phone className="size-4" aria-hidden="true" />
                    {app.applicant.phone}
                  </a>
                )}
              </dd>
            </div>
          </dl>

          {app.motivation && (
            <section>
              <h3 className="font-extrabold">{a.motivation}</h3>
              <p className="mt-1 whitespace-pre-line rounded-md bg-surface-muted p-3">{app.motivation}</p>
            </section>
          )}

          {placement.questions.length > 0 && (
            <section>
              <h3 className="font-extrabold">{a.answers}</h3>
              <dl className="mt-2 space-y-2">
                {placement.questions.map((q) => {
                  const ans = app.answers.find((x) => x.questionId === q.id)?.value ?? "";
                  return (
                    <div key={q.id}>
                      <dt className="text-sm font-bold text-ink-muted">{tx(q.text, locale)}</dt>
                      <dd>{q.type === "yesno" ? (ans === "yes" ? t.common.yes : ans === "no" ? t.common.no : "—") : ans || "—"}</dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          )}

          <section>
            <h3 className="font-extrabold">{a.cv}</h3>
            {app.cv ? (
              <p className="mt-1 flex items-center gap-2">
                <FileText className="size-4 text-primary" aria-hidden="true" />
                {app.cv.name} ({formatBytes(app.cv.size, locale)})<span className="text-sm text-ink-muted"> — {a.cvDemo}</span>
              </p>
            ) : (
              <p className="mt-1 text-ink-muted">{a.noCv}</p>
            )}
          </section>

          {app.guardian && (
            <section className="rounded-md border border-accent/40 bg-accent-soft p-3">
              <h3 className="flex items-center gap-2 font-extrabold">
                <ShieldCheck className="size-4 text-accent-ink" aria-hidden="true" />
                {a.guardian}
              </h3>
              <p className="mt-1">
                {app.guardian.name} · {app.guardian.phone} · {app.guardian.email}
              </p>
              {app.guardian.consent && <p className="mt-1 text-sm font-bold text-success">✓ {a.guardianGiven}</p>}
            </section>
          )}

          {app.evaluation && (
            <section>
              <h3 className="font-extrabold">{a.evaluationTitle}</h3>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {CRITERIA.map((c) => (
                  <li key={c} className="flex justify-between gap-3 rounded-md bg-surface-muted px-3 py-1.5 text-sm">
                    <span>{a.criteria[c]}</span>
                    <span className="font-extrabold">{app.evaluation![c]}/5</span>
                  </li>
                ))}
              </ul>
              {app.evaluation.comment && <p className="mt-2 italic">“{app.evaluation.comment}”</p>}
            </section>
          )}

          {error && <Notice tone="danger">{error}</Notice>}
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-ink-muted">{a.evaluationLead}</p>
          {CRITERIA.map((c) => (
            <fieldset key={c}>
              <legend className="text-sm font-bold">
                {a.criteria[c]}
                <span className="ml-0.5 text-danger" aria-hidden="true">
                  *
                </span>
              </legend>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className={`flex size-11 cursor-pointer items-center justify-center rounded-md border text-base font-extrabold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                      scores[c] === n ? "border-primary bg-primary text-white" : "border-line bg-surface hover:border-ink/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={c}
                      className="sr-only"
                      checked={scores[c] === n}
                      onChange={() => setScores((s) => ({ ...s, [c]: n }))}
                      aria-label={fmt(a.scoreOf, { n })}
                    />
                    {n}
                  </label>
                ))}
              </div>
              {showErrors && !scores[c] && <p className="mt-1 text-sm font-medium text-danger">{t.validation.required}</p>}
            </fieldset>
          ))}
          <Field
            label={a.comment}
            hint={a.commentHint}
            counter={`${comment.length}/${COMMENT_MAX}`}
            error={showErrors && comment.length > COMMENT_MAX ? fmt(t.validation.maxLength, { n: COMMENT_MAX }) : undefined}
          >
            {({ id, describedBy, invalid }) => (
              <Textarea id={id} rows={3} maxLength={COMMENT_MAX} value={comment} onChange={(e) => setComment(e.target.value)} aria-describedby={describedBy} invalid={invalid} />
            )}
          </Field>
          {error && <Notice tone="danger">{error}</Notice>}
        </div>
      )}
    </Dialog>
  );
}
