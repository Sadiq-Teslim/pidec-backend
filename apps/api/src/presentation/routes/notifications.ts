import { Router } from 'express';
import { z } from 'zod';
import { PaginationQuerySchema, UuidSchema } from '@pidec/shared';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notification-controller.js';

const NotificationParamsSchema = z.object({
  id: UuidSchema,
});

const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get('/', validate(PaginationQuerySchema, 'query'), listNotifications);
notificationRouter.post(
  '/:id/read',
  validate(NotificationParamsSchema, 'params'),
  markNotificationRead,
);
notificationRouter.patch(
  '/:id/read',
  validate(NotificationParamsSchema, 'params'),
  markNotificationRead,
);
notificationRouter.post('/read-all', markAllNotificationsRead);

export { notificationRouter };
