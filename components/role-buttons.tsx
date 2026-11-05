"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { buttonClass, type ButtonVariant } from "@/components/ui/button";
import { roleIcon } from "@/components/role-icon";
import type { Role } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { roleHome, ROLES } from "@/lib/roles";

/** Remember the role and go to its first page. */
function useChooseRole() {
  const { setRole } = useRole();
  const router = useRouter();
  return (r: Role) => {
    setRole(r);
    router.push(roleHome[r]);
  };
}

/** The company stand is the main call to action; the rest are secondary. */
const VARIANT: Record<Role, ButtonVariant> = {
  exhibitor: "accent",
  innovator: "secondary",
  investor: "primary",
  school: "secondary",
};

/** The four "who are you?" buttons in a grid (closing call to action, empty dashboard). */
export function RoleButtons({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const { t } = useI18n();
  const choose = useChooseRole();
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${className}`}>
      {ROLES.map((r) => {
        const Icon = roleIcon[r];
        const variant = onDark && VARIANT[r] !== "accent" ? "inverse" : VARIANT[r];
        return (
          <li key={r}>
            <button
              type="button"
              onClick={() => choose(r)}
              className={buttonClass(variant, "lg", "h-auto min-h-13 w-full whitespace-normal py-3 text-left leading-snug")}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="flex-1">{t.roleButtons[r]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Hero version: one main button (book a stand) and the investor as an outlined
 * button, both full-width blocks; innovators and school teams as quieter links.
 * Same roles, same labels.
 */
export function HeroRoleActions({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const choose = useChooseRole();
  const ExhibitorIcon = roleIcon.exhibitor;
  const InvestorIcon = roleIcon.investor;
  return (
    <div className={className}>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => choose("exhibitor")}
          className={buttonClass("accent", "lg", "h-auto min-h-14 w-full whitespace-normal py-3 leading-snug")}
        >
          <ExhibitorIcon className="size-5 shrink-0" aria-hidden="true" />
          {t.roleButtons.exhibitor}
          <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => choose("investor")} className={buttonClass("secondary", "lg", "min-h-14 w-full")}>
          <InvestorIcon className="size-5 shrink-0" aria-hidden="true" />
          {t.roleButtons.investor}
        </button>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {(["innovator", "school"] as const).map((r) => {
          const Icon = roleIcon[r];
          return (
            <li key={r}>
              <button
                type="button"
                onClick={() => choose(r)}
                className="group inline-flex items-center gap-2 rounded-sm py-1 text-left text-[0.95rem] font-semibold text-ink"
              >
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="underline decoration-line decoration-2 underline-offset-[5px] transition-colors group-hover:decoration-accent">{t.roleButtons[r]}</span>
                <ArrowRight className="size-4 shrink-0 text-accent-ink transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
