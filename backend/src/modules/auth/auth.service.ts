import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { AppError } from '../../middlewares/error.middleware';
import { UserProfile, LoginDto, RegisterDto, UpdateProfileDto } from './auth.types';
import { VKU_SAMPLE_COURSES } from '../../shared/constants/courses';

class AuthService {
  // In-memory mock database for development
  private users: UserProfile[] = [
    {
      id: 'usr_01',
      studentId: '23IT.B063',
      email: 'hoangnq.23it@vku.udn.vn',
      fullName: 'Nguyễn Quang Hoàng',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      faculty: 'Khoa Công nghệ Thông tin',
      major: 'Kỹ thuật Phần mềm',
      enrolledCourses: ['IT001 - Quản lý dự án phần mềm', 'IT002 - Lập trình di động đa nền tảng'],
      studyGoals: 'Ôn thi cuối kỳ đạt điểm A và hoàn thành đồ án App VKU StudyHub',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_02',
      studentId: '23CE.B025',
      email: 'trongpnp.23ce@vku.udn.vn',
      fullName: 'Phạm Nguyễn Phú Trọng',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
      faculty: 'Khoa Kỹ thuật Máy tính',
      major: 'Hệ thống Nhúng & IoT',
      enrolledCourses: ['IT001 - Quản lý dự án phần mềm', 'IT004 - Kiến trúc máy tính & Hệ điều hành'],
      studyGoals: 'Luyện đề thi trắc nghiệm và ôn giải thuật',
      createdAt: new Date().toISOString()
    }
  ];

  public generateToken(user: UserProfile): string {
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

  public async login(dto: LoginDto) {
    const studentId = dto.studentId?.trim();
    const email = dto.email?.trim().toLowerCase();

    let user = this.users.find(
      (u) =>
        (studentId && u.studentId.toLowerCase() === studentId.toLowerCase()) ||
        (email && u.email.toLowerCase() === email)
    );

    // If user does not exist in mock store, auto create for smooth prototyping
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        studentId: studentId || `23IT.AUTO_${Math.floor(100 + Math.random() * 900)}`,
        email: email || `${studentId || 'student'}@vku.udn.vn`,
        fullName: dto.fullName || 'Sinh viên VKU',
        faculty: 'Khoa Công nghệ Thông tin',
        major: 'Công nghệ Thông tin',
        enrolledCourses: ['IT001 - Quản lý dự án phần mềm'],
        studyGoals: 'Nâng cao kết quả học tập kỳ này',
        createdAt: new Date().toISOString()
      };
      this.users.push(user);
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  public async register(dto: RegisterDto) {
    const existing = this.users.find(
      (u) =>
        u.studentId.toLowerCase() === dto.studentId.toLowerCase() ||
        u.email.toLowerCase() === dto.email.toLowerCase()
    );

    if (existing) {
      throw new AppError('Sinh viên với MSSV hoặc Email này đã tồn tại trong hệ thống', 409);
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      studentId: dto.studentId,
      email: dto.email.toLowerCase(),
      fullName: dto.fullName,
      faculty: dto.faculty || 'Khoa Công nghệ Thông tin',
      major: dto.major || 'Công nghệ Thông tin',
      enrolledCourses: dto.enrolledCourses || ['IT001 - Quản lý dự án phần mềm'],
      studyGoals: dto.studyGoals || 'Mục tiêu học tập',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    const token = this.generateToken(newUser);
    return { token, user: newUser };
  }

  public async getProfile(userId: string): Promise<UserProfile> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      // Fallback to first user in development mode
      return this.users[0];
    }
    return user;
  }

  public async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    const targetIndex = userIndex !== -1 ? userIndex : 0;

    this.users[targetIndex] = {
      ...this.users[targetIndex],
      ...dto,
      updatedAt: new Date().toISOString()
    };

    return this.users[targetIndex];
  }

  public async getAvailableCourses() {
    return VKU_SAMPLE_COURSES;
  }
}

export const authService = new AuthService();

