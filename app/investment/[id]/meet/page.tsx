"use client";

import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { eventConfig, investorTypes } from "@/config/event";
import { useToast } from "@/components/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { ChoiceGroup, Field, Input, Textarea } from "@/components/ui/form";
import { Card, Container, EmptyState, Loading, PageHeader } from "@/components/ui/misc";
import { DataError, getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import { isInShowcase } from "@/lib/fair/filters";
import { emptyMeeting, validateMeeting, type FormErrors, type MeetingInput } from "@/lib/fair/forms";
import { fmt, useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { focusFirstError } from "@/lib/validation";

export default function RequestMeetingPage() {
  const { t } = useI18n();
  const m = t.meeting;
  const toast = useToast();
  const { role, setRole } = useRole();
  const { id } = useParams<{ id: string }>();
  const { data: e, loading } = useQuery((repo) => repo.getExhibitor(id), [id]);
  const [input, setInput] = useState<MeetingInput>(emptyMeeting);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const errors: FormErrors = useMemo(() => (attempted ? validateMeeting(input) : {}), [attempted, input]);
  const err = (key: string) => (errors[key] ? t.fieldErrors[errors[key]] : undefined);
  const set = (patch: Partial<MeetingInput>) => setInput((i) => ({ ...i, ...patch }));

  if (loading) return <Loading label={t.common.loading} />;
  if (!e || !isInShowcase(e)) {
    return (
      <Container className="py-20">
        <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} action={<LinkButton href="/investment">{t.showcase.backToList}</LinkButton>} />
      </Container>
    );
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setAttempted(true);
    if (Object.keys(validateMeeting(input)).length) {
      focusFirstError();
      return;
    }
    setBusy(true);
    try {
      await getRepository().requestMeeting(e.id, input);
      if (role !== "investor") setRole("investor");
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
      <Link href={`/investment/${e.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {e.name}
      </Link>
      <div className="mt-6">
        <PageHeader title={m.title} lead={fmt(m.lead, { name: e.name })} />
      </div>
      {done ? (
        <Card className="mt-8 p-6 text-center sm:p-10">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-edge bg-accent text-on-accent">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight">{m.successTitle}</h2>
          <p className="mt-2 text-lg text-ink-muted">{m.successText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/dashboard">{m.toDashboard}</LinkButton>
            <LinkButton href="/investment" variant="secondary">
              {m.toShowcase}
            </LinkButton>
          </div>
        </Card>
      ) : (
        <form onSubmit={submit} noValidate>
          <Card as="section" className="mt-8 space-y-5 p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={m.name} required error={err("name")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.name} onChange={(ev) => set({ name: ev.target.value })} autoComplete="name" />}
              </Field>
              <Field label={m.organisation} required error={err("organisation")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.organisation} onChange={(ev) => set({ organisation: ev.target.value })} autoComplete="organization" />}
              </Field>
            </div>
            <ChoiceGroup
              legend={m.type}
              value={input.type}
              onChange={(type) => set({ type })}
              options={investorTypes.map((x) => ({ value: x, label: t.options.investorType[x] }))}
            />
            <Field label={m.message} required hint={m.messageHint} error={err("message")}>
              {(p) => <Textarea id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} rows={4} value={input.message} onChange={(ev) => set({ message: ev.target.value })} />}
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <ChoiceGroup
                legend={m.day}
                value={input.day}
                onChange={(day) => set({ day })}
                options={eventConfig.days.map((d) => ({ value: d, label: fmt(t.common.day, { n: d }) }))}
              />
              <Field label={m.time} hint={m.timeHint} error={err("time")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="time" value={input.time} onChange={(ev) => set({ time: ev.target.value })} />}
              </Field>
            </div>
            {attempted && Object.keys(errors).length > 0 && (
              <p className="text-sm font-semibold text-danger" role="alert">
                {t.errors.invalid}
              </p>
            )}
            <Button type="submit" variant="accent" size="lg" disabled={busy}>
              <Send className="size-5" aria-hidden="true" />
              {m.submit}
            </Button>
          </Card>
        </form>
      )}
    </Container>
  );
}
