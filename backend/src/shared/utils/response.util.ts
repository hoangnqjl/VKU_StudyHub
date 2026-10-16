import { Response } from 'express';
import { ApiResponse } from '../types/api.types';

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message: string = 'Thành công',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'Đã xảy ra lỗi',
  statusCode: number = 500,
  error?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: error instanceof Error ? error.message : error,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
};

