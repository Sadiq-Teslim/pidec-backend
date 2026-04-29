import { z } from 'zod';
import { TEAM_LIMITS } from '../constants/limits.js';
import { UuidSchema } from './common.js';

export const TeamNameSchema = z
  .string()
  .trim()
  .min(TEAM_LIMITS.TEAM_NAME_MIN, `Team name must be at least ${TEAM_LIMITS.TEAM_NAME_MIN} characters`)
  .max(TEAM_LIMITS.TEAM_NAME_MAX, `Team name must be at most ${TEAM_LIMITS.TEAM_NAME_MAX} characters`)
  .regex(/^[\p{L}0-9 _'\-]+$/u, {
    message: 'Team name may only contain letters, numbers, spaces, hyphens, underscores, and apostrophes',
  });

export const CreateTeamSchema = z.object({
  name: TeamNameSchema,
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;

export const SendInviteSchema = z.object({
  inviteeId: UuidSchema,
});

export type SendInviteInput = z.infer<typeof SendInviteSchema>;

export const InviteResponseSchema = z.object({
  inviteId: UuidSchema,
});

export const RemoveMemberSchema = z.object({
  userId: UuidSchema,
});

export const SearchTeammatesSchema = z.object({
  query: z.string().trim().min(2, 'Enter at least 2 characters').max(120),
});
