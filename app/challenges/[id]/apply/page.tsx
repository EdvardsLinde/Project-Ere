"use client";

import { ArrowLeft, CheckCircle2, ShieldCheck, Trash2, UserPlus, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { teamSize } from "@/config/event";
import { siteConfig } from "@/config/site";
import { useToast } from "@/components/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { Card, Container, EmptyState, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { DataError, getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import { emptyTeam, needsGuardianConsent, validateTeam, type FormErrors, type TeamInput } from "@/lib/fair/forms";
import { fmt, useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { tx } from "@/lib/text";
import { focusFirstError } from "@/lib/validation";

export default function TeamApplyPage() {
  const { t, locale } = useI18n();
  const tm = t.team;
  const toast = useToast();
  const { role, setRole } = useRole();
  const { id } = useParams<{ id: string }>();
  const { data: ch, loading } = useQuery((repo) => repo.getChallenge(id), [id]);
  const [input, setInput] = useState<TeamInput>(emptyTeam);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const errors: FormErrors = useMemo(() => (attempted ? validateTeam(input) : {}), [attempted, input]);
  const err = (key: string) => (errors[key] ? t.fieldErrors[errors[key]] : undefined);
  const set = (patch: Partial<TeamInput>) => setInput((i) => ({ ...i, ...patch }));
  const setMember = (i: number, patch: Partial<TeamInput["members"][number]>) =>
    setInput((s) => ({ ...s, members: s.members.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));
  const consentNeeded = needsGuardianConsent(input.members);

  if (loading) return <Loading label={t.common.loading} />;
  if (!ch) {
    return (
      <Container className="py-20">
        <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} action={<LinkButton href="/challenges">{t.challenges.backToList}</LinkButton>} />
      </Container>
    );
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setAttempted(true);
    if (Object.keys(validateTeam(input)).length) {
      focusFirstError();
      return;
    }
    setBusy(true);
    try {
      await getRepository().applyTeam(ch.id, input);
      if (role !== "school") setRole("school");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast(error instanceof DataError ? t.errors[error.code] : t.errors.generic, "danger");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Link href={`/challenges/${ch.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.challenges.backToList}
      </Link>
      <div className="mt-6">
        <PageHeader title={tm.title} lead={fmt(tm.lead, { company: tx(ch.company, locale) })} />
      </div>
      {done ? (
        <Card className="mt-8 p-6 text-center sm:p-10">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-edge bg-accent text-on-accent">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight">{tm.successTitle}</h2>
          <p className="mt-2 text-lg text-ink-muted">{tm.successText}</p>
          <LinkButton href="/dashboard" className="mt-8">
            {tm.toDashboard}
          </LinkButton>
        </Card>
      ) : (
        <form onSubmit={submit} noValidate>
          <Card as="section" className="mt-8 space-y-6 p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={tm.school} required hint={tm.schoolHint} error={err("school")}>
                {(p) => (
                  <>
                    <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} list="school-options" value={input.school} onChange={(e) => set({ school: e.target.value })} />
                    <datalist id="school-options">
                      {siteConfig.schools.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </>
                )}
              </Field>
              <Field label={tm.teamName} required error={err("teamName")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.teamName} onChange={(e) => set({ teamName: e.target.value })} />}
              </Field>
            </div>

            <fieldset>
              <legend className="text-sm font-bold text-ink">{tm.members}</legend>
              <ol className="mt-3 space-y-3">
                {input.members.map((m, i) => (
                  <li key={i} className="rounded-md border border-line bg-surface-muted p-3 sm:p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{fmt(tm.memberN, { n: i + 1 })}</p>
                    <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_auto] items-start gap-3">
                      <Field label={tm.memberName} required error={err(`members.${i}.name`)}>
                        {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={m.name} onChange={(e) => setMember(i, { name: e.target.value })} />}
                      </Field>
                      <Field label={tm.memberAge} required error={err(`members.${i}.age`)}>
                        {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} inputMode="numeric" value={m.age} onChange={(e) => setMember(i, { age: e.target.value.replace(/\D/g, "").slice(0, 2) })} />}
                      </Field>
                      <Button
                        variant="quiet"
                        size="sm"
                        className="mt-7 px-2"
                        aria-label={fmt(tm.removeMember, { n: i + 1 })}
                        disabled={input.members.length <= teamSize.min}
                        onClick={() => set({ members: input.members.filter((_, j) => j !== i) })}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
              {err("members") && <p className="mt-2 text-sm font-medium text-danger" role="alert">{err("members")}</p>}
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                disabled={input.members.length >= teamSize.max}
                onClick={() => set({ members: [...input.members, { name: "", age: "" }] })}
              >
                <UserPlus className="size-4" aria-hidden="true" />
                {tm.addMember}
              </Button>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={tm.mentor} required error={err("mentor")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.mentor} onChange={(e) => set({ mentor: e.target.value })} />}
              </Field>
              <Field label={tm.contact} required error={err("contact")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="email" value={input.contact} onChange={(e) => set({ contact: e.target.value })} autoComplete="email" />}
              </Field>
            </div>

            {consentNeeded && (
              <Notice tone="primary" icon={<ShieldCheck className="size-5 text-primary" aria-hidden="true" />}>
                <p className="text-sm">{tm.guardianNote}</p>
                <Checkbox
                  className="mt-3"
                  label={tm.guardianConsent}
                  checked={input.guardianConsent}
                  onChange={(e) => set({ guardianConsent: e.target.checked })}
                  error={err("guardianConsent")}
                />
              </Notice>
            )}

            {attempted && Object.keys(errors).length > 0 && (
              <p className="text-sm font-semibold text-danger" role="alert">
                {t.errors.invalid}
              </p>
            )}
            <Button type="submit" variant="accent" size="lg" disabled={busy}>
              <Send className="size-5" aria-hidden="true" />
              {tm.submit}
            </Button>
          </Card>
        </form>
      )}
    </Container>
  );
}
