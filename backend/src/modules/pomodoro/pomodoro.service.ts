import { PomodoroRoom, CreateRoomDto, UpdateTimerDto } from './pomodoro.types';
import { AppError } from '../../middlewares/error.middleware';

class PomodoroService {
  private rooms: PomodoroRoom[] = [
    {
      id: 'room_01',
      title: 'Phòng học nhóm ôn WBS & Project Charter',
      courseCode: 'IT001',
      courseName: 'Quản lý dự án phần mềm',
      hostId: 'usr_01',
      hostName: 'Nguyễn Quang Hoàng',
      focusDurationMinutes: 25,
      breakDurationMinutes: 5,
      currentMode: 'FOCUS',
      status: 'RUNNING',
      startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      remainingSeconds: 20 * 60,
      participants: [
        {
          userId: 'usr_01',
          fullName: 'Nguyễn Quang Hoàng',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
          isHost: true,
          joinedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          userId: 'usr_02',
          fullName: 'Phạm Nguyễn Phú Trọng',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
          isHost: false,
          joinedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          userId: 'usr_03',
          fullName: 'Nguyễn Thị Diễm Quỳnh',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          isHost: false,
          joinedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'room_02',
      title: 'Luyện đề trắc nghiệm React Native Navigation',
      courseCode: 'IT002',
      courseName: 'Lập trình di động đa nền tảng',
      hostId: 'usr_04',
      hostName: 'Tạ Kim Hương',
      focusDurationMinutes: 25,
      breakDurationMinutes: 5,
      currentMode: 'FOCUS',
      status: 'PAUSED',
      remainingSeconds: 25 * 60,
      participants: [
        {
          userId: 'usr_04',
          fullName: 'Tạ Kim Hương',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
          isHost: true,
          joinedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  ];

  public getRooms(courseCode?: string) {
    if (courseCode) {
      return this.rooms.filter((r) => r.courseCode.toLowerCase() === courseCode.toLowerCase());
    }
    return this.rooms;
  }

  public getRoomById(id: string) {
    const room = this.rooms.find((r) => r.id === id);
    if (!room) {
      throw new AppError('Không tìm thấy phòng Pomodoro', 404);
    }
    return room;
  }

  public createRoom(host: { id: string; fullName?: string }, dto: CreateRoomDto) {
    const focusDuration = dto.focusDurationMinutes || 25;
    const breakDuration = dto.breakDurationMinutes || 5;

    const newRoom: PomodoroRoom = {
      id: `room_${Date.now()}`,
      title: dto.title,
      courseCode: dto.courseCode,
      courseName: dto.courseName || dto.courseCode,
      hostId: host.id,
      hostName: host.fullName || 'Thành viên VKU',
      focusDurationMinutes: focusDuration,
      breakDurationMinutes: breakDuration,
      currentMode: 'FOCUS',
      status: 'PAUSED',
      remainingSeconds: focusDuration * 60,
      participants: [
        {
          userId: host.id,
          fullName: host.fullName || 'Thành viên VKU',
          isHost: true,
          joinedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.rooms.unshift(newRoom);
    return newRoom;
  }

  public joinRoom(roomId: string, user: { id: string; fullName?: string; avatarUrl?: string }) {
    const room = this.getRoomById(roomId);

    const isMember = room.participants.some((p) => p.userId === user.id);
    if (!isMember) {
      room.participants.push({
        userId: user.id,
        fullName: user.fullName || 'Sinh viên VKU',
        avatarUrl: user.avatarUrl,
        isHost: false,
        joinedAt: new Date().toISOString()
      });
    }

    return room;
  }

  public leaveRoom(roomId: string, userId: string) {
    const room = this.getRoomById(roomId);
    room.participants = room.participants.filter((p) => p.userId !== userId);

    // If host leaves and there are participants, promote next member as host
    if (room.hostId === userId && room.participants.length > 0) {
      room.hostId = room.participants[0].userId;
      room.hostName = room.participants[0].fullName;
      room.participants[0].isHost = true;
    }

    return { success: true, message: 'Đã rời khỏi phòng học' };
  }

  public updateTimer(roomId: string, dto: UpdateTimerDto) {
    const room = this.getRoomById(roomId);

    switch (dto.action) {
      case 'START':
        room.status = 'RUNNING';
        room.startedAt = new Date().toISOString();
        break;
      case 'PAUSE':
        room.status = 'PAUSED';
        break;
      case 'RESET':
        room.status = 'PAUSED';
        room.remainingSeconds =
          room.currentMode === 'FOCUS'
            ? room.focusDurationMinutes * 60
            : room.breakDurationMinutes * 60;
        break;
      case 'NEXT_PHASE':
        if (room.currentMode === 'FOCUS') {
          room.currentMode = 'SHORT_BREAK';
          room.remainingSeconds = room.breakDurationMinutes * 60;
        } else {
          room.currentMode = 'FOCUS';
          room.remainingSeconds = room.focusDurationMinutes * 60;
        }
        room.status = 'PAUSED';
        break;
    }

    return room;
  }
}

export const pomodoroService = new PomodoroService();

