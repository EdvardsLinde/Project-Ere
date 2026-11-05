"use client";

import { CheckCircle2, Eye, ImagePlus, Info, Send, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  amountRanges,
  eventConfig,
  exhibitorGoals,
  sectors,
  stages,
  standNeeds,
  standTypes,
  type FairDay,
  type StandSize,
} from "@/config/event";
import { siteConfig } from "@/config/site";
import { ExhibitorCard } from "@/components/fair/exhibitor-card";
import { StandMap } from "@/components/fair/stand-map";
import { useToast } from "@/components/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { ChoiceGroup, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Badge, Card, Notice } from "@/components/ui/misc";
import { DataError, getRepository } from "@/lib/data";
import type { Exhibitor } from "@/lib/data/types";
import { formatEuro } from "@/lib/dates";
import { emptyStandBooking, validateStandBooking, wantsInvestment, type FormErrors, type StandBookingInput } from "@/lib/fair/forms";
import { standPrice, standSizeOf } from "@/lib/fair/stands";
import { fmt, formatBytes, useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { tx } from "@/lib/text";
import { focusFirstError } from "@/lib/validation";

type PaidSize = Exclude<StandSize, "innovator">;
const PAID: PaidSize[] = ["S", "M", "L"];

/** The live preview's record, tolerant of a half-filled form. */
function previewOf(input: StandBookingInput): Exhibitor {
  return {
    id: "preview",
    name: input.name,
    address: input.address,
    sector: input.sector || "agriculture",
    adjacentNote: input.adjacentNote,
    description: input.description,
    logoDataUrl: input.logoDataUrl || undefined,
    contactName: input.contactName,
    email: input.email,
    stand: { size: input.size || "S", number: input.number ?? undefined, days: input.days, needs: input.needs },
    showcase: input.showcase,
    goals: input.goals,
    investment: wantsInvestment(input) ? { amountRange: input.investment.amountRange || "upTo50k", purpose: "", where: "", stage: "idea", offer: "" } : undefined,
    status: "submitted",
    isExample: false,
    createdAt: "",
  };
}

export function StandBookingForm({ exhibitors, initialStand }: { exhibitors: Exhibitor[]; initialStand: number | null }) {
  const { t, locale } = useI18n();
  const b = t.booking;
  const toast = useToast();
  const { role, setRole } = useRole();
  const initialSize = initialStand !== null ? standSizeOf(initialStand) : undefined;
  const [input, setInput] = useState<StandBookingInput>(() => ({
    ...emptyStandBooking(),
    size: initialSize && initialSize !== "innovator" ? initialSize : "",
    number: initialSize && initialSize !== "innovator" ? initialStand : null,
  }));
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Exhibitor | null>(null);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const errors: FormErrors = useMemo(() => (attempted ? validateStandBooking(input, exhibitors) : {}), [attempted, input, exhibitors]);
  const err = (key: string) => (errors[key] ? t.fieldErrors[errors[key]] : undefined);
  const set = (patch: Partial<StandBookingInput>) => setInput((i) => ({ ...i, ...patch }));
  const setInv = (patch: Partial<StandBookingInput["investment"]>) => setInput((i) => ({ ...i, investment: { ...i.investment, ...patch } }));
  const investing = wantsInvestment(input);

  const onLogo = (file: File | undefined) => {
    setFileError("");
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) return setFileError(t.fieldErrors.fileType);
    if (file.size > siteConfig.logoMaxBytes) return setFileError(fmt(t.fieldErrors.fileTooBig, { size: formatBytes(siteConfig.logoMaxBytes, locale) }));
    const reader = new FileReader();
    reader.onload = () => set({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (Object.keys(validateStandBooking(input, exhibitors)).length) {
      focusFirstError();
      return;
    }
    setBusy(true);
    try {
      const saved = await getRepository().submitStand(input);
      if (role !== "exhibitor") setRole("exhibitor");
      setDone(saved);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast(error instanceof DataError ? t.errors[error.code] : t.errors.generic, "danger");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Card className="mx-auto mt-8 max-w-2xl p-6 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-edge bg-accent text-on-accent">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight">{b.successTitle}</h2>
        <p className="mt-2 text-lg text-ink-muted">{b.successText}</p>
        {done.investment && <p className="mt-2 font-semibold text-primary">{b.successShowcase}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/dashboard">{b.toDashboard}</LinkButton>
          {done.investment && (
            <LinkButton href={`/investment/${done.id}`} variant="secondary">
              {b.toShowcase}
            </LinkButton>
          )}
        </div>
      </Card>
    );
  }

  const price = input.size ? standPrice(input.size) : null;
  const sectionTitle = "flex items-center gap-2 text-2xl font-extrabold tracking-tight";

  return (
    <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-6">
        {/* A. Company */}
        <Card as="section" className="space-y-5 p-5 sm:p-7">
          <h2 className={sectionTitle}>{b.sections.company}</h2>
          <Field label={b.name} required error={err("name")}>
            {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.name} onChange={(e) => set({ name: e.target.value })} autoComplete="organization" />}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={b.regNo}>
              {(p) => <Input id={p.id} aria-describedby={p.describedBy} value={input.regNo} onChange={(e) => set({ regNo: e.target.value })} />}
            </Field>
            <Field label={b.address} required error={err("address")}>
              {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.address} onChange={(e) => set({ address: e.target.value })} autoComplete="street-address" />}
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={b.sector} required error={err("sector")}>
              {(p) => (
                <Select id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.sector} onChange={(e) => set({ sector: e.target.value as StandBookingInput["sector"] })}>
                  <option value="">{b.choose}</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {tx(s.label, locale)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {input.sector === "adjacent" && (
              <Field label={b.adjacentNote} required hint={b.adjacentHint} error={err("adjacentNote")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.adjacentNote} onChange={(e) => set({ adjacentNote: e.target.value })} />}
              </Field>
            )}
          </div>
          <Field label={b.description} required hint={b.descriptionHint} error={err("description")}>
            {(p) => <Textarea id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} rows={3} value={input.description} onChange={(e) => set({ description: e.target.value })} />}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={b.website} error={err("website")}>
              {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.website} onChange={(e) => set({ website: e.target.value })} inputMode="url" autoComplete="url" />}
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-ink" id="logo-label">
                {b.logo}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {input.logoDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- uploaded data URL
                  <img src={input.logoDataUrl} alt="" className="size-11 rounded-full border-2 border-edge bg-white object-contain" />
                )}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="sr-only" aria-labelledby="logo-label" onChange={(e) => onLogo(e.target.files?.[0])} />
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="size-4" aria-hidden="true" />
                  {b.logoChoose}
                </Button>
                {input.logoDataUrl && (
                  <Button variant="quiet" size="sm" onClick={() => set({ logoDataUrl: "" })}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    {b.logoRemove}
                  </Button>
                )}
              </div>
              <p className={`text-sm ${fileError ? "font-medium text-danger" : "text-ink-muted"}`} role={fileError ? "alert" : undefined}>
                {fileError || b.logoHint}
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label={b.contactName} required error={err("contactName")}>
              {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.contactName} onChange={(e) => set({ contactName: e.target.value })} autoComplete="name" />}
            </Field>
            <Field label={b.email} required error={err("email")}>
              {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="email" value={input.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" />}
            </Field>
            <Field label={b.phone} error={err("phone")}>
              {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} type="tel" value={input.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="tel" />}
            </Field>
          </div>
        </Card>

        {/* B. Stand */}
        <Card as="section" className="space-y-6 p-5 sm:p-7">
          <h2 className={sectionTitle}>{b.sections.stand}</h2>
          <ChoiceGroup<PaidSize>
            legend={b.size}
            required
            error={err("size")}
            value={input.size || ("" as PaidSize)}
            onChange={(size) => set({ size, number: input.number !== null && standSizeOf(input.number) === size ? input.number : null })}
            options={PAID.map((size) => ({
              value: size,
              label: `${size} · ${fmt(t.stands.area, { w: standTypes[size].width, d: standTypes[size].depth })} · ${formatEuro(standTypes[size].price, locale)}`,
            }))}
          />
          <fieldset>
            <legend className="text-sm font-bold text-ink">{b.number}</legend>
            <p className="mb-3 mt-0.5 text-sm text-ink-muted">{b.numberHint}</p>
            <StandMap exhibitors={exhibitors} mode="pick" size={input.size} selected={input.number} onPick={(n) => set({ number: n, size: (standSizeOf(n) as PaidSize) ?? input.size })} showInnovatorZone={false} />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="font-semibold" aria-live="polite" data-invalid={errors.number ? "true" : undefined} tabIndex={errors.number ? -1 : undefined}>
                {input.number !== null ? fmt(b.numberPicked, { n: input.number }) : b.numberAny}
              </p>
              {input.number !== null && (
                <Button variant="quiet" size="sm" onClick={() => set({ number: null })}>
                  {b.numberAny}
                </Button>
              )}
            </div>
            {err("number") && <p className="mt-1.5 text-sm font-medium text-danger" role="alert">{err("number")}</p>}
          </fieldset>
          <ChoiceGroup<FairDay>
            legend={b.days}
            multiple
            required
            error={err("days")}
            value={input.days}
            onChange={(d) => set({ days: input.days.includes(d) ? input.days.filter((x) => x !== d) : [...input.days, d].sort() })}
            options={eventConfig.days.map((d) => ({ value: d, label: fmt(t.common.day, { n: d }) }))}
          />
          <ChoiceGroup
            legend={b.needs}
            multiple
            value={input.needs}
            onChange={(n) => set({ needs: input.needs.includes(n) ? input.needs.filter((x) => x !== n) : [...input.needs, n] })}
            options={standNeeds.map((n) => ({ value: n, label: t.options.need[n] }))}
          />
          <Field label={b.showcase} required hint={b.showcaseHint} error={err("showcase")}>
            {(p) => <Textarea id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} rows={3} value={input.showcase} onChange={(e) => set({ showcase: e.target.value })} />}
          </Field>
        </Card>

        {/* C. Goals */}
        <Card as="section" className="space-y-5 p-5 sm:p-7">
          <h2 className={sectionTitle}>{b.sections.goals}</h2>
          <ChoiceGroup
            legend={b.goals}
            hint={b.goalsHint}
            multiple
            value={input.goals}
            onChange={(g) => set({ goals: input.goals.includes(g) ? input.goals.filter((x) => x !== g) : [...input.goals, g] })}
            options={exhibitorGoals.map((g) => ({ value: g, label: t.options.exhibitorGoal[g] }))}
          />
        </Card>

        {/* D. Investment */}
        <Card as="section" className="space-y-5 p-5 sm:p-7">
          <h2 className={sectionTitle}>{b.sections.investment}</h2>
          {!investing ? (
            <Notice tone="neutral" icon={<Info className="size-5 text-ink-muted" aria-hidden="true" />}>
              {b.investmentOff}
            </Notice>
          ) : (
            <>
              <ChoiceGroup
                legend={b.amount}
                required
                error={err("investment.amountRange")}
                value={input.investment.amountRange}
                onChange={(amountRange) => setInv({ amountRange })}
                options={amountRanges.map((r) => ({ value: r.id, label: t.options.amount[r.id] }))}
              />
              <Field label={b.purpose} required error={err("investment.purpose")}>
                {(p) => <Textarea id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} rows={2} value={input.investment.purpose} onChange={(e) => setInv({ purpose: e.target.value })} />}
              </Field>
              <Field label={b.where} required error={err("investment.where")}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} invalid={p.invalid} value={input.investment.where} onChange={(e) => setInv({ where: e.target.value })} />}
              </Field>
              <ChoiceGroup
                legend={b.stage}
                required
                error={err("investment.stage")}
                value={input.investment.stage}
                onChange={(stage) => setInv({ stage })}
                options={stages.map((s) => ({ value: s, label: t.options.stage[s] }))}
              />
              <Field label={b.offer} hint={b.offerHint}>
                {(p) => <Input id={p.id} aria-describedby={p.describedBy} value={input.investment.offer} onChange={(e) => setInv({ offer: e.target.value })} />}
              </Field>
            </>
          )}
        </Card>

        {/* Live preview on small screens (the sidebar holds it on large ones). */}
        <section className="lg:hidden" aria-label={b.preview}>
          <p className="flex items-center gap-2 font-extrabold">
            <Eye className="size-5 text-primary" aria-hidden="true" />
            {b.preview}
          </p>
          <div className="mt-3 rounded-lg border-2 border-dashed border-line bg-bg p-3">
            <ExhibitorCard exhibitor={previewOf(input)} preview headingLevel="h3" />
          </div>
        </section>

        {/* Summary */}
        <Card as="section" className="p-5 sm:p-7" aria-labelledby="summary-title">
          <h2 id="summary-title" className={sectionTitle}>
            {b.sections.summary}
          </h2>
          <dl className="mt-4 divide-y divide-line">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink-muted">{b.summaryStand}</dt>
              <dd className="text-right font-semibold">
                {input.size ? `${input.size}${input.number !== null ? ` · ${fmt(t.exhibitors.stand, { n: input.number })}` : ` · ${b.numberAny}`}` : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink-muted">{b.summaryDays}</dt>
              <dd className="text-right font-semibold">{input.days.length ? input.days.map((d) => fmt(t.common.day, { n: d })).join(", ") : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink-muted">{b.summaryShowcase}</dt>
              <dd className="font-semibold">{investing ? t.common.yes : t.common.no}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="font-bold">{b.summaryPrice}</dt>
              <dd className="flex items-center gap-2">
                <Badge tone="warning">{t.common.placeholder}</Badge>
                <span className="font-display text-2xl font-extrabold tabular-nums">{price !== null ? formatEuro(price, locale) : "—"}</span>
              </dd>
            </div>
          </dl>
          <Notice tone="neutral" className="mt-4" icon={<Info className="size-5 text-ink-muted" aria-hidden="true" />}>
            {b.summaryNoPayment}
          </Notice>
          {attempted && Object.keys(errors).length > 0 && (
            <p className="mt-4 text-sm font-semibold text-danger" role="alert">
              {t.errors.invalid}
            </p>
          )}
          <Button type="submit" variant="accent" size="lg" className="mt-6 w-full sm:w-auto" disabled={busy}>
            <Send className="size-5" aria-hidden="true" />
            {busy ? b.submitting : b.submit}
          </Button>
        </Card>
      </div>

      <aside className="hidden lg:block" aria-label={b.preview}>
        <div className="sticky top-24">
          <p className="flex items-center gap-2 font-extrabold">
            <Eye className="size-5 text-primary" aria-hidden="true" />
            {b.preview}
          </p>
          <p className="mb-3 text-sm text-ink-muted">{b.previewHint}</p>
          <div className="rounded-lg border-2 border-dashed border-line bg-bg p-3">
            <ExhibitorCard exhibitor={previewOf(input)} preview headingLevel="h3" />
          </div>
        </div>
      </aside>
    </form>
  );
}
