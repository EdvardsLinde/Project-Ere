/**
 * In-memory router for the single-file preview build.
 *
 * The preview runs inside a sandboxed page where only plain `#name` hashes
 * survive in the address bar, so routes live in memory. Most views are
 * mirrored to a plain hash (`#agenda`, `#apply-stand`, `#investment-exh-agrosense`,
 * …) so they can be bookmarked and opened directly.
 */
import { createContext, useContext, useSyncExternalStore } from "react";

let stack: string[] = ["/"];
let index = 0;
const listeners = new Set<() => void>();

function emit(scroll: boolean) {
  syncHash();
  if (scroll) window.scrollTo({ top: 0 });
  for (const l of listeners) l();
}

export const router = {
  current: () => stack[index],
  push(href: string) {
    if (href === stack[index]) return;
    stack = stack.slice(0, index + 1);
    stack.push(href);
    index++;
    emit(true);
  },
  replace(href: string) {
    stack[index] = href;
    emit(true);
  },
  back() {
    if (index > 0) {
      index--;
      emit(true);
    }
  },
};

export function splitHref(href: string): { path: string; search: string } {
  const i = href.indexOf("?");
  const path = (i === -1 ? href : href.slice(0, i)) || "/";
  return { path: path.length > 1 ? path.replace(/\/$/, "") : path, search: i === -1 ? "" : href.slice(i) };
}

export function useHref(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => stack[index],
    () => "/",
  );
}

// Plain hash names ---------------------------------------------------------

/** Pages without parameters, as `#name` (a slash becomes `-`, e.g. `#apply-stand`). */
const STATIC_VIEWS = [
  "agenda",
  "exhibitors",
  "stands",
  "investment",
  "invest-in-latvia",
  "challenges",
  "dashboard",
  "privacy",
  "apply/stand",
  "apply/innovator",
];

/** Detail pages: `#exhibitor-exh-agrosense` ↔ `/exhibitors/exh_agrosense`. */
const DETAIL_VIEWS: [prefix: string, base: string][] = [
  ["exhibitor", "exhibitors"],
  ["investment", "investment"],
  ["challenge", "challenges"],
];

/** Ids use `_`, which a hash name can't carry; they never contain `-`. */
const encodeId = (id: string) => id.replace(/_/g, "-");
const decodeId = (id: string) => id.replace(/-/g, "_");

export function hashFor(href: string): string {
  const { path } = splitHref(href);
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return "";
  const joined = seg.join("/");
  if (STATIC_VIEWS.includes(joined)) return joined.replace("/", "-");
  if (seg.length === 2) {
    const view = DETAIL_VIEWS.find(([, base]) => base === seg[0]);
    if (view) return `${view[0]}-${encodeId(seg[1])}`;
  }
  return "";
}

export function hrefForHash(hash: string): string | null {
  const name = hash.replace(/^#/, "");
  if (!name) return "/";
  const view = STATIC_VIEWS.find((v) => v.replace("/", "-") === name);
  if (view) return `/${view}`;
  for (const [prefix, base] of DETAIL_VIEWS) {
    const m = new RegExp(`^${prefix}-([A-Za-z0-9-]+)$`).exec(name);
    if (m) return `/${base}/${decodeId(m[1])}`;
  }
  return null;
}

function syncHash() {
  const name = hashFor(stack[index]);
  try {
    const base = window.location.pathname + window.location.search;
    history.replaceState(history.state, "", name ? `#${name}` : base);
  } catch {
    /* the host may refuse; routing still works in memory */
  }
}

export function startHashSync() {
  const initial = hrefForHash(window.location.hash);
  if (initial) stack = [initial];
  window.addEventListener("hashchange", () => {
    const href = hrefForHash(window.location.hash);
    if (href && href !== stack[index]) router.push(href);
  });
}

// Route params -------------------------------------------------------------

export const ParamsContext = createContext<Record<string, string>>({});
export const useRouteParams = () => useContext(ParamsContext);

export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split("/").filter(Boolean);
  const s = path.split("/").filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}
