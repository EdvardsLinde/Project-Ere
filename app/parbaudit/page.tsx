"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Card, Container, Notice } from "@/components/ui/misc";
import { fmt, useI18n } from "@/lib/i18n";

const CERT_ID_PATTERN = new RegExp(`^${siteConfig.certificatePrefix}-\\d{4}-\\d{4,}$`, "i");

export default function VerifyFormPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const v = t.verify;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = value.trim().toUpperCase();
    if (!CERT_ID_PATTERN.test(id)) {
      setError(fmt(v.idInvalid, { format: `${siteConfig.certificatePrefix}-2026-0001` }));
      return;
    }
    router.push(`/parbaudit/${encodeURIComponent(id)}`);
  };

  return (
    <div className="bg-dots">
      <Container className="max-w-xl py-14 sm:py-20">
        <Card className="p-6 sm:p-8">
          <span className="flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{v.title}</h1>
          <p className="mt-2 text-ink-muted">{v.lead}</p>
          <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
            <Field label={v.idLabel} required error={error} className="flex-1">
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  value={value}
                  placeholder={v.idPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono uppercase"
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError("");
                  }}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>
            <Button type="submit" className="sm:mt-7">
              {v.submit}
            </Button>
          </form>
          <Notice tone="neutral" className="mt-6">
            <p className="text-sm">{v.demoNote}</p>
          </Notice>
        </Card>
      </Container>
    </div>
  );
}
