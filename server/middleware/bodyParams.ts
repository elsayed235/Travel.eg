/**
 * Request-body reading for the endpoints that move money.
 *
 * The audit records "no server-side request validation" across ~120 handlers.
 * This is not that fix; it covers the handlers where an unvalidated body has a
 * financial consequence, and the pattern is available for the rest.
 *
 * What it replaces, concretely:
 *
 *  - `amountEGP: Number(req.body.amountEGP)` on the refund endpoint. `Number()`
 *    of an absent or non-numeric field is **NaN**, and the refund path wrote it
 *    straight into a double-entry ledger row debiting PLATFORM_ESCROW_MAIN.
 *  - `passengersCount = 2` and `skuId || 'SKU-TRF-001'` style defaults, which
 *    turned a malformed request into a real hold against the demo trip and the
 *    demo traveler rather than an error.
 *  - `idempotencyKey: idempotencyKey || \`IDEMP-REF-${Date.now()}\``, which
 *    generated a fresh key whenever the caller omitted one — defeating the
 *    entire idempotency mechanism, because a double submit produced two keys
 *    and therefore two refunds.
 *
 * Nothing here asserts a type; every function narrows by checking.
 */

export class InvalidRequestBodyError extends Error {
  public readonly status = 400;
  public readonly title = 'Invalid Request';
  public readonly type = 'https://dahab.travel/errors/invalid-request-body';

  constructor(field: string, detail: string) {
    super(`"${field}" ${detail}`);
    this.name = 'InvalidRequestBodyError';
  }
}

export function requiredString(value: unknown, field: string, maxLength = 256): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new InvalidRequestBodyError(field, 'is required and must be a non-empty string.');
  }
  if (value.length > maxLength) {
    throw new InvalidRequestBodyError(field, `must be at most ${maxLength} characters.`);
  }
  return value.trim();
}

export function optionalString(value: unknown, field: string, maxLength = 256): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredString(value, field, maxLength);
}

/**
 * A money amount. Rejects NaN, Infinity, negatives, zero and values carrying
 * sub-piastre precision, which a ledger cannot represent honestly.
 */
export function requiredAmountEGP(value: unknown, field: string, maxEGP = 1_000_000): number {
  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount)) {
    throw new InvalidRequestBodyError(field, 'must be a number.');
  }
  if (amount <= 0) {
    throw new InvalidRequestBodyError(field, 'must be greater than zero.');
  }
  if (amount > maxEGP) {
    throw new InvalidRequestBodyError(field, `must not exceed ${maxEGP} EGP.`);
  }
  if (Math.round(amount * 100) !== amount * 100) {
    throw new InvalidRequestBodyError(field, 'must not have more than two decimal places.');
  }
  return amount;
}

export function requiredCount(value: unknown, field: string, min = 1, max = 100): number {
  const count = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(count)) {
    throw new InvalidRequestBodyError(field, 'must be a whole number.');
  }
  if (count < min || count > max) {
    throw new InvalidRequestBodyError(field, `must be between ${min} and ${max}.`);
  }
  return count;
}

/** Same rules as requiredCount, but the field may be absent. */
export function optionalCount(
  value: unknown,
  field: string,
  min = 1,
  max = 100
): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredCount(value, field, min, max);
}

/** An ISO calendar date (YYYY-MM-DD), which is what the inventory keys on. */
export function requiredCalendarDate(value: unknown, field: string): string {
  const raw = requiredString(value, field, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(Date.parse(raw))) {
    throw new InvalidRequestBodyError(field, 'must be a calendar date in YYYY-MM-DD form.');
  }
  return raw;
}

/** Returns `unknown[]` deliberately: narrowing the elements is the caller's
 *  job, and a generic here would only be an assertion in disguise. */
export function requiredArray(value: unknown, field: string, maxItems = 50): unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new InvalidRequestBodyError(field, 'must be a non-empty array.');
  }
  if (value.length > maxItems) {
    throw new InvalidRequestBodyError(field, `must contain at most ${maxItems} items.`);
  }
  return value;
}

