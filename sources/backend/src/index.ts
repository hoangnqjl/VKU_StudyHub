import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { testConnection } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'VKU StudyHub API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modules
app.use('/api', apiRouter);

// Start server
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 VKU StudyHub Backend Service running on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
  await testConnection();
});

export default app;
