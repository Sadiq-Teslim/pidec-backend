import { type RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Zod validation middleware. Parses request body/query/params against the
 * given schema and writes the parsed (typed, transformed) value back to
 * req[location], so the controller works with validated data only.
 *
 * On failure, throws ZodError which the global error handler maps to a
 * 400 VALIDATION_ERROR response with field-level details.
 */
type Location = 'body' | 'query' | 'params';

export const validate =
  <T>(schema: ZodSchema<T>, location: Location = 'body'): RequestHandler =>
  (req, _res, next) => {
    try {
      const parsed = schema.parse(req[location]);
      // Mutate in place so downstream handlers consume the validated value
      (req as unknown as Record<Location, unknown>)[location] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
