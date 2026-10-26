import { z } from 'zod';

export const checkInSchema = z.object({
  body: z.object({
    locationId: z.string().min(1, 'Địa điểm check-in không được để trống'),
    customLocationName: z.string().max(100, 'Tên địa điểm tùy chỉnh tối đa 100 ký tự').optional(),
    courseCode: z.string().min(1, 'Môn học không được để trống'),
    customCourseName: z.string().max(150, 'Tên môn học tùy chỉnh tối đa 150 ký tự').optional(),
    studyNote: z.string().max(120, 'Ghi chú vị trí bàn ngồi tối đa 120 ký tự').optional()
  })
});

export const extendCheckInSchema = z.object({
  body: z
    .object({
      note: z.string().max(120, 'Ghi chú tối đa 120 ký tự').optional()
    })
    .optional()
});

export const joinTableRequestSchema = z.object({
  body: z.object({
    targetUserId: z.string().min(1, 'Người nhận lời mời không hợp lệ'),
    message: z.string().max(200, 'Tin nhắn tối đa 200 ký tự').optional(),
    senderSeatNote: z.string().max(120, 'Ghi chú bàn ngồi tối đa 120 ký tự').optional()
  })
});

export const updateJoinRequestSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED'], {
      errorMap: () => ({ message: 'Trạng thái phản hồi phải là ACCEPTED hoặc REJECTED' })
    })
  })
});
