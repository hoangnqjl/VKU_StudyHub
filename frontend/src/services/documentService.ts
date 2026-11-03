import { apiClient } from './apiClient';

export interface DocumentItem {
  id: string;
  title: string;
  subject?: string;
  courseCode?: string;
  courseName?: string;
  category?: string;
  description?: string;
  fileUrl?: string;
  fileSize?: number | string;
  uploadedBy?: {
    id: string;
    fullName: string;
  };
  ownerName?: string;
  ownerStudentId?: string;
  downloadsCount?: number;
  likesCount?: number;
  isSaved?: boolean;
  createdAt: string;
}

export interface StorageUsage {
  usedBytes: number;
  totalBytes: number;
  usedMb: number;
  totalMb: number;
  usedPercentage: number;
  documentsCount: number;
}

export const documentService = {
  async getDocuments(params?: {
    category?: string;
    subject?: string;
    courseCode?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await apiClient.get<DocumentItem[]>('/documents', params);
    return res.data;
  },

  async getStorageUsage(): Promise<StorageUsage> {
    const res = await apiClient.get<StorageUsage>('/documents/storage');
    return res.data;
  },

  async uploadFile(fileData: string, fileName: string) {
    const res = await apiClient.post<{
      fileUrl: string;
      fileName: string;
      fileSizeBytes: number;
      isCloudinary: boolean;
      publicId?: string;
    }>('/documents/upload', { fileData, fileName });
    return res.data;
  },

  async getDocumentById(id: string) {
    const res = await apiClient.get<DocumentItem>(`/documents/${id}`);
    return res.data;
  },

  async getSavedDocuments() {
    const res = await apiClient.get<DocumentItem[]>('/documents/saved');
    return res.data;
  },

  async toggleSaveDocument(id: string) {
    const res = await apiClient.post<any>(`/documents/qr/claim`, {
      qrToken: `QR_DOC_${id}`,
    });
    return res.data;
  },

  async generateQRToken(documentId: string, isPermanent = true) {
    const res = await apiClient.post<{ qrToken: string; qrUrl: string; expiresAt: string }>(
      `/documents/${documentId}/qr`,
      { isPermanent }
    );
    return res.data;
  },

  async getDocumentByQR(qrToken: string) {
    const res = await apiClient.get<DocumentItem>(`/documents/qr/info/${qrToken}`);
    return res.data;
  },

  async claimQRDocument(qrToken: string) {
    const res = await apiClient.post<any>('/documents/qr/claim', { qrToken });
    return res.data;
  },

  async deleteDocument(id: string) {
    const res = await apiClient.delete(`/documents/${id}`);
    return res.data;
  },

  async createDocument(data: {
    title: string;
    description?: string;
    courseCode: string;
    courseName?: string;
    category?: 'DE_THI' | 'TOM_TAT' | 'BAI_GIANG' | 'DO_AN';
    fileUrl?: string;
    fileData?: string;
    fileName?: string;
    fileType?: 'PDF' | 'DOCX' | 'ZIP' | 'IMAGE';
    fileSizeBytes?: number;
  }) {
    const res = await apiClient.post<DocumentItem>('/documents', data);
    return res.data;
  },
};
