import pino, { type Logger } from 'pino';
import { env, isDev } from '../config/env.js';

/**
 * Structured logger (Pino). Per master spec § Security:
 *   - Never log PII (no full names, no matric numbers)
 *   - Never log file content
 *   - Never log auth tokens or secrets
 *   - Stack traces redacted in production responses
 *
 * The transport pretty-prints in development and emits JSON in production
 * for log aggregators.
 */
export const logger: Logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.cookie',
      'req.headers.authorization',
      'req.body.password',
      'req.body.token',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
      '*.matricNumber',
      '*.matric_number',
      '*.email',
    ],
    censor: '[REDACTED]',
  },
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' },
        },
      }
    : {}),
});
