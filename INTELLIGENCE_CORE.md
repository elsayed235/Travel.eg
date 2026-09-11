# DAHAB INTELLIGENCE CORE — Architecture & Operations

*Status: LIVE. The Core is the deterministic admin control plane. It proposes nothing it cannot execute through the allowlisted tool registry, and it executes nothing the ledger, booking rules, and role gates have not already approved.*

## 1. What it is

The Intelligence Core is an operations-grade command surface: an admin asks in plain language (EN/AR), the Core routes the intent **deterministically** to allowlisted tools over the *existing* Dahab services, answers from live state, and — for mutations — issues an expiring, single-use, actor-bound confirmation that is re-authorized at execution time.

Layering (unchanged from the approved architecture):

```
DayGI                     → reasoning / intent / summarization (traveler-facing)
Intelligence Core         → deterministic allowlisted authority boundary (ops-facing)
Existing business services→ actual business authority (booking, ledger, suppliers…)
Server                    → auth + authorization + validation + risk + confirmation + audit
```

No model output can execute SQL, shell commands, arbitrary functions, or uncontrolled APIs. `parseIntelIntent` is a deterministic keyword/ref/date parser (EN + AR keyword sets, word-boundary-safe pronouns); tool routing goes through `getTool()` which is a `hasOwnProperty` allowlist; parameters pass through `sanitizeParams()`; mutations wrap `bookingService` / `supplierService` / `notificationService` / the ledger.

## 2. Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /api/intelligence-core/query` | Operations/Admin | Deterministic intent → read tools → grounded reply (EN/AR) |
| `GET /api/intelligence-core/attention` | Operations/Admin | Prioritized exceptions (CRITICAL→LOW), 7 categories |
| `POST /api/intelligence-core/action` | Operations/Admin | LOW executes; MEDIUM/HIGH return a confirmation token; FORBIDDEN rejects |
| `POST /api/intelligence-core/confirm` | Operations/Admin | Execute a pending confirmation (TTL 10 min, single-use, creator-bound) |

The API access policy (`server/middleware/apiAccessPolicy.ts`) gates `/intelligence-core/*` to `Operations` and `Admin`. Identity always comes from the session (`req.user`), never the body.

## 3. Tool registry (`server/services/intelligenceCoreTools.ts`)

19 read tools (risk `LOW`): dashboard summary, bookings (filtered/list/search/single), pending supplier bookings, supplier performance, orders, inventory alerts, revenue summary (ledger-verified), trip summary, system health (ledger integrity + Gemini quota), recent errors, analytics, attention queue, reviews, market intelligence, knowledge status, reliability status, Core audit trail.

6 mutation tools, risk-gated:

| Tool | Risk | Wraps | Guardrails |
|---|---|---|---|
| `cancelBooking` | HIGH | `bookingService.cancelBooking` | requires `cancellationKey`; inventory release + conditional refund |
| `rescheduleBooking` | HIGH | `bookingService.rescheduleBooking` | capacity-checked, idempotency key |
| `approveSupplierBooking` / `rejectSupplierBooking` | HIGH | `supplierService.updateBookingState` | resolves booking by id/ref, notifies parties |
| `updateInventory` | MEDIUM | direct slot mutation | price/capacity bounds; refuses below reserved+held |
| `sendNotification` | MEDIUM | `notificationService` | single recipient, channel allowlist |

Every mutation audits (`INTELLIGENCE_CORE_MUTATION`), and `FORBIDDEN` is reserved for tools that must never run through the Core.

## 4. Confirmation lifecycle

1. `action` with a MEDIUM/HIGH tool → `IntelConfirmation` (token `ICF-…`, impact text, affected count, expiry = now + 10 min).
2. `confirm` re-checks: token exists → not expired (410) → creator and role match the session (403) → **re-authorizes** the tool against current state → executes. A replay of a consumed token is rejected (404, the public consumed-token contract) **and audited** as a replay attempt; expired tokens are swept opportunistically so the in-memory map cannot grow unbounded.
3. Bulk: `bulkIds` (≤50, every id validated to resolve **before** any token is issued; trip-scoped tools require their shared `tripId` up front) executes per-id with `{ok, failed, failures[]}` results; per-item failures stay visible in the Action Plan card.
4. Confirmations live in a process-local map; the service exposes `__clearConfirms()` as the test seam.

