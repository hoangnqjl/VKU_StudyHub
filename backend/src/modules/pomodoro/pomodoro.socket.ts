import { Server as SocketIOServer, Socket } from 'socket.io';
import { pomodoroService } from './pomodoro.service';
import { POMODORO_SOCKET_EVENTS, TimerMode } from './pomodoro.types';

export const registerPomodoroSocket = (io: SocketIOServer, socket: Socket) => {
  const defaultUser = socket.data.user || {
    id: `usr_${socket.id.substring(0, 8)}`,
    fullName: 'Sinh viên VKU'
  };

  /**
   * 1. Lắng nghe sự kiện tham gia phòng học Pomodoro
   */
  socket.on(
    POMODORO_SOCKET_EVENTS.JOIN_ROOM,
    async (payload: { roomId: string; user?: { id: string; fullName?: string; avatarUrl?: string } }) => {
      try {
        const { roomId, user } = payload || {};
        if (!roomId) {
          socket.emit(POMODORO_SOCKET_EVENTS.ERROR, { message: 'Mã phòng (roomId) là bắt buộc' });
          return;
        }

        const activeUser = {
          id: user?.id || defaultUser.id,
          fullName: user?.fullName || defaultUser.fullName,
          avatarUrl: user?.avatarUrl
        };

        const roomChannel = `pomodoro:${roomId}`;
        socket.join(roomChannel);

        const room = await pomodoroService.joinRoom(roomId, activeUser, socket.id);
        const messages = await pomodoroService.getMessages(roomId);

        // Gửi toàn bộ trạng thái hiện tại của phòng cho client vừa kết nối
        socket.emit(POMODORO_SOCKET_EVENTS.ROOM_STATE, {
          room: {
            ...room,
            messages
          },
          serverTime: new Date().toISOString()
        });

        console.log(`👤 [Pomodoro Socket] User ${activeUser.fullName} (${activeUser.id}) joined room ${roomId}`);
      } catch (error: any) {
        socket.emit(POMODORO_SOCKET_EVENTS.ERROR, { message: error.message || 'Lỗi khi vào phòng Pomodoro' });
      }
    }
  );

  /**
   * 2. Lắng nghe sự kiện rời khỏi phòng học Pomodoro
   */
  socket.on(POMODORO_SOCKET_EVENTS.LEAVE_ROOM, async (payload: { roomId: string; userId?: string }) => {
    try {
      const { roomId, userId } = payload || {};
      if (!roomId) return;

      const targetUserId = userId || defaultUser.id;
      const roomChannel = `pomodoro:${roomId}`;
      socket.leave(roomChannel);

      await pomodoroService.leaveRoom(roomId, targetUserId);
      console.log(`👋 [Pomodoro Socket] User ${targetUserId} left room ${roomId}`);
    } catch (error: any) {
      socket.emit(POMODORO_SOCKET_EVENTS.ERROR, { message: error.message });
    }
  });

  /**
   * 3. Lắng nghe sự kiện điều khiển Timer (Start, Pause, Reset, Next Phase, Switch Mode)
   */
  socket.on(
    POMODORO_SOCKET_EVENTS.TIMER_ACTION,
    async (payload: {
      roomId: string;
      action: 'START' | 'PAUSE' | 'RESET' | 'NEXT_PHASE' | 'SWITCH_MODE';
      targetMode?: TimerMode;
    }) => {
      try {
        const { roomId, action, targetMode } = payload || {};
        if (!roomId || !action) {
          socket.emit(POMODORO_SOCKET_EVENTS.ERROR, { message: 'roomId và action là bắt buộc' });
          return;
        }

        await pomodoroService.updateTimer(roomId, { action, targetMode });
        console.log(`⏱ [Pomodoro Socket] Action [${action}] executed for room ${roomId}`);
      } catch (error: any) {
        socket.emit(POMODORO_SOCKET_EVENTS.ERROR, { message: error.message });
      }
    }
  );

  /**
   * 4. Lắng nghe yêu cầu đồng bộ thời gian (Sync Request)
   */
  socket.on(POMODORO_SOCKET_EVENTS.SYNC_REQUEST, async (payload: { roomId: string }) => {
    try {
      const { roomId } = payload || {};
      if (!roomId) return;

      const room = await pomodoroService.getRoomById(roomId);
      socket.emit(POMODORO_SOCKET_EVENTS.TIMER_STATE, {
        roomId: room.id,
        status: room.status,
        currentMode: room.currentMode,
        remainingSeconds: room.remainingSeconds,
        serverTime: new Date().toISOString()
      });
    } catch {
      // Ignored
    }
  });

  /**
   * 5. Lắng nghe gửi tin nhắn trao đổi trong phòng (Realtime Chat)
   */
  socket.on(POMODORO_SOCKET_EVENTS.SEND_MESSAGE, async (payload: { roomId: string; message: string }) => {
    try {
      const { roomId, message } = payload || {};
      if (!roomId || !message?.trim()) return;

      await pomodoroService.addMessage(roomId, defaultUser, message);
    } catch (error: any) {
      socket.emit(POMODORO_SOCKET_EVENTS.ERROR, { message: error.message });
    }
  });

  /**
   * 6. Lắng nghe gửi Reaction biểu cảm cổ vũ (Realtime Reaction)
   */
  socket.on(POMODORO_SOCKET_EVENTS.SEND_REACTION, (payload: { roomId: string; emoji: string }) => {
    try {
      const { roomId, emoji } = payload || {};
      if (!roomId || !emoji) return;

      pomodoroService.addReaction(roomId, defaultUser, emoji);
    } catch {
      // Ignored
    }
  });

  /**
   * 7. Xử lý khi socket ngắt kết nối
   */
  socket.on('disconnect', async () => {
    try {
      await pomodoroService.handleSocketDisconnect(socket.id);
    } catch {
      // Ignored
    }
  });
};

