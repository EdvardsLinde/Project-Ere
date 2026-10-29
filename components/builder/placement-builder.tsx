"use client";

import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, CloudCheck, Eye, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/misc";
import { PlacementCard } from "@/components/placement/placement-card";
import { PlacementDetailView } from "@/components/placement/placement-detail";
import { PlacementStatusBadge } from "@/components/placement/display";
import { useToast } from "@/components/toast";
import { STEP_COUNT, validatePlacement, type MissingItem } from "@/lib/builder";
import { DataError, getRepository, type PlacementInput } from "@/lib/data";
import type { Placement, PlacementStatus } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import {
  StepApplications,
  StepBasics,
  StepBenefits,
  StepCompany,
  StepHeading,
  StepRequirements,
  StepTask,
  type StepProps,
} from "./steps";

interface Props {
  companyId: string;
  initial: PlacementInput;
  placementId: string | null;
  status: PlacementStatus;
}

const STEPS = [StepCompany, StepBasics, StepTask, StepRequirements, StepBenefits, StepApplications];

export function PlacementBuilder({ companyId, initial, placementId, status: initialStatus }: Props) {
  const { t, locale } = useI18n();
  const b = t.builder;
  const router = useRouter();
  const toast = useToast();
  const [data, setData] = useState<PlacementInput>(initial);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<PlacementStatus>(initialStatus);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<"card" | "detail">("card");
  const idRef = useRef<string | null>(placementId);
  const dirty = useRef(false);
  const saving = useRef<Promise<void>>(Promise.resolve());
  const headingRef = useRef<HTMLDivElement>(null);
  const isDraft = status === "draft";

  const missing = useMemo(() => validatePlacement(data, locale), [data, locale]);
  const err = (field: string) => {
    if (!attempted) return undefined;
    const m = missing.find((x) => x.field === field);
    if (!m) return undefined;
    return /Invalid|Long|AfterStart|^ages$|^terms$/.test(m.key) ? b.missing[m.key] : t.validation.required;
  };

  const update = (patch: Partial<PlacementInput>) => {
    dirty.current = true;
    setData((d) => ({ ...d, ...patch }));
  };

  /** Save the current data, creating the draft on first save. Serialised so we never create twice. */
  const persist = (snapshot: PlacementInput) => {
    saving.current = saving.current.then(async () => {
      const repo = getRepository();
      if (idRef.current) await repo.updatePlacement(idRef.current, snapshot);
      else idRef.current = (await repo.createPlacement(companyId, snapshot)).id;
      dirty.current = false;
      setSavedAt(new Date());
    });
    return saving.current;
  };

  // Drafts autosave shortly after each change. Published placements save on request.
  useEffect(() => {
    if (!dirty.current || !isDraft) return;
    const handle = setTimeout(() => {
      persist(data).catch((e) => setError(e instanceof DataError ? t.errors[e.code] : t.errors.generic));
    }, 700);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isDraft]);

  const goTo = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  };

  const run = async (fn: () => Promise<void>) => {
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

  const publish = () =>
    run(async () => {
      if (missing.length) {
        setAttempted(true);
        goTo(STEP_COUNT - 1);
        return;
      }
      await persist(data);
      await getRepository().setPlacementStatus(idRef.current!, "published");
      setStatus("published");
      toast(b.published);
      router.push("/uznemums");
    });

  const saveDraft = () =>
    run(async () => {
      await persist(data);
      toast(t.common.saved);
    });

  const saveLive = () =>
    run(async () => {
      if (missing.length) {
        setAttempted(true);
        goTo(STEP_COUNT - 1);
        return;
      }
      await persist(data);
      toast(t.common.saved);
      router.push("/uznemums");
    });

  const previewPlacement: Placement = {
    ...data,
    id: placementId ?? "preview",
    companyId,
    status,
    isSample: false,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    publishedAt: null,
  };

  const missingByStep = (n: number) => missing.filter((m) => m.step === n).length;
  const StepComponent = STEPS[step];
  const stepProps: StepProps = { data, update, err };

  const preview = (
    <div className="space-y-4">
      <div role="tablist" aria-label={b.preview} className="grid grid-cols-2 rounded-full border-2 border-edge bg-surface-muted p-1 text-sm">
        {(["card", "detail"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={previewTab === tab}
            onClick={() => setPreviewTab(tab)}
            className={`h-9 rounded-full font-bold ${previewTab === tab ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"}`}
          >
            {tab === "card" ? b.previewCard : b.previewDetail}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="rounded-lg border-2 border-dashed border-line bg-bg p-3">
        {previewTab === "card" ? (
          <PlacementCard placement={previewPlacement} applications={[]} preview headingLevel="h3" />
        ) : (
          <div className="pointer-events-none select-none text-[0.92rem]" inert>
            <PlacementDetailView
              placement={previewPlacement}
              applications={[]}
              preview
              action={
                <Button variant="accent" className="w-full" tabIndex={-1}>
                  {t.detail.apply}
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/uznemums" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.applications.backToDashboard}
        </Link>
        <p className="flex items-center gap-2 text-sm text-ink-muted" aria-live="polite">
          <PlacementStatusBadge status={status} />
          {isDraft && (
            <>
              <CloudCheck className="size-4" aria-hidden="true" />
              {savedAt ? fmt(b.autosaved, { time: savedAt.toLocaleTimeString(locale === "lv" ? "lv-LV" : "en-GB", { hour: "2-digit", minute: "2-digit" }) }) : b.autosaveIdle}
            </>
          )}
        </p>
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{placementId ? b.titleEdit : b.titleNew}</h1>
      {!isDraft && (
        <Notice tone="primary" className="mt-4">
          {b.alreadyPublished}
        </Notice>
      )}

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{fmt(b.progress, { n: step + 1, total: STEP_COUNT })}</span>
          <span className="text-ink-muted">{b.steps[step]}</span>
        </div>
        <div
          className="mt-2 h-3.5 overflow-hidden rounded-full border-2 border-edge bg-surface"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEP_COUNT}
          aria-valuenow={step + 1}
          aria-label={fmt(b.progress, { n: step + 1, total: STEP_COUNT })}
        >
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_24rem]">
        <nav aria-label={b.stepsNav} className="min-w-0">
          <ol className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {b.steps.map((label, i) => {
              const miss = attempted ? missingByStep(i) : 0;
              const active = i === step;
              return (
                <li key={label} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-center gap-2.5 rounded-full border-2 px-3 py-2 text-left text-sm font-bold transition-colors ${
                      active ? "border-edge bg-primary-fill text-white shadow-card" : "border-transparent text-ink hover:border-line hover:bg-surface"
                    }`}
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        active ? "bg-white text-primary" : miss ? "bg-danger-soft text-danger" : "bg-surface-muted text-ink-muted"
                      }`}
                    >
                      {miss ? "!" : i + 1}
                    </span>
                    <span className="whitespace-nowrap">{label}</span>
                    {miss > 0 && <span className="sr-only">({miss})</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="min-w-0">
          <div ref={headingRef} tabIndex={-1} className="scroll-mt-24 outline-none" />
          <section key={step} className="animate-step rounded-lg border-2 border-edge bg-surface p-5 shadow-card sm:p-7" aria-label={b.steps[step]}>
            {step < STEPS.length ? (
              <StepComponent {...stepProps} />
            ) : (
              <ReviewStep missing={missing} goTo={goTo} preview={preview} />
            )}
          </section>

          {error && (
            <Notice tone="danger" className="mt-4">
              <p role="alert">{error}</p>
            </Notice>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => goTo(step - 1)} disabled={step === 0}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              {b.prev}
            </Button>
            {step < STEP_COUNT - 1 && (
              <Button variant="secondary" onClick={() => goTo(step + 1)}>
                {b.next}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            )}
            <Button variant="quiet" className="xl:hidden" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-4" aria-hidden="true" />
              {b.showPreview}
            </Button>
            <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
              {isDraft ? (
                <>
                  <Button variant="secondary" onClick={saveDraft} disabled={busy}>
                    <Save className="size-4" aria-hidden="true" />
                    {b.saveDraft}
                  </Button>
                  <Button variant="accent" onClick={publish} disabled={busy}>
                    <Send className="size-4" aria-hidden="true" />
                    {busy ? b.publishing : b.publish}
                  </Button>
                </>
              ) : (
                <Button onClick={saveLive} disabled={busy}>
                  <Save className="size-4" aria-hidden="true" />
                  {b.saveChanges}
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="hidden xl:block" aria-label={b.preview}>
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            <p className="flex items-center gap-2 font-extrabold">
              <Eye className="size-5 text-primary" aria-hidden="true" />
              {b.preview}
            </p>
            <p className="mb-3 text-sm text-ink-muted">{b.previewHint}</p>
            {preview}
          </div>
        </aside>
      </div>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} title={b.preview} closeLabel={t.common.close} size="full">
        <p className="mb-3 text-sm text-ink-muted">{b.previewHint}</p>
        {preview}
      </Dialog>
    </div>
  );
}

function ReviewStep({ missing, goTo, preview }: { missing: MissingItem[]; goTo: (n: number) => void; preview: React.ReactNode }) {
  const { t } = useI18n();
  const b = t.builder;
  return (
    <>
      <StepHeading title={b.s7.title} lead={b.s7.lead} />
      {missing.length > 0 ? (
        <div className="rounded-lg border border-danger/30 bg-danger-soft p-4">
          <h3 className="flex items-center gap-2 font-extrabold text-danger">
            <AlertCircle className="size-5" aria-hidden="true" />
            {b.missingTitle} ({missing.length})
          </h3>
          <ul className="mt-3 space-y-1.5">
            {missing.map((m, i) => (
              <li key={`${m.field}-${i}`} className="flex flex-wrap items-center gap-x-2">
                <span className="font-semibold">{b.missing[m.key]}</span>
                <button type="button" onClick={() => goTo(m.step)} className="text-sm font-semibold text-primary underline underline-offset-2">
                  {fmt(b.goToStep, { step: b.steps[m.step] })}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft p-4 font-bold text-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          {b.missingNone}
        </p>
      )}
      <div className="mt-6 xl:hidden">{preview}</div>
      <p className="mt-6 hidden items-center gap-2 text-sm text-ink-muted xl:flex">
        <Check className="size-4" aria-hidden="true" />
        {b.previewHint}
      </p>
    </>
  );
}
