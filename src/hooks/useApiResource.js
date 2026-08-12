import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api';

/**
 * Loads a read-only API resource with explicit loading and error states.
 *
 * Every panel previously caught fetch failures and substituted hardcoded demo data. That
 * turned an outage into silent misinformation — most seriously in the parent portal, where
 * a failed request displayed invented study statistics for fictional children as though
 * they were the signed-in parent's own. Failures are now surfaced, never papered over.
 *
 * @param {string} endpoint  API path to load
 * @param {object} [options] `{ enabled }` to defer the request
 * @returns {{data: any, error: import('../api').ApiError|null, isLoading: boolean, reload: () => void}}
 */
export function useApiResource(endpoint, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [reloadCount, setReloadCount] = useState(0);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    apiFetch(endpoint)
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err) => {
        // Keep any previously loaded data on screen rather than blanking the panel,
        // but make the failure visible alongside it.
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [endpoint, enabled, reloadCount]);

  return { data, error, isLoading, reload };
}
