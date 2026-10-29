/** Stand-in for `next/navigation` in the single-file preview build. */
import { useMemo } from "react";
import { router, splitHref, useHref, useRouteParams } from "../router";

export function useRouter() {
  return {
    push: (href: string) => router.push(href),
    replace: (href: string) => router.replace(href),
    back: () => router.back(),
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  };
}

export function usePathname(): string {
  return splitHref(useHref()).path;
}

export function useSearchParams(): URLSearchParams {
  const { search } = splitHref(useHref());
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useRouteParams() as T;
}
