"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StandBookingForm } from "@/components/fair/stand-booking-form";
import { Container, Loading, PageHeader } from "@/components/ui/misc";
import { useQuery } from "@/lib/data/hooks";
import { useI18n } from "@/lib/i18n";

export default function BookStandPage() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<Loading label={t.common.loading} />}>
      <BookStand />
    </Suspense>
  );
}

function BookStand() {
  const { t } = useI18n();
  const params = useSearchParams();
  const stand = Number(params.get("stand"));
  const { data: exhibitors } = useQuery((repo) => repo.listExhibitors(), []);
  return (
    <Container className="py-10 sm:py-14">
      <PageHeader title={t.booking.title} lead={t.booking.lead} />
      {!exhibitors ? (
        <Loading label={t.common.loading} />
      ) : (
        <StandBookingForm exhibitors={exhibitors} initialStand={Number.isInteger(stand) && stand > 0 ? stand : null} />
      )}
    </Container>
  );
}
