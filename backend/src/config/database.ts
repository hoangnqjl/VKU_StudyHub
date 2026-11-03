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

    
    // Table cohorts (Khóa học 2019 - 2028)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cohorts (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_year INT NOT NULL,
        end_year INT NOT NULL,
        description VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [existingCohorts]: any = await connection.query('SELECT COUNT(*) as count FROM cohorts');
    if (existingCohorts[0]?.count === 0) {
      await connection.query(`
        INSERT INTO cohorts (id, name, start_year, end_year, description) VALUES
        ('K19', 'Khóa 2019 (K19)', 2019, 2023, 'Niên khóa 2019 - 2023'),
        ('K20', 'Khóa 2020 (K20)', 2020, 2024, 'Niên khóa 2020 - 2024'),
        ('K21', 'Khóa 2021 (K21)', 2021, 2025, 'Niên khóa 2021 - 2025'),
        ('K22', 'Khóa 2022 (K22)', 2022, 2026, 'Niên khóa 2022 - 2026'),
        ('K23', 'Khóa 2023 (K23)', 2023, 2027, 'Niên khóa 2023 - 2027'),
        ('K24', 'Khóa 2024 (K24)', 2024, 2028, 'Niên khóa 2024 - 2028'),
        ('K25', 'Khóa 2025 (K25)', 2025, 2029, 'Niên khóa 2025 - 2029'),
        ('K26', 'Khóa 2026 (K26)', 2026, 2030, 'Niên khóa 2026 - 2030'),
        ('K27', 'Khóa 2027 (K27)', 2027, 2031, 'Niên khóa 2027 - 2031'),
        ('K28', 'Khóa 2028 (K28)', 2028, 2032, 'Niên khóa 2028 - 2032')
        ON DUPLICATE KEY UPDATE name=VALUES(name);
      `);
      console.log('🌱 [Database] Đã khởi tạo dữ liệu khóa học mẫu 2019 - 2028 cho bảng cohorts');
    }
  
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

    // 4. Table pomodoro_rooms (Module 4: Shared Study Timer)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pomodoro_rooms (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        course_code VARCHAR(20) NOT NULL,
        course_name VARCHAR(150),
        host_id VARCHAR(36) NOT NULL,
        host_name VARCHAR(100) NOT NULL,
        focus_duration_minutes INT DEFAULT 25,
        break_duration_minutes INT DEFAULT 5,
        current_mode ENUM('FOCUS', 'SHORT_BREAK', 'LONG_BREAK') DEFAULT 'FOCUS',
        status ENUM('PAUSED', 'RUNNING', 'COMPLETED') DEFAULT 'PAUSED',
        remaining_seconds INT NOT NULL,
        started_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Table pomodoro_participants
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pomodoro_participants (
        room_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        is_host BOOLEAN DEFAULT FALSE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (room_id, user_id),
        FOREIGN KEY (room_id) REFERENCES pomodoro_rooms(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Table pomodoro_messages
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pomodoro_messages (
        id VARCHAR(36) PRIMARY KEY,
        room_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES pomodoro_rooms(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    
    // 7. Table user_google_links (Module 1: Real VKU Google Account Binding)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_google_links (
        user_id VARCHAR(36) PRIMARY KEY,
        google_email VARCHAR(100) NOT NULL,
        google_id VARCHAR(100),
        linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

    // Seed sample users if empty
    const [existingUsers]: any = await connection.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0]?.count === 0) {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update('123456').digest('hex');
      await connection.query(
        `INSERT INTO users (id, student_id, email, full_name, password_hash, avatar_url, faculty, major, study_goals) VALUES ('usr_01', '23IT.B063', 'hoangnq.23it@vku.udn.vn', 'Nguyễn Quang Hoàng', ?, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', 'Khoa Công nghệ Thông tin', 'Kỹ thuật Phần mềm', 'Ôn thi cuối kỳ đạt điểm A và hoàn thành đồ án App VKU StudyHub'), ('usr_02', '23CE.B025', 'trongpnp.23ce@vku.udn.vn', 'Phạm Nguyễn Phú Trọng', ?, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', 'Khoa Kỹ thuật Máy tính', 'Hệ thống Nhúng & IoT', 'Luyện đề thi trắc nghiệm và ôn giải thuật')`,
        [hash, hash]
      );
      console.log('🌱 [Database] Đã đồng bộ tài khoản sinh viên mẫu (23IT.B063 & 23CE.B025)');
    }

    console.log('✅ [Database] Đã khởi tạo & đồng bộ cấu trúc bảng Module 1 & Module 4 (Pomodoro) thành công');
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
