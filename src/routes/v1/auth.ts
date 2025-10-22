import { Router } from 'express';
import register from '@/controllers/v1/auth/register';
import validationError from '@/middlewares/validationError';
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import { loginSchema, refreshTokenSchema, registerSchema } from '@/schemas/authSchema';
import { cookie } from 'express-validator';
import logout from '@/controllers/v1/auth/logout';
import authenticate from '@/middlewares/authenticate';

const router = Router();

router.post('/register', registerSchema, validationError, register);
router.post('/login', loginSchema, validationError, login);
router.post('/refresh-token', refreshTokenSchema, validationError, refreshToken);
router.post('/logout', authenticate, logout);

export default router;