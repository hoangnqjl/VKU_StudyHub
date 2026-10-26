import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { sendError } from '../shared/utils/response.util';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    studentId: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Chưa đăng nhập hoặc thiếu Bearer Token', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Token không hợp lệ hoặc đã hết hạn', 403, error);
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
      req.user = decoded;
    } catch {
      // Ignored for optional authentication
    }
  }
  next();
};

