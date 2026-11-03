export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
export type TimerStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface PomodoroParticipant {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  isHost: boolean;
  joinedAt: string;
  socketId?: string;
}

export interface PomodoroMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export interface PomodoroReaction {
  roomId: string;
  userId: string;
  userName: string;
  emoji: string;
  timestamp: string;
}

export interface PomodoroRoom {
  id: string;
  title: string;
  name?: string;
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
  messages?: PomodoroMessage[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRoomDto {
  title: string;
  courseCode: string;
  courseName?: string;
  focusDurationMinutes?: number;
  breakDurationMinutes?: number;
}

export interface UpdateTimerDto {
  action: 'START' | 'PAUSE' | 'RESET' | 'NEXT_PHASE' | 'SWITCH_MODE';
  targetMode?: TimerMode;
}

export interface TimerSyncPayload {
  roomId: string;
  status: TimerStatus;
  currentMode: TimerMode;
  remainingSeconds: number;
  serverTime: string;
}

export const POMODORO_SOCKET_EVENTS = {
  // Client -> Server
  JOIN_ROOM: 'pomodoro:join',
  LEAVE_ROOM: 'pomodoro:leave',
  TIMER_ACTION: 'pomodoro:timer_action',
  SEND_MESSAGE: 'pomodoro:send_message',
  SEND_REACTION: 'pomodoro:send_reaction',
  SYNC_REQUEST: 'pomodoro:sync_request',

  // Server -> Client
  ROOM_STATE: 'pomodoro:room_state',
  TIMER_TICK: 'pomodoro:tick',
  TIMER_STATE: 'pomodoro:timer_state',
  PHASE_CHANGED: 'pomodoro:phase_changed',
  USER_JOINED: 'pomodoro:user_joined',
  USER_LEFT: 'pomodoro:user_left',
  NEW_MESSAGE: 'pomodoro:new_message',
  NEW_REACTION: 'pomodoro:new_reaction',
  ERROR: 'pomodoro:error'
} as const;
