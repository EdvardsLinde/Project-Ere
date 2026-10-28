"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { CompanyFields, DESCRIPTION_MAX, type CompanyErrors } from "@/components/company-fields";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Card, Container, Loading, Notice, PageHeader } from "@/components/ui/misc";
import { TagInput } from "@/components/ui/tag-input";
import { useToast } from "@/components/toast";
import { ageOn } from "@/lib/dates";
import { DataError, getRepository } from "@/lib/data";
import type { CompanyProfile, PlacementCompany, StudentProfile } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { tx } from "@/lib/placements";
import { useRoleGuard, useSession } from "@/lib/session";
import { focusFirstError, isEmail, isISODate, isPhone, isUrl, type Errors } from "@/lib/validation";

export default function ProfilePage() {
  const { t } = useI18n();
  const allowed = useRoleGuard(["student", "company"]);
  const { session } = useSession();
  if (!allowed || !session) return <Loading label={t.common.loading} />;
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      {session.student ? (
        <StudentProfileForm key={session.student.userId} profile={session.student} />
      ) : session.company ? (
        <CompanyProfileForm key={session.company.id} company={session.company} />
      ) : null}
    </Container>
  );
}

function StudentProfileForm({ profile }: { profile: StudentProfile }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [f, setF] = useState(profile);
  type K = "firstName" | "lastName" | "email" | "phone" | "birthDate" | "schoolOther" | "form";
  const [errors, setErrors] = useState<Errors<K>>({});
  const [busy, setBusy] = useState(false);
  const p = t.profile;
  const v = t.validation;
  const set = <Key extends keyof StudentProfile>(k: Key, val: StudentProfile[Key]) => setF((s) => ({ ...s, [k]: val }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors<K> = {};
    if (!f.firstName.trim()) errs.firstName = v.required;
    if (!f.lastName.trim()) errs.lastName = v.required;
    if (!isEmail(f.email)) errs.email = v.email;
    if (f.phone.trim() && !isPhone(f.phone)) errs.phone = v.phone;
    if (!isISODate(f.birthDate)) errs.birthDate = v.date;
    else {
      const age = ageOn(f.birthDate);
      if (age < siteConfig.ageMin || age > siteConfig.ageMax) errs.birthDate = fmt(v.ageRange, { min: siteConfig.ageMin, max: siteConfig.ageMax });
    }
    if (f.schoolId === "other" && !f.schoolOther.trim()) errs.schoolOther = v.required;
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError();
    setBusy(true);
    try {
      const { userId: _userId, ...patch } = f;
      void _userId;
      await getRepository().updateStudentProfile(profile.userId, patch);
      toast(p.savedToast);
    } catch (err) {
      setErrors({ form: err instanceof DataError ? t.errors[err.code] : t.errors.generic });
    } finally {
      setBusy(false);
    }
  };

  const input = (k: K & keyof StudentProfile, label: string, type = "text", required = false, autoComplete?: string) => (
    <Field label={label} required={required} error={errors[k]}>
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={f[k] as string}
          onChange={(e) => set(k, e.target.value)}
          aria-describedby={describedBy}
          invalid={invalid}
        />
      )}
    </Field>
  );

  return (
    <>
      <PageHeader title={p.title} lead={p.studentLead} />
      <form onSubmit={save} noValidate className="mt-8">
        <Card className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {input("firstName", p.firstName, "text", true, "given-name")}
            {input("lastName", p.lastName, "text", true, "family-name")}
            {input("email", p.email, "email", true, "email")}
            {input("phone", p.phone, "tel", false, "tel")}
            {input("birthDate", p.birthDate, "date", true, "bday")}
            <Field label={p.grade}>
              {({ id }) => <Input id={id} value={f.grade} placeholder={t.auth.gradePlaceholder} onChange={(e) => set("grade", e.target.value)} />}
            </Field>
            <Field label={p.school} required>
              {({ id }) => (
                <Select id={id} value={f.schoolId} onChange={(e) => set("schoolId", e.target.value)}>
                  {siteConfig.schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label[locale]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {f.schoolId === "other" && input("schoolOther", p.schoolOther, "text", true)}
          </div>
          <TagInput
            label={p.interests}
            hint={p.interestsHint}
            value={f.interests}
            onChange={(val) => set("interests", val)}
            suggestions={siteConfig.interestSuggestions.map((s) => s[locale])}
            removeLabel={t.common.remove}
            addLabel={t.common.add}
          />
          <Field label={p.bio} counter={`${f.bio.length}/400`}>
            {({ id }) => <Textarea id={id} maxLength={400} value={f.bio} onChange={(e) => set("bio", e.target.value)} />}
          </Field>
          {errors.form && <Notice tone="danger">{errors.form}</Notice>}
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>
              {busy ? t.common.saving : p.saveProfile}
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
}

function toEditable(c: CompanyProfile): PlacementCompany {
  return {
    name: c.name,
    regNumber: c.regNumber,
    industry: c.industry,
    description: c.description,
    employees: c.employees,
    website: c.website,
    logo: c.logo,
    address: { ...c.address },
    directions: c.directions,
    contactPerson: { ...c.contactPerson },
  };
}

function CompanyProfileForm({ company }: { company: CompanyProfile }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const [value, setValue] = useState<PlacementCompany>(() => toEditable(company));
  const [errors, setErrors] = useState<CompanyErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const v = t.validation;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: CompanyErrors = {};
    if (!value.name.trim()) errs.name = v.required;
    if (!value.industry) errs.industry = v.required;
    const desc = tx(value.description, locale);
    if (desc.length > DESCRIPTION_MAX) errs.description = fmt(v.maxLength, { n: DESCRIPTION_MAX });
    if (!value.address.town.trim()) errs.town = v.required;
    if (!value.contactPerson.name.trim()) errs.contactName = v.required;
    if (!isEmail(value.contactPerson.email)) errs.contactEmail = v.email;
    if (value.contactPerson.phone.trim() && !isPhone(value.contactPerson.phone)) errs.contactPhone = v.phone;
    if (!isUrl(value.website)) errs.website = v.url;
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError();
    setBusy(true);
    try {
      await getRepository().updateCompanyProfile(company.id, value);
      toast(t.profile.savedToast);
    } catch (err) {
      setFormError(err instanceof DataError ? t.errors[err.code] : t.errors.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title={t.company.profileTitle} lead={t.profile.companyLead} />
      <form onSubmit={save} noValidate className="mt-8">
        <Card className="space-y-6 p-5 sm:p-6">
          <CompanyFields value={value} onChange={setValue} errors={errors} onLogoError={(m) => setErrors((s) => ({ ...s, logo: m }))} />
          {formError && <Notice tone="danger">{formError}</Notice>}
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>
              {busy ? t.common.saving : t.profile.saveProfile}
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
}
