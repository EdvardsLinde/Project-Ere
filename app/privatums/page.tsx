"use client";

import { Container, PageHeader } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  const p = t.privacy;
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <PageHeader title={p.title} lead={p.updated} />
      <div className="mt-8 space-y-8">
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-extrabold">{s.title}</h2>
            <p className="mt-2 max-w-[68ch] leading-relaxed text-ink-muted">{s.text}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
