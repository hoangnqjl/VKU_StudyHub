import { apiClient, SOCKET_URL } from './apiClient';
import { io, Socket } from 'socket.io-client';

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
  name?: string;
  description?: string;
  courseCode?: string;
  courseName?: string;
  hostId: string;
  hostName: string;
  focusDurationMinutes: number;
  targetDurationMinutes?: number;
  breakDurationMinutes: number;
  currentMode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
  participants: PomodoroParticipant[];
  participantsCount?: number;
  isPrivate?: boolean;
  createdAt: string;
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
  ERROR: 'pomodoro:error',
} as const;

let socketInstance: Socket | null = null;

export const pomodoroService = {
  async getRooms(params?: { search?: string }) {
    const res = await apiClient.get<PomodoroRoom[]>('/pomodoro/rooms', params);
    return res.data;
  },

  async getRoomById(id: string) {
    const res = await apiClient.get<PomodoroRoom>(`/pomodoro/rooms/${id}`);
    return res.data;
  },

  async createRoom(data: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    passcode?: string;
    targetDurationMinutes: number;
    breakDurationMinutes?: number;
  }) {
    const res = await apiClient.post<PomodoroRoom>('/pomodoro/rooms', {
      title: data.name,
      courseCode: 'IT002',
      courseName: data.description || 'Lập trình di động',
      focusDurationMinutes: data.targetDurationMinutes,
      breakDurationMinutes: data.breakDurationMinutes || 5,
    });
    const room = res.data;
    if (room) {
      if (!room.title) room.title = data.name;
      if (!room.name) room.name = room.title;
    }
    return room;
  },

  async joinRoom(roomId: string) {
    const res = await apiClient.post(`/pomodoro/rooms/${roomId}/join`);
    return res.data;
  },

  async closeRoom(roomId: string) {
    const res = await apiClient.post(`/pomodoro/rooms/${roomId}/close`);
    return res.data;
  },

  async leaveRoom(roomId: string) {
    const res = await apiClient.post(`/pomodoro/rooms/${roomId}/leave`);
    return res.data;
  },

  getSocket(): Socket {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          if (socketInstance) {
            socketInstance.disconnect();
          }
        });
      }
    }
    return socketInstance;
  },

  joinRoomRealtime(roomId: string, user: { id: string; fullName: string; avatarUrl?: string }) {
    const sock = this.getSocket();
    sock.emit(POMODORO_SOCKET_EVENTS.JOIN_ROOM, { roomId, user });
  },

  leaveRoomRealtime(roomId: string, userId: string) {
    const sock = this.getSocket();
    sock.emit(POMODORO_SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId });
  },

  sendTimerAction(
    roomId: string,
    action: 'START' | 'PAUSE' | 'RESET' | 'NEXT_PHASE' | 'SWITCH_MODE',
    targetMode?: TimerMode
  ) {
    const sock = this.getSocket();
    sock.emit(POMODORO_SOCKET_EVENTS.TIMER_ACTION, { roomId, action, targetMode });
  },
};
