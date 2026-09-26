export interface StudentUser {
  id: string;
  studentId: string; // MSSV (e.g. 23IT.B063)
  fullName: string;
  email: string;
  major: string; // e.g. Công nghệ thông tin
  enrolledCourses: string[];
}

export interface RadarBuddy {
  id: string;
  userId: string;
  studentId: string;
  fullName: string;
  courseCode: string;
  courseName: string;
  location: string;
  note?: string;
  checkInTime: string;
}

export interface StudyDocItem {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  category: 'exam' | 'lecture' | 'exercise' | 'summary';
  qrCodeToken: string;
  uploaderName: string;
  downloadsCount: number;
}

export interface PomodoroState {
  roomId?: string;
  roomName: string;
  timeLeftSeconds: number;
  isRunning: boolean;
  mode: 'focus' | 'break';
  participantCount: number;
}
