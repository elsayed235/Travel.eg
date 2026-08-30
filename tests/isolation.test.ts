import { describe, it, expect, afterEach } from 'vitest';
import { db } from '../server/db/database';
import { JsonFilePersistenceAdapter } from '../server/db/adapters/JsonFilePersistenceAdapter';
import { InMemoryPersistenceAdapter } from '../server/db/adapters/InMemoryPersistenceAdapter';

/**
 * Guards the guard.
 *
 * tests/setup.ts swaps in the in-memory adapter and installs an fs tripwire so
 * the suite can never touch data/dahab_db.json — which holds real user records,
 * live session tokens and the ledger. A tripwire that has never been observed
 * to fire is indistinguishable from no tripwire at all, which is precisely the
 * self-certification pattern this codebase was audited for. So: prove it fires.
 */
describe('test isolation', () => {
  afterEach(() => db.setAdapter(new InMemoryPersistenceAdapter()));

  it('runs the suite against the in-memory adapter, never the JSON file', () => {
    expect(db.getAdapter().constructor.name).toBe('InMemoryPersistenceAdapter');
  });

  it('blocks a write to the real database file if the adapter is ever restored', () => {
    db.setAdapter(new JsonFilePersistenceAdapter());
    // save() throws synchronously now; it is no longer `async`, so a failure
    // reaches the caller instead of becoming an unhandled rejection.
    expect(() => db.getAdapter().save()).toThrow(/Test isolation breach/);
  });
});
