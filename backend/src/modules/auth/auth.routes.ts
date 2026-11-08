import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, signupSchema, updateProfileSchema, googleLoginSchema } from './auth.schema';
import { authRateLimiter } from '../../middlewares/security.middleware';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// 1. Login Endpoint
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.get('/google/status', optionalAuth, authController.getGoogleStatus);
router.post('/google/link', optionalAuth, authController.linkGoogle);
router.post('/google/unlink', optionalAuth, authController.unlinkGoogle);
router.post('/google', authRateLimiter, validate(googleLoginSchema), authController.googleLogin);

// 2. Signup / Register Endpoints
router.post('/signup', authRateLimiter, validate(signupSchema), authController.signup);
router.post('/register', authRateLimiter, validate(signupSchema), authController.register);

// 3. Profile Endpoint & Alias /me
router.get('/profile', optionalAuth, authController.getProfile);
router.get('/me', optionalAuth, authController.getProfile);

// 4. Edit Profile Endpoints
router.post('/avatar', authController.uploadAvatar);
router.post('/upload-avatar', authController.uploadAvatar);
router.put('/profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);
router.put('/edit-profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);

// 5. Home Dashboard Endpoint
router.get('/home', optionalAuth, authController.getHomeData);

// 6. Courses Catalog Endpoint
router.get('/courses', authController.getCourses);
router.get('/cohorts', authController.getCohorts);

export default router;
