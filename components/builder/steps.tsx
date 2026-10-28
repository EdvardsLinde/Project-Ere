"use client";

import { CalendarPlus, Lightbulb, Plus, ShieldCheck, Trash2, Wand2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CompanyFields } from "@/components/company-fields";
import { Button } from "@/components/ui/button";
import { Checkbox, ChoiceGroup, Field, Input, Select, Textarea, RequiredMark } from "@/components/ui/form";
import { TagInput } from "@/components/ui/tag-input";
import { recalcTerms, resizeDayPlan, samplePlan } from "@/lib/builder";
import { newId } from "@/lib/data/util";
import type { PlacementInput } from "@/lib/data/repository";
import type { EducationLevel, Text, WorkLanguage } from "@/lib/data/types";
import { endAfterWorkingDays, formatDate } from "@/lib/dates";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/placements";

export interface StepProps {
  data: PlacementInput;
  update: (patch: Partial<PlacementInput>) => void;
  /** Inline error for a field, shown after a publish attempt. */
  err: (field: string) => string | undefined;
}

export function StepHeading({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      {lead && <p className="mt-1 text-ink-muted">{lead}</p>}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <p className="flex gap-2 rounded-md bg-accent-soft px-3 py-2 text-sm">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
      <span>
        <span className="font-bold">{t.common.tip}: </span>
        {children}
      </span>
    </p>
  );
}

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function textValue(v: Text, locale: "lv" | "en") {
  return tx(v, locale);
}

// Step 1 ---------------------------------------------------------------

export function StepCompany({ data, update, err }: StepProps) {
  const { t } = useI18n();
  const s = t.builder.s1;
  return (
    <>
      <StepHeading title={s.title} lead={s.lead} />
      <CompanyFields
        value={data.company}
        onChange={(company) => update({ company })}
        errors={{
          name: err("name"),
          industry: err("industry"),
          description: err("description"),
          town: err("town") ?? err("street"),
          contactName: err("contactName"),
          contactEmail: err("contactEmail"),
          contactPhone: err("contactPhone"),
        }}
      />
    </>
  );
}

// Step 2 ---------------------------------------------------------------

