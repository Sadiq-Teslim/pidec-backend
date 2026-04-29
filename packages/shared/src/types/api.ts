import type { ErrorCode } from '../constants/error-codes.js';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta | undefined;
}

export interface ApiError {
  success: false;
  error: {
    code: ErrorCode | string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

export interface PaginatedResponse<T> extends ApiSuccess<T[]> {
  meta: PaginationMeta;
}
