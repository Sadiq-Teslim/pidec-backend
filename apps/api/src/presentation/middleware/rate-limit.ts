import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { env } from '../../shared/config/env.js';
import { ERROR_CODES, type ApiError } from '@pidec/shared';

const redisClient = env.REDIS_URL ? new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
}) : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    // Silent fail - the store will fallback to memory if connection fails
  });
}

// Helper to standardise the 429 response
const createRateLimitResponse = (message: string) => {
  return (req: any, res: any) => {
    const body: ApiError = {
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMITED,
        message,
      },
    };
    res.status(429).json(body);
  };
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  ...(redisClient ? {
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(args[0] as string, ...args.slice(1)) as any,
      prefix: 'rl:global:',
    })
  } : {}),
  handler: createRateLimitResponse('Too many requests, please try again later.'),
});

export const registerRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  ...(redisClient ? {
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(args[0] as string, ...args.slice(1)) as any,
      prefix: 'rl:register:',
    })
  } : {}),
  handler: createRateLimitResponse('Registration limit reached, please try again in 10 minutes.'),
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  ...(redisClient ? {
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(args[0] as string, ...args.slice(1)) as any,
      prefix: 'rl:login:',
    })
  } : {}),
  handler: createRateLimitResponse('Too many login attempts, please try again in 15 minutes.'),
});
