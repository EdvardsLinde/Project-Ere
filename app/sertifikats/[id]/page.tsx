"use client";

import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Container, EmptyState, Loading } from "@/components/ui/misc";
import { CertificateSheet } from "@/components/certificate-sheet";
import { useQuery } from "@/lib/data/hooks";
import { useI18n } from "@/lib/i18n";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const router = useRouter();
  const { data: certificate, loading } = useQuery((repo) => repo.getCertificate(decodeURIComponent(id)), [id]);
  const c = t.certificate;

  if (loading) return <Loading label={t.common.loading} />;
  if (!certificate) {
    return (
      <Container className="py-16">
        <EmptyState title={c.notFound} text={c.notFoundText} action={<LinkButton href="/parbaudit">{t.verify.title}</LinkButton>} />
      </Container>
    );
  }

  return (
    <div className="bg-surface-muted py-8 sm:py-12 print:bg-white print:p-0">
      <Container className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="quiet" onClick={() => router.back()}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          {c.back}
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <LinkButton href={`/parbaudit/${certificate.id}`} variant="secondary">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {t.verify.submit}
          </LinkButton>
          <Button variant="accent" onClick={() => window.print()}>
            <Download className="size-4" aria-hidden="true" />
            {c.download}
          </Button>
        </div>
        <p className="w-full text-right text-sm text-ink-muted">{c.downloadHint}</p>
      </Container>
      <div className="px-4 print:px-0">
        <CertificateSheet certificate={certificate} />
      </div>
    </div>
  );
}
