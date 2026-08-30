import { ProblemDetails } from '../types/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGN_IN: '/api/auth/sign-in',
  AUTH_SIGN_UP: '/api/auth/sign-up',
  AUTH_ME: '/api/auth/me',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_FIREBASE_SYNC: '/api/auth/firebase-sync',

  // Trips
  TRIPS: '/api/trips',
  TRIP_BY_ID: (id: string) => `/api/trips/${id}`,
  TRIP_ACTIVITIES: (tripId: string) => `/api/trips/${tripId}/activities`,

  // Commerce & Inventory
  HOLDS: '/api/commerce/holds',
  HOLD_BY_TOKEN: (token: string) => `/api/commerce/holds/${token}`,
  CHECKOUT: '/api/commerce/checkout',
  BOOKINGS: '/api/bookings',
  BOOKING_BY_REF: (ref: string) => `/api/bookings/${ref}`,

  // DayGI Orchestration
  DAYGI_ORCHESTRATE: '/api/daygi/orchestrate',
  DAYGI_ACTION_CONFIRM: '/api/daygi/confirm-action',
  DAYGI_TASK_STATUS: (taskId: string) => `/api/daygi/task/${taskId}`,
  DAYGI_TRIP_HEALTH: (tripId: string) => `/api/daygi/trip-health/${tripId}`,

  // Knowledge OS
  DKOS_SEARCH: '/api/dkos/search',
  DKOS_ENTITY: (id: string) => `/api/dkos/entity/${id}`,
  DKOS_HEALTH: '/api/dkos/health',

  // Operations & Suppliers
  SUPPLIERS: '/api/suppliers',
  OPS_CONSOLE: '/api/operations/console'
};

export function buildProblemDetails(params: {
  typeSuffix: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  correlationId?: string;
  invalidParams?: Array<{ name: string; reason: string }>;
  extra?: Record<string, any>;
}): ProblemDetails {
  return {
    type: `https://dahab.travel/errors/${params.typeSuffix}`,
    title: params.title,
    status: params.status,
    detail: params.detail,
    instance: params.instance,
    correlationId: params.correlationId,
    ...(params.invalidParams ? { invalidParams: params.invalidParams } : {}),
    ...(params.extra || {})
  };
}
