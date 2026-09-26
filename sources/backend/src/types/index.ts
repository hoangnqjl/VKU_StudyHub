export interface UserProfile {
  id: string;
  studentId: string; // MSSV (e.g., 23IT.B063)
  email: string;
  fullName: string;
  avatarUrl?: string;
  enrolledCourses: string[];
  createdAt: string;
}

export interface RadarCheckIn {
  id: string;
  userId: string;
  studentId: string;
  fullName: string;
  courseCode: string;
  courseName: string;
  location: string; // e.g., "Thư viện tầng 2", "Khu tự học Tòa V"
  note?: string;
  isActive: boolean;
  checkInTime: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  category: 'exam' | 'lecture' | 'exercise' | 'summary';
  description?: string;
  fileUrl: string;
  qrCodeToken: string;
  uploaderId: string;
  uploaderName: string;
  downloadsCount: number;
  createdAt: string;
}

export interface PomodoroRoom {
  id: string;
  roomName: string;
  hostId: string;
  hostName: string;
  focusMinutes: number;
  breakMinutes: number;
  status: 'idle' | 'focusing' | 'break';
  participantCount: number;
  createdAt: string;
}
