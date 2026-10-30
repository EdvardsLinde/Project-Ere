"use client";

import { Building2, GraduationCap, KeyRound, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { CircuitLeaf } from "@/components/nature";
import { Photo } from "@/components/photo";
import { Button, LinkButton } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { Card, Container, Loading, Notice } from "@/components/ui/misc";
import { ageOn } from "@/lib/dates";
import { DataError, getRepository } from "@/lib/data";
import { DEMO_ACCOUNTS } from "@/lib/data/seed";
import type { Role } from "@/lib/data/types";
import { fmt, useI18n } from "@/lib/i18n";
import { dashboardPath, useSession } from "@/lib/session";
import { focusFirstError, isEmail, isISODate, type Errors } from "@/lib/validation";

export default function LoginPage() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<Loading label={t.common.loading} />}>
      <KeyedAuthScreen />
    </Suspense>
  );
}

/** Remount when the header's role buttons change `?loma=` while this page is open. */
function KeyedAuthScreen() {
  const params = useSearchParams();
  return <AuthScreen key={`${params.get("loma")}-${params.get("tab")}`} />;
}

type Tab = "login" | "register";

function AuthScreen() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const { ready, session } = useSession();
  const [role, setRole] = useState<Role>(params.get("loma") === "uznemums" ? "company" : "student");
  const [tab, setTab] = useState<Tab>(params.get("tab") === "register" ? "register" : "login");
  const next = params.get("next");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!ready) return <Loading label={t.common.loading} />;

  if (session) {
    const name = session.company?.name ?? [session.student?.firstName, session.student?.lastName].join(" ");
    return (
      <Container className="max-w-lg py-16">
        <Card className="p-6 text-center">
          <p className="text-lg font-semibold">{fmt(t.auth.alreadyLoggedIn, { name })}</p>
          <LinkButton href={dashboardPath(session.user.role)} className="mt-5">
            {t.auth.toDashboard}
          </LinkButton>
        </Card>
      </Container>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "login", label: t.auth.login },
    { id: "register", label: t.auth.register },
  ];

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const nextIndex = (index + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="bg-dots">
      <Container className="grid max-w-5xl gap-8 py-10 sm:py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:pt-6">
          <p className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-on-accent">{siteConfig.name[locale]}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {role === "company" ? t.nav.forCompanies : t.nav.forStudents}
          </h1>
          <p className="mt-3 text-lg text-ink-muted">{role === "company" ? t.auth.leadCompany : t.auth.leadStudent}</p>

          <fieldset className="mt-8">
            <legend className="text-sm font-bold">{t.auth.roleLabel}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["student", t.roles.student, GraduationCap],
                  ["company", t.roles.company, Building2],
                ] as const
              ).map(([r, label, Icon]) => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md border-2 px-4 py-3 font-bold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                    role === r ? "border-edge bg-accent text-on-accent shadow-card" : "border-line bg-surface hover:border-ink/40"
                  }`}
                >
                  <input type="radio" name="role" className="sr-only" checked={role === r} onChange={() => setRole(r)} />
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <Notice tone="neutral" className="mt-6" icon={<ShieldAlert className="size-5 text-ink-muted" aria-hidden="true" />}>
            <p className="text-sm">{t.auth.securityNote}</p>
          </Notice>
          <div className="mt-10 hidden items-end gap-2 lg:flex" aria-hidden="true">
            <Photo name="leafGreen" className="w-20 -rotate-12" />
            <Photo name="wheat" className="w-44 rotate-6" />
            <CircuitLeaf className="w-20" />
          </div>
        </div>

        <Card className="p-5 sm:p-7">
          <div role="tablist" aria-label={t.auth.title} className="grid grid-cols-2 rounded-full border-2 border-edge bg-surface-muted p-1">
            {tabs.map((x, i) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${x.id}`}
                aria-selected={tab === x.id}
                aria-controls={`panel-${x.id}`}
                tabIndex={tab === x.id ? 0 : -1}
                onClick={() => setTab(x.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`h-10 rounded-full text-[0.95rem] font-bold transition-colors ${
                  tab === x.id ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
            {tab === "login" ? (
              <LoginForm key={`login-${role}`} role={role} next={next} />
            ) : role === "student" ? (
              <StudentRegisterForm next={next} />
            ) : (
              <CompanyRegisterForm next={next} />
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

function useAfterAuth(next: string | null) {
  const router = useRouter();
  return (role: Role) => {
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    const fits =
      safeNext &&
      (role === "company"
        ? safeNext.startsWith("/uznemums") || safeNext.startsWith("/profils") || safeNext.startsWith("/sertifikats")
        : !safeNext.startsWith("/uznemums"));
    router.replace(fits ? safeNext : dashboardPath(role));
  };
}

function LoginForm({ role, next }: { role: Role; next: string | null }) {
  const { t } = useI18n();
  const done = useAfterAuth(next);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors<"email" | "password" | "form">>({});
  const [busy, setBusy] = useState(false);
  const demo = role === "company" ? DEMO_ACCOUNTS.company : DEMO_ACCOUNTS.student;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!isEmail(email)) errs.email = t.validation.email;
    if (!password) errs.password = t.validation.required;
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError();
    setBusy(true);
    try {
      const session = await getRepository().login(email, password);
      done(session.user.role);
    } catch (err) {
      setErrors({ form: err instanceof DataError ? t.errors[err.code] : t.errors.generic });
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label={t.auth.email} required error={errors.email}>
        {({ id, describedBy, invalid }) => (
          <Input id={id} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby={describedBy} invalid={invalid} />
        )}
      </Field>
      <Field label={t.auth.password} required error={errors.password}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={describedBy}
            invalid={invalid}
          />
        )}
      </Field>
      {errors.form && (
        <Notice tone="danger">
          <p role="alert" className="font-semibold">
            {errors.form}
          </p>
        </Notice>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? t.auth.working : t.auth.loginCta}
      </Button>
      <div className="rounded-md border border-dashed border-line p-4 text-sm">
        <p className="flex items-center gap-2 font-bold">
          <KeyRound className="size-4 text-accent-ink" aria-hidden="true" />
          {t.auth.demoTitle}
        </p>
        <p className="mt-1 text-ink-muted">{fmt(t.auth.demoText, demo)}</p>
        <Button
          variant="quiet"
          size="sm"
          className="-ml-3 mt-1"
          onClick={() => {
            setEmail(demo.email);
            setPassword(demo.password);
          }}
        >
          {t.auth.useDemo}
        </Button>
      </div>
    </form>
  );
}

function StudentRegisterForm({ next }: { next: string | null }) {
  const { t, locale } = useI18n();
  const done = useAfterAuth(next);
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    schoolId: siteConfig.schools[0].id as string,
    schoolOther: "",
    grade: "",
  });
  type K = keyof typeof f | "form";
  const [errors, setErrors] = useState<Errors<K>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const v = t.validation;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors<K> = {};
    if (!f.firstName.trim()) errs.firstName = v.required;
    if (!f.lastName.trim()) errs.lastName = v.required;
    if (!isEmail(f.email)) errs.email = v.email;
    if (f.password.length < 8) errs.password = v.password;
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
      const session = await getRepository().registerStudent(f);
      done(session.user.role);
    } catch (err) {
      setErrors({ form: err instanceof DataError ? t.errors[err.code] : t.errors.generic });
      setBusy(false);
    }
  };

  const input = (k: keyof typeof f, label: string, type = "text", autoComplete?: string, hint?: string) => (
    <Field label={label} required error={errors[k]} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <Input id={id} type={type} autoComplete={autoComplete} value={f[k]} onChange={(e) => set(k, e.target.value)} aria-describedby={describedBy} invalid={invalid} />
      )}
    </Field>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {input("firstName", t.auth.firstName, "text", "given-name")}
        {input("lastName", t.auth.lastName, "text", "family-name")}
      </div>
      {input("email", t.auth.email, "email", "email")}
      {input("password", t.auth.password, "password", "new-password", t.auth.passwordHint)}
      {input("birthDate", t.auth.birthDate, "date", "bday", t.auth.ageNote)}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.auth.school} required>
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
        <Field label={t.auth.grade}>
          {({ id, describedBy }) => (
            <Input id={id} placeholder={t.auth.gradePlaceholder} value={f.grade} onChange={(e) => set("grade", e.target.value)} aria-describedby={describedBy} />
          )}
        </Field>
      </div>
      {f.schoolId === "other" && input("schoolOther", t.auth.schoolOther)}
      {errors.form && (
        <Notice tone="danger">
          <p role="alert" className="font-semibold">
            {errors.form}
          </p>
        </Notice>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={busy}>
        {busy ? t.auth.working : t.auth.registerCta}
      </Button>
    </form>
  );
}

function CompanyRegisterForm({ next }: { next: string | null }) {
  const { t, locale } = useI18n();
  const done = useAfterAuth(next);
  const [f, setF] = useState({ companyName: "", contactName: "", email: "", password: "", industry: "", town: "Saldus" });
  type K = keyof typeof f | "form";
  const [errors, setErrors] = useState<Errors<K>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const v = t.validation;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors<K> = {};
    if (!f.companyName.trim()) errs.companyName = v.required;
    if (!f.contactName.trim()) errs.contactName = v.required;
    if (!isEmail(f.email)) errs.email = v.email;
    if (f.password.length < 8) errs.password = v.password;
    if (!f.industry) errs.industry = v.required;
    if (!f.town.trim()) errs.town = v.required;
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError();
    setBusy(true);
    try {
      const session = await getRepository().registerCompany(f);
      done(session.user.role);
    } catch (err) {
      setErrors({ form: err instanceof DataError ? t.errors[err.code] : t.errors.generic });
      setBusy(false);
    }
  };

  const input = (k: keyof typeof f, label: string, type = "text", autoComplete?: string, hint?: string) => (
    <Field label={label} required error={errors[k]} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <Input id={id} type={type} autoComplete={autoComplete} value={f[k]} onChange={(e) => set(k, e.target.value)} aria-describedby={describedBy} invalid={invalid} />
      )}
    </Field>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {input("companyName", t.auth.companyName, "text", "organization")}
      {input("contactName", t.auth.contactName, "text", "name")}
      {input("email", t.auth.email, "email", "email")}
      {input("password", t.auth.password, "password", "new-password", t.auth.passwordHint)}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.auth.industry} required error={errors.industry}>
          {({ id, describedBy, invalid }) => (
            <Select id={id} value={f.industry} onChange={(e) => set("industry", e.target.value)} aria-describedby={describedBy} invalid={invalid}>
              <option value="">{t.auth.choose}</option>
              {siteConfig.industries.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label[locale]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        {input("town", t.auth.town, "text", "address-level2")}
      </div>
      {errors.form && (
        <Notice tone="danger">
          <p role="alert" className="font-semibold">
            {errors.form}
          </p>
        </Notice>
      )}
      <Button type="submit" variant="accent" className="w-full" size="lg" disabled={busy}>
        {busy ? t.auth.working : t.auth.registerCta}
      </Button>
    </form>
  );
}
