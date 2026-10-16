import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import radarRoutes from '../modules/radar/radar.routes';
import documentRoutes from '../modules/documents/document.routes';
import pomodoroRoutes from '../modules/pomodoro/pomodoro.routes';

const apiRouter = Router();

// Modular Route Aggregation
apiRouter.use('/auth', authRoutes);
apiRouter.use('/radar', radarRoutes);
apiRouter.use('/documents', documentRoutes);
apiRouter.use('/pomodoro', pomodoroRoutes);

export default apiRouter;

