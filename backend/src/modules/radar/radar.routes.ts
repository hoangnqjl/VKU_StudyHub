import { Router } from 'express';
import { radarController } from './radar.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  checkInSchema,
  extendCheckInSchema,
  joinTableRequestSchema,
  updateJoinRequestSchema
} from './radar.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// 1. Tra cứu danh mục địa điểm & Bạn học đang sáng đèn
router.get('/locations', optionalAuth, radarController.getLocations);
router.get('/buddies', optionalAuth, radarController.getBuddies);

// 2. Vòng đời Check-in / Gia hạn 4 tiếng (So sánh IP) / Checkout
router.post('/checkin', optionalAuth, validate(checkInSchema), radarController.checkIn);
router.post('/extend', optionalAuth, validate(extendCheckInSchema), radarController.extendCheckIn);
router.post('/checkout', optionalAuth, radarController.checkOut);

// 3. Quy trình Lời mời Ghép bàn học (Thời hạn 5 phút)
router.post('/join-request', optionalAuth, validate(joinTableRequestSchema), radarController.sendJoinRequest);
router.get('/join-requests', optionalAuth, radarController.getJoinRequests);
router.get('/join-requests/badge', optionalAuth, radarController.getBadgeCount);
router.patch('/join-requests/:requestId/respond', optionalAuth, validate(updateJoinRequestSchema), radarController.respondJoinRequest);
router.patch('/join-requests/:requestId/cancel', optionalAuth, radarController.cancelJoinRequest);

export default router;
