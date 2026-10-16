import { z } from 'zod';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Tiêu đề tài liệu phải từ 3 ký tự trở lên'),
    description: z.string().optional(),
    courseCode: z.string().min(1, 'Mã môn học không được để trống'),
    courseName: z.string().optional(),
    fileUrl: z.string().url('Đường dẫn file (URL) không hợp lệ'),
    fileType: z.enum(['PDF', 'DOCX', 'ZIP', 'IMAGE']).optional(),
    fileSizeBytes: z.number().positive().optional()
  })
});

export const claimQrSchema = z.object({
  params: z.object({
    qrToken: z.string().min(4, 'Mã QR không hợp lệ')
  })
});

