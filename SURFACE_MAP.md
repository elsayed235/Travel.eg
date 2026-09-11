# DAHAB — FRONTEND SURFACE MAP (Phase 0.5 deliverable)
*Evidence-cited classifications. Source: repo audit + live run on :3000 + baseline battery (2026-09-10).*

## 1. ROUTES → VIEW → CLASSIFICATION
| Route | View (lazy) | Class | Evidence |
|---|---|---|---|
| / /home /discover | V2HomeCockpit + CinematicVideoHero | **REDESIGN** (hero + chrome + dock; cockpit IA stays) | live screenshots; Living Chart spec |
| /explore | ExploreView | **IMPROVE** (one engine, needles, skeletons, icons) | dual-truth search, emoji pills |
| /attractions | AttractionsView | IMPROVE | BUCKET_EMOJI maps |
| /experiences[/slug] | ExperienceDetailView | IMPROVE (badges, conditions) | no availability display |
| /programs[/slug] | ProgramDetailView | KEEP | live, CMS-driven |
| /listings | ListingCard default | **REMOVE→merge into /explore** | alias surface, same corpus |
| /hotels[/slug] | AccommodationsView/Detail/Card/Map | IMPROVE (map split, badges) | NL search live, map exists |
| /restaurants | RestaurantsView | IMPROVE (shared catalogue hooks) | mapper duality with Explore |
| /food | FoodNowView | IMPROVE (SVG icons) | intent model strong; emoji sites |
| /rentals[/slug] | RentalsView/Detail/Card | KEEP | real lifecycle |
| /transfers[/local|/intercity] | TransfersHubView | KEEP | good pattern |
| /trip-builder /trip-preview | TripPlanner (+5 step views, BuildingTripState) | IMPROVE (skeleton/glass) | 467 kB chunk — split |
| /plan-for-me | PlanForMeView | KEEP | |
| /my-trip[/day|/activity] | MyTripView + sections (TripCockpitHeader, TimelineTab, BookingsTab, ToolsTab, GroupSplitCard, HeroCard, NextUp, BudgetCard) | IMPROVE (group entry, reef gauge, glass) | hub surface |
| /bookings | BookingsView + BookingTimeline + BookingManageModal + ReviewInvitations | KEEP (polish: hold timers) | timeline + reviews shipped |
| /quick-book /book-now | BookNowCommerceView/Modal | IMPROVE (hold timer, price explainer, alternatives) | |
| /live | DahabLiveView + MarineConditions | KEEP (canonical instrument; join to listings) | marine shipped |
| /daygi /ai-director | DayGiConciergeView (1,988 lines) | **REFACTOR** (split) + IMPROVE (ambient panel) | bundle, provenance |
| /help /change-recovery /arrive /first-two-hours /departure /post-trip /memories | journey sub-flows | KEEP (icons sweep) | staged model strong |
| /profile | ProfileView | IMPROVE (reviews, impact, long-stay entry) | |
| /about /faq /travel-guides | CmsStaticPage | KEEP (prerender) | CMS workflow live |
| /preview/:token | CmsPreviewPage | KEEP | expiring previews |
| /auth/* | AuthView | KEEP (captcha later) | |
| /ops-console | CommandCenterShell (19 sections + cms/*) | **REDESIGN** (attention queue landing; solid-first) | 12-charts problem |
| /supplier-portal | SupplierPortalView + RentalsProviderPanel | **IMPROVE** (calendar, revenue, analytics) | gap list |
| /market-intelligence | MarketIntelligenceView | KEEP | ops-heavy, staff |
| /404 | NotFoundView | KEEP | shipped |

## 2. SHARED COMPONENTS (KEEP — reuse-first)
TouchTarget · SafeArea · MobileSheet · DahabEmptyState · CmsImage · ChartSeasonStrip · StickyBookingBottomBar · ThumbBar · SectionReveal · ErrorBoundary (×2) · ClickableCard · DahabIcons · DahabMotifs · InternalPageHeader · SinaiFloatingQuickDock (→ de-crowd into it) · SinaiPassbookModal · EmergencyModal · OfflineTripPackModal · CmsImage · NotFoundView.

## 3. STATE / CONTEXT
Theme (6 themes) · Language (AR/EN, RTL) · UIContext (router) · AuthContext · CommerceContext · TripContext/TripOsContext (trip graph) · ItineraryContext · DahabTimeContext · useSiteTheme (CMS tokens) · useApiResource/useCmsFetch (no cache — P1).

## 4. DUPLICATED / INCONSISTENT UI (with evidence)
- Per-view mappers: Explore vs Restaurants vs SearchDrawer each map catalogue differently → shared hooks (P3).
- Card variants: AccommodationCard / HotelCard / RentalCard / ListingCard / OptionCards → one ListingCard contract (P2/P3).
- Emoji icon sets: Explore pills, Live spot pills, Attractions BUCKET_EMOJI, spontaneousMapper, food/companion/arrival glyphs (54 sites) → Lucide (P1).
- Floating clusters: DayGI FAB + EmergencyModal ring + "✨ Dahab Tools" pill on every viewport → dock (P1).
- Rescue-CSS `!important` blocks vs component hard-hex → tokens (P1).

## 5. DEAD / LOW-VALUE UI
- `/ai-director` alias (canonicalized to /daygi — keep as redirect, remove from nav) · `/memories` alias (→/post-trip) · AhmedJourneyWalkthrough (dev/staff only, tree-shaken in prod — verified absent from dist) · `/listings` (merge) · `dev-server-*.log`, `broken.tmp.mjs`, `shot4.tmp.mjs`, `codemod4.tmp.mjs`, `buildout.txt` (repo litter — leave; out of scope).

## 6. MISSING STATES (audit)
| Surface | Loading | Empty | Error | Offline |
|---|---|---|---|---|
| Home hero | static frame (ok) | n/a | telemetry fallback (ok) | ok |
| Explore | 🔶 partial skeletons | 🔶 DahabEmptyState some | 🔶 | ❌ |
| Hotels list | 🔶 | 🔶 | 🔶 | ❌ |
| Bookings | ✅ | ✅ designed | 🔶 | ❌ |
| My Trip | 🔶 | ✅ | 🔶 | ❌ |
| DayGI | ✅ | ✅ | ✅ | ❌ |
| Commerce checkout | 🔶 | n/a | ✅ (requiresSignIn) | ❌ |
| Supplier/Ops tables | 🔶 (Skeleton exists) | ✅ (EmptyState exists) | 🔶 | n/a |
→ Uniform skeleton/empty/error/offline discipline per surface (P1+P3; offline pack P7).

## 7. THEMES
6 themes verified (`data-theme-id`): charcoal-minimal · deep-reef · editorial-sand · high-contrast-pro · lagoon-breeze · sinai-midnight. High Contrast Pro = zero-transparency contract for glass.

## 8. BUDGET FACTS (for P1)
index chunk 875.52 kB (gzip 256) · vendor-firebase 749.83 kB · vendor-charts 292.99 kB · TripPlanner 467.77 kB · AccommodationsView 199.29 kB · chunkSizeWarningLimit raised to 900 (revert to real budget) · DayGiConciergeView 1,988 lines.