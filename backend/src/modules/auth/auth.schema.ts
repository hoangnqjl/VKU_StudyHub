import { z } from 'zod';

export const loginSchema = z.object({
  body: z
    .object({
      studentId: z.string().optional(),
      email: z.string().optional(),
      studentIdOrEmail: z.string().optional(),
      password: z.string().min(1, 'Mật khẩu không được để trống').optional()
    })
    .refine((data) => data.studentId || data.email || data.studentIdOrEmail, {
      message: 'Vui lòng cung cấp MSSV hoặc Email để đăng nhập'
    })
});

export const signupSchema = z.object({
  body: z.object({
    studentId: z.string().min(3, 'MSSV phải có tối thiểu 3 ký tự'),
    email: z.string().email('Email sinh viên VKU không hợp lệ'),
    fullName: z.string().min(2, 'Họ và tên không được để trống'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    faculty: z.string().optional(),
    major: z.string().optional(),
    enrolledCourses: z.array(z.string()).optional(),
    academicYear: z.string().optional(),
    studyGoals: z.string().optional()
  })
});

export const registerSchema = signupSchema;

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự').optional(),
    avatarUrl: z.string().optional(),
    faculty: z.string().optional(),
    major: z.string().optional(),
    enrolledCourses: z.array(z.string()).optional(),
    studyGoals: z.string().optional()
  })
});

export const googleLoginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Email Google không hợp lệ')
      .refine((val) => val.trim().toLowerCase().endsWith('@vku.udn.vn'), {
        message: 'Chỉ chấp nhận tài khoản Google sinh viên/cán bộ VKU có đuôi @vku.udn.vn'
      }),
    idToken: z.string().optional(),
    fullName: z.string().optional(),
    avatarUrl: z.string().optional(),
    googleId: z.string().optional()
  })
});
