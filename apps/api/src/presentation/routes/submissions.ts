import { Router } from 'express';
import { Stage1SubmitSchema, Stage2SubmitSchema, Stage3SubmitSchema } from '@pidec/shared';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listMySubmissions,
  submitStage1,
  submitStage2,
  submitStage3,
} from '../controllers/submission-controller.js';

const submissionRouter = Router();

submissionRouter.use(requireAuth, requireRole('student'));

submissionRouter.get('/me', listMySubmissions);
submissionRouter.post('/stage-1', validate(Stage1SubmitSchema), submitStage1);
submissionRouter.post('/stage-2', validate(Stage2SubmitSchema), submitStage2);
submissionRouter.post('/stage-3', validate(Stage3SubmitSchema), submitStage3);

export { submissionRouter };
