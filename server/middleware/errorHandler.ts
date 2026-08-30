import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './correlationMiddleware';

export function errorHandler(err: any, req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const correlationId = req.correlationId || 'unknown';

  console.error(`[ERROR] [${correlationId}] ${req.method} ${req.originalUrl}:`, err);

  // Client errors (4xx) are the caller's own fault and safe to describe.
  // Server errors (5xx) may carry stack frames, file paths, SQL, or secrets in
  // their message, so return a generic detail and let the correlationId be the
  // link to the full server-side log.
  const isClientError = status >= 400 && status < 500;
  const detail = isClientError
    ? err.message || 'The request could not be processed.'
    : 'An unexpected error occurred while processing your request.';

  const responseBody = {
    type: err.type || 'https://dahab.travel/errors/internal-server-error',
    title: err.title || (isClientError ? 'Request Error' : 'Internal Server Error'),
    status,
    detail,
    instance: req.originalUrl,
    correlationId,
    timestamp: new Date().toISOString()
  };

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json(responseBody);
}
