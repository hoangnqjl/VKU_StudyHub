import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { dbPool } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { hashPassword, verifyPassword } from '../../shared/utils/crypto.util';
import {
  UserProfile,
  UserEntity,
  LoginDto,
  SignupDto,
  UpdateProfileDto,
  HomeDashboardData
} from './auth.types';
import { VKU_SAMPLE_COURSES } from '../../shared/constants/courses';
import { radarService } from '../radar/radar.service';
import { documentService } from '../documents/document.service';
import { pomodoroService } from '../pomodoro/pomodoro.service';

class AuthService {
  // In-memory fallback repository for development/offline
  private memoryUsers: UserEntity[] = [
    {
      id: 'usr_01',
      studentId: '23IT.B063',
      email: 'hoangnq.23it@vku.udn.vn',
      fullName: 'Nguyễn Quang Hoàng',
      passwordHash: hashPassword('123456'),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      faculty: 'Khoa Công nghệ Thông tin',
      major: 'Kỹ thuật Phần mềm',
      enrolledCourses: ['IT001', 'IT002'],
      studyGoals: 'Ôn thi cuối kỳ đạt điểm A và hoàn thành đồ án App VKU StudyHub',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_02',
      studentId: '23CE.B025',
      email: 'trongpnp.23ce@vku.udn.vn',
      fullName: 'Phạm Nguyễn Phú Trọng',
      passwordHash: hashPassword('123456'),
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
      faculty: 'Khoa Kỹ thuật Máy tính',
      major: 'Hệ thống Nhúng & IoT',
      enrolledCourses: ['IT001', 'IT004'],
      studyGoals: 'Luyện đề thi trắc nghiệm và ôn giải thuật',
      createdAt: new Date().toISOString()
    }
  ];

