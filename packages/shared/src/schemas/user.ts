import { z } from 'zod';

export const UpdateOwnProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    level: z.coerce.number().int().refine((value) => [100, 200, 300, 400, 500].includes(value), {
      message: 'Select a valid level (100-500)',
    }).optional(),
  })
  .refine((value) => value.name !== undefined || value.level !== undefined, {
    message: 'Provide at least one field to update',
  });

export type UpdateOwnProfileInput = z.infer<typeof UpdateOwnProfileSchema>;
