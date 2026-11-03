import { AppError } from '../../middlewares/error.middleware';
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
  
  public getCohorts = async (_req: any, res: any) => {
    const cohorts = await authService.getAvailableCohorts();
    return sendSuccess(res, cohorts, 'Danh sách khóa học niên khóa 2019 đến 2028 tại VKU');
  };

  public getCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const courses = await authService.getAvailableCourses();
      return sendSuccess(res, courses, 'Danh sách môn học mẫu tại trường VKU');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Upload Avatar endpoint (Cloudinary / Local)
   */
  public uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || req.body.userId || 'usr_01';
      const image = req.body.image || req.body.avatarUrl || req.body.file;
      if (!image) {
        return res.status(400).json({
          success: false,
          error: { message: 'Vui lòng cung cấp dữ liệu hình ảnh (base64 hoặc đường dẫn file)' }
        });
      }
      const result = await authService.uploadAvatar(userId, image);
      return sendSuccess(
        res,
        result,
        result.isCloudinary
          ? 'Đã tải ảnh đại diện lên Cloudinary thành công'
          : 'Đã cập nhật ảnh đại diện thành công'
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Google VKU OAuth Login endpoint
   */
  public googleLogin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await authService.loginWithGoogle(req.body);
      return sendSuccess(res, result, 'Đăng nhập tài khoản Google VKU thành công');
    } catch (error) {
      next(error);
    }
  };



  public getGoogleStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const status = await authService.getGoogleLinkStatus(userId);
      return sendSuccess(res, status, 'Trạng thái liên kết Google VKU');
    } catch (error) {
      next(error);
    }
  };

  public linkGoogle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || req.body.userId || 'usr_01';
      const email = req.body.email || req.body.googleEmail;
      if (!email) {
        throw new AppError('Vui lòng cung cấp địa chỉ email Google VKU (@vku.udn.vn)', 400);
      }
      const result = await authService.linkGoogleAccount(userId, email, req.body.googleId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public unlinkGoogle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const result = await authService.unlinkGoogleAccount(userId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

}

export const authController = new AuthController();
