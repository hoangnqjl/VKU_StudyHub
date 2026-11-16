import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { ENV } from './config/env';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { helmetMiddleware, generalApiLimiter, sanitizeInput } from './middlewares/security.middleware';
import apiRouter from './routes';
import { sendSuccess, sendError } from './shared/utils/response.util';

const app = express();

// Tin tưởng proxy của Render / Cloudflare để rate-limit nhận đúng IP của từng client
app.set('trust proxy', 1);

// Global Middlewares
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true
  })
);

// Tăng giới hạn payload lên 50MB cho upload avatar base64 và tệp tài liệu
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(loggerMiddleware);

// Phục vụ tệp tĩnh ảnh đại diện và tài liệu tải lên
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
app.use('/documents', express.static(path.join(uploadsDir, 'documents'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  return sendSuccess(
    res,
    {
      service: 'VKU StudyHub Backend API',
      status: 'UP',
      uptime: process.uptime(),
      realtime: 'Socket.IO (Pomodoro Realtime Sync Enabled)',
      timestamp: new Date().toISOString(),
      modules: ['auth', 'radar', 'documents', 'pomodoro']
    },
    'Hệ thống Backend VKU StudyHub đang hoạt động bình thường'
  );
});

// Mount Central API Routes
// Giới hạn tần suất gọi API phòng chống DDoS & Brute Force
app.use('/api', generalApiLimiter);
app.use('/api', apiRouter);

// 404 Route Handler
app.use('*', (req: Request, res: Response) => {
  return sendError(res, `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`, 404);
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