## 5. Attention Queue

Computed live from state, not from AI: supplier acceptance older than 2h (CRITICAL at 24h+), failed payments, slots ≤2 remaining, imminent starts <24h unconfirmed, cancellation spike, error spike (≥10 audit failures/24h), open support, unacknowledged market alerts. Each item carries `recommendedAction` and a `safeTool` the operator can deep-link into.

## 6. Frontend

- **Floating Core** (`GlobalIntelligenceCore`) — compact orb FAB on every ops-console section with attention badge, expandable frosted panel: conversation, quick commands, attention summary, action plan, deep link to `#core`. Escape closes the dialog and focus returns to the FAB; opening moves focus to the command input.
- **Command Center section** (`#core`, `IntelligenceCoreView`) — large Orb, KPIs, conversation with tool-call provenance, command input (text first, voice progressive, TTS read-aloud for the latest reply), Attention Required panel with one-click inspect → follow-up query, Action Plan confirmation card (keeps per-item bulk failures visible; dead tokens clear instead of lingering), Core audit-trail card, gesture toggle wired to the orb (drag-rotate / pinch-zoom).
- **Conversation memory** — the booking the admin last inspected is remembered for the session, so follow-up "why is this pending?" resolves without a fresh explicit ref. The deterministic parser only consults it for pronoun-style questions; answers still come from tool output, never invention.
- **Orb** (`OrbVisualization` + `src/lib/dahabOrbScene.ts`) — 10 states (idle/listening/thinking/responding/action/success/warning/error/confirm/alert), canvas-2D scene with disposal + reduced-motion render-on-demand + small-viewport/SVG fallback; `setAttentionCount` drives the alert ring; `rotate`/`zoom` serve gesture control.
- **Voice** (`VoiceControl`) — Web Speech STT/TTS, EN `en-US` / AR `ar-EG`, graceful degradation (unsupported/denied/no-speech); TTS stops when a new query is sent or the input unmounts.
- **Gestures** (`GestureControl`) — opt-in MediaPipe hand tracking loaded lazily only when enabled; camera off by default; GPU→CPU fallback; start/stop generation guard so a slow permission prompt can never leak a camera stream; pinch-zoom + drag-rotate drive the section orb; full cleanup (tracks + landmarker + rAF).
- i18n: all Core strings are bilingual; `tests/domain/i18nCoverage.test.ts` enforces that every literal key used by the Core surface exists in both languages.

## 7. Security model

Deny-by-default API policy · session-only identity · role gate (Ops/Admin) at service *and* tool level · `hasOwnProperty` allowlist (no `__proto__` smuggling) · `sanitizeParams` (prototype keys dropped, length caps, nested objects flattened to strings) · per-tool wall-clock timeouts (`timeoutMs`, enforced by the router — 504, not hangs) · PII minimization (`maskPhone`/`maskEmail` on every booking detail leaving the Core; list projections never carry contacts) · mutation re-authorization at execution · full audit trail (`db.logAudit`: query, tool call, mutation, denial, expiry, replay) · server-only telemetry (`intel.query/tool/deny/confirm/mutation/error` with latency payloads; the client analytics ingestion path rejects `intel.*` so telemetry cannot be forged).

Adversarial tests pin: SQL/command-like text is data, prompt-injection cannot invoke arbitrary tools, forged role params cannot escalate, replay/expiry/foreign-token confirmations fail closed.

## 8. Testing & verification

- `tests/domain/intelligenceCore.test.ts` — registry, grounding, confirmation lifecycle, bulk, adversarial inputs.
- `tests/domain/intelligenceCoreOrb.test.ts` — orb state machine.
- `tests/domain/i18nCoverage.test.ts` — Core UI key coverage EN+AR.
- `tests/e2e/intelligence-core.spec.ts` — browser matrix (EN + AR + mobile): section load, grounded query, floating Core, no mobile overflow.

## 9. Ops runbook

- **Denied tool**: check the tool name against `TOOL_REGISTRY`; FORBIDDEN tools are intentional.
- **Expired confirmation**: 410 — ask for the action again (fresh token).
- **Bulk partial failure**: response includes per-id `failures[]`; audit records `{ok, failed, total}`.
- **Model-less by design**: the Core never depends on Gemini availability; replies degrade to honest "no data" rather than fabricated answers.