"use client";

import { CheckCircle2, Lightbulb, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { innovatorGoals, innovatorStandLimit, sectors, stages } from "@/config/event";
import { useToast } from "@/components/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { ChoiceGroup, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Card, Container, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { DataError, getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import { emptyInnovator, validateInnovator, type FormErrors, type InnovatorInput } from "@/lib/fair/forms";
import { innovatorSpotsLeft } from "@/lib/fair/stands";
import { fmt, useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { tx } from "@/lib/text";
import { focusFirstError } from "@/lib/validation";

export default function InnovatorPage() {
  const { t, locale } = useI18n();
  const n = t.innovator;
  const toast = useToast();
  const { role, setRole } = useRole();
  const { data: exhibitors } = useQuery((repo) => repo.listExhibitors(), []);
  const [input, setInput] = useState<InnovatorInput>(emptyInnovator);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const all = useMemo(() => exhibitors ?? [], [exhibitors]);
  const errors: FormErrors = useMemo(() => (attempted ? validateInnovator(input, all) : {}), [attempted, input, all]);
  const err = (key: string) => (errors[key] ? t.fieldErrors[errors[key]] : undefined);
  const set = (patch: Partial<InnovatorInput>) => setInput((i) => ({ ...i, ...patch }));
  const left = innovatorSpotsLeft(all);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (Object.keys(validateInnovator(input, all)).length) {
      focusFirstError();
      return;
    }
    setBusy(true);
    try {
      await getRepository().submitInnovator(input);
      if (role !== "innovator") setRole("innovator");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast(error instanceof DataError ? t.errors[error.code] : t.errors.generic, "danger");
    } finally {
      setBusy(false);
    }
  };

  const counter = (
    <p
      className="inline-flex items-center gap-2 rounded-full border border-edge bg-accent px-4 py-2 font-bold text-on-accent shadow-card"
      aria-live="polite"
    >
      <Lightbulb className="size-5" aria-hidden="true" />
      {fmt(n.spots, { n: left, total: innovatorStandLimit })}
    </p>
  );

  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <PageHeader title={n.title} lead={n.lead} />
      {!exhibitors ? (
        <Loading label={t.common.loading} />
      ) : done ? (
        <Card className="mt-8 p-6 text-center sm:p-10">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-edge bg-accent text-on-accent">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight">{n.successTitle}</h2>
          <p className="mt-2 text-lg text-ink-muted">{n.successText}</p>
          <div className="mt-6 flex justify-center">{counter}</div>
          <LinkButton href="/dashboard" className="mt-8">
            {n.toDashboard}
          </LinkButton>
        </Card>
      ) : (
        <>
          <div className="mt-6">{counter}</div>
          {left === 0 && (
            <Notice tone="danger" className="mt-4">
              {n.noSpots}
            </Notice>
          )}
          <form onSubmit={submit} noValidate>
            <Card as="section" className="mt-6 space-y-5 p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={n.name} required error={err("name")}>
                  {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" />}
                </Field>
                <Field label={n.team} hint={n.teamHint}>
                  {(p) => <Input id={p.id} aria-describedby={p.describedBy} value={input.team} onChange={(e) => set({ team: e.target.value })} />}
                </Field>
              </div>
              <Field label={n.ideaTitle} required error={err("title")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.title} onChange={(e) => set({ title: e.target.value })} />}
              </Field>
              <Field label={n.description} required hint={n.descriptionHint} error={err("description")}>
                {(p) => <Textarea id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} rows={3} value={input.description} onChange={(e) => set({ description: e.target.value })} />}
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={n.sector} required error={err("sector")}>
                  {(p) => (
                    <Select id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.sector} onChange={(e) => set({ sector: e.target.value as InnovatorInput["sector"] })}>
                      <option value="">{t.booking.choose}</option>
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {tx(s.label, locale)}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                {input.sector === "adjacent" && (
                  <Field label={n.adjacentNote} required error={err("adjacentNote")}>
                    {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.adjacentNote} onChange={(e) => set({ adjacentNote: e.target.value })} />}
                  </Field>
                )}
              </div>
              <ChoiceGroup
                legend={n.stage}
                value={input.stage}
                onChange={(stage) => set({ stage: input.stage === stage ? "" : stage })}
                options={stages.map((s) => ({ value: s, label: t.options.stage[s] }))}
              />
              <ChoiceGroup
                legend={n.lookingFor}
                multiple
                value={input.lookingFor}
                onChange={(g) => set({ lookingFor: input.lookingFor.includes(g) ? input.lookingFor.filter((x) => x !== g) : [...input.lookingFor, g] })}
                options={innovatorGoals.map((g) => ({ value: g, label: t.options.innovatorGoal[g] }))}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={n.email} required error={err("email")}>
                  {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="email" value={input.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" />}
                </Field>
                <Field label={n.phone} error={err("phone")}>
                  {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="tel" value={input.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" />}
                </Field>
              </div>
              {attempted && Object.keys(errors).length > 0 && (
                <p className="text-sm font-semibold text-danger" role="alert">
                  {errors.spots ? n.noSpots : t.errors.invalid}
                </p>
              )}
              <Button type="submit" variant="accent" size="lg" disabled={busy || left === 0}>
                <Send className="size-5" aria-hidden="true" />
                {n.submit}
              </Button>
            </Card>
          </form>
        </>
      )}
    </Container>
  );
}
