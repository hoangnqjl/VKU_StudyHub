import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vku_studyhub',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('[Database] Connected successfully to MySQL database.');
    connection.release();
    return true;
  } catch (error) {
    console.warn('[Database] Could not connect to MySQL server. Operating in mock/fallback mode for development.', error);
    return false;
  }
};
