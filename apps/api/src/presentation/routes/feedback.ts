import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listMyFeedback, getSubmissionFeedback } from '../controllers/feedback-controller.js';

const router = Router();

router.use(requireAuth);
router.get('/me', listMyFeedback);
router.get('/:submissionId', getSubmissionFeedback);

export { router as feedbackRouter };
