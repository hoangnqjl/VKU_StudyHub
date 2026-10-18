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

export const initDatabaseTables = async (): Promise<boolean> => {
  try {
    const connection = await dbPool.getConnection();

    // 1. Table users (Module 1: Authentication & Profile)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        student_id VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        faculty VARCHAR(100),
        major VARCHAR(100),
        study_goals TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Table courses
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        code VARCHAR(20) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        faculty VARCHAR(100),
        credits INT DEFAULT 3
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Table user_courses (Quan hệ môn học sinh viên đăng ký theo kỳ)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_courses (
        user_id VARCHAR(36),
        course_code VARCHAR(20),
        PRIMARY KEY (user_id, course_code),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed sample courses if table is empty
    const [existingCourses]: any = await connection.query('SELECT COUNT(*) as count FROM courses');
    if (existingCourses[0]?.count === 0) {
      await connection.query(`
        INSERT INTO courses (code, name, faculty, credits) VALUES
        ('IT001', 'Quản lý dự án phần mềm', 'Khoa Công nghệ Thông tin', 3),
        ('IT002', 'Lập trình di động đa nền tảng', 'Khoa Công nghệ Thông tin', 3),
        ('IT003', 'Cơ sở dữ liệu nâng cao', 'Khoa Công nghệ Thông tin', 3),
        ('IT004', 'Kiến trúc máy tính & Hệ điều hành', 'Khoa Kỹ thuật Máy tính', 3),
        ('IT005', 'Trí tuệ nhân tạo căn bản', 'Khoa Trí tuệ Nhân tạo', 3),
        ('MATH001', 'Xác suất thống kê', 'Bộ môn Khoa học Cơ bản', 3);
      `);
      console.log('🌱 [Database] Đã khởi tạo dữ liệu môn học mẫu cho bảng courses');
    }

    console.log('✅ [Database] Đã khởi tạo & đồng bộ cấu trúc bảng Module 1 thành công');
    connection.release();
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [Database] Không thể khởi tạo bảng tự động: ${error.message}`);
    return false;
  }
};

export const testDbConnection = async (): Promise<boolean> => {
  try {
    const connection = await dbPool.getConnection();
    console.log(`✅ [Database] Kết nối cơ sở dữ liệu MySQL thành công (${ENV.DB.HOST}:${ENV.DB.PORT}/${ENV.DB.NAME})`);
    connection.release();
    await initDatabaseTables();
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [Database] Không thể kết nối trực tiếp MySQL (${error.message}). Hệ thống sẽ chuyển sang chế độ Mock/In-Memory cho phát triển.`);
    return false;
  }
};
