import { Router } from 'express';
import { z } from 'zod';
import {
  CreateTeamSchema,
  SendInviteSchema,
  SearchTeammatesSchema,
  RemoveMemberSchema,
  UuidSchema,
} from '@pidec/shared';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTeam,
  getMyTeam,
  listMyInvites,
  sendInvite,
  respondInvite,
  acceptInvite,
  declineInvite,
  searchTeammates,
  removeMember,
  dissolveTeam,
  dissolveMyTeam,
} from '../controllers/team-controller.js';

const RespondInviteSchema = z.object({
  inviteId: UuidSchema,
  status: z.enum(['accepted', 'declined']),
});

const TeamParamsSchema = z.object({
  teamId: UuidSchema,
});

const InviteParamsSchema = z.object({
  id: UuidSchema,
});

const teamRouter = Router();

teamRouter.use(requireAuth, requireRole('student'));

teamRouter.get('/me', getMyTeam);
teamRouter.get('/my', getMyTeam);
teamRouter.post('/', validate(CreateTeamSchema), createTeam);
teamRouter.get('/search', validate(SearchTeammatesSchema, 'query'), searchTeammates);

teamRouter.get('/invites', listMyInvites);
teamRouter.post('/invites', validate(SendInviteSchema), sendInvite);
teamRouter.post('/invites/respond', validate(RespondInviteSchema), respondInvite);
teamRouter.post('/invites/:id/accept', validate(InviteParamsSchema, 'params'), acceptInvite);
teamRouter.post('/invites/:id/decline', validate(InviteParamsSchema, 'params'), declineInvite);

teamRouter.post('/members/remove', validate(RemoveMemberSchema), removeMember);
teamRouter.delete('/members/:userId', validate(z.object({ userId: UuidSchema }), 'params'), removeMember);
teamRouter.delete('/:teamId', validate(TeamParamsSchema, 'params'), dissolveTeam);
teamRouter.delete('/', dissolveMyTeam);

export { teamRouter };
