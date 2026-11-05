/** Short random id with a readable prefix, e.g. `exh_k3j9x2ab`. */
export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}
