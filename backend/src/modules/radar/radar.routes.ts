import { Router } from 'express';
import { radarController } from './radar.controller';
import { validate } from '../../middlewares/validate.middleware';
import { checkInSchema, joinTableRequestSchema, updateJoinRequestSchema } from './radar.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// Location list & active buddies
router.get('/locations', radarController.getLocations);
router.get('/buddies', radarController.getBuddies);

// Check-in / Checkout status
router.post('/checkin', optionalAuth, validate(checkInSchema), radarController.checkIn);
router.post('/checkout', optionalAuth, radarController.checkOut);

// Table join requests
router.post('/join-request', optionalAuth, validate(joinTableRequestSchema), radarController.sendJoinRequest);
router.get('/join-requests', optionalAuth, radarController.getJoinRequests);
router.patch('/join-requests/:requestId', optionalAuth, validate(updateJoinRequestSchema), radarController.updateJoinRequest);

export default router;

