import { Router } from 'express';
import { healthRouter } from './health.js';
import { authRouter } from './auth.js';
import { publicRouter } from './public.js';
import { userRouter } from './users.js';
import { teamRouter } from './teams.js';
import { submissionRouter } from './submissions.js';
import { notificationRouter } from './notifications.js';
import { judgeRouter } from './judge.js';
import { feedbackRouter } from './feedback.js';
import { adminRouter } from './admin.js';

/**
 * v1 API router. Feature modules are mounted here.
 */
const v1: Router = Router();

v1.use('/health', healthRouter);
v1.use('/public', publicRouter);
v1.use('/auth', authRouter);
v1.use('/users', userRouter);
v1.use('/teams', teamRouter);
v1.use('/submissions', submissionRouter);
v1.use('/notifications', notificationRouter);
v1.use('/judge', judgeRouter);
v1.use('/feedback', feedbackRouter);
v1.use('/admin', adminRouter);

export { v1 as v1Router };
