import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { registerPomodoroSocket } from '../modules/pomodoro/pomodoro.socket';

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: http.Server): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ['websocket', 'polling']
  });

  // Socket Authentication & Identity Middleware
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

      if (token) {
        try {
          const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
          socket.data.user = {
            id: decoded.id,
            studentId: decoded.studentId,
            fullName: decoded.fullName || decoded.studentId,
            email: decoded.email
          };
        } catch {
          // Token expired or invalid: fallback to guest data from handshake or generate guest
          socket.data.user = socket.handshake.auth?.user || {
            id: `usr_${socket.id.substring(0, 8)}`,
            fullName: 'Sinh viên VKU',
            studentId: '23IT.GUEST'
          };
        }
      } else {
        // No token provided: allow guest or development user
        socket.data.user = socket.handshake.auth?.user || {
          id: `usr_${socket.id.substring(0, 8)}`,
          fullName: 'Sinh viên VKU',
          studentId: '23IT.GUEST'
        };
      }
      next();
    } catch (err: any) {
      console.warn(`[Socket.IO] Auth middleware warning: ${err.message}`);
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    console.log(`🔌 [Socket.IO] Client connected: ${socket.id} (User: ${user?.fullName || user?.id})`);

    // Register module socket handlers
    registerPomodoroSocket(io!, socket);

    socket.on('disconnect', (reason) => {
      console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  console.log('⚡ [Socket.IO] Realtime WebSocket Server initialized');
  return io;
};

export const getSocketIO = (): SocketIOServer | null => io;

export const emitToRoom = (roomId: string, event: string, payload: any) => {
  if (io) {
    io.to(`pomodoro:${roomId}`).emit(event, payload);
  }
};

