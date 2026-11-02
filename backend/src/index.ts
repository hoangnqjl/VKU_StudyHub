import http from 'http';
import app from './app';
import { ENV } from './config/env';
import { testDbConnection } from './config/database';
import { initSocketServer } from './socket';
import { pomodoroService } from './modules/pomodoro/pomodoro.service';

const startServer = async () => {
  const server = http.createServer(app);

  // Initialize Socket.IO Realtime Engine
  initSocketServer(server);

  server.listen(ENV.PORT, async () => {
    console.log('====================================================');
    console.log(`🚀 [VKU StudyHub] Backend API & Realtime Server running!`);
    console.log(`📡 Port: ${ENV.PORT} | Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`⚡ WebSocket Realtime: ws://localhost:${ENV.PORT} (Socket.IO)`);
    console.log(`📚 Modules: /api/auth, /api/radar, /api/documents, /api/pomodoro`);
    console.log('====================================================');

    await testDbConnection();
  });

  const handleShutdown = () => {
    console.log('\n🛑 Đang đóng tiến trình máy chủ Backend VKU StudyHub...');
    pomodoroService.cleanupAllIntervals();
    server.close(() => {
      console.log('👋 Máy chủ đã dừng an toàn.');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
};

startServer().catch((err) => {
  console.error('❌ Lỗi khởi động máy chủ:', err);
  process.exit(1);
});
