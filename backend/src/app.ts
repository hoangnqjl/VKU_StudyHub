import express, { Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';
import apiRouter from './routes';
import { sendSuccess, sendError } from './shared/utils/response.util';

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  return sendSuccess(
    res,
    {
      service: 'VKU StudyHub Backend API',
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      modules: ['auth', 'radar', 'documents', 'pomodoro']
    },
    'Hệ thống Backend VKU StudyHub đang hoạt động bình thường'
  );
});

// Mount Central API Routes
app.use('/api', apiRouter);

// 404 Route Handler
app.use('*', (req: Request, res: Response) => {
  return sendError(res, `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`, 404);
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;

