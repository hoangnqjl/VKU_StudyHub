import { Request, Response, NextFunction } from 'express';
import { sendError } from '../shared/utils/response.util';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`💥 [Error] ${req.method} ${req.url}:`, err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(
    res,
    err.message || 'Lỗi hệ thống nội bộ máy chủ',
    err.statusCode || 500,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};

