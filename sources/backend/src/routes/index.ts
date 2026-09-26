import { Router } from 'express';
import authRoutes from './auth.routes';
import radarRoutes from './radar.routes';
import documentRoutes from './document.routes';
import pomodoroRoutes from './pomodoro.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/radar', radarRoutes);
router.use('/documents', documentRoutes);
router.use('/pomodoro', pomodoroRoutes);

export default router;
