import { describe, it, expect } from 'vitest';
import type { Response } from 'express';
import { apiAccessPolicy, isPublicApiPath, requiredRolesFor } from '../../server/middleware/apiAccessPolicy';
import type { AuthenticatedRequest } from '../../server/middleware/correlationMiddleware';

/**
 * Deny-by-default access policy — regression cover for CRIT-2 and CRIT-10.
 *
 * requireAuth used to be applied to exactly one router. Checkout, refunds, the
 * ledger, the operations overview and supplier records including payout IBANs
 * all answered anonymous requests. The policy inverted that: anything not
 * explicitly listed as public requires a session.
 *
 * These tests exist mainly to protect the DEFAULT. Someone adding a route is
 * meant to get a 401 if they forget this file — not a data breach. A test that
 * only checked the listed routes would not notice if the default flipped.
 */

type Role = 'Traveler' | 'Supplier' | 'Operations' | 'Product' | 'Admin';

interface Outcome { status: number | null; nexted: boolean; body: unknown }

function run(path: string, method = 'GET', role?: Role): Outcome {
  const outcome: Outcome = { status: null, nexted: false, body: null };
  const req = {
    path,
    method,
    originalUrl: `/api${path}`,
    correlationId: 'test-correlation',
    user: role ? { userId: 'USR-TEST', role } : undefined
  } as unknown as AuthenticatedRequest;

  const res = {
    status(code: number) { outcome.status = code; return this; },
    json(payload: unknown) { outcome.body = payload; return this; }
  } as unknown as Response;

  apiAccessPolicy(req, res, () => { outcome.nexted = true; });
  return outcome;
}

const allow = (o: Outcome) => o.nexted && o.status === null;

describe('deny by default', () => {
  it('rejects an unlisted route anonymously, so a forgotten route fails closed', () => {
    const o = run('/some/route/nobody/added/to/the/policy');
    expect(o.status).toBe(401);
    expect(allow(o)).toBe(false);
  });

  it('rejects anonymous access to the routes that used to leak', () => {
    for (const path of ['/commerce/ledger', '/operations/overview', '/suppliers']) {
      expect(run(path).status, path).toBe(401);
    }
  });

  it('rejects anonymous checkout and refund', () => {
    expect(run('/commerce/checkout', 'POST').status).toBe(401);
    expect(run('/commerce/refund', 'POST').status).toBe(401);
  });

  it('does not leak the caller role back in a 403 body', () => {
    const o = run('/operations/overview', 'GET', 'Traveler');
    expect(o.status).toBe(403);
    expect(JSON.stringify(o.body)).not.toMatch(/Traveler/);
  });
});

describe('role separation', () => {
  const table: Array<[string, Role, boolean]> = [
    ['/commerce/ledger',      'Traveler',   false],
    ['/commerce/ledger',      'Supplier',   false],
    ['/commerce/ledger',      'Operations', true],
    ['/commerce/ledger',      'Admin',      true],
    ['/operations/overview',  'Traveler',   false],
    ['/operations/overview',  'Supplier',   false],
    ['/operations/overview',  'Operations', true],
    ['/suppliers',            'Traveler',   false],
    ['/suppliers',            'Supplier',   true],
    ['/market/refresh',       'Traveler',   false],
    ['/market/refresh',       'Product',    true],
    ['/sms/dispatch',         'Traveler',   false],
    ['/sms/dispatch',         'Operations', true],
    ['/testing/golden-journey', 'Operations', false],
    ['/testing/golden-journey', 'Admin',      true]
  ];

  it.each(table)('%s as %s → %s', (path, role, expected) => {
    const o = run(path, path.startsWith('/testing') ? 'POST' : 'GET', role);
    expect(allow(o)).toBe(expected);
    if (!expected) expect(o.status).toBe(403);
  });

  it('keeps the supplier IBAN surface away from travellers', () => {
    expect(requiredRolesFor('/suppliers')).not.toContain('Traveler');
  });

  it('lets an authenticated traveller reach their own trip, which has no role rule', () => {
    expect(requiredRolesFor('/trip/DHB-TRIP-1')).toBeNull();
    expect(allow(run('/trip/DHB-TRIP-1', 'GET', 'Traveler'))).toBe(true);
  });
});

describe('public allowlist', () => {
  it('lets a visitor sign in, browse and plan without a session', () => {
    expect(allow(run('/auth/login', 'POST'))).toBe(true);
    expect(allow(run('/health'))).toBe(true);
    expect(allow(run('/dahab/places'))).toBe(true);
    expect(allow(run('/telemetry/weather'))).toBe(true);
    expect(allow(run('/commerce/availability', 'POST'))).toBe(true);
    expect(allow(run('/trip/generate', 'POST'))).toBe(true);
  });

  it('does NOT let /dahab/admin through the public knowledge allowlist', () => {
    expect(isPublicApiPath('/dahab/admin/merge', 'GET')).toBe(false);
    expect(run('/dahab/admin/merge').status).toBe(401);
  });

  it('scopes public rules by method: a public GET does not make POST public', () => {
    expect(isPublicApiPath('/dahab/places', 'GET')).toBe(true);
    expect(isPublicApiPath('/dahab/places', 'POST')).toBe(false);
    expect(run('/dahab/places', 'POST').status).toBe(401);
  });

  it('keeps the public inventory rule to a single segment, not a whole subtree', () => {
    expect(isPublicApiPath('/inventory/SKU-1', 'GET')).toBe(true);
    expect(isPublicApiPath('/inventory/SKU-1/secrets', 'GET')).toBe(false);
  });
});
