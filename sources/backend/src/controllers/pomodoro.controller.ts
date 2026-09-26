import { Request, Response } from 'express';
import { PomodoroRoom } from '../types';

const pomodoroRooms: PomodoroRoom[] = [
  {
    id: 'pomo_01',
    roomName: 'Ôn thi cuối kỳ QLDA phần mềm - TS. Nguyễn Thành Tuấn',
    hostId: 'usr_01',
    hostName: 'Nguyễn Quang Hoàng',
    focusMinutes: 25,
    breakMinutes: 5,
    status: 'focusing',
    participantCount: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pomo_02',
    roomName: 'Luyện đề Lập trình di động Expo',
    hostId: 'usr_04',
    hostName: 'Phạm Nguyễn Phú Trọng',
    focusMinutes: 45,
    breakMinutes: 10,
    status: 'idle',
    participantCount: 3,
    createdAt: new Date().toISOString()
  }
];

export const getRooms = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: pomodoroRooms
  });
};

export const createRoom = async (req: Request, res: Response) => {
  const { roomName, hostName, focusMinutes, breakMinutes } = req.body;

  if (!roomName) {
    return res.status(400).json({ success: false, message: 'Tên phòng Pomodoro là bắt buộc.' });
  }

  const newRoom: PomodoroRoom = {
    id: `pomo_${Date.now()}`,
    roomName,
    hostId: 'usr_me',
    hostName: hostName || 'Trưởng nhóm Pomodoro',
    focusMinutes: Number(focusMinutes) || 25,
    breakMinutes: Number(breakMinutes) || 5,
    status: 'idle',
    participantCount: 1,
    createdAt: new Date().toISOString()
  };

  pomodoroRooms.unshift(newRoom);

  return res.status(201).json({
    success: true,
    message: 'Tạo phòng Pomodoro học nhóm thành công!',
    data: newRoom
  });
};

export const joinRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = pomodoroRooms.find(r => r.id === roomId);

  if (!room) {
    return res.status(404).json({ success: false, message: 'Phòng không tồn tại.' });
  }

  room.participantCount += 1;

  return res.status(200).json({
    success: true,
    message: `Đã tham gia phòng học nhóm: ${room.roomName}`,
    data: room
  });
};
