"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getRepository } from "@/lib/data";
import type { Role, Session } from "@/lib/data/types";

interface SessionValue {
  /** `false` until the session has been read from storage (first client render). */
  ready: boolean;
  session: Session | null;
  refresh: () => Promise<void>;
  /** Log out and go home without the page guard bouncing to the login page. */
  logout: () => Promise<void>;
  /** Go home, then run `fn` (e.g. reset demo data) — guards stay quiet meanwhile. */
  leaveHome: (fn: () => Promise<void>) => Promise<void>;
  loggingOut: boolean;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ ready: boolean; session: Session | null }>({ ready: false, session: null });
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Once we're back on the home page the logout is finished.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (loggingOut && pathname === "/") setLoggingOut(false);
  }

  const leaveHome = useCallback(
    async (fn: () => Promise<void>) => {
      if (window.location.pathname !== "/") setLoggingOut(true);
      router.push("/");
      await fn();
    },
    [router],
  );
  const logout = useCallback(() => leaveHome(() => getRepository().logout()), [leaveHome]);

  const refresh = useCallback(async () => {
    const session = await getRepository().getSession();
    setState({ ready: true, session });
  }, []);

  useEffect(() => {
    const repo = getRepository();
    let alive = true;
    repo.getSession().then((session) => {
      if (alive) setState({ ready: true, session });
    });
    const unsubscribe = repo.subscribe(() => {
      repo.getSession().then((session) => {
        if (alive) setState({ ready: true, session });
      });
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={{ ...state, refresh, logout, leaveHome, loggingOut }}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

export function dashboardPath(role: Role | undefined): string {
  return role === "company" ? "/uznemums" : "/students";
}

export function loginPath(role: Role, next?: string): string {
  const loma = role === "company" ? "uznemums" : "skolens";
  return `/pieslegties?loma=${loma}${next ? `&next=${encodeURIComponent(next)}` : ""}`;
}

/**
 * Client-side role guard. Returns `true` when the current user may see the page;
 * otherwise redirects and returns `false` (render a loader meanwhile).
 *
 * - `allow`: roles that may see the page; `"guest"` allows logged-out visitors.
 * - Companies on student pages go to `/uznemums`; students on company pages go to `/students`.
 */
export function useRoleGuard(allow: (Role | "guest")[], loginRole: Role = "student"): boolean {
  const { ready, session, loggingOut } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const role = session?.user.role;
  const allowed = ready && (role ? allow.includes(role) : allow.includes("guest"));

  useEffect(() => {
    if (!ready || allowed || loggingOut) return;
    if (!role) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      router.replace(loginPath(loginRole, `${pathname}${search}`));
    } else {
      router.replace(dashboardPath(role));
    }
  }, [ready, allowed, role, router, pathname, loginRole, loggingOut]);

  return allowed;
}
