export interface StudyDocument {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP' | 'IMAGE';
  fileSizeBytes: number;
  authorId: string;
  authorName: string;
  downloadsCount: number;
  qrToken?: string;
  createdAt: string;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  courseCode: string;
  courseName?: string;
  fileUrl: string;
  fileType?: 'PDF' | 'DOCX' | 'ZIP' | 'IMAGE';
  fileSizeBytes?: number;
}

export interface SavedDocumentRecord {
  id: string;
  userId: string;
  documentId: string;
  savedViaQr: boolean;
  savedAt: string;
  document: StudyDocument;
}

