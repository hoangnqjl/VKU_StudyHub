import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const statusColor = statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusColor} [${method}] ${originalUrl} -> ${statusCode} (${duration}ms)`);
  });

  next();
};

