import { Request, Response } from 'express';
import { RadarCheckIn } from '../types';

const activeCheckIns: RadarCheckIn[] = [
  {
    id: 'chk_01',
    userId: 'usr_02',
    studentId: '23IT.B088',
    fullName: 'Tạ Kim Hương',
    courseCode: 'IT001',
    courseName: 'Quản lý dự án phần mềm',
    location: 'Thư viện tầng 2 - Bàn A4',
    note: 'Đang ôn bài WBS & Charter',
    isActive: true,
    checkInTime: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'chk_02',
    userId: 'usr_03',
    studentId: '23IT.B196',
    fullName: 'Nguyễn Thị Diễm Quỳnh',
    courseCode: 'IT002',
    courseName: 'Lập trình di động',
    location: 'Khu tự học Tòa V - Phòng V201',
    note: 'Thiết kế UI Expo React Native',
    isActive: true,
    checkInTime: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'chk_03',
    userId: 'usr_04',
    studentId: '23CE.B025',
    fullName: 'Phạm Nguyễn Phú Trọng',
    courseCode: 'IT002',
    courseName: 'Lập trình di động',
    location: 'Căn tin sinh viên VKU',
    note: 'Code module Camera & Barcode',
    isActive: true,
    checkInTime: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

export const getActiveBuddies = async (req: Request, res: Response) => {
  const { courseCode, location } = req.query;

  let results = activeCheckIns.filter(c => c.isActive);

  if (courseCode) {
    results = results.filter(c => c.courseCode.toLowerCase() === String(courseCode).toLowerCase());
  }

  if (location) {
    results = results.filter(c => c.location.toLowerCase().includes(String(location).toLowerCase()));
  }

  return res.status(200).json({
    success: true,
    total: results.length,
    data: results
  });
};

export const checkIn = async (req: Request, res: Response) => {
  const { userId, studentId, fullName, courseCode, courseName, location, note } = req.body;

  if (!courseCode || !location) {
    return res.status(400).json({
      success: false,
      message: 'Môn học (courseCode) và Địa điểm (location) là bắt buộc.'
    });
  }

  const newCheckIn: RadarCheckIn = {
    id: `chk_${Date.now()}`,
    userId: userId || 'usr_guest',
    studentId: studentId || '23IT.GUEST',
    fullName: fullName || 'Bạn học VKU',
    courseCode,
    courseName: courseName || courseCode,
    location,
    note: note || '',
    isActive: true,
    checkInTime: new Date().toISOString()
  };

  // Remove existing active check-ins for this user
  const idx = activeCheckIns.findIndex(c => c.userId === newCheckIn.userId);
  if (idx !== -1) {
    activeCheckIns[idx] = newCheckIn;
  } else {
    activeCheckIns.unshift(newCheckIn);
  }

  return res.status(201).json({
    success: true,
    message: 'Check-in Study Radar thành công!',
    data: newCheckIn
  });
};

export const checkOut = async (req: Request, res: Response) => {
  const { checkInId } = req.params;
  const item = activeCheckIns.find(c => c.id === checkInId);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy phiên check-in.' });
  }

  item.isActive = false;

  return res.status(200).json({
    success: true,
    message: 'Đã tắt trạng thái tìm bạn học.',
    data: item
  });
};
