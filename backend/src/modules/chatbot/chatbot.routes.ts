import { Router } from 'express';
import { chatbotController } from './chatbot.controller';
import { validate } from '../../middlewares/validate.middleware';
import { sendChatSchema } from './chatbot.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/message', optionalAuth, validate(sendChatSchema), chatbotController.sendMessage);

export default router;
