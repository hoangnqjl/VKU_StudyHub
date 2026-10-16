import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema, updateProfileSchema } from './auth.schema';
import { authenticateJwt, optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// Public auth routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.get('/courses', authController.getCourses);

// Protected routes (support optionalAuth for dev flexibility)
router.get('/profile', optionalAuth, authController.getProfile);
router.put('/profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);

export default router;