export function StepBasics({ data, update, err }: StepProps) {
  const { t, locale } = useI18n();
  const s = t.builder.s2;

  const setLength = (n: 3 | 4 | 5) =>
    update({ lengthDays: n, terms: recalcTerms(data, n), dayPlan: resizeDayPlan(data.dayPlan, n) });

  const setTerm = (i: number, patch: Partial<PlacementInput["terms"][number]>) => {
    const terms = data.terms.map((term, j) => {
      if (j !== i) return term;
      const next = { ...term, ...patch };
      if (patch.start !== undefined) next.end = patch.start ? endAfterWorkingDays(patch.start, data.lengthDays) : "";
      return next;
    });
    update({ terms });
  };

  return (
    <>
      <StepHeading title={s.title} />
      <div className="space-y-6">
        <Field
          label={s.placementTitle}
          required
          hint={s.placementTitleHint}
          example={s.placementTitleExample}
          exampleLabel={t.common.example}
          error={err("title")}
        >
          {({ id, describedBy, invalid }) => (
            <Input id={id} value={textValue(data.title, locale)} onChange={(e) => update({ title: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
          )}
        </Field>

        <Field label={s.focusArea} required error={err("focusArea")}>
          {({ id, describedBy, invalid }) => (
            <Select id={id} value={data.focusArea} onChange={(e) => update({ focusArea: e.target.value as PlacementInput["focusArea"] })} aria-describedby={describedBy} invalid={invalid}>
              <option value="">{t.auth.choose}</option>
              {siteConfig.focusAreas.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label[locale]}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <ChoiceGroup
          legend={s.length}
          required
          hint={s.lengthHint}
          options={[3, 4, 5].map((n) => ({ value: n as 3 | 4 | 5, label: fmt(t.common.days, { n }) }))}
          value={data.lengthDays}
          onChange={setLength}
        />

        <fieldset>
          <legend className="text-sm font-semibold">
            {s.dates}<RequiredMark /></legend>
          <div className="mt-1">
            <Tip>{s.datesHint}</Tip>
          </div>
          {err("terms") && <p className="mt-2 text-sm font-medium text-danger" role="alert">{err("terms")}</p>}
          <ul className="mt-3 space-y-3">
            {data.terms.map((term, i) => (
              <li key={term.id} className="grid items-end gap-3 rounded-md border border-line bg-bg p-3 sm:grid-cols-[1fr_1fr_7rem_auto]">
                <Field label={s.start} required error={err(`term-start-${i}`)}>
                  {({ id, describedBy, invalid }) => (
                    <Input id={id} type="date" value={term.start} onChange={(e) => setTerm(i, { start: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
                  )}
                </Field>
                <div>
                  <p className="text-sm font-semibold">{s.end}</p>
                  <p className="mt-1.5 flex h-11 items-center rounded-md bg-surface-muted px-3 text-ink-muted" aria-live="polite">
                    {term.end ? formatDate(term.end, locale) : "—"}
                  </p>
                </div>
                <Field label={s.spots} required error={err(`term-spots-${i}`)}>
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      type="number"
                      min={1}
                      max={50}
                      value={term.spots || ""}
                      onChange={(e) => setTerm(i, { spots: Math.max(0, Number(e.target.value) || 0) })}
                      aria-describedby={describedBy}
                      invalid={invalid}
                    />
                  )}
                </Field>
                <Button variant="quiet" className="text-danger hover:bg-danger-soft" aria-label={`${s.removeDate} ${i + 1}`} onClick={() => update({ terms: data.terms.filter((_, j) => j !== i) })}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => update({ terms: [...data.terms, { id: newId("trm"), start: "", end: "", spots: 2 }] })}
          >
            <CalendarPlus className="size-4" aria-hidden="true" />
            {s.addDate}
          </Button>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={`${s.hours}: ${s.hoursFrom}`}>
            {({ id }) => <Input id={id} type="time" value={data.hoursFrom} onChange={(e) => update({ hoursFrom: e.target.value })} />}
          </Field>
          <Field label={`${s.hours}: ${s.hoursTo}`}>
            {({ id }) => <Input id={id} type="time" value={data.hoursTo} onChange={(e) => update({ hoursTo: e.target.value })} />}
          </Field>
        </div>

        <ChoiceGroup
          legend={s.format}
          options={(["onsite", "hybrid"] as const).map((v) => ({ value: v, label: t.options.format[v] }))}
          value={data.format}
          onChange={(format) => update({ format })}
        />
        <ChoiceGroup
          legend={s.languages}
          multiple
          options={(["lv", "en", "ru"] as WorkLanguage[]).map((v) => ({ value: v, label: t.options.languages[v] }))}
          value={data.languages}
          onChange={(v) => update({ languages: toggle(data.languages, v) })}
        />

        <fieldset className="rounded-md border border-line p-4">
          <legend className="px-1 text-sm font-bold">{s.target}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={s.ageFrom} error={err("ages")}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} type="number" min={siteConfig.ageMin} max={siteConfig.ageMax} value={data.ageFrom} onChange={(e) => update({ ageFrom: Number(e.target.value) })} aria-describedby={describedBy} invalid={invalid} />
              )}
            </Field>
            <Field label={s.ageTo}>
              {({ id }) => <Input id={id} type="number" min={siteConfig.ageMin} max={siteConfig.ageMax} value={data.ageTo} onChange={(e) => update({ ageTo: Number(e.target.value) })} />}
            </Field>
          </div>
          <div className="mt-4 space-y-4">
            <ChoiceGroup
              legend={s.education}
              multiple
              options={(["secondary", "vocational", "university"] as EducationLevel[]).map((v) => ({ value: v, label: t.options.education[v] }))}
              value={data.educationLevels}
              onChange={(v) => update({ educationLevels: toggle(data.educationLevels, v) })}
            />
            <Checkbox label={s.beginner} hint={s.beginnerHint} checked={data.beginnerFriendly} onChange={(e) => update({ beginnerFriendly: e.target.checked })} />
          </div>
        </fieldset>
      </div>
    </>
  );
}

// Step 3 ---------------------------------------------------------------

export function StepTask({ data, update, err }: StepProps) {
  const { t, locale } = useI18n();
  const s = t.builder.s3;
  const setDay = (i: number, k: "title" | "description", v: string) =>
    update({ dayPlan: data.dayPlan.map((d, j) => (j === i ? { ...d, [k]: v } : d)) });

  return (
    <>
      <StepHeading title={s.title} />
      <div className="space-y-6">
        <Field label={s.problem} required hint={s.problemHint} example={s.problemExample} exampleLabel={t.common.example} error={err("problem")}>
          {({ id, describedBy, invalid }) => (
            <Textarea id={id} rows={4} value={textValue(data.problem, locale)} onChange={(e) => update({ problem: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
          )}
        </Field>
        <ChoiceGroup
          legend={s.outputType}
          required
          options={siteConfig.outputTypes.map((o) => ({ value: o.id, label: o.label[locale] }))}
          value={data.outputType}
          onChange={(outputType) => update({ outputType })}
          error={err("outputType")}
        />
        <Field
          label={s.outputDescription}
          required
          hint={s.outputDescriptionHint}
          example={s.outputDescriptionExample}
          exampleLabel={t.common.example}
          error={err("outputDescription")}
        >
          {({ id, describedBy, invalid }) => (
            <Textarea id={id} rows={3} value={textValue(data.outputDescription, locale)} onChange={(e) => update({ outputDescription: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
          )}
        </Field>

        <fieldset>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <legend className="text-sm font-semibold">{s.dayPlan}</legend>
            <Button variant="secondary" size="sm" onClick={() => update({ dayPlan: samplePlan(data.lengthDays, t) })}>
              <Wand2 className="size-4" aria-hidden="true" />
              {s.fillSample}
            </Button>
          </div>
          <p className="text-sm text-ink-muted">{s.dayPlanHint}</p>
          <ol className="mt-3 space-y-3">
            {data.dayPlan.map((day, i) => (
              <li key={i} className="flex gap-3 rounded-md border border-line bg-bg p-3">
                <span className="mt-7 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-extrabold text-accent-ink" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="grid flex-1 gap-3">
                  <Field label={fmt(s.dayTitle, { n: i + 1 })}>
                    {({ id }) => <Input id={id} value={textValue(day.title, locale)} onChange={(e) => setDay(i, "title", e.target.value)} />}
                  </Field>
                  <Field label={fmt(s.dayDescription, { n: i + 1 })}>
                    {({ id }) => <Textarea id={id} rows={2} value={textValue(day.description, locale)} onChange={(e) => setDay(i, "description", e.target.value)} />}
                  </Field>
                </div>
              </li>
            ))}
          </ol>
        </fieldset>

        <TagInput
          label={s.tools}
          hint={s.toolsHint}
          value={data.tools}
          onChange={(tools) => update({ tools })}
          suggestions={[...siteConfig.toolSuggestions]}
          removeLabel={t.common.remove}
          addLabel={t.common.add}
        />
        <Field label={s.dataSystems} example={s.dataSystemsExample} exampleLabel={t.common.example}>
          {({ id, describedBy }) => (
            <Textarea id={id} rows={2} value={textValue(data.dataSystems, locale)} onChange={(e) => update({ dataSystems: e.target.value })} aria-describedby={describedBy} />
          )}
        </Field>
        <Checkbox label={s.nda} checked={data.ndaRequired} onChange={(e) => update({ ndaRequired: e.target.checked })} />
      </div>
    </>
  );
}

// Step 4 ---------------------------------------------------------------

export function StepRequirements({ data, update }: StepProps) {
  const { t, locale } = useI18n();
  const s = t.builder.s4;
  return (
    <>
      <StepHeading title={s.title} />
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <TagInput
            label={s.skillsRequired}
            hint={s.skillsHint}
            value={data.skillsRequired.map((v) => tx(v, locale))}
            onChange={(skillsRequired) => update({ skillsRequired })}
            removeLabel={t.common.remove}
            addLabel={t.common.add}
          />
          <TagInput
            label={s.skillsNice}
            hint={s.skillsHint}
            value={data.skillsNice.map((v) => tx(v, locale))}
            onChange={(skillsNice) => update({ skillsNice })}
            removeLabel={t.common.remove}
            addLabel={t.common.add}
          />
        </div>
        <ChoiceGroup
          legend={s.level}
          options={(["none", "basic", "intermediate"] as const).map((v) => ({ value: v, label: t.options.skillLevel[v] }))}
          value={data.skillLevel}
          onChange={(skillLevel) => update({ skillLevel })}
        />
        <TagInput
          label={s.bring}
          value={data.bring.map((v) => tx(v, locale))}
          onChange={(bring) => update({ bring })}
          suggestions={siteConfig.bringSuggestions.map((b) => b[locale])}
          removeLabel={t.common.remove}
          addLabel={t.common.add}
        />
        <fieldset className="space-y-4 rounded-md border border-line p-4">
          <legend className="flex items-center gap-2 px-1 text-sm font-bold">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            {s.safetyTitle}
          </legend>
          <Checkbox label={s.safetyBriefing} checked={data.safetyBriefing} onChange={(e) => update({ safetyBriefing: e.target.checked })} />
          <Field label={s.ppe} example={s.ppeExample} exampleLabel={t.common.example}>
            {({ id, describedBy }) => <Input id={id} value={textValue(data.ppe, locale)} onChange={(e) => update({ ppe: e.target.value })} aria-describedby={describedBy} />}
          </Field>
          <Field label={s.minorRestrictions} example={s.minorRestrictionsExample} exampleLabel={t.common.example}>
            {({ id, describedBy }) => (
              <Input id={id} value={textValue(data.minorRestrictions, locale)} onChange={(e) => update({ minorRestrictions: e.target.value })} aria-describedby={describedBy} />
            )}
          </Field>
          <Checkbox label={s.parentalConsent} checked={data.parentalConsentRequired} onChange={(e) => update({ parentalConsentRequired: e.target.checked })} />
        </fieldset>
      </div>
    </>
  );
}

// Step 5 ---------------------------------------------------------------

export function StepBenefits({ data, update, err }: StepProps) {
  const { t, locale } = useI18n();
  const s = t.builder.s5;
  const comp = data.compensation;
  const setComp = (patch: Partial<typeof comp>) => {
    const next = { ...comp, ...patch };
    // "None" excludes the others and vice versa.
    if (patch.none) Object.assign(next, { stipend: false, meals: false, travel: false, stipendAmount: null });
    if (patch.stipend || patch.meals || patch.travel) next.none = false;
    update({ compensation: next });
  };
  const setMentor = (patch: Partial<PlacementInput["mentor"]>) => update({ mentor: { ...data.mentor, ...patch, isSample: false } });

  return (
    <>
      <StepHeading title={s.title} />
      <div className="space-y-6">
        <fieldset className="rounded-md border border-line p-4">
          <legend className="px-1 text-sm font-bold">{s.mentorTitle}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={s.mentorName} required error={err("mentorName")}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} value={data.mentor.name} onChange={(e) => setMentor({ name: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
              )}
            </Field>
            <Field label={s.mentorPosition} required error={err("mentorPosition")}>
              {({ id, describedBy, invalid }) => (
                <Input id={id} value={textValue(data.mentor.position, locale)} onChange={(e) => setMentor({ position: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
              )}
            </Field>
            <Field label={s.mentorBio} example={s.mentorBioExample} exampleLabel={t.common.example} className="sm:col-span-2">
              {({ id, describedBy }) => (
                <Textarea id={id} rows={2} value={textValue(data.mentor.bio, locale)} onChange={(e) => setMentor({ bio: e.target.value })} aria-describedby={describedBy} />
              )}
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-md border border-primary/25 bg-primary-soft p-4">
          <legend className="px-1 text-sm font-bold">{s.certificateTitle}</legend>
          <Checkbox label={t.detail.passport} hint={s.certificateAlways} checked disabled readOnly />
          <Checkbox label={s.recognises} checked={data.recognisesCertificate} onChange={(e) => update({ recognisesCertificate: e.target.checked })} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">{s.compensation}</legend>
          <p className="text-sm text-ink-muted">{s.compensationHint}</p>
          <Checkbox label={t.options.compensation.none} checked={comp.none} onChange={(e) => setComp({ none: e.target.checked })} />
          <Checkbox label={t.options.compensation.stipend} checked={comp.stipend} onChange={(e) => setComp({ stipend: e.target.checked })} />
          {comp.stipend && (
            <div className="pl-8 sm:max-w-xs">
              <Field label={s.stipendAmount} required error={err("stipendAmount")}>
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={comp.stipendAmount ?? ""}
                    onChange={(e) => setComp({ stipendAmount: e.target.value ? Number(e.target.value) : null })}
                    aria-describedby={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>
            </div>
          )}
          <Checkbox label={t.options.compensation.meals} checked={comp.meals} onChange={(e) => setComp({ meals: e.target.checked })} />
          <Checkbox label={t.options.compensation.travel} checked={comp.travel} onChange={(e) => setComp({ travel: e.target.checked })} />
        </fieldset>

        <ChoiceGroup
          legend={s.opportunities}
          multiple
          options={siteConfig.opportunities.map((o) => ({ value: o.id, label: o.label[locale] }))}
          value={data.opportunities}
          onChange={(v) => update({ opportunities: toggle(data.opportunities, v) })}
        />
        {data.opportunities.includes("other") && (
          <Field label={s.opportunitiesOther}>
            {({ id }) => <Input id={id} value={textValue(data.opportunitiesOther, locale)} onChange={(e) => update({ opportunitiesOther: e.target.value })} />}
          </Field>
        )}
      </div>
    </>
  );
}

// Step 6 ---------------------------------------------------------------

export function StepApplications({ data, update, err }: StepProps) {
  const { t, locale } = useI18n();
  const s = t.builder.s6;
  const setQ = (i: number, patch: Partial<PlacementInput["questions"][number]>) =>
    update({ questions: data.questions.map((q, j) => (j === i ? { ...q, ...patch } : q)) });

  return (
    <>
      <StepHeading title={s.title} />
      <div className="space-y-6">
        <Field label={s.deadline} required hint={s.deadlineHint} error={err("deadline")} className="sm:max-w-xs">
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="date" value={data.deadline} onChange={(e) => update({ deadline: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
          )}
        </Field>
        <div className="space-y-3">
          <Checkbox label={s.requireCv} checked={data.requireCv} onChange={(e) => update({ requireCv: e.target.checked })} />
          <Checkbox label={s.requireMotivation} checked={data.requireMotivation} onChange={(e) => update({ requireMotivation: e.target.checked })} />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold">{s.questions}</legend>
          <p className="text-sm text-ink-muted">{s.questionsHint}</p>
          <ul className="mt-3 space-y-3">
            {data.questions.map((q, i) => (
              <li key={q.id} className="grid items-end gap-3 rounded-md border border-line bg-bg p-3 sm:grid-cols-[1fr_11rem_auto]">
                <Field label={`${s.questionText} ${i + 1}`} required error={err(`question-${i}`)} example={i === 0 ? s.questionExample : undefined} exampleLabel={t.common.example}>
                  {({ id, describedBy, invalid }) => (
                    <Input id={id} value={textValue(q.text, locale)} onChange={(e) => setQ(i, { text: e.target.value })} aria-describedby={describedBy} invalid={invalid} />
                  )}
                </Field>
                <Field label={s.questionType}>
                  {({ id }) => (
                    <Select id={id} value={q.type} onChange={(e) => setQ(i, { type: e.target.value as typeof q.type })}>
                      {(["short", "long", "yesno"] as const).map((v) => (
                        <option key={v} value={v}>
                          {t.options.questionType[v]}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Button
                  variant="quiet"
                  className="text-danger hover:bg-danger-soft"
                  aria-label={`${s.removeQuestion} ${i + 1}`}
                  onClick={() => update({ questions: data.questions.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
          {data.questions.length < 3 && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => update({ questions: [...data.questions, { id: newId("q"), text: "", type: "short" }] })}
            >
              <Plus className="size-4" aria-hidden="true" />
              {s.addQuestion}
            </Button>
          )}
        </fieldset>

        <ChoiceGroup
          legend={s.selection}
          options={(["first-come", "review", "interview"] as const).map((v) => ({ value: v, label: t.options.selection[v] }))}
          value={data.selectionMethod}
          onChange={(selectionMethod) => update({ selectionMethod })}
        />
      </div>
    </>
  );
}
