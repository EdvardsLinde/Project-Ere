"use client";

import { ImageUp, Trash2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Field, FieldError, Input, Select, Textarea } from "@/components/ui/form";
import type { PlacementCompany } from "@/lib/data/types";
import { fmt, formatBytes, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/placements";

export const DESCRIPTION_MAX = 600;

export type CompanyErrors = Partial<
  Record<"name" | "industry" | "description" | "town" | "contactName" | "contactEmail" | "contactPhone" | "website" | "logo", string>
>;

/** Company details editor, used by builder step 1 and the company profile page. */
export function CompanyFields({
  value,
  onChange,
  errors = {},
  onLogoError,
}: {
  value: PlacementCompany;
  onChange: (next: PlacementCompany) => void;
  errors?: CompanyErrors;
  onLogoError?: (message: string | undefined) => void;
}) {
  const { t, locale } = useI18n();
  const s = t.builder.s1;
  const set = <K extends keyof PlacementCompany>(k: K, v: PlacementCompany[K]) => onChange({ ...value, [k]: v });
  const setAddress = (k: keyof PlacementCompany["address"], v: string) => set("address", { ...value.address, [k]: v });
  const setContact = (k: keyof PlacementCompany["contactPerson"], v: string) =>
    set("contactPerson", { ...value.contactPerson, [k]: v });
  const description = tx(value.description, locale);

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.type)) {
      onLogoError?.(fmt(t.validation.fileType, { types: "PNG, JPG, WEBP, SVG" }));
      return;
    }
    if (file.size > siteConfig.uploads.logoMaxBytes) {
      onLogoError?.(fmt(t.validation.fileTooBig, { size: formatBytes(siteConfig.uploads.logoMaxBytes, locale) }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onLogoError?.(undefined);
      set("logo", String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const text = (
    label: string,
    val: string,
    on: (v: string) => void,
    opts: { required?: boolean; error?: string; type?: string; autoComplete?: string; hint?: string; example?: string; className?: string } = {},
  ) => (
    <Field
      label={label}
      required={opts.required}
      error={opts.error}
      hint={opts.hint}
      example={opts.example}
      exampleLabel={t.common.example}
      className={opts.className}
    >
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          type={opts.type ?? "text"}
          autoComplete={opts.autoComplete}
          value={val}
          onChange={(e) => on(e.target.value)}
          aria-describedby={describedBy}
          invalid={invalid}
        />
      )}
    </Field>
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {text(s.name, value.name, (v) => set("name", v), { required: true, error: errors.name, autoComplete: "organization", className: "sm:col-span-2" })}
        {text(s.regNumber, value.regNumber, (v) => set("regNumber", v))}
        <Field label={s.industry} required error={errors.industry}>
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              value={value.industry}
              onChange={(e) => set("industry", e.target.value as PlacementCompany["industry"])}
              aria-describedby={describedBy}
              invalid={invalid}
            >
              <option value="">{t.auth.choose}</option>
              {siteConfig.industries.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label[locale]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          label={s.description}
          required
          hint={s.descriptionHint}
          example={s.descriptionExample}
          exampleLabel={t.common.example}
          error={errors.description}
          counter={`${description.length}/${DESCRIPTION_MAX}`}
          className="sm:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              rows={4}
              maxLength={DESCRIPTION_MAX}
              value={description}
              onChange={(e) => set("description", e.target.value)}
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>
        {text(s.employees, value.employees, (v) => set("employees", v), { type: "text" })}
        {text(s.website, value.website, (v) => set("website", v), { type: "url", error: errors.website, autoComplete: "url" })}
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold">{s.logo}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            {value.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- base64 data URL from the user
              <img src={value.logo} alt="" className="size-14 rounded-md border border-line bg-surface object-contain p-1" />
            ) : (
              <span className="flex size-14 items-center justify-center rounded-md border border-dashed border-line text-ink-muted">
                <ImageUp className="size-6" aria-hidden="true" />
              </span>
            )}
            <label className="inline-flex h-10 cursor-pointer items-center rounded-md border border-line bg-surface px-3 text-sm font-semibold hover:bg-surface-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary">
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} />
              {s.logo}…
            </label>
            {value.logo && (
              <Button variant="quiet" size="sm" onClick={() => set("logo", "")}>
                <Trash2 className="size-4" aria-hidden="true" />
                {s.logoRemove}
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-sm text-ink-muted">{s.logoHint}</p>
          {errors.logo && (
            <div className="mt-1">
              <FieldError>{errors.logo}</FieldError>
            </div>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="text-lg font-extrabold">
          {s.addressTitle}
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {text(s.street, value.address.street.startsWith("[TODO") ? "" : value.address.street, (v) => setAddress("street", v), {
            autoComplete: "street-address",
            className: "sm:col-span-2",
          })}
          {text(s.town, value.address.town, (v) => setAddress("town", v), { required: true, error: errors.town, autoComplete: "address-level2" })}
          {text(s.parish, value.address.parish, (v) => setAddress("parish", v))}
          {text(s.postcode, value.address.postcode, (v) => setAddress("postcode", v), { autoComplete: "postal-code" })}
          <Field label={s.directions} hint={s.directionsHint} example={s.directionsExample} exampleLabel={t.common.example} className="sm:col-span-2">
            {({ id, describedBy }) => (
              <Textarea id={id} rows={2} value={tx(value.directions, locale)} onChange={(e) => set("directions", e.target.value)} aria-describedby={describedBy} />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-extrabold">
          {s.contactTitle}
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        </legend>
        <p className="text-sm text-ink-muted">{s.contactHint}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {text(s.contactName, value.contactPerson.name, (v) => setContact("name", v), { required: true, error: errors.contactName, autoComplete: "name" })}
          {text(s.contactPosition, value.contactPerson.position, (v) => setContact("position", v), { autoComplete: "organization-title" })}
          {text(s.contactEmail, value.contactPerson.email, (v) => setContact("email", v), {
            required: true,
            error: errors.contactEmail,
            type: "email",
            autoComplete: "email",
          })}
          {text(s.contactPhone, value.contactPerson.phone, (v) => setContact("phone", v), {
            required: true,
            error: errors.contactPhone,
            type: "tel",
            autoComplete: "tel",
          })}
        </div>
      </fieldset>
    </div>
  );
}
