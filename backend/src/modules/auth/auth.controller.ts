import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { authService } from './auth.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class AuthController {
  public login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Đăng nhập thành công');
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 'Đăng ký tài khoản thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const user = await authService.getProfile(userId);
      return sendSuccess(res, user, 'Lấy thông tin tài khoản thành công');
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const updatedUser = await authService.updateProfile(userId, req.body);
      return sendSuccess(res, updatedUser, 'Cập nhật hồ sơ thành công');
    } catch (error) {
      next(error);
    }
  };

  public getCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const courses = await authService.getAvailableCourses();
      return sendSuccess(res, courses, 'Danh sách môn học mẫu VKU');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();

