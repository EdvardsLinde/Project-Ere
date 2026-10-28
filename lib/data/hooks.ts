"use client";

import { useCallback, useEffect, useState } from "react";
import { getRepository, type DataRepository } from "./index";

export interface QueryState<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown;
  reload: () => void;
}

/**
 * Runs an async query against the repository and re-runs it whenever the data
 * changes (in this tab or another one). `deps` work like useEffect deps.
 */
export function useQuery<T>(query: (repo: DataRepository) => Promise<T>, deps: unknown[]): QueryState<T> {
  const [state, setState] = useState<{ data: T | undefined; loading: boolean; error: unknown }>({
    data: undefined,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const repo = getRepository();
    return repo.subscribe(reload);
  }, [reload]);

  useEffect(() => {
    let cancelled = false;
    query(getRepository())
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: undefined, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { ...state, reload };
}
