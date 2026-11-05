"use client";

import { useRouter } from "next/navigation";
import { buttonClass, type ButtonVariant } from "@/components/ui/button";
import { roleIcon } from "@/components/role-icon";
import type { Role } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n";
import { useRole } from "@/lib/role";
import { roleHome, ROLES } from "@/lib/roles";

/** The company stand is the main call to action; the rest are secondary. */
const VARIANT: Record<Role, ButtonVariant> = {
  exhibitor: "accent",
  innovator: "secondary",
  investor: "primary",
  school: "secondary",
};

/** The four "who are you?" buttons: pick a role and go to its first page. */
export function RoleButtons({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const { t } = useI18n();
  const { setRole } = useRole();
  const router = useRouter();
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${className}`}>
      {ROLES.map((r) => {
        const Icon = roleIcon[r];
        const variant = onDark && VARIANT[r] === "primary" ? "secondary" : VARIANT[r];
        return (
          <li key={r}>
            <button
              type="button"
              onClick={() => {
                setRole(r);
                router.push(roleHome[r]);
              }}
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
