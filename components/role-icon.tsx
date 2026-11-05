import { Building2, GraduationCap, Landmark, Lightbulb } from "lucide-react";
import type { Role } from "@/lib/data/types";

/** One icon per role, used in the role menu, landing buttons and dashboard. */
export const roleIcon: Record<Role, typeof Building2> = {
  exhibitor: Building2,
  innovator: Lightbulb,
  investor: Landmark,
  school: GraduationCap,
};