  public generateToken(user: { id: string; studentId: string; email: string }): string {
    return jwt.sign(
      {
        id: user.id,
        studentId: user.studentId,
        email: user.email
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  /**
   * 1. Login - Xác thực đăng nhập sinh viên VKU
   */
  public async login(dto: LoginDto) {
    const studentId = dto.studentId?.trim();
    const email = dto.email?.trim().toLowerCase();
    const password = dto.password || '123456';

    try {
      // 1. Try MySQL Database
      const [rows]: any = await dbPool.query(
        `SELECT * FROM users WHERE (student_id = ? OR email = ?) LIMIT 1`,
        [studentId || '', email || '']
      );

      if (rows && rows.length > 0) {
        const row = rows[0];
        const isPasswordValid = verifyPassword(password, row.password_hash);
        if (!isPasswordValid) {
          throw new AppError('Mật khẩu không chính xác', 401);
        }

        // Get user enrolled courses
        const [courseRows]: any = await dbPool.query(
          `SELECT course_code FROM user_courses WHERE user_id = ?`,
          [row.id]
        );
        const enrolledCourses = courseRows.map((c: any) => c.course_code);

        const user: UserProfile = {
          id: row.id,
          studentId: row.student_id,
          email: row.email,
          fullName: row.full_name,
          avatarUrl: row.avatar_url,
          faculty: row.faculty,
          major: row.major,
          studyGoals: row.study_goals,
          enrolledCourses,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };

        const token = this.generateToken(user);
        return { token, user };
      }
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      console.warn(`[AuthService] Fallback to memory store (DB error: ${err.message})`);
    }

    // 2. Fallback to Memory Store
    let memUser = this.memoryUsers.find(
      (u) =>
        (studentId && u.studentId.toLowerCase() === studentId.toLowerCase()) ||
        (email && u.email.toLowerCase() === email)
    );

    if (memUser) {
      if (dto.password && !verifyPassword(dto.password, memUser.passwordHash)) {
        throw new AppError('Mật khẩu không chính xác', 401);
      }
    } else {
      // Auto-create new memory user if not existing in mock mode
      memUser = {
        id: `usr_${Date.now()}`,
        studentId: studentId || `23IT.AUTO_${Math.floor(100 + Math.random() * 900)}`,
        email: email || `${studentId || 'student'}@vku.udn.vn`,
        fullName: 'Sinh viên VKU',
        passwordHash: hashPassword(password),
        faculty: 'Khoa Công nghệ Thông tin',
        major: 'Kỹ thuật Phần mềm',
        enrolledCourses: ['IT001', 'IT002'],
        studyGoals: 'Đạt kết quả học tập xuất sắc trong học kỳ này',
        createdAt: new Date().toISOString()
      };
      this.memoryUsers.push(memUser);
    }

    const { passwordHash: _, ...profile } = memUser;
    const token = this.generateToken(profile);
    return { token, user: profile };
  }

  /**
   * 2. Signup - Đăng ký tài khoản sinh viên mới
   */
  public async signup(dto: SignupDto) {
    const studentId = dto.studentId.trim();
    const email = dto.email.trim().toLowerCase();
    const password = dto.password || '123456';
    const pwdHash = hashPassword(password);
    const userId = `usr_${Date.now()}`;
    const enrolledCourses =
      dto.enrolledCourses && dto.enrolledCourses.length > 0
        ? dto.enrolledCourses
        : ['IT001', 'IT002'];

    try {
      // 1. Try MySQL Database
      const [existing]: any = await dbPool.query(
        `SELECT id FROM users WHERE student_id = ? OR email = ? LIMIT 1`,
        [studentId, email]
      );

      if (existing && existing.length > 0) {
        throw new AppError('Sinh viên với MSSV hoặc Email này đã tồn tại trong hệ thống', 409);
      }

      await dbPool.query(
        `INSERT INTO users (id, student_id, email, full_name, password_hash, avatar_url, faculty, major, study_goals)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          studentId,
          email,
          dto.fullName,
          pwdHash,
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
          dto.faculty || 'Khoa Công nghệ Thông tin',
          dto.major || 'Kỹ thuật Phần mềm',
          dto.studyGoals || 'Hoàn thành tốt các môn học trong kỳ'
        ]
      );

      // Insert enrolled courses
      for (const courseCode of enrolledCourses) {
        await dbPool.query(
          `INSERT IGNORE INTO user_courses (user_id, course_code) VALUES (?, ?)`,
          [userId, courseCode]
        );
      }

      const user: UserProfile = {
        id: userId,
        studentId,
        email,
        fullName: dto.fullName,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        faculty: dto.faculty || 'Khoa Công nghệ Thông tin',
        major: dto.major || 'Kỹ thuật Phần mềm',
        enrolledCourses,
        studyGoals: dto.studyGoals || 'Hoàn thành tốt các môn học trong kỳ',
        createdAt: new Date().toISOString()
      };

      const token = this.generateToken(user);
      return { token, user };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      console.warn(`[AuthService] Fallback to memory signup (DB error: ${err.message})`);
    }

    // 2. Fallback to Memory Store
    const memExisting = this.memoryUsers.find(
      (u) =>
        u.studentId.toLowerCase() === studentId.toLowerCase() ||
        u.email.toLowerCase() === email
    );

    if (memExisting) {
      throw new AppError('Sinh viên với MSSV hoặc Email này đã tồn tại trong hệ thống', 409);
    }

    const newUser: UserEntity = {
      id: userId,
      studentId,
      email,
      fullName: dto.fullName,
      passwordHash: pwdHash,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      faculty: dto.faculty || 'Khoa Công nghệ Thông tin',
      major: dto.major || 'Kỹ thuật Phần mềm',
      enrolledCourses,
      studyGoals: dto.studyGoals || 'Hoàn thành tốt các môn học trong kỳ',
      createdAt: new Date().toISOString()
    };

    this.memoryUsers.push(newUser);
    const { passwordHash: _, ...profile } = newUser;
    const token = this.generateToken(profile);
    return { token, user: profile };
  }

  public register(dto: SignupDto) {
    return this.signup(dto);
  }

  /**
   * 3. Profile - Lấy thông tin chi tiết hồ sơ sinh viên
   */
  public async getProfile(userId: string): Promise<UserProfile> {
    try {
      const [rows]: any = await dbPool.query(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [userId]
      );

      if (rows && rows.length > 0) {
        const row = rows[0];
        const [courseRows]: any = await dbPool.query(
          `SELECT course_code FROM user_courses WHERE user_id = ?`,
          [row.id]
        );
        const enrolledCourses = courseRows.map((c: any) => c.course_code);

        return {
          id: row.id,
          studentId: row.student_id,
          email: row.email,
          fullName: row.full_name,
          avatarUrl: row.avatar_url,
          faculty: row.faculty,
          major: row.major,
          studyGoals: row.study_goals,
          enrolledCourses,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
      }
    } catch (err: any) {
      console.warn(`[AuthService] Fallback getProfile from memory (${err.message})`);
    }

    const user = this.memoryUsers.find((u) => u.id === userId) || this.memoryUsers[0];
    const { passwordHash: _, ...profile } = user;
    return profile;
  }

  /**
   * 4. Edit Profile - Cập nhật thông tin sinh viên & danh sách môn học
   */
  public async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
    try {
      // 1. Try MySQL Database
      const updates: string[] = [];
      const values: any[] = [];

      if (dto.fullName) {
        updates.push('full_name = ?');
        values.push(dto.fullName);
      }
      if (dto.avatarUrl) {
        updates.push('avatar_url = ?');
        values.push(dto.avatarUrl);
      }
      if (dto.faculty) {
        updates.push('faculty = ?');
        values.push(dto.faculty);
      }
      if (dto.major) {
        updates.push('major = ?');
        values.push(dto.major);
      }
      if (dto.studyGoals !== undefined) {
        updates.push('study_goals = ?');
        values.push(dto.studyGoals);
      }

      if (updates.length > 0) {
        values.push(userId);
        await dbPool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
      }

      // Update courses
      if (dto.enrolledCourses) {
        await dbPool.query(`DELETE FROM user_courses WHERE user_id = ?`, [userId]);
        for (const code of dto.enrolledCourses) {
          await dbPool.query(
            `INSERT IGNORE INTO user_courses (user_id, course_code) VALUES (?, ?)`,
            [userId, code]
          );
        }
      }

      return await this.getProfile(userId);
    } catch (err: any) {
      console.warn(`[AuthService] Fallback updateProfile in memory (${err.message})`);
    }

    // 2. Fallback to Memory
    const userIndex = this.memoryUsers.findIndex((u) => u.id === userId);
    const targetIndex = userIndex !== -1 ? userIndex : 0;

    this.memoryUsers[targetIndex] = {
      ...this.memoryUsers[targetIndex],
      fullName: dto.fullName || this.memoryUsers[targetIndex].fullName,
      avatarUrl: dto.avatarUrl || this.memoryUsers[targetIndex].avatarUrl,
      faculty: dto.faculty || this.memoryUsers[targetIndex].faculty,
      major: dto.major || this.memoryUsers[targetIndex].major,
      studyGoals:
        dto.studyGoals !== undefined ? dto.studyGoals : this.memoryUsers[targetIndex].studyGoals,
      enrolledCourses: dto.enrolledCourses || this.memoryUsers[targetIndex].enrolledCourses,
      updatedAt: new Date().toISOString()
    };

    const { passwordHash: _, ...profile } = this.memoryUsers[targetIndex];
    return profile;
  }

  /**
   * 5. Home Dashboard - Tổng hợp dữ liệu trang chủ sinh viên
   */
  public async getHomeData(userId: string): Promise<HomeDashboardData> {
    const user = await this.getProfile(userId);

    // Active buddies count from radar service
    const activeBuddies = radarService.getActiveBuddies();
    // Saved documents count
    const savedDocs = documentService.getSavedDocuments(userId);
    // Active pomodoro rooms
    const activeRooms = await pomodoroService.getRooms();

    // Enrolled courses details
    const availableCourses = await this.getAvailableCourses();
    const enrolledCoursesDetails = (availableCourses as any[]).filter((c: any) =>
      user.enrolledCourses.some(
        (code) => code.toLowerCase().startsWith(c.code.toLowerCase()) || code === c.code
      )
    );

    return {
      user,
      stats: {
        enrolledCoursesCount: user.enrolledCourses.length,
        activeBuddiesNearBy: activeBuddies.length,
        savedDocumentsCount: savedDocs.length,
        activePomodoroRoomsCount: activeRooms.length
      },
      todayGoal: user.studyGoals || 'Tập trung ôn tập và hoàn thành bài tập lớn tuần này',
      enrolledCoursesDetails,
      quickTips: [
        '💡 Thư viện tầng 2 đang có nhiều bạn học cùng môn Quản lý dự án phần mềm.',
        '🚀 Quét mã QR tại bàn học để nhận ngay bộ slide ôn tập môn Lập trình di động.',
        '⏱ Tham gia phòng Pomodoro 25 phút để giữ kỷ luật và tập trung tối đa.'
      ]
    };
  }

  public async getAvailableCourses() {
    try {
      const [rows]: any = await dbPool.query(`SELECT code, name, faculty, credits FROM courses`);
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch {
      // Fallback
    }
    return VKU_SAMPLE_COURSES;
  }
}

export const authService = new AuthService();
