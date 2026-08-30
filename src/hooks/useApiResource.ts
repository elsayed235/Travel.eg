import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../services/apiError';

export type ApiResourceStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ApiResourceState<T> {
  data: T | null;
  status: ApiResourceStatus;
  /** A message fit to show a traveler. Null while loading or on success. */
  error: string | null;
  /** The request failed because there is no session. Prompt for sign-in, do not retry. */
  requiresSignIn: boolean;
  /** Re-runs the request, cancelling any in flight. */
  reload: () => void;
}

interface UseApiResourceOptions {
  /**
   * Skip the request entirely — for a resource that needs an id or a session
   * the caller does not have yet. The state stays 'idle' rather than reporting
   * an error the traveler cannot act on.
   */
  enabled?: boolean;
}

/**
 * One place where a page asks the backend for something.
 *
 * Three problems this exists to stop repeating, all of them found in the
 * running app rather than imagined:
 *
 * 1. **No request was ever cancelled.** Navigating away from a slow view still
 *    resolved into setState on an unmounted component, and on a slow
 *    connection a stale response could land in a later view's state. Every
 *    request here is aborted on unmount and when it is superseded by a reload.
 * 2. **A 401 was indistinguishable from a network failure**, so nothing in the
 *    app ever handled an expired session — the booking flow reported success
 *    after being rejected. `requiresSignIn` separates the two, once.
 * 3. **A failed request blanked the page.** `data` is left untouched on error,
 *    so a caller can keep showing what it already had, or its offline copy,
 *    and surface the error beside it.
 *
 * `fetcher` must be stable (defined outside the component, or wrapped in
 * useCallback) — it is a dependency, so an inline arrow would re-request on
 * every render.
 */
export function useApiResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: UseApiResourceOptions = {}
): ApiResourceState<T> {
  const { enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ApiResourceStatus>(enabled ? 'loading' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const [requiresSignIn, setRequiresSignIn] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  // Guards a setState after unmount on the abort path, where the rejection can
  // arrive a tick after cleanup has run.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setError(null);
    setRequiresSignIn(false);

    fetcher(controller.signal)
      .then(result => {
        if (controller.signal.aborted || !mounted.current) return;
        setData(result);
        setStatus('ready');
      })
      .catch((err: unknown) => {
        // A cancelled request is not a failure and must not be shown as one.
        if (controller.signal.aborted || !mounted.current) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;

        if (err instanceof ApiError && err.isUnauthorized) {
          setRequiresSignIn(true);
        }
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setStatus('error');
      });

    return () => controller.abort();
  }, [fetcher, enabled, reloadToken]);

  const reload = useCallback(() => setReloadToken(token => token + 1), []);

  return { data, status, error, requiresSignIn, reload };
}
