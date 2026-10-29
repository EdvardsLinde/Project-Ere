/**
 * In-memory router for the single-file preview build.
 *
 * The preview runs inside a sandboxed page where only plain `#name` hashes
 * survive in the address bar, so routes live in memory. A few views are
 * mirrored to a plain hash (`#prakses`, `#prakse-plc-pata-downtime`,
 * `#parbaudit-SDS-2026-0001`, …) so they can be bookmarked and opened directly.
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

const STATIC_VIEWS = ["prakses", "pieslegties", "students", "uznemums", "profils", "privatums", "parbaudit"];

/** Placement ids use `_`, which a hash name can't carry; they never contain `-`. */
const encodeId = (id: string) => id.replace(/_/g, "-");
const decodeId = (id: string) => id.replace(/-/g, "_");

export function hashFor(href: string): string {
  const { path } = splitHref(href);
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return "";
  if (seg.length === 1 && STATIC_VIEWS.includes(seg[0])) return seg[0];
  if (seg.length === 2 && seg[0] === "prakses") return `prakse-${encodeId(seg[1])}`;
  if (seg.length === 2 && seg[0] === "sertifikats") return `sertifikats-${seg[1]}`;
  if (seg.length === 2 && seg[0] === "parbaudit") return `parbaudit-${seg[1]}`;
  return "";
}

export function hrefForHash(hash: string): string | null {
  const name = hash.replace(/^#/, "");
  if (!name) return "/";
  if (STATIC_VIEWS.includes(name)) return `/${name}`;
  let m = /^prakse-([A-Za-z0-9-]+)$/.exec(name);
  if (m) return `/prakses/${decodeId(m[1])}`;
  m = /^sertifikats-([A-Za-z0-9-]+)$/.exec(name);
  if (m) return `/sertifikats/${m[1]}`;
  m = /^parbaudit-([A-Za-z0-9-]+)$/.exec(name);
  if (m) return `/parbaudit/${m[1]}`;
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
