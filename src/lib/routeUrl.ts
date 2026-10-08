import type { AppRoute } from '../types';

/**
 * Translation between the AppRoute union and the browser's address bar.
 *
 * Navigation used to be pure React state: navigateTo set currentRoute and
 * nothing else. The address bar therefore never moved, which meant the browser
 * Back button left the app entirely instead of going back a page, a refresh
 * dropped the traveler on the homepage, no page could be linked or shared, and
 * MyTripView's "share my trip" button copied window.location.href — the
 * homepage URL, for every trip.
 */

export interface RouteParams {
  dayId?: number;
  activityId?: string;
  bookingId?: string;
  programSlug?: string;
  experienceSlug?: string;
  /**
   * The hotel opened on the /hotels page, carried as a path segment exactly
   * like program/experience slugs: `/hotels/:slug` resolves to route
   * '/hotels' with hotelSlug set.
   */
  hotelSlug?: string;
  /**
   * The rental opened on the /rentals page, carried as a path segment exactly
   * like hotel/program slugs: `/rentals/:slug` resolves to route '/rentals'
   * with rentalSlug set.
   */
  rentalSlug?: string;
  /**
   * The product a checkout page should open on.
   *
   * Book Now used to always open on its full grid, so "book this experience"
   * and "book this itinerary line" had nowhere to point and did not exist.
   * Carried in the URL like every other selection, which also makes a specific
   * checkout linkable and survivable across a refresh.
   */
  skuId?: string;
  /**
   * The CMS draft preview token — opaque, single-purpose, never a selection
   * id. Like hotel/rental slugs it travels as a path segment
   * (`/preview/:token`) so preview links survive refresh and sharing; the
   * preview view parses it from the pathname (see CmsPreviewPage).
   */
  previewToken?: string;
}

/**
 * Runtime mirror of the AppRoute union.
 *
 * A union is erased at compile time, so matching an incoming pathname needs a
 * real array. The `satisfies` clause stops a typo here, and MissingRoutes below
 * stops the list from silently falling behind when a route is added to the
 * union — that would not be a type error on its own, it would just be a route
 * that mysteriously 404s to /home.
 */
export const ROUTES = [
  '/',
  '/home',
  '/discover',
  '/memories',
  '/live',
  '/daygi',
  '/ai-director',
  '/plan',
  '/explore',
  '/plan-for-me',
  '/trip-builder',
  '/trip-preview',
  '/my-trip',
  '/my-trip/day',
  '/my-trip/activity',
  '/bookings',
  '/quick-book',
  '/book-now',
  '/food',
  '/transfers',
  '/transfers/local',
  '/transfers/intercity',
  '/help',
  '/change-recovery',
  '/departure',
  '/post-trip',
  '/profile',
  '/ops-console',
  '/supplier-portal',
  '/market-intelligence',
  '/arrive',
  '/first-two-hours',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/verify',
  '/auth/callback',
  '/programs',
  '/experiences',
  '/about',
  '/faq',
  '/travel-guides',
  '/listings',
  '/restaurants',
  '/hotels',
  '/accommodations',
  '/admin/content',
  '/rentals',
  '/rentals-page',
  '/attractions',
  '/preview',
  '/design',
  '/404'
] as const satisfies readonly AppRoute[];

/** Empty when ROUTES covers the union. Anything else is a compile error below. */
type MissingRoutes = Exclude<AppRoute, (typeof ROUTES)[number]>;
const _routesAreExhaustive: MissingRoutes extends never ? true : never = true as MissingRoutes extends never ? true : never;
void _routesAreExhaustive;

export const DEFAULT_ROUTE: AppRoute = '/home';

const ROUTE_SET = new Set<string>(ROUTES);

export const isAppRoute = (value: string): value is AppRoute => ROUTE_SET.has(value);

/**
 * Path prefixes that carry a selection segment (canonical detail URLs).
 * Used by isKnownClientPath so the server's SPA fallback can tell a
 * shareable deep link from a typo without duplicating the parser.
 */
const SLUG_PREFIXES = [
  '/programs/', '/program/',
  '/experiences/', '/experience/', '/places/', '/place/',
  '/hotels/', '/rentals/', '/preview/',
];

/**
 * True for every pathname the client can render: exact routes plus canonical
 * detail URLs. The production SPA fallback serves 404 + noindex for anything
 * else instead of silently rendering the homepage.
 */
export function isKnownClientPath(pathname: string): boolean {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (isAppRoute(normalized)) return true;
  return SLUG_PREFIXES.some(prefix => normalized.startsWith(prefix) && normalized.length > prefix.length);
}

/**
 * Selection ids travel as query parameters rather than path segments.
 *
 * `/my-trip/day/3` would collide with the route union — every id would need its
 * own entry — whereas `/my-trip/day?day=3` keeps the pathname exactly equal to
 * the AppRoute value, so matching stays a set lookup instead of a parser.
 */
const PARAM_KEYS = { dayId: 'day', activityId: 'activity', bookingId: 'booking', programSlug: 'slug', experienceSlug: 'slug', skuId: 'sku' } as const;

