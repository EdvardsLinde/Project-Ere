/**
 * Single entry point for data access. Pages and components import `getRepository()`
 * (or the hooks in `lib/data/hooks.ts`) and never touch storage directly.
 *
 * To switch to Supabase: implement `DataRepository` in `lib/data/supabase.ts`
 * and return it here (e.g. when `process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase"`).
 */
import { LocalStorageRepository } from "./local-storage";
import type { DataRepository } from "./repository";

let instance: DataRepository | null = null;

export function getRepository(): DataRepository {
  if (typeof window === "undefined") {
    throw new Error("Demo data layer runs in the browser only (localStorage).");
  }
  if (!instance) instance = new LocalStorageRepository();
  return instance;
}

export * from "./repository";
export type * from "./types";
