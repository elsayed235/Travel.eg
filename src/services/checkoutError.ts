import { ApiError } from './apiError';
import type { TVars } from '../i18n/resolve';

/**
 * What a failed hold or checkout means to the traveller, and what they can do
 * about it.
 *
 * The commerce routes answer `{ error, code, details }`. `error` is a sentence
 * for logs; `code` is the contract the UI branches on. Callers used to show
 * `err.message` verbatim, so a traveller read "Hold token has expired or is
 * invalid" — accurate, but no help. Every code maps here to a translated
 * sentence and one recovery the screen can offer.
 */

export type CheckoutErrorCode =
  // Codes the server sends (server/services/commerceService.ts, fraudDetectionService.ts).
  | 'HOLD_REQUIRED'
  | 'HOLD_EXPIRED'
  | 'HOLD_NOT_OWNED'
  | 'HOLD_MISMATCH'
  | 'PRICE_CHANGED'
  | 'SUPPLIER_UNAVAILABLE'
  | 'FRAUD_BLOCKED'
  // Derived here from status + details: the hold route's capacity and
  // calendar 409s carry details but no code.
  | 'SOLD_OUT'
  | 'DATE_BLOCKED'
  // Transport-level outcomes.
  | 'SIGN_IN'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'SERVER'
  | 'NETWORK'
  | 'UNKNOWN';

/** The one thing the screen offers next. */
export type CheckoutRecovery =
  | 'confirmPrice'
  | 'rehold'
  | 'alternatives'
  | 'pickAnotherDate'
  | 'signIn'
  | 'contactSupport'
  | 'retry';

export interface CheckoutIssue {
  code: CheckoutErrorCode;
  /** Translation key for the traveller-facing sentence. */
  messageKey: string;
  recovery: CheckoutRecovery;
  /** The SKU the failure is about, when the server named one. */
  skuId?: string;
  /** PRICE_CHANGED: what the server will charge for that line now. */
  currentAmountEGP?: number;
  /** PRICE_CHANGED: what the client showed for that line. */
  quotedAmountEGP?: number;
  /** DATE_BLOCKED: the refused date (YYYY-MM-DD), when known. */
  date?: string;
  /** The server's details, untouched, for diagnostics. */
  details: Record<string, unknown>;
}

const SERVER_CODES: ReadonlySet<string> = new Set([
  'HOLD_REQUIRED',
  'HOLD_EXPIRED',
  'HOLD_NOT_OWNED',
  'HOLD_MISMATCH',
  'PRICE_CHANGED',
  'SUPPLIER_UNAVAILABLE',
  'FRAUD_BLOCKED',
]);

const MESSAGE_KEY: Record<CheckoutErrorCode, string> = {
  HOLD_REQUIRED: 'checkout.error.holdRequired',
  HOLD_EXPIRED: 'checkout.error.holdExpired',
  HOLD_NOT_OWNED: 'checkout.error.holdNotOwned',
  HOLD_MISMATCH: 'checkout.error.holdMismatch',
  PRICE_CHANGED: 'checkout.error.priceChanged',
  SUPPLIER_UNAVAILABLE: 'checkout.error.supplierUnavailable',
  FRAUD_BLOCKED: 'checkout.error.fraudBlocked',
  SOLD_OUT: 'checkout.error.soldOut',
  DATE_BLOCKED: 'checkout.error.dateBlocked',
  SIGN_IN: 'checkout.error.signIn',
  FORBIDDEN: 'checkout.error.forbidden',
  RATE_LIMITED: 'checkout.error.rateLimited',
  SERVER: 'checkout.error.server',
  NETWORK: 'checkout.error.network',
  UNKNOWN: 'checkout.error.unknown',
};

