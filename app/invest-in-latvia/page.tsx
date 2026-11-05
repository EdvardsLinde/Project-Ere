"use client";

import { ArrowRight, FileCheck2, Handshake, Info, Landmark, Trees } from "lucide-react";
import { eventConfig } from "@/config/event";
import { LinkButton } from "@/components/ui/button";
import { Card, Container, ExternalLink, Notice, PageHeader } from "@/components/ui/misc";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/text";

const ICONS = [FileCheck2, Trees, Landmark, Handshake];

/** General pointers only: no legal costs or rules are stated as fact; everything links to official sources. */
export default function InvestInLatviaPage() {
  const { t, locale } = useI18n();
  const l = t.investLatvia;
  return (
    <Container className="py-10 sm:py-14">
      <PageHeader
        title={l.title}
        lead={l.lead}
        actions={
          <LinkButton href="/investment" variant="accent">
            {l.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        }
      />
      <Notice tone="primary" className="mt-6" icon={<Info className="size-5 text-primary" aria-hidden="true" />}>
        <span className="font-semibold">{l.partner}: </span>
        {tx(eventConfig.advicePartner, locale)}
      </Notice>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {l.sections.map((section, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Card as="section" key={section.title} className="flex flex-col p-6">
              <span className="flex size-12 items-center justify-center rounded-full border border-edge bg-accent text-on-accent">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight">{section.title}</h2>
              <p className="mt-2 flex-1 leading-relaxed text-ink-muted">{section.text}</p>
              <div className="mt-4 border-t border-dashed border-line pt-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{l.linksLabel}</p>
                <ul className="mt-2 space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.url}>
                      <ExternalLink href={link.url} newTabLabel={t.common.opensInNewTab}>
                        {link.label}
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
