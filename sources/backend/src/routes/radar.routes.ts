import { Router } from 'express';
import { getActiveBuddies, checkIn, checkOut } from '../controllers/radar.controller';

const router = Router();

router.get('/buddies', getActiveBuddies);
router.post('/checkin', checkIn);
router.post('/checkout/:checkInId', checkOut);

export default router;
