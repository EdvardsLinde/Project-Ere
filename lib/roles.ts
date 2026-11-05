import type { Role } from "@/lib/data/types";

/** Pure role helpers, safe on the server (the provider lives in `lib/role.tsx`). */
export const ROLES: Role[] = ["exhibitor", "innovator", "investor", "school"];

export const isRole = (v: unknown): v is Role => typeof v === "string" && (ROLES as string[]).includes(v);

/** Where each role starts, e.g. after picking it on the landing page. */
export const roleHome: Record<Role, string> = {
  exhibitor: "/apply/stand",
  innovator: "/apply/innovator",
  investor: "/investment",
  school: "/challenges",
};

/** Menu keys per role; labels come from `messages.nav`. `null` = first visit. */
export type NavKey =
  | "about"
  | "agenda"
  | "exhibitors"
  | "showcase"
  | "stands"
  | "bookStand"
  | "applyInnovator"
  | "investLatvia"
  | "challenges"
  | "dashboard";

export const navHref: Record<NavKey, string> = {
  about: "/",
  agenda: "/agenda",
  exhibitors: "/exhibitors",
  showcase: "/investment",
  stands: "/stands",
  bookStand: "/apply/stand",
  applyInnovator: "/apply/innovator",
  investLatvia: "/invest-in-latvia",
  challenges: "/challenges",
  dashboard: "/dashboard",
};

export function navFor(role: Role | null): NavKey[] {
  switch (role) {
    case "exhibitor":
      return ["about", "stands", "bookStand", "dashboard"];
    case "innovator":
      return ["about", "applyInnovator", "dashboard"];
    case "investor":
      return ["about", "showcase", "investLatvia", "dashboard"];
    case "school":
      return ["about", "challenges", "dashboard"];
    default:
      return ["about", "agenda", "exhibitors", "showcase"];
  }
}
