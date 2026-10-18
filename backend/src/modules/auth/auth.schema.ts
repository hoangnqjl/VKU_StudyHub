import { z } from 'zod';

export const loginSchema = z.object({
  body: z
    .object({
      studentId: z.string().optional(),
      email: z.string().email('Email sinh viên VKU không hợp lệ').optional(),
      password: z.string().min(1, 'Mật khẩu không được để trống').optional()
    })
    .refine((data) => data.studentId || data.email, {
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
