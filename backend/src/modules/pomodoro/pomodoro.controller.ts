import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { pomodoroService } from './pomodoro.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class PomodoroController {
  public getRooms = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { courseCode } = req.query;
      const rooms = pomodoroService.getRooms(courseCode as string);
      return sendSuccess(res, rooms, 'Danh sách phòng học Pomodoro');
    } catch (error) {
      next(error);
    }
  };

  public getRoomById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const room = pomodoroService.getRoomById(id);
      return sendSuccess(res, room, 'Thông tin phòng học');
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const host = req.user || { id: 'usr_01', fullName: 'Nguyễn Quang Hoàng' };
      const newRoom = pomodoroService.createRoom(host as any, req.body);
      return sendSuccess(res, newRoom, 'Tạo phòng học Pomodoro thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public joinRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user || { id: 'usr_01', fullName: 'Sinh viên VKU' };
      const { id } = req.params;
      const room = pomodoroService.joinRoom(id, user as any);
      return sendSuccess(res, room, 'Đã tham gia phòng học Pomodoro');
    } catch (error) {
      next(error);
    }
  };

  public leaveRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const { id } = req.params;
      const result = pomodoroService.leaveRoom(id, userId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public updateTimer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedRoom = pomodoroService.updateTimer(id, req.body);
      return sendSuccess(res, updatedRoom, 'Cập nhật trạng thái đồng hồ Pomodoro thành công');
    } catch (error) {
      next(error);
    }
  };
}

export const pomodoroController = new PomodoroController();

