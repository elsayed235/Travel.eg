# DAYGI 2.0 SPECIFICATION
## The Natural-Language Control Surface for the Dahab Native OS

---

## 1. Executive Summary & Philosophy

**DayGI 2.0** is not a chatbot and not a siloed AI toy. It is the **Natural-Language Control Surface** of the Dahab Tourism Platform.

* **Deterministic Platform**: Controls the **TRUTH** (Cloud SQL, Ledger, Inventory Holds, Availability, Identity, Double-Entry Accounting).
* **DayGI 2.0**: Controls the **EXPERIENCE** (Intent Extraction, Dynamic Contextual Guidance, Grounded Proposal Structuring, Conversational Explanations).

DayGI 2.0 operates strictly under three operational modes:
1. **DISCOVER (Mode A)**: Rapid local situational awareness, seafood dining, shore snorkeling, time-window recommendations without itinerary changes.
2. **PLAN (Mode B)**: Itinerary pace evaluation, schedule adjustments, budget health audits, and proposal of non-destructive schedule shifts.
3. **ACT (Mode C)**: Direct verified bookings, dynamic weather/disruption recovery, price reconciliation, and supplier auto-reassignment—all executed through deterministic business services with mandatory audit trails.

---

## 2. Intent Classification Taxonomy

| Intent Code | Mode | Description | Example Query |
| :--- | :--- | :--- | :--- |
| `WHAT_SHOULD_I_DO_NOW` | `DISCOVER` | Immediate free-time window guidance | "معايا ساعتين وقريب من اللايتهاوس" |
| `DAILY_BRIEFING` | `DISCOVER` | Coastal status, marine window, day schedule | "موجز اليوم وحالة البحر" |
| `DISCOVER_FOOD` | `DISCOVER` | Verified local seafood, Bedouin dining | "أرخص وألذ سمك طازج على البحر بعد الغطس" |
| `GENERAL_DISCOVERY` | `DISCOVER` | Activities, wind conditions, gear advice | "عايز كايت سيرفنج في اللاجونا" |
| `RELAX_TOMORROW` | `PLAN` | Pacing optimization, shifting high-intensity items | "خلّي يوم بكرة أهدى وأقل إجهاداً" |
| `BUDGET_OPTIMIZE` | `PLAN` | Spend audit, target variance, savings tips | "ميزانيتي ١٥٠٠٠ وعايز أشوف وضعي وتوفير ممكن" |
| `EVALUATE_PACE` | `PLAN` | Itinerary density check | "الجدول مضغوط ولا مريح؟" |
| `BOOK_EXPERIENCE` | `ACT` | Direct inventory hold & verified checkout | "احجز لي غطسة كانيون لبكرة الصبح" |
| `RECOVER_TRIP` | `ACT` | Weather disruption substitution & price variance | "الغطسة اتلغت بسبب الرياح، عايز بديل فوري" |
| `OPS_ESCALATION` | `ACT` | Operations console supplier dispatch/reassignment | "إعادة تسكين الحجوزات المعلقة" |

---

## 3. UI Action Card Schemas

DayGI 2.0 delivers structured UI cards paired with its conversational responses:

1. **`BOOKING_CONFIRMATION` (`bookingReview`)**:
   - SKU details, verified supplier, unit price, date, time slot, guest count, cancellation terms.
   - Dual actions: Direct Hold/Confirm (`CONFIRM_DIRECT_BOOKING`) or full payment handoff (`BookNowCommerceModal`).
2. **`TRIP_CHANGE` (`proposedShift`)**:
   - Activity ID, original day, proposed day, new time slot, impact rationale.
   - Action: `APPLY_TRIP_SHIFT` committing to Cloud SQL trip items.
3. **`RECOVERY_PROPOSAL` (`recoveryProposal`)**:
   - Disruption reason (e.g. CDWS wind alert), original item (struck through), verified substitute, price difference EGP.
   - Action: `EXECUTE_TRIP_RECOVERY` syncing ledger & itinerary.
4. **`BUDGET_ANALYSIS` (`budgetAnalysis`)**:
   - Current spend, target budget, health status, category breakdown, actionable savings items.
   - Action: `APPLY_BUDGET_OPTIMIZATION`.
5. **`DAILY_BRIEFING` (`dailyBriefing`)**:
   - Timeline cards, free windows, CDWS marine flag status, water temp, visibility.
6. **`OPS_SUPPORT` (`opsSupport`)**:
   - Pending unassigned bookings, supplier telemetry, automated re-dispatch button.

---

## 4. Grounding & Confidence

Every DayGI response includes a **`sourceConfidence`** payload:
* `source`: `VERIFIED_FACT` (authoritative db query) or `CURATED_DAHAB_CONTEXT` (local field knowledge).
* `freshness`: Synchronization timestamp (e.g., "Live - 2 min ago").
* `confidenceScore`: Metric from 0.00 to 1.00 indicating grounding certainty.
* `whyThis`: Transparent human rationale explaining why Dahab local context justifies this specific recommendation.
