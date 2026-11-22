import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { authController } from '../modules/auth/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../modules/auth/auth.schema';
import { optionalAuth } from '../middlewares/auth.middleware';
import radarRoutes from '../modules/radar/radar.routes';
import documentRoutes from '../modules/documents/document.routes';
import pomodoroRoutes from '../modules/pomodoro/pomodoro.routes';
import chatbotRoutes from '../modules/chatbot/chatbot.routes';

const apiRouter = Router();

// Module 1: Auth & Profile Router
apiRouter.use('/auth', authRoutes);

// Direct Convenient Route Aliases for Module 1
apiRouter.get('/home', optionalAuth, authController.getHomeData);
apiRouter.get('/profile', optionalAuth, authController.getProfile);
apiRouter.put('/profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);
apiRouter.put('/edit-profile', optionalAuth, validate(updateProfileSchema), authController.updateProfile);

// Module 2, 3, 4 Routers
apiRouter.use('/radar', radarRoutes);
apiRouter.use('/documents', documentRoutes);
apiRouter.use('/pomodoro', pomodoroRoutes);
apiRouter.use('/chatbot', chatbotRoutes);

export default apiRouter;
