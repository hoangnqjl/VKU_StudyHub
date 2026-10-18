import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, signupSchema, updateProfileSchema } from './auth.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// 1. Login Endpoint
router.post('/login', validate(loginSchema), authController.login);

// 2. Signup / Register Endpoints
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/register', validate(signupSchema), authController.register);

// 3. Profile Endpoint
router.get('/profile', optionalAuth, authController.getProfile);

// 4. Edit Profile Endpoints
router.put('/profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);
router.put('/edit-profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);

// 5. Home Dashboard Endpoint
router.get('/home', optionalAuth, authController.getHomeData);

// 6. Courses Catalog Endpoint
router.get('/courses', authController.getCourses);

export default router;
