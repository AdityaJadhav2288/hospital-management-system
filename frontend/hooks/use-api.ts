"use client";

import { useCallback, useState } from "react";
import { resolveApiError } from "@/services/api-client";

export function useApi<T, TArgs extends unknown[]>(apiFn: (...args: TArgs) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(resolveApiError(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFn],
  );

  return { data, loading, error, execute };
}
