import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Only our own tests. server/test/* are the legacy self-certification
    // scripts, which are run manually via tsx and assert shape rather than
    // behaviour — they are deliberately not part of this suite.
    include: ['tests/**/*.test.ts'],
    // Swaps the Database singleton onto an in-memory adapter so the suite never
    // reads or writes data/dahab_db.json.
    setupFiles: ['tests/setup.ts', 'tests/i18nSeed.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    // The suite touches the shared JSON database singleton, so files must not
    // run concurrently against each other.
    fileParallelism: false,
    reporters: 'verbose'
  }
});
