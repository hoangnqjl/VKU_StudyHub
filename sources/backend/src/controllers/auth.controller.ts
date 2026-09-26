import { Request, Response } from 'express';
import { UserProfile } from '../types';

// Mock/Initial in-memory store for development
const mockUsers: UserProfile[] = [
  {
    id: 'usr_01',
    studentId: '23IT.B063',
    email: 'hoangnq.23it@vku.udn.vn',
    fullName: 'Nguyễn Quang Hoàng',
    enrolledCourses: ['IT001 - Quản lý dự án phần mềm', 'IT002 - Lập trình di động'],
    createdAt: new Date().toISOString()
  }
];

export const login = async (req: Request, res: Response) => {
  try {
    const { studentId, email } = req.body;
    if (!studentId && !email) {
      return res.status(400).json({ success: false, message: 'studentId hoặc email là bắt buộc.' });
    }

    const user = mockUsers.find(u => u.studentId === studentId || u.email === email) || {
      id: `usr_${Date.now()}`,
      studentId: studentId || '23IT.XXX',
      email: email || `${studentId}@vku.udn.vn`,
      fullName: req.body.fullName || 'Sinh viên VKU',
      enrolledCourses: ['Quản lý dự án phần mềm'],
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token: `mock_jwt_token_${user.id}`,
        user
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ', error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: mockUsers[0]
  });
};
