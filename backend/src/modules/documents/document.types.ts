export type DocumentCategory = 'DE_THI' | 'TOM_TAT' | 'BAI_GIANG' | 'DO_AN';
export type FileType = 'PDF' | 'DOCX' | 'ZIP' | 'IMAGE';

export const DOCUMENT_CONFIG = {
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,
  USER_STORAGE_LIMIT_BYTES: 1024 * 1024 * 1024, // 1 GB / sinh vien // 50MB (R-05 Cloud free-tier limit)
  DEFAULT_QR_TTL_MINUTES: 240, // 4 hours TTL
  QR_DEEP_LINK_PREFIX: 'vkuapp://document-qr?token=',
  ALLOWED_EXTENSIONS: ['pdf', 'docx', 'zip', 'png', 'jpg'],
  CATEGORY_LABELS: {
    DE_THI: 'Đề thi & Đề cương',
    TOM_TAT: 'Tóm tắt kiến thức',
    BAI_GIANG: 'Slide & Bài giảng',
    DO_AN: 'Đồ án & Bài tập lớn'
  }
} as const;

export interface StudyDocument {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  category: DocumentCategory;
  fileUrl?: string;
  fileData?: string;
  fileName?: string;
  fileType: FileType;
  fileSizeBytes: number;
  authorId: string;
  authorName: string;
  downloadsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  activeQrToken?: string;
}

export interface DocumentQrToken {
  id: string;
  documentId: string;
  qrToken: string;
  deepLinkUrl: string;
  expiresAt: string | null;
  isRevoked: boolean;
  claimCount: number;
  createdAt: string;
}

export interface SavedDocumentRecord {
  id: string;
  userId: string;
  documentId: string;
  savedViaQr: boolean;
  idempotencyKey?: string;
  savedAt: string;
  document?: StudyDocument;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  courseCode: string;
  courseName?: string;
  category?: DocumentCategory;
  fileUrl?: string;
  fileData?: string;
  fileName?: string;
  fileType?: FileType;
  fileSizeBytes?: number;
}

export interface UpdateDocumentDto {
  title?: string;
  description?: string;
  category?: DocumentCategory;
  fileUrl?: string;
  fileType?: FileType;
  fileSizeBytes?: number;
  isActive?: boolean;
}

export interface GenerateQrDto {
  expiresInMinutes?: number; // 0 hoặc undefined = không hết hạn, mặc định 240 (4 tiếng)
}

export interface ClaimQrDto {
  qrToken: string;
  idempotencyKey?: string;
}

export interface DocumentQueryFilter {
  courseCode?: string;
  category?: DocumentCategory;
  search?: string;
  fileType?: FileType;
  page?: number;
  limit?: number;
}

export interface ClaimQrResponse {
  isAlreadySaved: boolean;
  isAuthor?: boolean;
  message: string;
  document: StudyDocument;
  savedAt?: string;
}
