import {
  PomodoroRoom,
  CreateRoomDto,
  UpdateTimerDto,
  PomodoroParticipant,
  PomodoroMessage,
  PomodoroReaction,
  POMODORO_SOCKET_EVENTS
} from './pomodoro.types';
import { AppError } from '../../middlewares/error.middleware';
import { dbPool } from '../../config/database';
import { emitToRoom } from '../../socket';

class PomodoroService {
  // Active countdown timer intervals per room
  private activeIntervals: Map<string, NodeJS.Timeout> = new Map();

  // In-memory fallback and fast-access cache


  private rooms: PomodoroRoom[] = [];

  /**
   * Lấy danh sách tất cả phòng học Pomodoro
   */
  constructor() {
    setTimeout(() => {
      for (const r of this.rooms) {
        if (r.status === 'RUNNING') {
          console.log('⏱️ [PomodoroService] Starting ticker for live room: ' + r.id);
          this.startTimerTicker(r.id);
        }
      }
    }, 1000);
  }

  public async getRooms(courseCode?: string): Promise<PomodoroRoom[]> {
    try {
      let query = `SELECT * FROM pomodoro_rooms`;
      const params: any[] = [];
      if (courseCode) {
        query += ` WHERE course_code = ?`;
        params.push(courseCode);
      }
      query += ` ORDER BY created_at DESC`;

      const [rows]: any = await dbPool.query(query, params);
      if (rows && rows.length > 0) {
        // Sync database rows with cached active status & participants
        for (const row of rows) {
          const cached = this.rooms.find((r) => r.id === row.id);
          if (!cached) {
            const [partRows]: any = await dbPool.query(
              `SELECT user_id, full_name, avatar_url, is_host, joined_at FROM pomodoro_participants WHERE room_id = ?`,
              [row.id]
            );
            this.rooms.push({
              id: row.id,
              title: row.title,
              courseCode: row.course_code,
              courseName: row.course_name,
              hostId: row.host_id,
              hostName: row.host_name,
              focusDurationMinutes: row.focus_duration_minutes,
              breakDurationMinutes: row.break_duration_minutes,
              currentMode: row.current_mode,
              status: row.status,
              remainingSeconds: row.remaining_seconds,
              startedAt: row.started_at,
              participants: partRows.map((p: any) => ({
                userId: p.user_id,
                fullName: p.full_name,
                avatarUrl: p.avatar_url,
                isHost: Boolean(p.is_host),
                joinedAt: p.joined_at
              })),
              messages: [],
              createdAt: row.created_at
            });
          }
        }
      }
    } catch {
      // Fallback to memory cache silently
    }

    if (courseCode) {
      return this.rooms.filter(
        (r) => r.courseCode.toLowerCase() === courseCode.toLowerCase()
      );
    }
    return this.rooms;
  }

  /**
   * Lấy chi tiết phòng học Pomodoro theo ID
   */
  public async getRoomById(id: string): Promise<PomodoroRoom> {
    const room = this.rooms.find((r) => r.id === id);
    if (!room) {
      // Check database
      try {
        const [rows]: any = await dbPool.query(
          `SELECT * FROM pomodoro_rooms WHERE id = ? LIMIT 1`,
          [id]
        );
        if (rows && rows.length > 0) {
          const row = rows[0];
          const [partRows]: any = await dbPool.query(
            `SELECT user_id, full_name, avatar_url, is_host, joined_at FROM pomodoro_participants WHERE room_id = ?`,
            [row.id]
          );
          const [msgRows]: any = await dbPool.query(
            `SELECT * FROM pomodoro_messages WHERE room_id = ? ORDER BY created_at ASC LIMIT 50`,
            [row.id]
          );

          const dbRoom: PomodoroRoom = {
            id: row.id,
            title: row.title,
            courseCode: row.course_code,
            courseName: row.course_name,
            hostId: row.host_id,
            hostName: row.host_name,
            focusDurationMinutes: row.focus_duration_minutes,
            breakDurationMinutes: row.break_duration_minutes,
            currentMode: row.current_mode,
            status: row.status,
            remainingSeconds: row.remaining_seconds,
            startedAt: row.started_at,
            participants: partRows.map((p: any) => ({
              userId: p.user_id,
              fullName: p.full_name,
              avatarUrl: p.avatar_url,
              isHost: Boolean(p.is_host),
              joinedAt: p.joined_at
            })),
            messages: msgRows.map((m: any) => ({
              id: m.id,
              roomId: m.room_id,
              userId: m.user_id,
              userName: m.user_name,
              message: m.message,
              createdAt: m.created_at
            })),
            createdAt: row.created_at
          };
          this.rooms.unshift(dbRoom);
          return dbRoom;
        }
      } catch {
        // Fallback
      }
      throw new AppError('Không tìm thấy phòng Pomodoro yêu cầu', 404);
    }
    return room;
  }

