/**
 * The status code an API call failed with.
 *
 * Every method in `api` used to throw a plain `Error` carrying only a message,
 * so a caller could not tell "you are signed out" from "the server broke" from
 * "that trip does not exist" — which is why nothing in the app ever handled a
 * 401 and the booking flow reported success after being rejected. Callers need
 * the status to decide, so it travels with the error.
 */
export class ApiError extends Error {
  public readonly status: number;
  /** The problem-detail `type` when the server sent one, for logging. */
  public readonly type?: string;

  constructor(message: string, status: number, type?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
  }

  /** The session is missing or expired: the caller should prompt for sign-in. */
  public get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Signed in, but not allowed. Prompting for sign-in again would not help. */
  public get isForbidden(): boolean {
    return this.status === 403;
  }

  public get isNotFound(): boolean {
    return this.status === 404;
  }
}

/**
 * Builds an ApiError from a failed Response, preferring the server's own
 * wording. The backend returns two shapes — `{ error }` from the older handlers
 * and RFC 7807 `{ title, detail, type }` from the validation middleware — so
 * both are read rather than assuming one.
 */
export async function apiErrorFrom(res: Response, fallback: string): Promise<ApiError> {
  const body: unknown = await res.json().catch(() => null);
  let message = fallback;
  let type: string | undefined;

  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const detail = typeof record.detail === 'string' ? record.detail : undefined;
    const error = typeof record.error === 'string' ? record.error : undefined;
    message = detail || error || fallback;
    if (typeof record.type === 'string') type = record.type;
  }

  return new ApiError(message, res.status, type);
}


/**
 * Reads a JSON body, or fails with wording a traveler can read.
 *
 * A request to a path the API does not serve falls through to the SPA's
 * index.html with HTTP 200, so `res.ok` is true and `res.json()` throws
 * `Unexpected token '<'`. That string was measured on screen, inside the
 * bookings page's error banner, where it told the traveler nothing. A response
 * that is not JSON is a broken endpoint, and it is reported as one.
 */
export async function readJson<T>(res: Response, context: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(`${context} (the server did not return data).`, res.status);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError(`${context} (the server's response could not be read).`, res.status);
  }
}
