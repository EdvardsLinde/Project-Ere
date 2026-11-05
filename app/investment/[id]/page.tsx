"use client";

import { ArrowLeft, Bookmark, BookmarkCheck, Coins, MapPin, MessageSquarePlus, Sprout, Target } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExhibitorBadges } from "@/components/fair/badges";
import { StandLine } from "@/components/fair/exhibitor-card";
import { useToast } from "@/components/toast";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, Container, EmptyState, Loading } from "@/components/ui/misc";
import { getRepository } from "@/lib/data";
import { useQuery } from "@/lib/data/hooks";
import { isInShowcase } from "@/lib/fair/filters";
import { sectorLabel } from "@/lib/fair/labels";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

export default function ShowcaseItemPage() {
  const { t, locale } = useI18n();
  const s = t.showcase;
  const toast = useToast();
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery(async (repo) => ({ e: await repo.getExhibitor(id), saved: await repo.listSaved() }), [id]);

  if (loading) return <Loading label={t.common.loading} />;
  const e = data?.e;
  if (!e || !isInShowcase(e)) {
    return (
      <Container className="py-20">
        <EmptyState title={t.common.notFoundTitle} text={t.common.notFoundText} action={<LinkButton href="/investment">{s.backToList}</LinkButton>} />
      </Container>
    );
  }
  const inv = e.investment;
  const saved = data.saved.includes(e.id);
  const facts = [
    { icon: Target, label: s.purpose, value: tx(inv.purpose, locale) },
    { icon: MapPin, label: s.where, value: tx(inv.where, locale) },
    { icon: Sprout, label: s.stage, value: t.options.stage[inv.stage] },
    { icon: Coins, label: s.offer, value: tx(inv.offer, locale) },
  ].filter((f) => f.value);

  const toggle = async () => {
    const now = await getRepository().toggleSaved(e.id);
    toast(now ? s.savedToast : s.unsavedToast);
  };

  return (
    <Container className="py-10 sm:py-14">
      <Link href="/investment" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {s.backToList}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <ExhibitorBadges exhibitor={e} showSeeking={false} />
          <p className="mt-4 font-bold text-accent-ink">{sectorLabel(e, locale)}</p>
          <h1 className="mt-1 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{e.name}</h1>
          <p className="mt-4 w-fit rounded-full bg-primary-fill px-4 py-1.5 font-display text-2xl font-extrabold text-white">
            <span className="sr-only">{s.amount}: </span>
            {t.options.amount[inv.amountRange]}
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border-2 border-edge bg-surface p-4 shadow-card">
                <dt className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1.5 font-semibold leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
          <section className="mt-8" aria-labelledby="about-title">
            <h2 id="about-title" className="text-xl font-extrabold">
              {s.about}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-muted">{tx(e.description, locale)}</p>
            <h2 className="mt-6 text-xl font-extrabold">{s.showcaseAt}</h2>
            <p className="mt-2 leading-relaxed text-ink-muted">{tx(e.showcase, locale)}</p>
          </section>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.06em] text-ink-muted">{s.standInfo}</p>
            <p className="font-semibold">
              <Link href={`/exhibitors/${e.id}`} className="hover:underline">
                <StandLine exhibitor={e} />
              </Link>
            </p>
            <LinkButton href={`/investment/${e.id}/meet`} variant="accent" className="w-full whitespace-normal">
              <MessageSquarePlus className="size-4" aria-hidden="true" />
              {s.request}
            </LinkButton>
            <Button variant="secondary" className="w-full" onClick={toggle} aria-pressed={saved}>
              {saved ? <BookmarkCheck className="size-4" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
              {saved ? s.saved : s.save}
            </Button>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
