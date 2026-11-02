import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { pomodoroService } from './pomodoro.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class PomodoroController {
  public getRooms = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { courseCode } = req.query;
      const rooms = await pomodoroService.getRooms(courseCode as string);
      return sendSuccess(res, rooms, 'Danh sách phòng học Pomodoro');
    } catch (error) {
      next(error);
    }
  };

  public getRoomById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const room = await pomodoroService.getRoomById(id);
      return sendSuccess(res, room, 'Thông tin phòng học');
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const host = req.user || { id: 'usr_01', fullName: 'Nguyễn Quang Hoàng' };
      const newRoom = await pomodoroService.createRoom(host as any, req.body);
      return sendSuccess(res, newRoom, 'Tạo phòng học Pomodoro thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public joinRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user || { id: 'usr_01', fullName: 'Sinh viên VKU' };
      const { id } = req.params;
      const room = await pomodoroService.joinRoom(id, user as any);
      return sendSuccess(res, room, 'Đã tham gia phòng học Pomodoro');
    } catch (error) {
      next(error);
    }
  };

  public leaveRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const { id } = req.params;
      const result = await pomodoroService.leaveRoom(id, userId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public updateTimer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedRoom = await pomodoroService.updateTimer(id, req.body);
      return sendSuccess(res, updatedRoom, 'Cập nhật trạng thái đồng hồ Pomodoro thành công');
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user || { id: 'usr_01', fullName: 'Sinh viên VKU' };
      const { id } = req.params;
      const { message } = req.body;
      const newMsg = await pomodoroService.addMessage(id, user as any, message);
      return sendSuccess(res, newMsg, 'Gửi tin nhắn phòng học thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const messages = await pomodoroService.getMessages(id);
      return sendSuccess(res, messages, 'Lịch sử tin nhắn phòng học');
    } catch (error) {
      next(error);
    }
  };

  public sendReaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user || { id: 'usr_01', fullName: 'Sinh viên VKU' };
      const { id } = req.params;
      const { emoji } = req.body;
      const reaction = pomodoroService.addReaction(id, user as any, emoji || '👏');
      return sendSuccess(res, reaction, 'Đã gửi biểu cảm cổ vũ');
    } catch (error) {
      next(error);
    }
  };
}

export const pomodoroController = new PomodoroController();
