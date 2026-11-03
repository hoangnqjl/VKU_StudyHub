import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Helmet Security Headers Configuration
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Để Expo Web / fonts / Socket.IO hoạt động trơn tru
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép web tải ảnh avatar từ localhost:5000/uploads
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Hỗ trợ Google OAuth Popup
});

/**
 * Rate Limiter cho các API Xác thực (Chống Brute Force mật khẩu & Spam tài khoản)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 60, // Tối đa 60 requests/15 phút cho 1 IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Bạn đã thực hiện quá nhiều yêu cầu xác thực. Vui lòng đợi 15 phút trước khi thử lại.',
      },
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Rate Limiter chung cho toàn bộ hệ thống API
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600, // Tối đa 600 requests/15 phút
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware làm sạch và kiểm duyệt đầu vào (Input Sanitization)
 * Loại bỏ ký tự độc hại nhằm ngăn chặn XSS và Injection
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  const sanitize = (val: any): any => {
    if (typeof val === 'string') {
      // Giữ nguyên chuỗi base64 ảnh và URL hợp lệ, làm sạch các chuỗi text thông thường
      if (val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://')) {
        return val;
      }
      return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
    }
    if (typeof val === 'object' && val !== null) {
      for (const k of Object.keys(val)) {
        val[k] = sanitize(val[k]);
      }
    }
    return val;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
};

