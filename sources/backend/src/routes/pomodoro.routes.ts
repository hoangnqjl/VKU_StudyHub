import { Router } from 'express';
import { getRooms, createRoom, joinRoom } from '../controllers/pomodoro.controller';

const router = Router();

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.post('/rooms/:roomId/join', joinRoom);

export default router;
