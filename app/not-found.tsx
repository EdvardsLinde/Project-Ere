"use client";

import { LinkButton } from "@/components/ui/button";
import { Container, EmptyState } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <Container className="py-20">
      <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} action={<LinkButton href="/">{t.common.toHome}</LinkButton>} />
    </Container>
  );
}
