import { z } from 'zod';

export const checkInSchema = z.object({
  body: z.object({
    locationId: z.string().min(1, 'Địa điểm check-in không được để trống'),
    courseCode: z.string().min(1, 'Môn học không được để trống'),
    courseName: z.string().optional(),
    studyNote: z.string().max(120, 'Ghi chú tối đa 120 ký tự').optional()
  })
});

export const joinTableRequestSchema = z.object({
  body: z.object({
    targetUserId: z.string().min(1, 'Người nhận lời mời không hợp lệ'),
    message: z.string().max(200, 'Tin nhắn tối đa 200 ký tự').optional(),
    senderSeatNote: z.string().optional()
  })
});

export const updateJoinRequestSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED'])
  })
});