  /**
   * Tạo phòng học nhóm Pomodoro mới
   */
  public async createRoom(
    host: { id: string; fullName?: string },
    dto: CreateRoomDto
  ): Promise<PomodoroRoom> {
    const focusDuration = dto.focusDurationMinutes || 25;
    const breakDuration = dto.breakDurationMinutes || 5;
    const roomId = `room_${Date.now()}`;
    const hostName = host.fullName || 'Thành viên VKU';

    const newRoom: PomodoroRoom = {
      id: roomId,
      title: dto.title,
      name: dto.title,
      courseCode: dto.courseCode,
      courseName: dto.courseName || dto.courseCode,
      hostId: host.id,
      hostName,
      focusDurationMinutes: focusDuration,
      breakDurationMinutes: breakDuration,
      currentMode: 'FOCUS',
      status: 'PAUSED',
      remainingSeconds: focusDuration * 60,
      participants: [
        {
          userId: host.id,
          fullName: hostName,
          isHost: true,
          joinedAt: new Date().toISOString()
        }
      ],
      messages: [],
      createdAt: new Date().toISOString()
    };

    this.rooms.unshift(newRoom);

    // Persist to database if available
    try {
      await dbPool.query(
        `INSERT INTO pomodoro_rooms 
        (id, title, course_code, course_name, host_id, host_name, focus_duration_minutes, break_duration_minutes, current_mode, status, remaining_seconds)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newRoom.id,
          newRoom.title,
          newRoom.courseCode,
          newRoom.courseName,
          newRoom.hostId,
          newRoom.hostName,
          newRoom.focusDurationMinutes,
          newRoom.breakDurationMinutes,
          newRoom.currentMode,
          newRoom.status,
          newRoom.remainingSeconds
        ]
      );

      await dbPool.query(
        `INSERT INTO pomodoro_participants (room_id, user_id, full_name, is_host) VALUES (?, ?, ?, ?)`,
        [newRoom.id, host.id, hostName, true]
      );
    } catch (err: any) {
      console.warn(`[PomodoroService] DB save room fallback (${err.message})`);
    }

    return newRoom;
  }

  /**
   * Tham gia vào phòng học Pomodoro
   */
  public async joinRoom(
    roomId: string,
    user: { id: string; fullName?: string; avatarUrl?: string },
    socketId?: string
  ): Promise<PomodoroRoom> {
    const room = await this.getRoomById(roomId);

    let participant = room.participants.find((p) => p.userId === user.id);
    if (!participant) {
      participant = {
        userId: user.id,
        fullName: user.fullName || 'Sinh viên VKU',
        avatarUrl: user.avatarUrl,
        isHost: room.participants.length === 0,
        joinedAt: new Date().toISOString(),
        socketId
      };
      room.participants.push(participant);

      try {
        await dbPool.query(
          `INSERT INTO pomodoro_participants (room_id, user_id, full_name, avatar_url, is_host)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), avatar_url = VALUES(avatar_url)`,
          [roomId, user.id, participant.fullName, participant.avatarUrl || null, participant.isHost]
        );
      } catch {
        // Fallback
      }
    } else {
      if (socketId) {
        participant.socketId = socketId;
      }
    }

    // Broadcast user joined to room
    emitToRoom(roomId, POMODORO_SOCKET_EVENTS.USER_JOINED, {
      roomId,
      user: participant,
      participants: room.participants,
      participantCount: room.participants.length
    });

    return room;
  }

  /**
   * Rời khỏi phòng học Pomodoro
   */
  public async leaveRoom(
    roomId: string,
    userId: string
  ): Promise<{ success: boolean; message: string; room?: PomodoroRoom }> {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) {
      return { success: true, message: 'Phòng không tồn tại hoặc đã đóng' };
    }

    const leavingUser = room.participants.find((p) => p.userId === userId);
    room.participants = room.participants.filter((p) => p.userId !== userId);

    try {
      await dbPool.query(
        `DELETE FROM pomodoro_participants WHERE room_id = ? AND user_id = ?`,
        [roomId, userId]
      );
    } catch {
      // Fallback
    }

    // If host left and members remain, assign host to the first member
    if (room.hostId === userId && room.participants.length > 0) {
      room.hostId = room.participants[0].userId;
      room.hostName = room.participants[0].fullName;
      room.participants[0].isHost = true;

      try {
        await dbPool.query(
          `UPDATE pomodoro_rooms SET host_id = ?, host_name = ? WHERE id = ?`,
          [room.hostId, room.hostName, roomId]
        );
        await dbPool.query(
          `UPDATE pomodoro_participants SET is_host = TRUE WHERE room_id = ? AND user_id = ?`,
          [roomId, room.hostId]
        );
      } catch {
        // Fallback
      }
    }

    // If room is completely empty, stop timer and automatically clean up
    if (room.participants.length === 0) {
      await this.closeRoom(roomId);
      return { success: true, message: 'Phòng học đã tự động kết thúc và đóng do không còn thành viên.' };
    }

    // Broadcast user left to remaining room participants
    emitToRoom(roomId, POMODORO_SOCKET_EVENTS.USER_LEFT, {
      roomId,
      userId,
      userName: leavingUser?.fullName || 'Sinh viên VKU',
      newHostId: room.hostId,
      participants: room.participants,
      participantCount: room.participants.length
    });

    return { success: true, message: 'Đã rời phòng học Pomodoro', room };
  }

  /**
   * Xử lý khi socket ngắt kết nối
   */
  public async handleSocketDisconnect(socketId: string) {
    for (const room of this.rooms) {
      const participant = room.participants.find((p) => p.socketId === socketId);
      if (participant) {
        await this.leaveRoom(room.id, participant.userId);
      }
    }
  }

  /**
   * Điều khiển trạng thái đếm ngược Pomodoro (Start, Pause, Reset, Next Phase, Switch Mode)
   */
  /**
   * Đóng và kết thúc phòng học Pomodoro
   */
  public async closeRoom(roomId: string, userId?: string): Promise<boolean> {
    const roomIndex = this.rooms.findIndex((r) => r.id === roomId);
    if (roomIndex !== -1) {
      this.stopTimerTicker(roomId);
      this.rooms.splice(roomIndex, 1);
    }

    try {
      await dbPool.query('DELETE FROM pomodoro_participants WHERE room_id = ?', [roomId]);
      await dbPool.query('DELETE FROM pomodoro_messages WHERE room_id = ?', [roomId]);
      await dbPool.query('DELETE FROM pomodoro_rooms WHERE id = ?', [roomId]);
    } catch (err) {
      console.warn('[PomodoroService] DB delete error:', err);
    }

    emitToRoom(roomId, 'pomodoro:room_closed', {
      roomId,
      message: 'Chủ phòng đã kết thúc và đóng phòng học.'
    });

    return true;
  }

  public async updateTimer(roomId: string, dto: UpdateTimerDto): Promise<PomodoroRoom> {
    const room = await this.getRoomById(roomId);

    switch (dto.action) {
      case 'START':
        room.status = 'RUNNING';
        room.startedAt = new Date().toISOString();
        this.startTimerTicker(roomId);
        break;

      case 'PAUSE':
        room.status = 'PAUSED';
        this.stopTimerTicker(roomId);
        break;

      case 'RESET':
        room.status = 'PAUSED';
        this.stopTimerTicker(roomId);
        room.remainingSeconds =
          room.currentMode === 'FOCUS'
            ? room.focusDurationMinutes * 60
            : room.breakDurationMinutes * 60;
        break;

      case 'NEXT_PHASE':
        this.stopTimerTicker(roomId);
        if (room.currentMode === 'FOCUS') {
          room.currentMode = 'SHORT_BREAK';
          room.remainingSeconds = room.breakDurationMinutes * 60;
        } else {
          room.currentMode = 'FOCUS';
          room.remainingSeconds = room.focusDurationMinutes * 60;
        }
        room.status = 'PAUSED';
        break;

      case 'SWITCH_MODE':
        this.stopTimerTicker(roomId);
        room.currentMode = dto.targetMode || 'FOCUS';
        room.remainingSeconds =
          room.currentMode === 'FOCUS'
            ? room.focusDurationMinutes * 60
            : room.breakDurationMinutes * 60;
        room.status = 'PAUSED';
        break;
    }

    room.updatedAt = new Date().toISOString();

    // Broadcast Realtime Timer State to all participants in this room
    emitToRoom(roomId, POMODORO_SOCKET_EVENTS.TIMER_STATE, {
      roomId,
      status: room.status,
      currentMode: room.currentMode,
      remainingSeconds: room.remainingSeconds,
      serverTime: new Date().toISOString(),
      action: dto.action
    });

    // Update database
    try {
      await dbPool.query(
        `UPDATE pomodoro_rooms 
         SET status = ?, current_mode = ?, remaining_seconds = ?, started_at = ?
         WHERE id = ?`,
        [room.status, room.currentMode, room.remainingSeconds, room.startedAt || null, roomId]
      );
    } catch {
      // Fallback
    }

    return room;
  }

  /**
   * Khởi động Ticker đếm ngược 1 giây phía máy chủ
   */
  public startTimerTicker(roomId: string) {
    if (this.activeIntervals.has(roomId)) {
      return;
    }

    const interval = setInterval(() => {
      this.tickRoom(roomId);
    }, 1000);

    this.activeIntervals.set(roomId, interval);
  }

  /**
   * Dừng Ticker đếm ngược phòng học
   */
  public stopTimerTicker(roomId: string) {
    const interval = this.activeIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.activeIntervals.delete(roomId);
    }
  }

  /**
   * Hàm đếm ngược mỗi giây được thực thi bởi server (Server-authoritative)
   */
  private tickRoom(roomId: string) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room || room.status !== 'RUNNING') {
      this.stopTimerTicker(roomId);
      return;
    }

    room.remainingSeconds -= 1;

    if (room.remainingSeconds > 0) {
      // Broadcast tick every second
      emitToRoom(roomId, POMODORO_SOCKET_EVENTS.TIMER_TICK, {
        roomId,
        remainingSeconds: room.remainingSeconds,
        currentMode: room.currentMode,
        status: room.status,
        serverTime: new Date().toISOString()
      });
    } else {
      // Session finished! Handle phase shift
      if (room.currentMode === 'FOCUS') {
        // Transition from FOCUS to SHORT_BREAK
        room.currentMode = 'SHORT_BREAK';
        room.remainingSeconds = room.breakDurationMinutes * 60;
        room.status = 'RUNNING'; // Automatically run break

        emitToRoom(roomId, POMODORO_SOCKET_EVENTS.PHASE_CHANGED, {
          roomId,
          previousMode: 'FOCUS',
          currentMode: 'SHORT_BREAK',
          remainingSeconds: room.remainingSeconds,
          status: room.status,
          message: '🎉 Chúc mừng! Phiên tập trung đã hoàn thành. Hãy thư giãn giải lao 5 phút!',
          serverTime: new Date().toISOString()
        });
      } else {
        // Transition from BREAK to FOCUS
        room.currentMode = 'FOCUS';
        room.remainingSeconds = room.focusDurationMinutes * 60;
        room.status = 'PAUSED'; // Require host to start next focus session
        this.stopTimerTicker(roomId);

        emitToRoom(roomId, POMODORO_SOCKET_EVENTS.PHASE_CHANGED, {
          roomId,
          previousMode: 'SHORT_BREAK',
          currentMode: 'FOCUS',
          remainingSeconds: room.remainingSeconds,
          status: room.status,
          message: '⚡ Hết thời gian giải lao! Sẵn sàng bấm Bắt đầu cho phiên tập trung mới!',
          serverTime: new Date().toISOString()
        });
      }

      // Sync DB
      dbPool
        .query(
          `UPDATE pomodoro_rooms SET status = ?, current_mode = ?, remaining_seconds = ? WHERE id = ?`,
          [room.status, room.currentMode, room.remainingSeconds, roomId]
        )
        .catch(() => {});
    }
  }

  /**
   * Gửi tin nhắn trao đổi trong phòng học
   */
  public async addMessage(
    roomId: string,
    user: { id: string; fullName?: string },
    messageText: string
  ): Promise<PomodoroMessage> {
    const room = await this.getRoomById(roomId);
    const message: PomodoroMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      roomId,
      userId: user.id,
      userName: user.fullName || 'Sinh viên VKU',
      message: messageText.trim(),
      createdAt: new Date().toISOString()
    };

    if (!room.messages) {
      room.messages = [];
    }
    room.messages.push(message);

    // Broadcast new message in realtime
    emitToRoom(roomId, POMODORO_SOCKET_EVENTS.NEW_MESSAGE, message);

    try {
      await dbPool.query(
        `INSERT INTO pomodoro_messages (id, room_id, user_id, user_name, message) VALUES (?, ?, ?, ?, ?)`,
        [message.id, roomId, message.userId, message.userName, message.message]
      );
    } catch {
      // Fallback
    }

    return message;
  }

  /**
   * Lấy lịch sử tin nhắn phòng học
   */
  public async getMessages(roomId: string): Promise<PomodoroMessage[]> {
    const room = await this.getRoomById(roomId);
    if (room.messages && room.messages.length > 0) {
      return room.messages;
    }

    try {
      const [rows]: any = await dbPool.query(
        `SELECT * FROM pomodoro_messages WHERE room_id = ? ORDER BY created_at ASC LIMIT 100`,
        [roomId]
      );
      if (rows && rows.length > 0) {
        room.messages = rows.map((r: any) => ({
          id: r.id,
          roomId: r.room_id,
          userId: r.user_id,
          userName: r.user_name,
          message: r.message,
          createdAt: r.created_at
        }));
        return room.messages || [];
      }
    } catch {
      // Fallback
    }

    return [];
  }

  /**
   * Gửi biểu cảm cổ vũ (Reaction) trong phòng học realtime
   */
  public addReaction(
    roomId: string,
    user: { id: string; fullName?: string },
    emoji: string
  ): PomodoroReaction {
    const reaction: PomodoroReaction = {
      roomId,
      userId: user.id,
      userName: user.fullName || 'Sinh viên VKU',
      emoji,
      timestamp: new Date().toISOString()
    };

    emitToRoom(roomId, POMODORO_SOCKET_EVENTS.NEW_REACTION, reaction);
    return reaction;
  }

  /**
   * Dọn dẹp toàn bộ intervals khi server tắt
   */
  public cleanupAllIntervals() {
    for (const [roomId, interval] of this.activeIntervals.entries()) {
      clearInterval(interval);
    }
    this.activeIntervals.clear();
  }
}

export const pomodoroService = new PomodoroService();
