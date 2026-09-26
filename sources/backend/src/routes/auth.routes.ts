import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.get('/profile', getProfile);

export default router;
