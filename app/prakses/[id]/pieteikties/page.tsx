"use client";

import { ArrowLeft, CheckCircle2, Paperclip } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button, LinkButton } from "@/components/ui/button";
import { Checkbox, ChoiceGroup, Field, FieldError, Input, Textarea, RequiredMark } from "@/components/ui/form";
import { Card, Container, EmptyState, Loading, Notice } from "@/components/ui/misc";
import { ageOn, formatRange } from "@/lib/dates";
import { DataError, getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import type { ApplicantDetails, Application, Placement, StudentProfile } from "@/lib/data/types";
import { fmt, formatBytes, useI18n } from "@/lib/i18n";
import { applyBlockReason, freeSpots, isMinor, schoolLabel, tx, upcomingTerms } from "@/lib/placements";
import { useRoleGuard, useSession } from "@/lib/session";
import { focusFirstError, isEmail, isISODate, isPhone, type Errors } from "@/lib/validation";

const MOTIVATION_MAX = 800;
const CV_TYPES = [".pdf", ".doc", ".docx"];

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const allowed = useRoleGuard(["student"], "student");
  const { session } = useSession();
  const { data, loading } = useQuery(
    async (repo) => {
      const placement = await repo.getPlacement(id);
      if (!placement) return null;
      return { placement, applications: await repo.listPlacementApplications(id) };
    },
    [id],
  );
  const [submitted, setSubmitted] = useState(false);

  if (!allowed || loading || !session?.student) return <Loading label={t.common.loading} />;

  if (submitted) {
    return (
      <Container className="max-w-2xl py-16">
        <Card className="p-8 text-center">
          <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-extrabold">{t.apply.successTitle}</h1>
          <p className="mt-2 text-lg text-ink-muted">{t.apply.successText}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/students">{t.apply.toDashboard}</LinkButton>
            <LinkButton href="/prakses" variant="secondary">
              {t.apply.toCatalogue}
            </LinkButton>
          </div>
        </Card>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="py-16">
        <EmptyState title={t.detail.notFound} text={t.detail.notFoundText} action={<LinkButton href="/prakses">{t.detail.backToList}</LinkButton>} />
      </Container>
    );
  }

  const block = applyBlockReason(data.placement, data.applications, session.user.id);
  if (block) {
    const text = {
      "not-published": t.detail.notPublished,
      deadline: t.detail.deadlinePassed,
      full: t.detail.full,
      duplicate: t.detail.applied,
    }[block];
    return (
      <Container className="py-16">
        <EmptyState
          title={t.apply.blockedTitle}
          text={text}
          action={
            <LinkButton href={block === "duplicate" ? "/students" : `/prakses/${id}`} variant="secondary">
              {block === "duplicate" ? t.detail.viewApplication : t.common.back}
            </LinkButton>
          }
        />
      </Container>
    );
  }

  return (
    <ApplyForm
      placement={data.placement}
      applications={data.applications}
      profile={session.student}
      onDone={() => {
        setSubmitted(true);
        window.scrollTo({ top: 0 });
      }}
    />
  );
}

type FieldKey =
  | keyof ApplicantDetails
  | "termId"
  | "motivation"
  | "cv"
  | "guardianName"
  | "guardianPhone"
  | "guardianEmail"
  | "guardianConsent"
  | "dataConsent"
  | `q_${string}`
  | "form";

