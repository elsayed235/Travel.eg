import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './correlationMiddleware';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired windows every minute
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 60000).unref();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const identifier = req.user?.userId || req.ip || req.socket.remoteAddress || 'anonymous';
    const key = `${req.baseUrl || req.path}:${identifier}`;
    const now = Date.now();

    let record = store.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + options.windowMs
      };
      store.set(key, record);
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', options.maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      return next();
    }

    if (record.count >= options.maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

      return res.status(429).json({
        type: 'https://dahab.travel/errors/rate-limit-exceeded',
        title: 'Too Many Requests',
        status: 429,
        detail: options.message || `Rate limit exceeded. Please retry in ${retryAfterSec} seconds.`,
        instance: req.originalUrl,
        correlationId: req.correlationId,
        retryAfter: retryAfterSec
      });
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', options.maxRequests - record.count);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
    next();
  };
}

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
  message: 'API rate limit exceeded. Please slow down your requests.'
});

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Too many authentication attempts. Please wait a minute before trying again.'
});