/**
 * Narrows one element of a validated array to something whose fields can be
 * read. Returns `Record<string, unknown>` — every field still has to be
 * validated individually; this only says "it is an object, not a string".
 */
export function requiredObject(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new InvalidRequestBodyError(field, 'must be an object.');
  }
  const entries = Object.entries(value).filter(([key]) => key !== '__proto__');
  return Object.fromEntries(entries);
}

/** A member of a known set, or a 400 naming what was allowed. */
export function requiredEnum<T extends string>(value: unknown, allowed: readonly T[], field: string): T {
  const raw = requiredString(value, field, 64);
  const match = allowed.find(candidate => candidate === raw);
  if (match === undefined) {
    throw new InvalidRequestBodyError(field, `must be one of: ${allowed.join(', ')}.`);
  }
  return match;
}

export function optionalEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string
): T | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  return requiredEnum(value, allowed, field);
}

export const SERVICE_TYPES = ['hotel', 'transfer', 'diving', 'safari', 'wellness', 'dining'] as const;
export const SUBSTITUTION_SERVICE_TYPES = ['hotel', 'transfer', 'diving', 'safari', 'activity'] as const;
export const PAYMENT_PROVIDERS = ['PAYMOB', 'STRIPE', 'CASH_ON_ARRIVAL'] as const;

/**
 * Rejects a body still carrying raw card data.
 *
 * The single-item checkout has done this since Phase A; the multi-item one
 * passed `req.body` straight through, so a stale client could still put a PAN
 * into this server's memory, logs and error handler.
 */
export function rejectRawCardData(body: unknown): void {
  const candidate = typeof body === 'object' && body !== null ? Object.keys(body) : [];
  const forbidden = candidate.filter(key => /^(cardnumber|pan|cvv|cvc|expiry|expirydate|expirationdate)$/i.test(key));
  if (forbidden.length > 0) {
    throw new InvalidRequestBodyError(
      forbidden[0],
      'must not be sent to this API. Supply only cardLast4.'
    );
  }
}

/**
 * Keeps only the named keys, and only when their value is a primitive or an
 * array of strings.
 *
 * Two endpoints spread `req.body` straight into state that is then persisted:
 * DayGI memory preferences and the beta experiment flags. Any key a caller
 * invented was stored forever, and a nested object could be written where the
 * UI expected a string. This bounds what can be written without enumerating
 * every value union — those remain the service's own contract.
 */
export function pickAllowedKeys(
  body: unknown,
  allowed: readonly string[],
  field: string
): Record<string, string | number | boolean | string[]> {
  const source = requiredObject(body, field);
  const picked: Record<string, string | number | boolean | string[]> = {};

  for (const key of allowed) {
    const value = source[key];
    if (value === undefined) continue;

    if (typeof value === 'string' || typeof value === 'boolean') {
      picked[key] = value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      picked[key] = value;
    } else if (Array.isArray(value) && value.every(entry => typeof entry === 'string')) {
      picked[key] = value.slice(0, 50);
    } else {
      throw new InvalidRequestBodyError(`${field}.${key}`, 'must be a string, number, boolean, or list of strings.');
    }
  }

  if (Object.keys(picked).length === 0) {
    throw new InvalidRequestBodyError(field, `must contain at least one of: ${allowed.join(', ')}.`);
  }
  return picked;
}

export const DAYGI_PREFERENCE_KEYS = [
  'pace',
  'morningPreference',
  'divingLevel',
  'dietaryPreferences',
  'budgetBand',
  'transferPreference',
  'seafoodPreference',
  'avoidsLongTransfers'
] as const;

export const DAYGI_EXPERIMENT_FLAG_KEYS = [
  'proactiveAlertFrequency',
  'quickPromptOrdering',
  'explanationLevel',
  'confirmationStyle',
  'recommendationCardLayout'
] as const;
