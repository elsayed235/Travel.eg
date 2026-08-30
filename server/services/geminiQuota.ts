/**
 * Keeps an exhausted Gemini quota from costing time on every request.
 *
 * The key on this project is a free-tier key: `generate_content_free_tier_requests`,
 * limit 20 per day per model. When that runs out the API answers HTTP 429
 * `RESOURCE_EXHAUSTED` with a `Please retry in 22.010s`, and the @google/genai
 * SDK honours it *inside the call* — so a request that would normally take a
 * couple of seconds returned after 10s on one measurement and 38.5s on
 * another. That was diagnosed at the time as a slow model; it was a spent
 * quota, and every AI request in the app paid the retry delay before falling
 * back to the answer it already had.
 *
 * This records the exhaustion and stops calling until the window the API
 * itself named has passed. Nothing is guessed: the wait comes from the error's
 * own `Please retry in Ns`, and falls back to a conservative hour only when
 * the message does not carry one.
 */

/** Google resets the free daily quota on a rolling window; an hour is a safe floor. */
const DEFAULT_COOLDOWN_MS = 60 * 60 * 1000;

interface QuotaState {
  /** When calls may be attempted again. Null means the quota is believed fine. */
  blockedUntil: number | null;
  /** The API's own wording, kept for /api/health and the logs. */
  reason: string | null;
}

const state: QuotaState = { blockedUntil: null, reason: null };

/** True when the error is the API refusing on quota rather than anything else. */
export function isQuotaExhaustedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message || '';
  return (
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('"code":429') ||
    message.includes('exceeded your current quota')
  );
}

/** Reads `Please retry in 22.010119056s` out of the API's message. */
function retryDelayMsFrom(message: string): number | null {
  const match = /retry in ([\d.]+)s/i.exec(message);
  if (!match) return null;
  const seconds = Number(match[1]);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds * 1000) : null;
}

/**
 * Records that the quota is spent. Called from the catch of every Gemini call
 * site, so one exhausted request spares all the others.
 */
export function recordQuotaExhausted(error: unknown): void {
  if (!isQuotaExhaustedError(error)) return;

  const message = error instanceof Error ? error.message : '';
  // A per-minute limit names a short retry; a per-day limit does not name one
  // at all, or names a short one that will simply fail again. Whichever is
  // longer is the safe wait.
  const named = retryDelayMsFrom(message);
  const waitMs = Math.max(named ?? 0, DEFAULT_COOLDOWN_MS);

  state.blockedUntil = Date.now() + waitMs;
  state.reason = /free_tier/i.test(message)
    ? 'Free-tier daily quota exhausted (20 requests/day).'
    : 'Gemini quota exhausted.';

  console.warn(
    `[Gemini] ${state.reason} Skipping model calls for ${Math.round(waitMs / 60000)} minute(s); ` +
      'deterministic answers are being served in the meantime.'
  );
}

/** True while calls are known to be pointless. */
export function isQuotaExhausted(): boolean {
  if (state.blockedUntil === null) return false;
  if (Date.now() >= state.blockedUntil) {
    // The window has passed; allow one attempt to find out.
    state.blockedUntil = null;
    state.reason = null;
    return false;
  }
  return true;
}

/** Cleared when a call succeeds, so a topped-up key is picked up immediately. */
export function recordQuotaAvailable(): void {
  state.blockedUntil = null;
  state.reason = null;
}

/** What /api/health reports, so the status is observable rather than guessed at. */
export function quotaStatus(): { exhausted: boolean; reason: string | null; retryAt: string | null } {
  const exhausted = isQuotaExhausted();
  return {
    exhausted,
    reason: exhausted ? state.reason : null,
    retryAt: exhausted && state.blockedUntil ? new Date(state.blockedUntil).toISOString() : null
  };
}
