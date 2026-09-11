import { describe, expect, it } from 'vitest';
import { readCache, writeCache, dedupe, invalidateCache, clearCache, cacheSize } from '../../src/services/queryCache';

describe('queryCache', () => {
  it('round-trips data and reports freshness by ttl', () => {
    writeCache('k', { n: 1 });

    expect(readCache('k', 60_000)).toEqual({ data: { n: 1 }, stale: false });
    // A negative ttl is always expired — deterministic staleness without sleeps.
    expect(readCache('k', -1)?.stale).toBe(true);

    clearCache();
    expect(readCache('k', 60_000)).toBeNull();
  });

  it('dedupes concurrent fetchers of the same key into one run', async () => {
    let calls = 0;
    const first = dedupe('d', async () => {
      calls++;
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'a';
    });
    const second = dedupe('d', async () => {
      calls++;
      return 'b';
    });

    expect(await Promise.all([first, second])).toEqual(['a', 'a']);
    expect(calls).toBe(1);

    // Once settled, the same key runs again for a new caller.
    const third = dedupe('d', async () => {
      calls++;
      return 'c';
    });
    expect(await third).toBe('c');
    expect(calls).toBe(2);
  });

  it('invalidates by prefix across store and in-flight', async () => {
    writeCache('auth.me', { u: 1 });
    writeCache('cms.nav', []);
    invalidateCache('auth.');

    expect(readCache('auth.me', 60_000)).toBeNull();
    expect(readCache('cms.nav', 60_000)).not.toBeNull();

    // In-flight work for the prefix is dropped too: a new caller re-runs.
    let calls = 0;
    const inflight = dedupe('auth.me', async () => {
      calls++;
      return 'x';
    });
    invalidateCache('auth.');
    const after = dedupe('auth.me', async () => {
      calls++;
      return 'y';
    });

    expect(await Promise.all([inflight, after])).toEqual(['x', 'y']);
    expect(calls).toBe(2);
  });

  it('cacheSize tracks live entries', () => {
    clearCache();
    writeCache('a', 1);
    writeCache('b', 2);
    expect(cacheSize()).toBe(2);
    clearCache();
    expect(cacheSize()).toBe(0);
  });
});