function ApplyForm({
  placement: p,
  applications,
  profile,
  onDone,
}: {
  placement: Placement;
  applications: Application[];
  profile: StudentProfile;
  onDone: () => void;
}) {
  const { t, locale } = useI18n();
  const a = t.apply;
  const v = t.validation;
  const terms = upcomingTerms(p);
  const firstFree = terms.find((term) => freeSpots(term, applications) > 0);

  const [applicant, setApplicant] = useState<ApplicantDetails>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    birthDate: profile.birthDate,
    school: schoolLabel(profile.schoolId, profile.schoolOther, locale),
    grade: profile.grade,
  });
  const [termId, setTermId] = useState(terms.length === 1 && firstFree ? firstFree.id : "");
  const [motivation, setMotivation] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cv, setCv] = useState<{ name: string; size: number } | null>(null);
  const [guardian, setGuardian] = useState({ name: "", phone: "", email: "", consent: false });
  const [dataConsent, setDataConsent] = useState(false);
  const [errors, setErrors] = useState<Errors<FieldKey>>({});
  const [busy, setBusy] = useState(false);

  const minor = isISODate(applicant.birthDate) && isMinor(applicant.birthDate);
  const needsGuardian = minor && p.parentalConsentRequired;
  const setA = (k: keyof ApplicantDetails, value: string) => setApplicant((s) => ({ ...s, [k]: value }));

  const validate = (): Errors<FieldKey> => {
    const e: Errors<FieldKey> = {};
    if (!applicant.firstName.trim()) e.firstName = v.required;
    if (!applicant.lastName.trim()) e.lastName = v.required;
    if (!isEmail(applicant.email)) e.email = v.email;
    if (!applicant.phone.trim()) e.phone = v.required;
    else if (!isPhone(applicant.phone)) e.phone = v.phone;
    if (!isISODate(applicant.birthDate)) e.birthDate = v.date;
    else {
      const age = ageOn(applicant.birthDate);
      if (age < p.ageFrom || age > p.ageTo) e.birthDate = fmt(v.ageRange, { min: p.ageFrom, max: p.ageTo });
    }
    if (!applicant.school.trim()) e.school = v.required;
    if (!termId) e.termId = v.chooseTerm;
    if (p.requireMotivation) {
      if (!motivation.trim()) e.motivation = v.required;
      else if (motivation.length > MOTIVATION_MAX) e.motivation = fmt(v.maxLength, { n: MOTIVATION_MAX });
    }
    for (const q of p.questions) if (!answers[q.id]?.trim()) e[`q_${q.id}`] = v.required;
    if (p.requireCv && !cv) e.cv = v.required;
    if (needsGuardian) {
      if (!guardian.name.trim()) e.guardianName = v.required;
      if (!isPhone(guardian.phone)) e.guardianPhone = guardian.phone.trim() ? v.phone : v.required;
      if (!isEmail(guardian.email)) e.guardianEmail = guardian.email.trim() ? v.email : v.required;
      if (!guardian.consent) e.guardianConsent = v.consent;
    }
    if (!dataConsent) e.dataConsent = v.consent;
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirstError();
      return;
    }
    setBusy(true);
    try {
      await getRepository().submitApplication({
        placementId: p.id,
        studentId: profile.userId,
        termId,
        applicant: { ...applicant, email: applicant.email.trim() },
        motivation: p.requireMotivation ? motivation.trim() : "",
        answers: p.questions.map((q) => ({ questionId: q.id, value: answers[q.id] ?? "" })),
        cv: p.requireCv ? cv : null,
        guardian: needsGuardian ? guardian : null,
        dataConsent,
      });
      onDone();
    } catch (err) {
      const code = err instanceof DataError ? err.code : null;
      setErrors({ form: code ? t.errors[code] : t.errors.generic });
    } finally {
      setBusy(false);
    }
  };

  const onCv = (file: File | undefined) => {
    if (!file) return setCv(null);
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!CV_TYPES.includes(ext)) {
      setCv(null);
      return setErrors((s) => ({ ...s, cv: fmt(v.fileType, { types: CV_TYPES.join(", ") }) }));
    }
    if (file.size > siteConfig.uploads.cvMaxBytes) {
      setCv(null);
      return setErrors((s) => ({ ...s, cv: fmt(v.fileTooBig, { size: formatBytes(siteConfig.uploads.cvMaxBytes, locale) }) }));
    }
    setErrors((s) => ({ ...s, cv: undefined }));
    setCv({ name: file.name, size: file.size });
  };

  const text = (k: keyof ApplicantDetails, label: string, type = "text", autoComplete?: string) => (
    <Field label={label} required error={errors[k]}>
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={applicant[k]}
          onChange={(e) => setA(k, e.target.value)}
          aria-describedby={describedBy}
          invalid={invalid}
        />
      )}
    </Field>
  );

  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Link href={`/prakses/${p.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.common.back}
      </Link>
      <p className="mt-6 font-bold text-ink-muted">{p.company.name}</p>
      <h1 className="text-3xl font-extrabold tracking-tight">
        {a.title}: {tx(p.title, locale)}
      </h1>
      <p className="mt-2 text-lg text-ink-muted">{a.lead}</p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-6">
        {Object.keys(errors).length > 0 && !errors.form && (
          <Notice tone="danger">
            <p role="alert" className="font-semibold">
              {t.errors.formHasErrors}
            </p>
          </Notice>
        )}

        <Card as="section" className="p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">{a.yourDetails}</h2>
          <p className="mt-1 text-sm text-ink-muted">{a.detailsHint}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {text("firstName", a.firstName, "text", "given-name")}
            {text("lastName", a.lastName, "text", "family-name")}
            {text("email", a.email, "email", "email")}
            {text("phone", a.phone, "tel", "tel")}
            {text("birthDate", a.birthDate, "date", "bday")}
            {text("school", a.school)}
            <Field label={a.grade} error={errors.grade}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} value={applicant.grade} onChange={(e) => setA("grade", e.target.value)} aria-describedby={describedBy} invalid={invalid} />
              )}
            </Field>
          </div>
        </Card>

        <Card as="section" className="p-5 sm:p-6">
          <fieldset>
            <legend className="text-lg font-extrabold">
              {a.chooseDate}<RequiredMark /></legend>
            <div className="mt-4 space-y-2">
              {terms.map((term) => {
                const free = freeSpots(term, applications);
                return (
                  <label
                    key={term.id}
                    className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 ${
                      free === 0
                        ? "cursor-not-allowed border-line bg-surface-muted text-ink-muted"
                        : termId === term.id
                          ? "cursor-pointer border-primary bg-primary-soft"
                          : "cursor-pointer border-line hover:border-ink/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="term"
                        value={term.id}
                        checked={termId === term.id}
                        disabled={free === 0}
                        onChange={() => setTermId(term.id)}
                        data-invalid={errors.termId ? "true" : undefined}
                        className="size-4 accent-[var(--color-primary)]"
                      />
                      <span className="font-semibold">{formatRange(term.start, term.end, locale)}</span>
                    </span>
                    <span className="text-sm">{free === 0 ? t.common.noSpots : fmt(t.common.spotsFree, { n: free })}</span>
                  </label>
                );
              })}
            </div>
            {errors.termId && (
              <div className="mt-2">
                <FieldError>{errors.termId}</FieldError>
              </div>
            )}
          </fieldset>
        </Card>

        {(p.requireMotivation || p.questions.length > 0 || p.requireCv) && (
          <Card as="section" className="space-y-5 p-5 sm:p-6">
            {p.requireMotivation && (
              <Field
                label={a.motivation}
                required
                hint={a.motivationHint}
                error={errors.motivation}
                counter={fmt(a.chars, { n: motivation.length, max: MOTIVATION_MAX })}
              >
                {({ id, describedBy, invalid }) => (
                  <Textarea
                    id={id}
                    rows={6}
                    maxLength={MOTIVATION_MAX}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    aria-describedby={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>
            )}

            {p.questions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-extrabold">{a.questions}</h2>
                {p.questions.map((q) =>
                  q.type === "yesno" ? (
                    <ChoiceGroup
                      key={q.id}
                      legend={tx(q.text, locale)}
                      required
                      options={[
                        { value: "yes", label: a.yesNo.yes },
                        { value: "no", label: a.yesNo.no },
                      ]}
                      value={answers[q.id] ?? ""}
                      onChange={(val) => setAnswers((s) => ({ ...s, [q.id]: val }))}
                      error={errors[`q_${q.id}`]}
                    />
                  ) : (
                    <Field key={q.id} label={tx(q.text, locale)} required error={errors[`q_${q.id}`]}>
                      {({ id, describedBy, invalid }) =>
                        q.type === "long" ? (
                          <Textarea
                            id={id}
                            value={answers[q.id] ?? ""}
                            onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: e.target.value }))}
                            aria-describedby={describedBy}
                            invalid={invalid}
                          />
                        ) : (
                          <Input
                            id={id}
                            value={answers[q.id] ?? ""}
                            onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: e.target.value }))}
                            aria-describedby={describedBy}
                            invalid={invalid}
                          />
                        )
                      }
                    </Field>
                  ),
                )}
              </div>
            )}

            {p.requireCv && (
              <Field label={a.cv} required hint={a.cvHint} error={errors.cv}>
                {({ id, describedBy, invalid }) => (
                  <div>
                    <input
                      id={id}
                      type="file"
                      accept={CV_TYPES.join(",")}
                      onChange={(e) => onCv(e.target.files?.[0])}
                      aria-describedby={describedBy}
                      aria-invalid={invalid || undefined}
                      className="block w-full text-sm file:mr-3 file:h-10 file:cursor-pointer file:rounded-md file:border file:border-line file:bg-surface file:px-4 file:font-semibold file:text-ink hover:file:bg-surface-muted"
                    />
                    {cv && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold">
                        <Paperclip className="size-4" aria-hidden="true" />
                        {fmt(a.cvSelected, { name: cv.name, size: formatBytes(cv.size, locale) })}
                      </p>
                    )}
                  </div>
                )}
              </Field>
            )}
          </Card>
        )}

        {needsGuardian && (
          <Card as="section" className="border-accent/40 p-5 sm:p-6">
            <h2 className="text-lg font-extrabold">{a.guardianTitle}</h2>
            <p className="mt-1 text-sm text-ink-muted">{a.guardianLead}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={a.guardianName} required error={errors.guardianName} className="sm:col-span-2">
                {({ id, describedBy, invalid }) => (
                  <Input id={id} value={guardian.name} onChange={(e) => setGuardian((g) => ({ ...g, name: e.target.value }))} aria-describedby={describedBy} invalid={invalid} />
                )}
              </Field>
              <Field label={a.guardianPhone} required error={errors.guardianPhone}>
                {({ id, describedBy, invalid }) => (
                  <Input id={id} type="tel" value={guardian.phone} onChange={(e) => setGuardian((g) => ({ ...g, phone: e.target.value }))} aria-describedby={describedBy} invalid={invalid} />
                )}
              </Field>
              <Field label={a.guardianEmail} required error={errors.guardianEmail}>
                {({ id, describedBy, invalid }) => (
                  <Input id={id} type="email" value={guardian.email} onChange={(e) => setGuardian((g) => ({ ...g, email: e.target.value }))} aria-describedby={describedBy} invalid={invalid} />
                )}
              </Field>
            </div>
            <Checkbox
              className="mt-5"
              label={a.guardianConsent}
              checked={guardian.consent}
              onChange={(e) => setGuardian((g) => ({ ...g, consent: e.target.checked }))}
              error={errors.guardianConsent}
            />
          </Card>
        )}

        <Checkbox
          label={
            <>
              {a.dataConsent}{" "}
              <Link href="/privatums" target="_blank" className="font-semibold text-primary underline">
                {a.privacyLink}
                <span className="sr-only"> {t.common.opensInNewTab}</span>
              </Link>
            </>
          }
          checked={dataConsent}
          onChange={(e) => setDataConsent(e.target.checked)}
          error={errors.dataConsent}
        />

        {errors.form && (
          <Notice tone="danger">
            <p role="alert" className="font-semibold">
              {errors.form}
            </p>
          </Notice>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <LinkButton href={`/prakses/${p.id}`} variant="secondary">
            {t.common.cancel}
          </LinkButton>
          <Button type="submit" variant="accent" size="lg" disabled={busy}>
            {busy ? a.submitting : a.submit}
          </Button>
        </div>
      </form>
    </Container>
  );
}
