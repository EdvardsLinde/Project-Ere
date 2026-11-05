/**
 * The one place that depends on where the app runs. The Next.js app uses the
 * browser location; the single-file preview build (`artifact/`) routes in memory
 * and sets `globalThis.__SDP_ENV__`.
 */
interface RuntimeEnv {
  search: () => string;
}

function override(): Partial<RuntimeEnv> | undefined {
  return (globalThis as { __SDP_ENV__?: Partial<RuntimeEnv> }).__SDP_ENV__;
}

/** Current query string, e.g. `?stand=12`. */
export function locationSearch(): string {
  const o = override();
  if (o?.search) return o.search();
  return typeof window !== "undefined" ? window.location.search : "";
}
