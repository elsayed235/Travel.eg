/**
 * Query-string parameter reading.
 *
 * Express types `req.query.x` as `string | string[] | ParsedQs | ParsedQs[]`,
 * so handlers were writing `req.query.severity as any` to get a domain union
 * out of it. That is not just a type-safety gap: it means an arbitrary string —
 * or an array, if the caller repeats the parameter — reached the service layer
 * as though it were a valid enum member, and the filters downstream compared it
 * with `===` and silently matched nothing.
 *
 * There is no validation library in this project yet (the audit records that as
 * an open item across ~120 handlers). These helpers cover the cases that were
 * reaching for `as any`, with no assertion anywhere.
 *
 * Absent means "no filter". Present but invalid is a 400: silently ignoring a
 * misspelled filter is worse than the bug it replaced — the old cast made a bad
 * value match nothing, whereas dropping it returns the caller MORE rows than
 * they asked for, with nothing to say the filter was discarded.
 */

export class InvalidQueryParameterError extends Error {
  public readonly status = 400;
  public readonly title = 'Invalid Query Parameter';
  public readonly type = 'https://dahab.travel/errors/invalid-query-parameter';

  constructor(param: string, detail: string) {
    super(`Query parameter "${param}" ${detail}`);
    this.name = 'InvalidQueryParameterError';
  }
}

/** A single string parameter, or undefined if absent. Repeated or structured
 *  values are rejected rather than silently collapsed. */
export function stringParam(value: unknown, param = 'parameter'): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw new InvalidQueryParameterError(param, 'must be a single text value.');
  }
  return value;
}

/**
 * A parameter that must be one of a known set.
 *
 * `find` returns `T | undefined` on its own, so nothing here is asserted.
 */
export function enumParam<T extends string>(
  value: unknown,
  allowed: readonly T[],
  param = 'parameter'
): T | undefined {
  const raw = stringParam(value, param);
  if (raw === undefined) return undefined;

  const match = allowed.find(candidate => candidate === raw);
  if (match === undefined) {
    throw new InvalidQueryParameterError(param, `must be one of: ${allowed.join(', ')}.`);
  }
  return match;
}

export const VERIFICATION_LEVELS = [
  'SOURCE_REPORTED',
  'INSTAGRAM_REPORTED',
  'WEB_CONFIRMED',
  'SUPPLIER_CONFIRMED',
  'REGULATORY_VERIFIED',
  'FULLY_VERIFIED',
  'STALE',
  'EXPIRED',
  'SUSPENDED',
  'UNVERIFIED_REGULATORY_CLAIM'
] as const;

export const PRICING_BASES = [
  'PER_PERSON',
  'PER_GROUP',
  'PER_BOOKING',
  'SINGLE',
  'DOUBLE',
  'SNGL_DBL',
  'VIP_PER_PERSON',
  'STARTING_FROM',
  'PRICE_ON_INQUIRY'
] as const;

export const REVIEW_ISSUE_TYPES = [
  'PRICE_ANOMALY',
  'SOURCE_PRICE_CONFLICT',
  'POSSIBLE_DUPLICATE',
  'CONTACT_CHANGE',
  'REGULATORY_CHANGE',
  'AMBIGUOUS_ACTIVITY',
  'UNEXPECTED_SUPPLIER_REMOVAL'
] as const;

export const REVIEW_STATUSES = [
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'DISMISSED',
  'MARKED_VERIFIED',
  'MARKED_STALE',
  'SOURCE_SUSPENDED',
  'SOURCE_REACTIVATED'
] as const;

export const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
