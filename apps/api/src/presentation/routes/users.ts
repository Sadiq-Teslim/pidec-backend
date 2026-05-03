import { Router } from 'express';
import { UpdateOwnProfileSchema } from '@pidec/shared';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getOwnProfile, updateOwnProfile } from '../controllers/user-controller.js';

const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get('/me', getOwnProfile);
userRouter.patch('/me', validate(UpdateOwnProfileSchema), updateOwnProfile);

export { userRouter };
