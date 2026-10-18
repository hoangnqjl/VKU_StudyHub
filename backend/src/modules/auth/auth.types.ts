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

export interface UserEntity extends UserProfile {
  passwordHash: string;
}

export interface LoginDto {
  studentId?: string;
  email?: string;
  password?: string;
}

export interface SignupDto {
  studentId: string;
  email: string;
  fullName: string;
  password?: string;
  faculty?: string;
  major?: string;
  enrolledCourses?: string[];
  studyGoals?: string;
}

export type RegisterDto = SignupDto;

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
  faculty?: string;
  major?: string;
  enrolledCourses?: string[];
  studyGoals?: string;
}

export interface HomeDashboardData {
  user: UserProfile;
  stats: {
    enrolledCoursesCount: number;
    activeBuddiesNearBy: number;
    savedDocumentsCount: number;
    activePomodoroRoomsCount: number;
  };
  todayGoal: string;
  enrolledCoursesDetails: Array<{
    code: string;
    name: string;
    faculty?: string;
    credits: number;
  }>;
  quickTips: string[];
}
