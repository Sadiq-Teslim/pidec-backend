import { ERROR_CODES, ERROR_HTTP_STATUS, type ErrorCode } from '@pidec/shared';

/**
 * Typed application error. Throw these from use cases. The global error
 * handler maps them to the standard ApiResponse error envelope.
 *
 * Never throw raw Error objects from business logic.
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details: unknown;

  constructor(code: ErrorCode, message?: string, details?: unknown) {
    super(message ?? code);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = ERROR_HTTP_STATUS[code];
    this.details = details;
  }

  static notFound(message = 'Resource not found') {
    return new AppError(ERROR_CODES.NOT_FOUND, message);
  }
  static forbidden(message = 'Forbidden') {
    return new AppError(ERROR_CODES.FORBIDDEN, message);
  }
  static unauthenticated(message = 'Authentication required') {
    return new AppError(ERROR_CODES.AUTH_REQUIRED, message);
  }
  static validation(message = 'Validation failed', details?: unknown) {
    return new AppError(ERROR_CODES.VALIDATION_ERROR, message, details);
  }
  static rateLimited(message = 'Too many requests, please slow down') {
    return new AppError(ERROR_CODES.RATE_LIMITED, message);
  }
  static internal(message = 'Internal server error') {
    return new AppError(ERROR_CODES.INTERNAL_ERROR, message);
  }
}
