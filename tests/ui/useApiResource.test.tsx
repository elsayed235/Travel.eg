import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useApiResource } from '../../src/hooks/useApiResource';
import { ApiError } from '../../src/services/apiError';

/** These three behaviours are the hook's reason to exist (see its docblock):
 * cancellation, 401-vs-network separation, and data retention on error. */
describe('useApiResource', () => {
  it('resolves to ready with data', async () => {
    const fetcher = vi.fn((_signal: AbortSignal) => Promise.resolve({ value: 42 }));
    const { result } = renderHook(() => useApiResource(fetcher));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.data).toEqual({ value: 42 });
    expect(result.current.error).toBeNull();
    expect(result.current.requiresSignIn).toBe(false);
  });

  it('aborts the in-flight request on unmount instead of setState-after-unmount', async () => {
    let aborted = false;
    const fetcher = (signal: AbortSignal) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          aborted = true;
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });

    const { unmount } = renderHook(() => useApiResource(fetcher));
    unmount();

    expect(aborted).toBe(true);
  });

  it('maps a 401 to requiresSignIn and not a generic error', async () => {
    const fetcher = vi.fn((_signal: AbortSignal) =>
      Promise.reject(new ApiError('Session expired', 401))
    );
    const { result } = renderHook(() => useApiResource(fetcher));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.requiresSignIn).toBe(true);
    expect(result.current.error).toBe('Session expired');
  });

  it('keeps previously loaded data when a later request fails', async () => {
    let call = 0;
    let rejectNext: ((e: unknown) => void) | null = null;
    const fetcher = vi.fn((_signal: AbortSignal) => {
      call++;
      if (call === 1) return Promise.resolve({ page: 1 });
      return new Promise((_resolve, reject) => {
        rejectNext = reject;
      });
    });

    const { result } = renderHook(() => useApiResource(fetcher));
    await waitFor(() => expect(result.current.data).toEqual({ page: 1 }));

    act(() => result.current.reload());
    await waitFor(() => expect(rejectNext).not.toBeNull());
    rejectNext!(new Error('network down'));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.data).toEqual({ page: 1 }); // not blanked
  });

  it('stays idle when enabled is false and starts when it flips true', async () => {
    const fetcher = vi.fn((_signal: AbortSignal) => Promise.resolve('x'));
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => useApiResource(fetcher, { enabled }),
      { initialProps: { enabled: false } }
    );

    expect(result.current.status).toBe('idle');
    expect(fetcher).not.toHaveBeenCalled();

    rerender({ enabled: true });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
