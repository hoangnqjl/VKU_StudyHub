import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { radarService } from './radar.service';
import { sendSuccess } from '../../shared/utils/response.util';
import { getClientIp } from '../../shared/utils/ip.util';

export class RadarController {
  /**
   * 1. Lấy danh mục địa điểm khuôn viên VKU (kèm số bạn đang học từng nơi)
   */
  public getLocations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const locations = radarService.getLocations();
      return sendSuccess(res, locations, 'Danh sách địa điểm trong khuôn viên VKU');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 2. Lấy danh sách bạn học đang "sáng đèn" (lọc theo vị trí, môn học, tìm kiếm)
   */
  public getBuddies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user?.id;
      const { locationId, courseCode, search } = req.query;

      const buddies = radarService.getActiveBuddies(currentUserId, {
        locationId: locationId as string,
        courseCode: courseCode as string,
        search: search as string
      });

      return sendSuccess(res, buddies, 'Danh sách bạn học đang online gần đó');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 3. Bật trạng thái tìm bạn học (Lưu IP và thời hạn 4 tiếng)
   */
  public checkIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user || {
        id: 'usr_01',
        fullName: 'Nguyễn Quang Hoàng',
        studentId: '23IT.B063'
      };
      const clientIp = getClientIp(req);

      const result = radarService.checkIn(user, req.body, clientIp);
      return sendSuccess(
        res,
        result,
        `Bật trạng thái tìm bạn học thành công tại ${result.locationName} (Hiệu lực: 4 tiếng)`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * 4. Gia hạn trạng thái học tập (So sánh IP hiện tại với IP check-in ban đầu)
   */
  public extendCheckIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const clientIp = getClientIp(req);

      const result = radarService.extendCheckIn(userId, clientIp, req.body);
      return sendSuccess(
        res,
        result,
        `Gia hạn trạng thái tự học thành công thêm 4 tiếng tại ${result.locationName}`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * 5. Tắt trạng thái tìm bạn học (Checkout)
   */
  public checkOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const result = radarService.checkOut(userId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 6. Gửi lời mời ghép bàn học (Thời hạn 5 phút)
   */
  public sendJoinRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sender = req.user || {
        id: 'usr_01',
        fullName: 'Nguyễn Quang Hoàng',
        studentId: '23IT.B063'
      };

      const request = radarService.sendJoinRequest(sender, req.body);
      return sendSuccess(
        res,
        request,
        'Đã gửi lời mời ghép bàn học thành công (Hiệu lực phản hồi trong vòng 5 phút)',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * 7. Xem danh sách lời mời (Hộp thư đến & Đã gửi)
   */
  public getJoinRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const requests = radarService.getJoinRequestsForUser(userId);
      return sendSuccess(res, requests, 'Danh sách lời mời ghép bàn');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 8. Lấy số lượng lời mời đang chờ (Badge Count)
   */
  public getBadgeCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const badge = radarService.getUnreadBadgeCount(userId);
      return sendSuccess(res, badge, 'Số lượng lời mời ghép bàn đang chờ');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 9. Người nhận phản hồi lời mời ghép bàn (ACCEPTED / REJECTED)
   */
  public respondJoinRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const targetUserId = req.user?.id || 'usr_01';
      const { requestId } = req.params;
      const { status } = req.body;

      const updated = radarService.respondJoinRequest(targetUserId, requestId, status);
      return sendSuccess(
        res,
        updated,
        `Đã ${status === 'ACCEPTED' ? 'chấp nhận' : 'từ chối'} yêu cầu ghép bàn học`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * 10. Người gửi chủ động hủy lời mời đã gửi (CANCELLED)
   */
  public cancelJoinRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const senderId = req.user?.id || 'usr_01';
      const { requestId } = req.params;

      const updated = radarService.cancelJoinRequest(senderId, requestId);
      return sendSuccess(res, updated, 'Đã hủy lời mời ghép bàn học thành công');
    } catch (error) {
      next(error);
    }
  };
}

export const radarController = new RadarController();
