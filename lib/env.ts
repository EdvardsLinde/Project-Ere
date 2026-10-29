import { siteConfig } from "@/config/site";

/**
 * The few places that depend on where the app runs. The Next.js app uses the
 * browser location. The single-file preview build (`artifact/`) sets
 * `globalThis.__SDP_ENV__` because it routes in memory and can't open the print dialog.
 */
interface RuntimeEnv {
  search: () => string;
  verifyUrl: (id: string) => string;
  canPrint: boolean;
}

function override(): Partial<RuntimeEnv> | undefined {
  return (globalThis as { __SDP_ENV__?: Partial<RuntimeEnv> }).__SDP_ENV__;
}

/** Current query string, e.g. `?loma=skolens`. */
export function locationSearch(): string {
  const o = override();
  if (o?.search) return o.search();
  return typeof window !== "undefined" ? window.location.search : "";
}

/** Public link to a certificate's verification page (used for the QR code). */
export function certificateVerifyUrl(id: string): string {
  const o = override();
  if (o?.verifyUrl) return o.verifyUrl(id);
  const origin = typeof window !== "undefined" ? window.location.origin : siteConfig.siteUrl;
  return `${origin}/parbaudit/${encodeURIComponent(id)}`;
}

/** Whether "Download PDF" (browser print) is available. */
export function canPrint(): boolean {
  return override()?.canPrint ?? true;
}
