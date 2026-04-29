import { Router } from 'express';
import { getLandingData } from '../controllers/landing-content-controller.js';

const publicRouter = Router();

publicRouter.get('/landing-data', getLandingData);

export { publicRouter };
