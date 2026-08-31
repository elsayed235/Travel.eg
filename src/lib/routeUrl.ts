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
   * The product a checkout page should open on.
   *
   * Book Now used to always open on its full grid, so "book this experience"
   * and "book this itinerary line" had nowhere to point and did not exist.
   * Carried in the URL like every other selection, which also makes a specific
   * checkout linkable and survivable across a refresh.
   */
  skuId?: string;
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
  '/experiences'
] as const satisfies readonly AppRoute[];

/** Empty when ROUTES covers the union. Anything else is a compile error below. */
type MissingRoutes = Exclude<AppRoute, (typeof ROUTES)[number]>;
const _routesAreExhaustive: MissingRoutes extends never ? true : MissingRoutes = true;
void _routesAreExhaustive;

export const DEFAULT_ROUTE: AppRoute = '/home';

const ROUTE_SET = new Set<string>(ROUTES);

export const isAppRoute = (value: string): value is AppRoute => ROUTE_SET.has(value);

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
 * An unrecognised pathname resolves to DEFAULT_ROUTE rather than throwing: the
 * address bar is user-editable and reachable from stale links, and a typo there
 * should land on the homepage, not a blank screen.
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

  const route = isAppRoute(normalized) ? normalized : DEFAULT_ROUTE;

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
