import { type RequestHandler } from 'express';
import { ERROR_CODES } from '@pidec/shared';

type JsonBody = Record<string, unknown>;

const isJsonObject = (value: unknown): value is JsonBody =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const responseEnvelopeMiddleware: RequestHandler = (_req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = ((body: unknown) => {
    if (!isJsonObject(body) || 'success' in body) {
      return originalJson(body);
    }

    if (body.status === 'success') {
      const data =
        'data' in body
          ? body.data
          : 'message' in body
            ? { message: body.message }
            : null;

      return originalJson({
        success: true,
        data,
        ...('meta' in body ? { meta: body.meta } : {}),
      });
    }

    if (body.status === 'error') {
      return originalJson({
        success: false,
        error: {
          code: typeof body.code === 'string' ? body.code : ERROR_CODES.INTERNAL_ERROR,
          message: typeof body.message === 'string' ? body.message : 'Request failed',
          ...('details' in body ? { details: body.details } : {}),
        },
      });
    }

    return originalJson(body);
  }) as typeof res.json;

  next();
};
