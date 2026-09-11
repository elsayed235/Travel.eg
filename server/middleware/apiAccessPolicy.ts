import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './correlationMiddleware';

type Role = 'Traveler' | 'Supplier' | 'Operations' | 'Product' | 'Admin';
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Rule {
  /** Matched against the path after /api, e.g. '/commerce/ledger'. */
  pattern: RegExp;
  methods?: Method[];
}

interface RoleRule extends Rule {
  roles: Role[];
}

/**
 * Central access policy for /api.
 *
 * Before this existed, requireAuth was applied to exactly one router
 * (/api/dahab/admin). Everything else — checkout, refunds, the ledger, the
 * operations overview, supplier dashboards including payout IBANs — answered
 * anonymous requests. Rather than hunting ~120 individual handlers, the default
 * is now "authentication required" and exceptions are listed explicitly here.
 *
 * Adding a route therefore makes it private by default. That is the point: the
 * failure mode of forgetting to update this file is a 401, not a data breach.
 */

/** Endpoints that must work before a session exists, or that are genuinely public. */
const PUBLIC_RULES: Rule[] = [
  // Session establishment and teardown.
  { pattern: /^\/auth\/(register|login|firebase-session|logout)$/, methods: ['POST'] },
  { pattern: /^\/health$/, methods: ['GET'] },

  // Anonymous product analytics ingestion. The handler whitelists event names
  // and strips PII, so the exposure is bounded by design.
  { pattern: /^\/analytics\/events$/, methods: ['POST'] },
  { pattern: /^\/media\/sync$/, methods: ['GET'] },

  // Destination knowledge: the public marketing and discovery surface.
  // /dahab/admin is excluded below and carries its own auth.
  { pattern: /^\/dahab\/(?!admin)/, methods: ['GET'] },

  // Ambient conditions shown on the public homepage.
  { pattern: /^\/telemetry\/(weather|cameras)$/, methods: ['GET'] },
  // Modeled sea state — same ambient class as weather/cameras (no PII, read-only,
  // 503 when the model run is missing). Powers the public discovery conditions strip.
  { pattern: /^\/telemetry\/marine$/, methods: ['GET'] },

  // Research-grounded homepage handbook (season / experiences / landmarks / safety).
  { pattern: /^\/research\/dahab-overview$/, methods: ['GET'] },

  // Browsing the catalogue and checking prices before signing up.
  { pattern: /^\/inventory\/[^/]+$/, methods: ['GET'] },
  { pattern: /^\/commerce\/availability$/, methods: ['POST'] },

  // Spatial helpers used by the anonymous homepage ("I have two hours").
  { pattern: /^\/context\//, methods: ['GET', 'POST'] },

  // Hotels catalogue: browsing the list, filters and per-hotel detail before
  // signing up. Bookability itself runs through /commerce/availability.
  { pattern: /^\/hotels(\/|$)/, methods: ['GET'] },

  // Accommodations catalogue (generalized successor to hotels): browsing,
  // per-property detail, and NL search-intent parsing before signing up.
  // Admin CRUD paths are excluded and carry role rules below.
  { pattern: /^\/accommodations$/, methods: ['GET'] },
  { pattern: /^\/accommodations\/search-intent$/, methods: ['POST'] },
  { pattern: /^\/accommodations\/[^/]+$/, methods: ['GET'] },

  // Rentals catalogue: browsing, per-listing detail, availability checks and
  // server-computed quotes before signing up. Provider/admin management paths
  // (/rentals/provider, /rentals/:id/...) are excluded and carry role rules
  // below.
  { pattern: /^\/rentals$/, methods: ['GET'] },
  { pattern: /^\/rentals\/(?!provider)[^/]+$/, methods: ['GET'] },
  { pattern: /^\/rentals\/(check-availability|quote)$/, methods: ['POST'] },

  // Transfer route discovery: browsing origins and quoting prices before signup.
  { pattern: /^\/transfers\/(origins|route|resolve-geo)$/, methods: ['GET'] },

  // The public trip planner.
  { pattern: /^\/trip\/generate$/, methods: ['POST'] },

  // CMS public content APIs — published content for the website.
  { pattern: /^\/content\//, methods: ['GET'] },

  // Verified-stay reviews for a supplier (blueprint row #14). Public read:
  // the trust signal is worthless if only signed-in users can see it. The
  // handler exposes display names and aggregates only — never emails/phones.
  // Writing, responding and moderating stay on the authenticated default.
  { pattern: /^\/reviews\/supplier\/[^/]+$/, methods: ['GET'] },

  // Supplier trust aggregates (reliability score, reef-positive score, and the
  // public reef-positive list). Same rationale as the reviews read: these are
  // display aggregates — rates and point totals, never names/contacts — and a
  // trust badge hidden behind sign-in is a badge nobody sees.
  { pattern: /^\/suppliers\/[^/]+\/reliability$/, methods: ['GET'] },
  { pattern: /^\/suppliers\/[^/]+\/reef-score$/, methods: ['GET'] },
  { pattern: /^\/reef-positive-suppliers$/, methods: ['GET'] },
  // The conservation scoring rubric behind the reef badges — public like the
  // reef-positive list. No personal data, just action-type point values.
  { pattern: /^\/reef-action-types$/, methods: ['GET'] },

  // Bundle catalogue read + the cart discount calculator. Both are display
  // aggregates / arithmetic over the already-public catalogue (names,
  // discount percentages, price math) — the marketing surface is worthless if
  // a visitor must sign in to see a promo. Mutations stay gated by the role
  // rules below; note compute-discount must be excluded there explicitly.
  { pattern: /^\/bundles$/, methods: ['GET'] },
  { pattern: /^\/bundles\/compute-discount$/, methods: ['POST'] },

  // Supplier availability calendar (blueprint row #12). The monthly view is
  // public so travel planners can show blocked dates without sign-in.
  // (Path is relative to the /api mount — a leading /api here never matched.)
  { pattern: /^\/suppliers\/[^/]+\/availability$/, methods: ['GET'] }
];

/**
 * Role requirements, applied after authentication. First match wins, so put
 * the most specific patterns first.
 */
const ROLE_RULES: RoleRule[] = [
  // Financial records and reconciliation.
  { pattern: /^\/commerce\/ledger/, roles: ['Operations', 'Admin'] },
  { pattern: /^\/commerce\/refund$/, roles: ['Operations', 'Admin'] },

  // Back-office consoles.
  { pattern: /^\/operations\//, roles: ['Operations', 'Admin'] },
  { pattern: /^\/suppliers/, roles: ['Supplier', 'Operations', 'Admin'] },

  // Market intelligence and autonomous data operations, including snapshot
  // rollback and schedule policy changes.
  { pattern: /^\/market\//, roles: ['Product', 'Operations', 'Admin'] },
  { pattern: /^\/intelligence\//, roles: ['Product', 'Operations', 'Admin'] },
  // Dahab Intelligence Core — admin control plane (deterministic tool router).
  { pattern: /^\/intelligence-core\//, roles: ['Operations', 'Admin'] },

  // Accommodations admin surface: create/edit/deactivate properties and
  // manage their external reference links.
  { pattern: /^\/admin\/accommodations(\/|$)/, roles: ['Operations', 'Admin', 'Product'] },

  // Rental provider and admin surfaces.
  { pattern: /^\/rentals\/provider/, roles: ['Supplier', 'Operations', 'Admin'] },
  { pattern: /^\/rentals\/[^/]+\/maintenance-blocks/, roles: ['Supplier', 'Operations', 'Admin'] },
  { pattern: /^\/rentals\/[^/]+\/status$/, roles: ['Operations', 'Admin'] },
  { pattern: /^\/rental-bookings\/provider/, roles: ['Supplier', 'Operations', 'Admin'] },
  { pattern: /^\/rental-bookings\/[^/]+\/(accept|reject|mark-returned|complete)$/, roles: ['Supplier', 'Operations', 'Admin'] },

  // /dahab/commerce is publicly readable (public /dahab GET surface), but the
  // mutation endpoints drive the back-office data-ops machine: triggering and
  // retargeting schedule policies, resolving the review queue, creating and
  // rolling back knowledge snapshots, acknowledging/resolving alerts, and
  // resetting the market-freshness circuit breakers. A Traveler must never do
  // these. Refresh is read-mostly (product-market data) so Product is included.
  { pattern: /^\/dahab\/commerce\/refresh$/, roles: ['Product', 'Operations', 'Admin'] },
  { pattern: /^\/dahab\/commerce\/(review-queue\/[^/]+\/resolve|jobs\/|run-all-scheduled|alerts\/[^/]+\/(acknowledge|resolve)|snapshots\/|circuit-breakers\/)/, roles: ['Operations', 'Admin'] },

  // Answering a traveler's support message is an Operations act; sending one
  // and reading your own thread is not, and is left to the default (any
  // authenticated user), with the handler scoping the list to its owner.
  { pattern: /^\/support\/messages\/[^/]+\/reply$/, roles: ['Operations', 'Admin'] },
  // Escalation, assignment, resolve, close — Operations/Admin only.
  // (Patterns are mount-relative: an /api/… prefix here never matched and
  // silently left these on the authenticated default.)
  { pattern: /^\/support\/messages\/[^/]+\/(escalate|assign|resolve|close)$/, roles: ['Operations', 'Admin'] },
  { pattern: /^\/support\/escalation-queue$/, roles: ['Operations', 'Admin'] },
  { pattern: /^\/support\/counts$/, roles: ['Operations', 'Admin'] },

  // Outbound messaging to real drivers and dive centres.
  { pattern: /^\/sms\//, roles: ['Operations', 'Admin'] },

  // Dynamic bundle management — mutations are Admin/Operations only. The
  // public read (GET /bundles) and the cart calculator
  // (POST /bundles/compute-discount) are allowlisted above, so compute-
  // discount is excluded here; GET /bundles/:id deliberately falls through to
  // the authenticated default (any signed-in user may view a bundle).
  { pattern: /^\/bundles$/, methods: ['POST'], roles: ['Admin', 'Operations'] },
  { pattern: /^\/bundles\/(?!compute-discount)[^/]+$/, methods: ['POST', 'PATCH', 'DELETE'], roles: ['Admin', 'Operations'] },

  // Fraud detection — Admin/Operations read, Admin-only write.
  { pattern: /^\/fraud\//, roles: ['Admin', 'Operations'] },

  // Review moderation (blueprint row #14): the pending queue and approve/
  // flag/hide actions are Operations acts. A supplier answers their own
  // approved reviews through /reviews/:id/respond, which stays on the
  // authenticated default and resolves the acting supplier from the session.
  { pattern: /^\/reviews\/pending$/, roles: ['Operations', 'Admin'] },
  { pattern: /^\/reviews\/[^/]+\/moderate$/, roles: ['Operations', 'Admin'] },

  // Payout settlement (blueprint row #12): the pending queue is ops-only.
  // Supplier payout reads use the authenticated default (own-supplier guard).
  { pattern: /^\/payouts\/pending$/, roles: ['Operations', 'Admin'] },

  // Ops-broadcast push sends (per-user subscribe/unsubscribe under /push/
  // stays on the authenticated default: any signed-in user, own browsers).
  { pattern: /^\/admin\/push\//, roles: ['Operations', 'Admin'] },

  // Background job control and the event bus.
  { pattern: /^\/jobs\//, roles: ['Operations', 'Admin'] },
  { pattern: /^\/events\//, roles: ['Operations', 'Admin'] },

  // Beta experiment flags and telemetry dashboards (write + read of aggregates).
  { pattern: /^\/daygi\/beta\/(dashboard|experiments|run-scenarios|generate-weekly-report)/, roles: ['Product', 'Operations', 'Admin'] },

  // Test harness, if it has been explicitly enabled.
  { pattern: /^\/testing\//, roles: ['Admin'] },

  // CMS content management — Operations and Admin can publish, Product can draft.
  { pattern: /^\/admin\/content\//, roles: ['Operations', 'Admin', 'Product'] }
];

function matches(rule: Rule, path: string, method: string): boolean {
  if (!rule.pattern.test(path)) return false;
  if (!rule.methods) return true;
  return rule.methods.includes(method as Method);
}

export function isPublicApiPath(path: string, method: string): boolean {
  return PUBLIC_RULES.some(rule => matches(rule, path, method));
}

/**
 * Role requirements for a path, applied after authentication. First match
 * wins, so put the most specific patterns first. A rule that declares
 * `methods` only applies to those methods — the method must be supplied for
 * that check to happen (the middleware always supplies it; a methodless query
 * matches method-declaring rules as a conservative read of written intent).
 */
export function requiredRolesFor(path: string, method?: string): Role[] | null {
  const m = method?.toUpperCase();
  const rule = ROLE_RULES.find(
    r => r.pattern.test(path) && (!r.methods || !m || r.methods.includes(m as Method))
  );
  return rule ? rule.roles : null;
}

/**
 * Deny-by-default gate. Mount on /api AFTER optionalAuth has run.
 */
export function apiAccessPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // req.path here is relative to the mount point (/api).
  const path = req.path;
  const method = req.method.toUpperCase();

  if (isPublicApiPath(path, method)) {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({
      type: 'https://dahab.travel/errors/unauthorized',
      title: 'Authentication Required',
      status: 401,
      // Unknown /api paths intentionally return this same 401 (deny-by-
      // default: the failure mode of a forgotten route is "sign in", not a
      // breach). Say so, or QA chases a session bug when the path is wrong.
      detail: 'Sign in to access this resource. Unknown /api paths return this same response by design — if you are signed in, verify the route path.',
      instance: req.originalUrl,
      correlationId: req.correlationId
    });
  }

  const roles = requiredRolesFor(path, method);
  if (roles && !roles.includes(req.user.role)) {
    return res.status(403).json({
      type: 'https://dahab.travel/errors/forbidden',
      title: 'Forbidden',
      status: 403,
      // Deliberately does not echo the caller's own role back; that is a small
      // information leak and it does not help a legitimate user.
      detail: 'Your account does not have permission to access this resource.',
      instance: req.originalUrl,
      correlationId: req.correlationId
    });
  }

  next();
}
