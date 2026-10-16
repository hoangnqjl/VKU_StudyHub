import { StudyDocument, CreateDocumentDto, SavedDocumentRecord } from './document.types';
import { AppError } from '../../middlewares/error.middleware';

class DocumentService {
  // In-memory document repository
  private documents: StudyDocument[] = [
    {
      id: 'doc_01',
      title: 'Đề cương ôn tập & 100 câu trắc nghiệm Quản lý dự án phần mềm',
      description: 'Tổng hợp kiến thức Scrum, Agile, WBS, RTM kèm đề thi mẫu các năm trước của VKU.',
      courseCode: 'IT001',
      courseName: 'Quản lý dự án phần mềm',
      fileUrl: 'https://vku.udn.vn/documents/de_cuong_qldan_2026.pdf',
      fileType: 'PDF',
      fileSizeBytes: 2450000,
      authorId: 'usr_01',
      authorName: 'Nguyễn Quang Hoàng',
      downloadsCount: 142,
      qrToken: 'QR_IT001_DECUONG_2026',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'doc_02',
      title: 'Slide bài giảng & Cheatsheet React Native Hooks & Navigation',
      description: 'Tóm tắt useState, useEffect, useCallback, React Navigation Tabs và Expo Camera API.',
      courseCode: 'IT002',
      courseName: 'Lập trình di động đa nền tảng',
      fileUrl: 'https://vku.udn.vn/documents/react_native_cheatsheet.pdf',
      fileType: 'PDF',
      fileSizeBytes: 1850000,
      authorId: 'usr_02',
      authorName: 'Phạm Nguyễn Phú Trọng',
      downloadsCount: 98,
      qrToken: 'QR_IT002_REACT_NATIVE_2026',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'doc_03',
      title: 'Bộ đề thi thử môn Cơ sở dữ liệu nâng cao (Có đáp án chi tiết)',
      description: 'Các dạng bài tập về Trigger, Stored Procedure, Indexing và tối ưu truy vấn SQL.',
      courseCode: 'IT003',
      courseName: 'Cơ sở dữ liệu nâng cao',
      fileUrl: 'https://vku.udn.vn/documents/csdl_nangcao_dethi.pdf',
      fileType: 'PDF',
      fileSizeBytes: 3120000,
      authorId: 'usr_05',
      authorName: 'Đoàn Hữu Khánh',
      downloadsCount: 75,
      qrToken: 'QR_IT003_CSDL_2026',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];

  // In-memory saved documents by users
  private savedDocuments: SavedDocumentRecord[] = [
    {
      id: 'saved_01',
      userId: 'usr_01',
      documentId: 'doc_02',
      savedViaQr: true,
      savedAt: new Date(Date.now() - 86400000).toISOString(),
      document: null as any
    }
  ];

  constructor() {
    // Link initial relation
    this.savedDocuments[0].document = this.documents[1];
  }

  public getDocuments(filter?: { courseCode?: string; search?: string; fileType?: string }) {
    return this.documents.filter((doc) => {
      if (filter?.courseCode && doc.courseCode.toLowerCase() !== filter.courseCode.toLowerCase()) {
        return false;
      }
      if (filter?.fileType && doc.fileType !== filter.fileType) {
        return false;
      }
      if (filter?.search) {
        const query = filter.search.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(query);
        const matchDesc = doc.description.toLowerCase().includes(query);
        const matchCourse = doc.courseName.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCourse) return false;
      }
      return true;
    });
  }

  public getDocumentById(id: string) {
    const doc = this.documents.find((d) => d.id === id);
    if (!doc) {
      throw new AppError('Không tìm thấy tài liệu', 404);
    }
    return doc;
  }

  public createDocument(author: { id: string; fullName?: string }, dto: CreateDocumentDto) {
    const newDoc: StudyDocument = {
      id: `doc_${Date.now()}`,
      title: dto.title,
      description: dto.description || '',
      courseCode: dto.courseCode,
      courseName: dto.courseName || dto.courseCode,
      fileUrl: dto.fileUrl,
      fileType: dto.fileType || 'PDF',
      fileSizeBytes: dto.fileSizeBytes || 1024000,
      authorId: author.id,
      authorName: author.fullName || 'Thành viên VKU',
      downloadsCount: 0,
      qrToken: `QR_${dto.courseCode}_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this.documents.unshift(newDoc);
    return newDoc;
  }

  public generateQrToken(documentId: string) {
    const doc = this.getDocumentById(documentId);
    if (!doc.qrToken) {
      doc.qrToken = `QR_${doc.courseCode}_${Date.now()}`;
    }

    return {
      documentId: doc.id,
      title: doc.title,
      qrToken: doc.qrToken,
      qrPayloadUrl: `vku-studyhub://document/claim/${doc.qrToken}`,
      generatedAt: new Date().toISOString()
    };
  }

  public claimDocumentByQr(userId: string, qrToken: string) {
    const doc = this.documents.find((d) => d.qrToken === qrToken);
    if (!doc) {
      throw new AppError('Mã QR không tồn tại hoặc đã hết hạn', 404);
    }

    // Check if user already saved this document
    const alreadySaved = this.savedDocuments.find(
      (item) => item.userId === userId && item.documentId === doc.id
    );

    if (alreadySaved) {
      return {
        isAlreadySaved: true,
        message: 'Tài liệu này đã có trong kho cá nhân của bạn',
        document: doc
      };
    }

    // Increment download/save count
    doc.downloadsCount += 1;

    const savedRecord: SavedDocumentRecord = {
      id: `saved_${Date.now()}`,
      userId,
      documentId: doc.id,
      savedViaQr: true,
      savedAt: new Date().toISOString(),
      document: doc
    };

    this.savedDocuments.unshift(savedRecord);

    return {
      isAlreadySaved: false,
      message: 'Quét mã QR thành công! Đã lưu tài liệu vào kho cá nhân của bạn',
      document: doc
    };
  }

  public getSavedDocuments(userId: string) {
    return this.savedDocuments
      .filter((s) => s.userId === userId)
      .map((s) => ({
        ...s,
        document: this.documents.find((d) => d.id === s.documentId) || s.document
      }));
  }
}

export const documentService = new DocumentService();

