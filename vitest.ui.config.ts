import { defineConfig } from 'vitest/config';

/**
 * §7b(ii) — the thin jsdom project.
 *
 * The node project (vitest.config.ts) tests pure domain logic; it must stay
 * fast and free of DOM fakes. This project exists for exactly one class of
 * test: hooks and context providers whose contracts live in browser
 * behaviour — request cancellation on unmount, storage reads, attribute
 * application. Deliberately excluded:
 *
 * - No `tests/setup.ts`: that file swaps the database singleton onto an
 *   in-memory adapter and installs fs traps — meaningless and slow in a
 *   browser environment.
 * - No JSX snapshot tests of large screens: with the MyTrip refactor and the
 *   i18n codemod moving markup and strings, snapshots would be churn.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/ui/**/*.test.tsx'],
    testTimeout: 30_000,
    reporters: 'verbose'
  }
});
