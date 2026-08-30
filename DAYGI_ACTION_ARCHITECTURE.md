# DAYGI 2.0 ACTION ARCHITECTURE
## End-to-End Execution Pipeline & Deterministic Service Integration

---

## 1. Architectural Diagram

```
+-------------------------------------------------------------------------------+
|                                 USER CLIENT                                   |
|   - Chat Bubble (Arabic/English)                                              |
|   - Spatial Context: Location (e.g. Lighthouse), Window (e.g. 120 min)        |
|   - Structured Action Cards (Booking / Shift / Recovery / Budget / Briefing)  |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼  POST /api/daygi/query
+-------------------------------------------------------------------------------+
|                       DAYGI REASONING ENGINE (Server)                         |
|   1. Intent Classifier: Deterministic & Rule-Grounding                        |
|   2. Context Aggregator: Active Itinerary, Marine Telemetry, Local SKUs       |
|   3. Gemini Grounding Layer: Structured Rationale & Nuanced Explanations       |
|   4. Mode Assignment: DISCOVER (A), PLAN (B), ACT (C)                         |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼ Returns DayGiResponse + Action Data
+-------------------------------------------------------------------------------+
|                         CLIENT ACTION REVIEW & APPROVAL                       |
|   - User views structured card, price variance, terms, and "Why This?" logic  |
|   - User clicks explicit action button: "Apply Shift" / "Confirm & Hold"      |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼  POST /api/daygi/action/execute
+-------------------------------------------------------------------------------+
|                        SAFETY GATEWAY & ACTION ROUTER                         |
|   - Role-Based Access Control (Traveler vs Supplier vs Ops vs Admin)          |
|   - Idempotency Key Validation                                                |
|   - Transactional Boundary (db.runInTransaction)                              |
+-------------------------------------------------------------------------------+
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
          tripService.ts      commerceService.ts   recoveryService.ts
          - Shift Trip Item   - Hold Inventory     - Item Substitution
          - Update Timeline   - Double-entry hold  - Price Variance
                   │                  │                  │
                   └──────────────────┼──────────────────┘
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
|                           AUTHORITATIVE CLOUD SQL                             |
|   - Trips / TripItems Table                                                   |
|   - Inventory & Holds Table                                                   |
|   - Ledger Entries Table (Strict Double-Entry)                                |
|   - Audit Logs Table (Action Key, Actor, Payload, AuditLogId)                 |
+-------------------------------------------------------------------------------+
```

---

## 2. Intent-to-Action Mapping Matrix

| User Trigger | Intent Code | Target Service | Deterministic Method | Cloud SQL Table Mutated |
| :--- | :--- | :--- | :--- | :--- |
| "خلّي يوم بكرة أهدى" | `RELAX_TOMORROW` | `tripService` | `shiftItem(fromDay, toDay)` | `trip_items` |
| "احجز لي غطسة كانيون" | `BOOK_EXPERIENCE` | `commerceService` | `createHold(skuId, tripId, date)` | `holds`, `inventory` |
| "البحر عالي والغطسة اتلغت" | `RECOVER_TRIP` | `recoveryService`| `substituteItem(...)` | `trip_items`, `ledger_entries` |
| "وفّر في الميزانية" | `BUDGET_OPTIMIZE` | `tripService` | `optimizeBudget(...)` | `trip_items` |
| "إعادة تسكين الموردين" | `OPS_ESCALATION` | `supplierService`| `reassignPendingBookings()` | `bookings`, `suppliers` |

---

## 3. The 5 Cardinal Rules of DayGI Action Safety

1. **No Direct Model Mutations**: LLMs never issue raw SQL or mutate application objects directly.
2. **Explicit Confirmation**: Every financial transaction or disruptive itinerary modification requires an explicit user click on a structured action card.
3. **Double-Entry Ledger Integrity**: Every booking, hold, recovery, or substitution records offsetting debit/credit lines in the authoritative ledger.
4. **Idempotency by Default**: Action execution requests generate and enforce unique `DAYGI-ACTION-{TIMESTAMP}` tokens to prevent double-execution.
5. **Auditable Lineage**: Every action execution writes an immutable audit record linking the prompt context, intent, user identity, and transaction result.
