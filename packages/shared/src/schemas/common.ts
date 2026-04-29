import { z } from 'zod';

export const UuidSchema = z.string().uuid({ message: 'Invalid UUID' });

export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Email is required')
  .max(254, 'Email is too long')
  .email('Enter a valid email address');

export const PaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
