import { z } from 'zod';
import { DOCUMENT_CONFIG } from './document.types';

export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Tiêu đề tài liệu phải từ 3 ký tự trở lên').max(150, 'Tiêu đề không được vượt quá 150 ký tự'),
    description: z.string().optional(),
    courseCode: z.string().min(1, 'Mã môn học không được để trống').max(20),
    courseName: z.string().optional(),
    category: z.enum(['DE_THI', 'TOM_TAT', 'BAI_GIANG', 'DO_AN']).optional().default('TOM_TAT'),
    fileUrl: z.string().optional(),
    fileData: z.string().optional(),
    fileName: z.string().optional(),
    fileType: z.enum(['PDF', 'DOCX', 'ZIP', 'IMAGE']).optional().default('PDF'),
    fileSizeBytes: z
      .number()
      .positive('Dung lượng tệp phải lớn hơn 0')
      .max(DOCUMENT_CONFIG.MAX_FILE_SIZE_BYTES, 'Dung lượng tệp vượt quá giới hạn 50MB cho phép')
      .optional()
  })
});

export const updateDocumentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Mã định danh tài liệu không hợp lệ')
  }),
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().optional(),
    category: z.enum(['DE_THI', 'TOM_TAT', 'BAI_GIANG', 'DO_AN']).optional(),
    fileUrl: z.string().url('Đường dẫn file (URL) không hợp lệ').optional(),
    fileType: z.enum(['PDF', 'DOCX', 'ZIP', 'IMAGE']).optional(),
    fileSizeBytes: z.number().positive().max(DOCUMENT_CONFIG.MAX_FILE_SIZE_BYTES).optional(),
    isActive: z.boolean().optional()
  })
});

export const documentQuerySchema = z.object({
  query: z.object({
    courseCode: z.string().optional(),
    category: z.enum(['DE_THI', 'TOM_TAT', 'BAI_GIANG', 'DO_AN']).optional(),
    search: z.string().optional(),
    fileType: z.enum(['PDF', 'DOCX', 'ZIP', 'IMAGE']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  }).optional()
});

export const generateQrSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Mã định danh tài liệu không hợp lệ')
  }),
  body: z.object({
    expiresInMinutes: z.number().min(0, 'Thời gian hết hạn không được âm').max(10080, 'Thời gian tối đa là 7 ngày').optional()
  }).optional()
});

export const claimQrSchema = z.object({
  body: z.object({
    qrToken: z.string().min(4, 'Mã QR không hợp lệ'),
    idempotencyKey: z.string().optional()
  })
});

export const revokeQrSchema = z.object({
  params: z.object({
    qrToken: z.string().min(4, 'Mã QR không hợp lệ')
  })
});

export const deleteDocumentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Mã định danh tài liệu không hợp lệ')
  })
});