/** Builds the address-bar path for a route and its selection. */
export function urlFromRoute(route: AppRoute, params?: RouteParams): string {
  if (route === '/programs' && params?.programSlug) {
    return `/programs/${encodeURIComponent(params.programSlug)}`;
  }
  if (route === '/experiences' && params?.experienceSlug) {
    return `/experiences/${encodeURIComponent(params.experienceSlug)}`;
  }
  if (route === '/hotels' && params?.hotelSlug) {
    return `/hotels/${encodeURIComponent(params.hotelSlug)}`;
  }
  if (route === '/rentals' && params?.rentalSlug) {
    return `/rentals/${encodeURIComponent(params.rentalSlug)}`;
  }
  if (route === '/preview' && params?.previewToken) {
    return `/preview/${encodeURIComponent(params.previewToken)}`;
  }

  const query = new URLSearchParams();

  if (params?.dayId !== undefined && Number.isFinite(params.dayId)) {
    query.set(PARAM_KEYS.dayId, String(params.dayId));
  }
  if (params?.activityId) query.set(PARAM_KEYS.activityId, params.activityId);
  if (params?.bookingId) query.set(PARAM_KEYS.bookingId, params.bookingId);
  if (params?.programSlug) query.set(PARAM_KEYS.programSlug, params.programSlug);
  if (params?.experienceSlug) query.set(PARAM_KEYS.experienceSlug, params.experienceSlug);
  if (params?.skuId) query.set(PARAM_KEYS.skuId, params.skuId);

  const search = query.toString();
  return search ? `${route}?${search}` : route;
}

/**
 * Reads a route and its selection back out of a URL.
 *
 * An unrecognised pathname resolves to '/404' rather than throwing or
 * dropping the traveler on the homepage: the address bar is user-editable
 * and reachable from stale links, and a typo should explain itself instead
 * of silently rendering unrelated content (which also poisons SEO).
 */
export function routeFromUrl(pathname: string, search = ''): { route: AppRoute; params: RouteParams } {
  // Trailing slashes are equivalent to their bare form ('/explore/' is
  // '/explore'), but '/' itself must survive the trim.
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  // Handle direct canonical program slugs: /programs/dahab-first-timer or /program/dahab-first-timer
  if (normalized.startsWith('/programs/') || normalized.startsWith('/program/')) {
    const slug = normalized.replace(/^\/(?:programs|program)\//, '').trim();
    if (slug) {
      return { route: '/programs', params: { programSlug: decodeURIComponent(slug) } };
    }
  }

  // Handle direct canonical experience/place slugs: /experiences/:slug or /places/:slug
  if (
    normalized.startsWith('/experiences/') ||
    normalized.startsWith('/experience/') ||
    normalized.startsWith('/places/') ||
    normalized.startsWith('/place/')
  ) {
    const slug = normalized
      .replace(/^\/(?:experiences|experience|places|place)\//, '')
      .trim();
    if (slug) {
      return { route: '/experiences', params: { experienceSlug: decodeURIComponent(slug) } };
    }
  }

  // Handle direct canonical hotel slugs: /hotels/:slug
  if (normalized.startsWith('/hotels/')) {
    const slug = normalized.replace(/^\/hotels\//, '').trim();
    if (slug) {
      return { route: '/hotels', params: { hotelSlug: decodeURIComponent(slug) } };
    }
  }

  // Handle direct canonical rental slugs: /rentals/:slug
  if (normalized.startsWith('/rentals/')) {
    const slug = normalized.replace(/^\/rentals\//, '').trim();
    if (slug) {
      return { route: '/rentals', params: { rentalSlug: decodeURIComponent(slug) } };
    }
  }

  // CMS draft preview links: /preview/:token. The token round-trips through
  // params so the canonical-URL effect preserves it instead of stripping it
  // to bare /preview (which rendered every shared link expired).
  if (normalized.startsWith('/preview/')) {
    const token = normalized.replace(/^\/preview\//, '').split('/')[0].trim();
    if (token) {
      return { route: '/preview', params: { previewToken: decodeURIComponent(token) } };
    }
  }

  const route = isAppRoute(normalized) ? normalized : ('/404' as AppRoute);

  const query = new URLSearchParams(search);
  const params: RouteParams = {};

  const rawDay = query.get(PARAM_KEYS.dayId);
  if (rawDay !== null) {
    const parsed = Number(rawDay);
    if (Number.isInteger(parsed)) params.dayId = parsed;
  }

  const activityId = query.get(PARAM_KEYS.activityId);
  if (activityId) params.activityId = activityId;

  const bookingId = query.get(PARAM_KEYS.bookingId);
  if (bookingId) params.bookingId = bookingId;

  const programSlug = query.get(PARAM_KEYS.programSlug) || query.get('id') || query.get('program');
  if (programSlug) params.programSlug = programSlug;

  const experienceSlug = query.get(PARAM_KEYS.experienceSlug) || query.get('experience') || query.get('place');
  if (experienceSlug) params.experienceSlug = experienceSlug;

  const skuId = query.get(PARAM_KEYS.skuId);
  if (skuId) params.skuId = skuId;

  return { route, params };
}
