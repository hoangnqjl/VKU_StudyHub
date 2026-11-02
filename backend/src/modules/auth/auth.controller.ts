import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { authService } from './auth.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class AuthController {
  /**
   * Login endpoint
   */
  public login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Đăng nhập thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Signup / Register endpoint
   */
  public signup = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.signup(req.body);
      return sendSuccess(res, result, 'Đăng ký tài khoản sinh viên thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public register = this.signup;

  /**
   * Get Profile endpoint
   */
  public getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const user = await authService.getProfile(userId);
      return sendSuccess(res, user, 'Lấy thông tin hồ sơ sinh viên thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edit Profile endpoint
   */
  public updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const updatedUser = await authService.updateProfile(userId, req.body);
      return sendSuccess(res, updatedUser, 'Cập nhật hồ sơ sinh viên thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Home Dashboard Data endpoint
   */
  public getHomeData = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const homeData = await authService.getHomeData(userId);
      return sendSuccess(res, homeData, 'Lấy dữ liệu trang chủ VKU StudyHub thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Available Courses list endpoint
   */
  public getCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const courses = await authService.getAvailableCourses();
      return sendSuccess(res, courses, 'Danh sách môn học mẫu tại trường VKU');
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
