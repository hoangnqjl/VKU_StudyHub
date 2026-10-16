export interface UserProfile {
  id: string;
  studentId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  faculty?: string;
  major?: string;
  enrolledCourses: string[];
  studyGoals?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginDto {
  studentId?: string;
  email?: string;
  fullName?: string;
  password?: string;
}

export interface RegisterDto {
  studentId: string;
  email: string;
  fullName: string;
  password?: string;
  faculty?: string;
  major?: string;
  enrolledCourses?: string[];
  studyGoals?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
  faculty?: string;
  major?: string;
  enrolledCourses?: string[];
  studyGoals?: string;
}

