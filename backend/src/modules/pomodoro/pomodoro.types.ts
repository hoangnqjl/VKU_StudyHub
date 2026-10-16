export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
export type TimerStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface PomodoroParticipant {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  isHost: boolean;
  joinedAt: string;
}

export interface PomodoroRoom {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  hostId: string;
  hostName: string;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  currentMode: TimerMode;
  status: TimerStatus;
  startedAt?: string;
  remainingSeconds: number;
  participants: PomodoroParticipant[];
  createdAt: string;
}

export interface CreateRoomDto {
  title: string;
  courseCode: string;
  courseName?: string;
  focusDurationMinutes?: number;
  breakDurationMinutes?: number;
}

export interface UpdateTimerDto {
  action: 'START' | 'PAUSE' | 'RESET' | 'NEXT_PHASE';
}

