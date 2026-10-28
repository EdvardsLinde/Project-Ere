/** Short random id with a readable prefix, e.g. `plc_k3j9x2ab`. */
export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}

/**
 * DEMO ONLY — NOT SECURE. FNV-1a string hash so demo passwords are not kept
 * in plain text in localStorage. It is not a password hash and offers no real
 * protection. Real auth (e.g. Supabase Auth) must replace it.
 */
export function demoHash(value: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `demo$${(h >>> 0).toString(16)}`;
}
