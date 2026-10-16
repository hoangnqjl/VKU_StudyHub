import { z } from 'zod';

export const createRoomSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Tên phòng học phải có ít nhất 3 ký tự'),
    courseCode: z.string().min(1, 'Mã môn học không được để trống'),
    courseName: z.string().optional(),
    focusDurationMinutes: z.number().int().min(5).max(120).optional().default(25),
    breakDurationMinutes: z.number().int().min(1).max(30).optional().default(5)
  })
});

export const updateTimerSchema = z.object({
  body: z.object({
    action: z.enum(['START', 'PAUSE', 'RESET', 'NEXT_PHASE'])
  })
});

