import mysql from 'mysql2/promise';
import { ENV } from './env';

export const dbPool = mysql.createPool({
  host: ENV.DB.HOST,
  port: ENV.DB.PORT,
  user: ENV.DB.USER,
  password: ENV.DB.PASSWORD,
  database: ENV.DB.NAME,
  ssl: ENV.DB.SSL ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const testDbConnection = async (): Promise<boolean> => {
  try {
    const connection = await dbPool.getConnection();
    console.log(`✅ [Database] Kết nối cơ sở dữ liệu MySQL thành công (${ENV.DB.HOST}:${ENV.DB.PORT}/${ENV.DB.NAME})`);
    connection.release();
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [Database] Không thể kết nối trực tiếp MySQL (${error.message}). Hệ thống sẽ chuyển sang chế độ Mock/In-Memory cho phát triển.`);
    return false;
  }
};

