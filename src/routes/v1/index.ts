import { Router } from 'express';

const router = Router();

import authRoutes from '@/routes/v1/auth';
import zodValidationError from '@/middlewares/validationError';

router.get('/ping', (req, res) => {
    res.json({
        message: "pong",
        status: 200,
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

router.use('/auth', authRoutes);
router.use(zodValidationError);

export default router;