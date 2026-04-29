import type { AppNotification } from '../entities/index.js';
import type { NotificationType } from '@pidec/shared';

export interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface INotificationRepository {
  listForUser(userId: string, opts?: { unreadOnly?: boolean; cursor?: string; limit?: number }): Promise<{
    items: AppNotification[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
  create(dto: CreateNotificationDTO): Promise<AppNotification>;
  createMany(items: CreateNotificationDTO[]): Promise<number>;
  markRead(id: string, userId: string): Promise<void>;
  markAllRead(userId: string): Promise<number>;
}
