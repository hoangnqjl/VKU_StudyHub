import app from './app';
import { ENV } from './config/env';
import { testDbConnection } from './config/database';

const startServer = async () => {
  const server = app.listen(ENV.PORT, async () => {
    console.log('====================================================');
    console.log(`🚀 [VKU StudyHub] Backend API Server is running!`);
    console.log(`📡 Port: ${ENV.PORT} | Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`📚 Modules: /api/auth, /api/radar, /api/documents, /api/pomodoro`);
    console.log('====================================================');

    await testDbConnection();
  });

  const handleShutdown = () => {
    console.log('\n🛑 Đang đóng tiến trình máy chủ Backend VKU StudyHub...');
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

