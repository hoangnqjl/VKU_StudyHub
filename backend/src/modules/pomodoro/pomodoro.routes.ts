import { Router } from 'express';
import { pomodoroController } from './pomodoro.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createRoomSchema, updateTimerSchema, sendRoomMessageSchema } from './pomodoro.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// Room list and room creation
router.get('/rooms', pomodoroController.getRooms);
router.post('/rooms', optionalAuth, validate(createRoomSchema), pomodoroController.createRoom);

// Single room details and interactions
router.get('/rooms/:id', pomodoroController.getRoomById);
router.post('/rooms/:id/join', optionalAuth, pomodoroController.joinRoom);
router.post('/rooms/:id/leave', optionalAuth, pomodoroController.leaveRoom);
router.patch('/rooms/:id/timer', optionalAuth, validate(updateTimerSchema), pomodoroController.updateTimer);

// Realtime room messages and reactions
router.get('/rooms/:id/messages', pomodoroController.getMessages);
router.post(
  '/rooms/:id/messages',
  optionalAuth,
  validate(sendRoomMessageSchema),
  pomodoroController.sendMessage
);
router.post('/rooms/:id/reactions', optionalAuth, pomodoroController.sendReaction);

export default router;
