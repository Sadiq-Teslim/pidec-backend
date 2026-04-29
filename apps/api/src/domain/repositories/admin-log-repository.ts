import type { DbAdminLogAction } from '@pidec/db-types';

export interface AppendAdminLogDTO {
  adminId: string;
  action: DbAdminLogAction;
  targetType: string;
  targetId?: string;
  beforeValue?: unknown;
  afterValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Append-only audit log. No `update` or `delete` methods — table-level
 * triggers reject those operations.
 */
export interface IAdminLogRepository {
  append(dto: AppendAdminLogDTO): Promise<void>;
}
