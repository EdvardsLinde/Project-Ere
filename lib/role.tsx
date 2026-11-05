"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/data/types";
import { ROLE_COOKIE } from "@/lib/locale";

interface RoleValue {
  role: Role | null;
  setRole: (role: Role | null) => void;
  /** Go home, then run `fn` (e.g. reset demo data). */
  leaveHome: (fn: () => Promise<void>) => Promise<void>;
}

const RoleContext = createContext<RoleValue | null>(null);

function remember(role: Role | null) {
  try {
    document.cookie = role
      ? `${ROLE_COOKIE}=${role}; path=/; max-age=31536000; samesite=lax`
      : `${ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
  } catch {
    /* cookies blocked */
  }
  try {
    if (role) window.localStorage.setItem(ROLE_COOKIE, role);
    else window.localStorage.removeItem(ROLE_COOKIE);
  } catch {
    /* storage blocked: the role lives in memory for this visit */
  }
}

/** The visitor's role, picked with the role switch. No accounts or passwords. */
export function RoleProvider({ initialRole, children }: { initialRole: Role | null; children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(initialRole);
  const router = useRouter();

  const setRole = useCallback((next: Role | null) => {
    setRoleState(next);
    remember(next);
  }, []);

  const leaveHome = useCallback(
    async (fn: () => Promise<void>) => {
      router.push("/");
      await fn();
    },
    [router],
  );

  return <RoleContext.Provider value={{ role, setRole, leaveHome }}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
