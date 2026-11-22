import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string().min(1),
});

export const sendChatSchema = z.object({
  message: z.string().trim().min(1, 'Tin nhắn không được để trống').max(4000, 'Tin nhắn quá dài'),
  history: z.array(chatMessageSchema).max(20).optional().default([]),
});

export type SendChatInput = z.infer<typeof sendChatSchema>;