const RECOVERY: Record<CheckoutErrorCode, CheckoutRecovery> = {
  HOLD_REQUIRED: 'rehold',
  HOLD_EXPIRED: 'rehold',
  HOLD_MISMATCH: 'rehold',
  HOLD_NOT_OWNED: 'signIn',
  PRICE_CHANGED: 'confirmPrice',
  SUPPLIER_UNAVAILABLE: 'alternatives',
  SOLD_OUT: 'alternatives',
  DATE_BLOCKED: 'pickAnotherDate',
  FRAUD_BLOCKED: 'contactSupport',
  FORBIDDEN: 'contactSupport',
  SIGN_IN: 'signIn',
  RATE_LIMITED: 'retry',
  SERVER: 'retry',
  NETWORK: 'retry',
  UNKNOWN: 'retry',
};

/** Every translation key this module can return — the i18n test checks both languages carry them. */
export const CHECKOUT_ERROR_MESSAGE_KEYS: readonly string[] = Object.values(MESSAGE_KEY);

const str = (v: unknown): string | undefined => (typeof v === 'string' && v ? v : undefined);
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

function codeOf(error: ApiError): CheckoutErrorCode {
  if (error.code && SERVER_CODES.has(error.code)) return error.code as CheckoutErrorCode;
  const d = error.details;
  if (error.status === 401) return 'SIGN_IN';
  if (error.status === 409) {
    // InsufficientCapacityError: { requested, available }.
    if (d.requested !== undefined || d.available !== undefined) return 'SOLD_OUT';
    // SupplierDateBlockedError: { supplierId, date, reason? }.
    if (str(d.supplierId) && str(d.date)) return 'DATE_BLOCKED';
    return 'SOLD_OUT';
  }
  // The single hold-settling checkout still answers an expired hold with a
  // bare 400 and no code; that sentence is the only signal it gives.
  if (error.status === 400 && /hold token has expired|select your slot again/i.test(error.message)) {
    return 'HOLD_EXPIRED';
  }
  if (error.status === 403) return 'FORBIDDEN';
  if (error.status === 429) return 'RATE_LIMITED';
  if (error.status >= 500) return 'SERVER';
  return 'UNKNOWN';
}

/** Turns anything a hold or checkout call threw into a CheckoutIssue. */
export function checkoutIssueFrom(error: unknown): CheckoutIssue {
  if (!(error instanceof ApiError)) {
    // A timeout from fetchWithTimeout or a TypeError (offline, DNS): the
    // server decided nothing.
    return { code: 'NETWORK', messageKey: MESSAGE_KEY.NETWORK, recovery: RECOVERY.NETWORK, details: {} };
  }
  const code = codeOf(error);
  const d = error.details;
  return {
    code,
    messageKey: MESSAGE_KEY[code],
    recovery: RECOVERY[code],
    skuId: str(d.skuId),
    currentAmountEGP: code === 'PRICE_CHANGED' ? num(d.currentAmountEGP) : undefined,
    quotedAmountEGP: code === 'PRICE_CHANGED' ? num(d.quotedAmountEGP) : undefined,
    date: code === 'DATE_BLOCKED' ? str(d.date) : undefined,
    details: d,
  };
}

type Translate = (key: string, vars: TVars) => string;

/** Fallback EGP formatting with Western digits, matching CurrencyContext. */
export const formatEGPPlain = (amountEGP: number): string =>
  `EGP ${Math.round(amountEGP).toLocaleString('en-US')}`;

/**
 * The sentence to show. `formatEGP` should be CurrencyContext's, so the new
 * price reads the way every other price on screen does.
 */
export function checkoutIssueMessage(
  issue: CheckoutIssue,
  t: Translate,
  formatEGP: (amountEGP: number) => string = formatEGPPlain
): string {
  if (issue.code === 'PRICE_CHANGED' && issue.currentAmountEGP === undefined) {
    // A price change with no amount cannot be confirmed honestly — ask the
    // traveller to start again rather than to agree to an unknown number.
    return t('checkout.error.priceChangedNoAmount', {});
  }
  if (issue.code === 'DATE_BLOCKED' && !issue.date) {
    return t('checkout.error.dateBlockedNoDate', {});
  }
  return t(issue.messageKey, {
    amount: issue.currentAmountEGP !== undefined ? formatEGP(issue.currentAmountEGP) : '',
    date: issue.date ?? '',
  });
}
