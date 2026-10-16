import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { radarService } from './radar.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class RadarController {
  public getLocations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const locations = radarService.getLocations();
      return sendSuccess(res, locations, 'Danh sách địa điểm trong khuôn viên VKU');
    } catch (error) {
      next(error);
    }
  };

  public getBuddies = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { locationId, courseCode } = req.query;
      const buddies = radarService.getActiveBuddies({
        locationId: locationId as string,
        courseCode: courseCode as string
      });
      return sendSuccess(res, buddies, 'Danh sách bạn học đang online gần đó');
    } catch (error) {
      next(error);
    }
  };

  public checkIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user || { id: 'usr_01', fullName: 'Nguyễn Quang Hoàng', studentId: '23IT.B063' };
      const result = radarService.checkIn(user as any, req.body);
      return sendSuccess(res, result, 'Bật trạng thái tìm bạn học thành công');
    } catch (error) {
      next(error);
    }
  };

  public checkOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const result = radarService.checkOut(userId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public sendJoinRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sender = req.user || { id: 'usr_01', fullName: 'Nguyễn Quang Hoàng', studentId: '23IT.B063' };
      const request = radarService.sendJoinRequest(sender as any, req.body);
      return sendSuccess(res, request, 'Đã gửi yêu cầu ghép bàn học thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public getJoinRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const requests = radarService.getJoinRequestsForUser(userId);
      return sendSuccess(res, requests, 'Danh sách yêu cầu ghép bàn nhận được');
    } catch (error) {
      next(error);
    }
  };

  public updateJoinRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const updated = radarService.updateJoinRequestStatus(requestId, status);
      return sendSuccess(res, updated, `Đã ${status === 'ACCEPTED' ? 'chấp nhận' : 'từ chối'} yêu cầu ghép bàn`);
    } catch (error) {
      next(error);
    }
  };
}

export const radarController = new RadarController();

