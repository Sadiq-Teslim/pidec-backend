import { Router } from 'express';

const router: Router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'pidec-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as healthRouter };
