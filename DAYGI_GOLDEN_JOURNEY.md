# DAYGI 2.0 GOLDEN JOURNEYS
## Three Complete End-to-End Scenarios Across Discover, Plan, and Act Modes

---

## Journey 1: Mode A (DISCOVER) — The 2-Hour Lighthouse Window

### Scenario:
Ahmed finished breakfast at Ralph's German Bakery and has a 2-hour window before his afternoon dive brief. He is located near Lighthouse Promenade.

1. **User Prompt**: `"معايا ساعتين وأنا قريب من اللايتهاوس، أعمل إيه؟"`
2. **Intent Classification**:
   - `intent`: `WHAT_SHOULD_I_DO_NOW`
   - `mode`: `DISCOVER`
   - `parameters`: `{ location: "Lighthouse", minutes: 120 }`
3. **DayGI Grounded Response**:
   - Conversational Arabic & English response explaining that calm seas make a shore snorkel effortless right from Lighthouse bay.
   - **Structured Action Card (`RECOMMENDATION`)**:
     - Location: Lighthouse Promenade
     - Duration: 90 minutes
     - Gear rental: EGP 100 on promenade
     - Practical Tips: No boat needed, gentle slope entrance, water temp 24°C.
     - **"Why This?" Rationale**: Zero transit delay, high reef visibility.
4. **Follow-ups Rendered**:
   - "Where should we eat seafood after?"
   - "Can we book a dive for tomorrow?"

---

## Journey 2: Mode B (PLAN) — Pacing Relaxation & Budget Health

### Scenario:
Ahmed looks at Day 3 and feels the schedule has back-to-back intense desert safari and deep canyon diving. He asks DayGI to make tomorrow less exhausting while maintaining his budget.

1. **User Prompt**: `"خلّي يوم بكرة أهدى وأقل إجهاداً وميزانيتي ما تزيدش"`
2. **Intent Classification**:
   - `intent`: `RELAX_TOMORROW`
   - `mode`: `PLAN`
   - `parameters`: `{ fromDay: 3, targetPace: "Relaxed" }`
3. **DayGI Grounded Response**:
   - Explains that shifting the deep Canyon Dive from Day 3 to Day 4 morning gives a tranquil seaside recovery window on Day 3.
   - **Structured Action Card (`TRIP_CHANGE`)**:
     - Activity: `Canyon Morning Guided Deep Dive`
     - From Day: Day 3
     - To Day: Day 4 (10:00 AM)
     - Impact: Moves high-intensity dive to rested morning; inserts seafront lunch on Day 3.
4. **User Action**:
   - Ahmed reviews the proposed shift card and clicks **"Apply Change to My Trip"**.
5. **Deterministic Execution**:
   - `tripService.shiftItem()` runs inside a database transaction.
   - Cloud SQL `trip_items` updated.
   - `DayGiConciergeView` and `MyTripView` immediately reflect the adjusted timeline with zero reload.

---

## Journey 3: Mode C (ACT) — Real-Time Weather Disruption & Direct Recovery

### Scenario:
CDWS issues a high wind alert for the northern gulf, temporarily restricting boat and deep canyon diving.

1. **User Prompt**: `"الغطسة اتلغت بسبب الرياح، عايز بديل فوري"`
2. **Intent Classification**:
   - `intent`: `RECOVER_TRIP`
   - `mode`: `ACT`
   - `parameters`: `{ disruption: "HIGH_WIND", originalActivity: "act-canyon-dive" }`
3. **DayGI Grounded Response**:
   - Reassures traveler and suggests sheltered Laguna Windsurfing & Stand-Up Paddleboarding which thrives in high wind conditions.
   - **Structured Action Card (`RECOVERY_PROPOSAL`)**:
     - Original Item: `Canyon Dive` (EGP 2,700 — struck through)
     - Alternative: `Laguna Sheltered Windsurfing & SUP` (EGP 1,800)
     - Price Variance: -EGP 900 credit credited to traveler wallet.
4. **User Action**:
   - Ahmed clicks **"Execute Substitution & Reconcile"**.
5. **Deterministic Execution**:
   - `recoveryService.substituteItem()` executes.
   - Authoritative double-entry ledger records refund of EGP 900 variance and holds slot with Laguna Water Sports center.
   - Audit log recorded with permanent tracking ID `AUD-RECOV-...`.
