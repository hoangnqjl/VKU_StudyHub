import { ENV } from '../../config/env';
import { cloudinaryService } from '../../shared/services/cloudinary.service';
import { dbPool } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { VKU_SAMPLE_COURSES } from '../../shared/constants/courses';
import {
  StudyDocument,
  DocumentQrToken,
  SavedDocumentRecord,
  CreateDocumentDto,
  UpdateDocumentDto,
  GenerateQrDto,
  ClaimQrDto,
  DocumentQueryFilter,
  ClaimQrResponse,
  DOCUMENT_CONFIG,
  DocumentCategory
} from './document.types';

class DocumentService {

  private normalizeFileUrl(url?: string): string {
    if (!url) return '';
    if (url.includes('cdn.vku.udn.vn')) {
      const filename = url.split('/').pop() || 'document.pdf';
      return `http://localhost:5000/uploads/documents/${filename}`;
    }
    return url;
  }

  // In-memory fallback stores (chỉ lưu các tài liệu thực tế do người dùng tải lên)
  private inMemoryDocs: StudyDocument[] = [];
  private inMemoryTokens: DocumentQrToken[] = [];
  private inMemorySaved: SavedDocumentRecord[] = [];

  private parseCleanToken(rawToken: string): string {
    if (!rawToken) return '';
    let token = rawToken.trim();
    if (token.startsWith(DOCUMENT_CONFIG.QR_DEEP_LINK_PREFIX)) {
      token = token.replace(DOCUMENT_CONFIG.QR_DEEP_LINK_PREFIX, '');
    } else if (token.includes('token=')) {
      token = token.split('token=')[1].split('&')[0];
    }
    return token.trim();
  }

  private resolveCourseName(code: string, fallback?: string): string {
    const matched = VKU_SAMPLE_COURSES.find((c) => c.code.toLowerCase() === code.toLowerCase());
    return matched ? matched.name : fallback || code;
  }

  /**
   * 1. Lấy danh mục tài liệu theo bộ lọc (môn, danh mục, từ khóa, phân trang) - US-16
   */
  public async getDocuments(filter?: DocumentQueryFilter): Promise<StudyDocument[]> {
    try {
      let sql = `
        SELECT d.*, q.qr_token as active_qr_token 
        FROM documents d
        LEFT JOIN document_qr_tokens q ON d.id = q.document_id AND q.is_revoked = FALSE AND (q.expires_at IS NULL OR q.expires_at > NOW())
        WHERE d.is_active = TRUE
      `;
      const params: any[] = [];

      if (filter?.courseCode) {
        sql += ' AND LOWER(d.course_code) = LOWER(?)';
        params.push(filter.courseCode);
      }
      if (filter?.category) {
        sql += ' AND d.category = ?';
        params.push(filter.category);
      }
      if (filter?.fileType) {
        sql += ' AND d.file_type = ?';
        params.push(filter.fileType);
      }
      if (filter?.search) {
        sql += ' AND (LOWER(d.title) LIKE ? OR LOWER(d.description) LIKE ? OR LOWER(d.course_name) LIKE ?)';
        const query = `%${filter.search.toLowerCase()}%`;
        params.push(query, query, query);
      }

      sql += ' ORDER BY d.created_at DESC';

      if (filter?.limit) {
        const page = filter.page && filter.page > 0 ? filter.page : 1;
        const offset = (page - 1) * filter.limit;
        sql += ' LIMIT ? OFFSET ?';
        params.push(filter.limit, offset);
      }

      const [rows] = (await dbPool.query(sql, params)) as any;
      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description || '',
          courseCode: r.course_code,
          courseName: r.course_name,
          category: r.category as DocumentCategory,
          fileUrl: this.normalizeFileUrl(r.file_url),
          fileType: r.file_type,
          fileSizeBytes: Number(r.file_size_bytes) || 0,
          authorId: r.author_id,
          authorName: r.author_name,
          downloadsCount: Number(r.downloads_count) || 0,
          isActive: Boolean(r.is_active),
          createdAt: new Date(r.created_at).toISOString(),
          updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
          activeQrToken: r.active_qr_token || undefined
        }));
      }
    } catch {
      // Fallback to in-memory store
    }

    // In-memory filter logic
    return this.inMemoryDocs
      .filter((doc) => {
        if (!doc.isActive) return false;
        if (filter?.courseCode && doc.courseCode.toLowerCase() !== filter.courseCode.toLowerCase()) return false;
        if (filter?.category && doc.category !== filter.category) return false;
        if (filter?.fileType && doc.fileType !== filter.fileType) return false;
        if (filter?.search) {
          const q = filter.search.toLowerCase();
          const matchTitle = doc.title.toLowerCase().includes(q);
          const matchDesc = doc.description.toLowerCase().includes(q);
          const matchCourse = doc.courseName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCourse) return false;
        }
        return true;
      })
      .map((doc) => {
        const activeToken = this.inMemoryTokens.find(
          (t) => t.documentId === doc.id && !t.isRevoked && (!t.expiresAt || new Date(t.expiresAt) > new Date())
        );
        return {
          ...doc,
          activeQrToken: activeToken?.qrToken || doc.activeQrToken
        };
      });
  }

  /**
   * 2. Lấy chi tiết một tài liệu - US-21
   */
  public async getDocumentById(id: string): Promise<StudyDocument> {
    try {
      const [rows] = (await dbPool.query(
        `SELECT d.*, q.qr_token as active_qr_token
         FROM documents d
         LEFT JOIN document_qr_tokens q ON d.id = q.document_id AND q.is_revoked = FALSE AND (q.expires_at IS NULL OR q.expires_at > NOW())
         WHERE d.id = ? AND d.is_active = TRUE
         LIMIT 1`,
        [id]
      )) as any;

      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          title: r.title,
          description: r.description || '',
          courseCode: r.course_code,
          courseName: r.course_name,
          category: r.category as DocumentCategory,
          fileUrl: this.normalizeFileUrl(r.file_url),
          fileType: r.file_type,
          fileSizeBytes: Number(r.file_size_bytes) || 0,
          authorId: r.author_id,
          authorName: r.author_name,
          downloadsCount: Number(r.downloads_count) || 0,
          isActive: Boolean(r.is_active),
          createdAt: new Date(r.created_at).toISOString(),
          updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
          activeQrToken: r.active_qr_token || undefined
        };
      }
    } catch {
      // Fallback
    }

    const doc = this.inMemoryDocs.find((d) => d.id === id && d.isActive);
    if (!doc) {
      throw new AppError('Không tìm thấy tài liệu hoặc tài liệu đã bị xóa', 404);
    }
    const token = this.inMemoryTokens.find(
      (t) => t.documentId === doc.id && !t.isRevoked && (!t.expiresAt || new Date(t.expiresAt) > new Date())
    );
    return { ...doc, activeQrToken: token?.qrToken || doc.activeQrToken };
  }

  /**
   * 3. Tải lên và tạo tài liệu mới - US-15
   */
  public async createDocument(
    author: { id: string; fullName?: string },
    dto: CreateDocumentDto
  ): Promise<StudyDocument> {
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const courseName = this.resolveCourseName(dto.courseCode, dto.courseName);
    const category = dto.category || 'TOM_TAT';
    const fileType = dto.fileType || 'PDF';
    let fileSizeBytes = dto.fileSizeBytes || 1024000;
    let fileUrl = dto.fileUrl || '';

    // Kiểm tra hạn mức lưu trữ 1 GB / sinh viên
    const storage = await this.getUserStorageUsage(author.id);
    if (storage.usedBytes + fileSizeBytes > storage.totalBytes) {
      throw new AppError(
        `Kho tài liệu đã vượt quá hạn mức 1 GB được cấp (${storage.usedMb} MB / 1024 MB). Vui lòng xóa bớt tài liệu để tiếp tục.`,
        400
      );
    }

    // Nếu người dùng gửi file dữ liệu base64 -> Tải trực tiếp lên Cloudinary
    if (dto.fileData) {
      const uploadRes = await cloudinaryService.uploadDocument(
        dto.fileData,
        dto.fileName || dto.title,
        author.id
      );
      fileUrl = uploadRes.url;
      fileSizeBytes = uploadRes.bytes;
    } else if (!fileUrl || !fileUrl.includes('cloudinary.com')) {
      const cloudName = ENV.CLOUDINARY.CLOUD_NAME || 'ktrcmxn2';
      const cleanName = (dto.fileName || dto.title || `${docId}.${fileType.toLowerCase()}`).replace(/\s+/g, '_');
      fileUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1/vku_studyhub/documents/${Date.now()}_${cleanName}`;
    }

    const authorName = author.fullName || 'Thành viên VKU';
    const createdAt = new Date().toISOString();

    // Tự động sinh ngay 1 mã QR hợp lệ trong 4 tiếng
    const cleanCourseCode = dto.courseCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const qrToken = `QR_${cleanCourseCode}_${Date.now().toString(36).toUpperCase()}`;
    const tokenId = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const deepLinkUrl = `${DOCUMENT_CONFIG.QR_DEEP_LINK_PREFIX}${qrToken}`;
    const expiresAtDate = new Date(Date.now() + DOCUMENT_CONFIG.DEFAULT_QR_TTL_MINUTES * 60000);
    const expiresAt = expiresAtDate.toISOString().slice(0, 19).replace('T', ' ');

    try {
      // Đảm bảo mã học phần tồn tại trong bảng courses để không bị lỗi foreign key
      await dbPool.query(
        `INSERT IGNORE INTO courses (code, name, faculty, credits) VALUES (?, ?, 'Khoa CNTT', 3)`,
        [cleanCourseCode, courseName]
      );

      await dbPool.query(
        `INSERT INTO documents 
         (id, title, description, course_code, category, file_url, file_type, file_size_bytes, author_id, author_name, downloads_count, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, TRUE)`,
        [
          docId,
          dto.title,
          dto.description || '',
          cleanCourseCode,
          category,
          fileUrl,
          fileType,
          fileSizeBytes,
          author.id,
          authorName
        ]
      );

      await dbPool.query(
        `INSERT INTO document_qr_tokens (id, document_id, qr_token, deep_link_url, expires_at, is_revoked, claim_count)
         VALUES (?, ?, ?, ?, ?, FALSE, 0)`,
        [tokenId, docId, qrToken, deepLinkUrl, expiresAt]
      );

      // Tự động thêm tài liệu vào kho cá nhân của tác giả
      await dbPool.query(
        `INSERT INTO user_saved_documents (id, user_id, document_id, saved_via_qr, idempotency_key, saved_at)
         VALUES (?, ?, ?, FALSE, NULL, NOW())
         ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP`,
        [`saved_${docId}`, author.id, docId]
      );
    } catch (dbErr: any) {
      console.warn('[DocumentService] Ghi MySQL thất bại, chuyển sang bộ nhớ đệm:', dbErr.message);
    }

    const newDoc: StudyDocument = {
      id: docId,
      title: dto.title,
      description: dto.description || '',
      courseCode: cleanCourseCode,
      courseName,
      category,
      fileUrl,
      fileType,
      fileSizeBytes,
      authorId: author.id,
      authorName,
      downloadsCount: 0,
      isActive: true,
      createdAt,
      activeQrToken: qrToken
    };

    this.inMemoryDocs.unshift(newDoc);
    this.inMemoryTokens.unshift({
      id: tokenId,
      documentId: docId,
      qrToken,
      deepLinkUrl,
      expiresAt,
      isRevoked: false,
      claimCount: 0,
      createdAt
    });
    this.inMemorySaved.unshift({
      id: `saved_${docId}`,
      userId: author.id,
      documentId: docId,
      savedViaQr: false,
      savedAt: createdAt,
      document: newDoc
    });

    return newDoc;
  }

  /**
   * 4. Cập nhật tài liệu / đổi file mới - US-22
   */
  public async updateDocument(id: string, userId: string, dto: UpdateDocumentDto): Promise<StudyDocument> {
    const existing = await this.getDocumentById(id);

    if (existing.authorId !== userId) {
      throw new AppError('Bạn không có quyền chỉnh sửa tài liệu này (Chỉ tác giả mới được cập nhật)', 403);
    }

    const updatedTitle = dto.title ?? existing.title;
    const updatedDesc = dto.description ?? existing.description;
    const updatedCategory = dto.category ?? existing.category;
    const updatedFileUrl = dto.fileUrl ?? existing.fileUrl;
    const updatedFileType = dto.fileType ?? existing.fileType;
    const updatedFileSize = dto.fileSizeBytes ?? existing.fileSizeBytes;
    const updatedIsActive = dto.isActive !== undefined ? dto.isActive : existing.isActive;

    try {
      await dbPool.query(
        `UPDATE documents 
         SET title = ?, description = ?, category = ?, file_url = ?, file_type = ?, file_size_bytes = ?, is_active = ?
         WHERE id = ?`,
        [updatedTitle, updatedDesc, updatedCategory, updatedFileUrl, updatedFileType, updatedFileSize, updatedIsActive, id]
      );
    } catch {
      // Fallback
    }

    existing.title = updatedTitle;
    existing.description = updatedDesc;
    existing.category = updatedCategory;
    existing.fileUrl = updatedFileUrl;
    existing.fileType = updatedFileType;
    existing.fileSizeBytes = updatedFileSize;
    existing.isActive = updatedIsActive;
    existing.updatedAt = new Date().toISOString();

    return existing;
  }

  /**
   * 5. Xóa vĩnh viễn tài liệu khỏi hệ thống - US-06
   */
  public async deleteDocument(id: string, userId: string): Promise<boolean> {
    try {
      await dbPool.query(`DELETE FROM user_saved_documents WHERE document_id = ?`, [id]);
      await dbPool.query(`DELETE FROM document_qr_tokens WHERE document_id = ?`, [id]);
      await dbPool.query(`DELETE FROM documents WHERE id = ?`, [id]);
    } catch (err: any) {
      console.warn('[DocumentService] Loi khi xoa MySQL, fallback danh dau an:', err.message);
      await dbPool.query(`UPDATE documents SET is_active = FALSE WHERE id = ?`, [id]).catch(() => {});
    }

    this.inMemoryDocs = this.inMemoryDocs.filter((d) => d.id !== id);
    this.inMemoryTokens = this.inMemoryTokens.filter((t) => t.documentId !== id);
    this.inMemorySaved = this.inMemorySaved.filter((s) => s.documentId !== id);

    return true;
  }

  /**
   * 6. Tạo mã QR động cho tài liệu - US-17
   */
  public async generateQrToken(documentId: string, userId: string, dto?: GenerateQrDto): Promise<DocumentQrToken> {
    const doc = await this.getDocumentById(documentId);

    if (doc.authorId !== userId) {
      throw new AppError('Chỉ tác giả mới có quyền tạo hoặc làm mới mã QR chia sẻ tài liệu này', 403);
    }

    const cleanCourse = doc.courseCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const qrToken = `QR_${cleanCourse}_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const tokenId = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const deepLinkUrl = `${DOCUMENT_CONFIG.QR_DEEP_LINK_PREFIX}${qrToken}`;
    const ttlMinutes = dto?.expiresInMinutes !== undefined ? dto.expiresInMinutes : DOCUMENT_CONFIG.DEFAULT_QR_TTL_MINUTES;
    const expiresAt =
      ttlMinutes > 0
        ? new Date(Date.now() + ttlMinutes * 60000).toISOString().slice(0, 19).replace('T', ' ')
        : null;

    try {
      // Thu hồi token cũ đang active của document này
      await dbPool.query(`UPDATE document_qr_tokens SET is_revoked = TRUE WHERE document_id = ? AND is_revoked = FALSE`, [
        documentId
      ]);

      await dbPool.query(
        `INSERT INTO document_qr_tokens (id, document_id, qr_token, deep_link_url, expires_at, is_revoked, claim_count)
         VALUES (?, ?, ?, ?, ?, FALSE, 0)`,
        [tokenId, documentId, qrToken, deepLinkUrl, expiresAt]
      );
    } catch {
      // Fallback
    }

    this.inMemoryTokens.forEach((t) => {
      if (t.documentId === documentId) t.isRevoked = true;
    });

    const tokenRecord: DocumentQrToken = {
      id: tokenId,
      documentId,
      qrToken,
      deepLinkUrl,
      expiresAt,
      isRevoked: false,
      claimCount: 0,
      createdAt: new Date().toISOString()
    };

    this.inMemoryTokens.unshift(tokenRecord);
    return tokenRecord;
  }

  /**
   * 7. Thu hồi / Vô hiệu hóa mã QR - US-22
   */
  public async revokeQrToken(rawQrToken: string, userId: string): Promise<boolean> {
    const qrToken = this.parseCleanToken(rawQrToken);

    try {
      const [rows] = (await dbPool.query(
        `SELECT q.*, d.author_id 
         FROM document_qr_tokens q
         JOIN documents d ON q.document_id = d.id
         WHERE q.qr_token = ?
         LIMIT 1`,
        [qrToken]
      )) as any;

      if (rows && rows.length > 0) {
        if (rows[0].author_id !== userId) {
          throw new AppError('Bạn không có quyền vô hiệu hóa mã QR của tài liệu này', 403);
        }
        await dbPool.query(`UPDATE document_qr_tokens SET is_revoked = TRUE WHERE qr_token = ?`, [qrToken]);
        return true;
      }
    } catch (err: any) {
      if (err instanceof AppError) throw err;
    }

    const tokenObj = this.inMemoryTokens.find((t) => t.qrToken === qrToken);
    if (!tokenObj) {
      throw new AppError('Mã QR không tồn tại trên hệ thống', 404);
    }

    const doc = this.inMemoryDocs.find((d) => d.id === tokenObj.documentId);
    if (doc && doc.authorId !== userId) {
      throw new AppError('Bạn không có quyền vô hiệu hóa mã QR của tài liệu này', 403);
    }

    tokenObj.isRevoked = true;
    return true;
  }

  /**
   * 7.1. Tra cứu thông tin tài liệu từ mã QR (Preview thông tin ngay khi quét trước khi bấm lưu)
   */
  public async getDocumentByQrToken(rawQrToken: string): Promise<StudyDocument> {
    const qrToken = this.parseCleanToken(rawQrToken);
    if (!qrToken) {
      throw new AppError('Mã QR không đúng định dạng của VKU StudyHub', 400);
    }

    let tokenRecord: DocumentQrToken | null = null;
    let targetDoc: StudyDocument | null = null;

    try {
      const [rows] = (await dbPool.query(
        `SELECT q.*, d.id as doc_id, d.title, d.description, d.course_code, d.category, d.file_url,
                d.file_type, d.file_size_bytes, d.author_id, d.author_name, d.downloads_count, d.is_active, d.created_at as doc_created_at
         FROM document_qr_tokens q
         JOIN documents d ON q.document_id = d.id
         WHERE q.qr_token = ?
         LIMIT 1`,
        [qrToken]
      )) as any;

      if (rows && rows.length > 0) {
        const r = rows[0];
        tokenRecord = {
          id: r.id,
          documentId: r.document_id,
          qrToken: r.qr_token,
          deepLinkUrl: r.deep_link_url,
          expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : null,
          isRevoked: Boolean(r.is_revoked),
          claimCount: Number(r.claim_count) || 0,
          createdAt: new Date(r.created_at).toISOString()
        };
        targetDoc = {
          id: r.doc_id,
          title: r.title,
          description: r.description || '',
          courseCode: r.course_code,
          courseName: this.resolveCourseName(r.course_code),
          category: r.category as DocumentCategory,
          fileUrl: this.normalizeFileUrl(r.file_url),
          fileType: r.file_type,
          fileSizeBytes: Number(r.file_size_bytes) || 0,
          authorId: r.author_id,
          authorName: r.author_name,
          downloadsCount: Number(r.downloads_count) || 0,
          isActive: Boolean(r.is_active),
          createdAt: new Date(r.doc_created_at).toISOString(),
          activeQrToken: qrToken
        };
      }
    } catch {
      // Fallback
    }

    if (!tokenRecord) {
      tokenRecord = this.inMemoryTokens.find((t) => t.qrToken === qrToken) || null;
      if (tokenRecord) {
        targetDoc = this.inMemoryDocs.find((d) => d.id === tokenRecord!.documentId) || null;
      }
    }

    if (!tokenRecord || !targetDoc) {
      throw new AppError('Mã QR không tồn tại trong hệ thống VKU StudyHub', 404);
    }
    if (tokenRecord.isRevoked) {
      throw new AppError('Mã QR này đã bị chủ sở hữu thu hồi hoặc vô hiệu hóa', 410);
    }
    if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date()) {
      throw new AppError('Mã QR đã hết hạn chia sẻ', 410);
    }
    if (!targetDoc.isActive) {
      throw new AppError('Tài liệu gốc không còn tồn tại trên hệ thống', 404);
    }

    return targetDoc;
  }

  /**
   * 8. Quét nhận và lưu tài liệu bằng mã QR (Chống trùng lặp Idempotency) - US-19, R-03
   */
  public async claimDocumentByQr(userId: string, dto: ClaimQrDto): Promise<ClaimQrResponse> {
    const qrToken = this.parseCleanToken(dto.qrToken);
    if (!qrToken) {
      throw new AppError('Mã QR không đúng định dạng của VKU StudyHub', 400);
    }

    let tokenRecord: DocumentQrToken | null = null;
    let targetDoc: StudyDocument | null = null;

    try {
      const [tokenRows] = (await dbPool.query(
        `SELECT q.*, d.id as doc_id, d.title, d.description, d.course_code, d.category, d.file_url,
                d.file_type, d.file_size_bytes, d.author_id, d.author_name, d.downloads_count, d.is_active, d.created_at as doc_created_at
         FROM document_qr_tokens q
         JOIN documents d ON q.document_id = d.id
         WHERE q.qr_token = ?
         LIMIT 1`,
        [qrToken]
      )) as any;

      if (tokenRows && tokenRows.length > 0) {
        const r = tokenRows[0];
        tokenRecord = {
          id: r.id,
          documentId: r.document_id,
          qrToken: r.qr_token,
          deepLinkUrl: r.deep_link_url,
          expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : null,
          isRevoked: Boolean(r.is_revoked),
          claimCount: Number(r.claim_count) || 0,
          createdAt: new Date(r.created_at).toISOString()
        };

        targetDoc = {
          id: r.doc_id,
          title: r.title,
          description: r.description || '',
          courseCode: r.course_code,
          courseName: this.resolveCourseName(r.course_code),
          category: r.category as DocumentCategory,
          fileUrl: this.normalizeFileUrl(r.file_url),
          fileType: r.file_type,
          fileSizeBytes: Number(r.file_size_bytes) || 0,
          authorId: r.author_id,
          authorName: r.author_name,
          downloadsCount: Number(r.downloads_count) || 0,
          isActive: Boolean(r.is_active),
          createdAt: new Date(r.doc_created_at).toISOString(),
          activeQrToken: qrToken
        };
      }
    } catch {
      // Fallback
    }

    if (!tokenRecord) {
      tokenRecord = this.inMemoryTokens.find((t) => t.qrToken === qrToken) || null;
      if (tokenRecord) {
        targetDoc = this.inMemoryDocs.find((d) => d.id === tokenRecord!.documentId) || null;
      }
    }

    if (!tokenRecord || !targetDoc) {
      throw new AppError('Mã QR không tồn tại trong hệ thống VKU StudyHub', 404);
    }

    // Ngoại lệ 1: Mã QR đã bị tác giả thu hồi
    if (tokenRecord.isRevoked) {
      throw new AppError('Mã QR này đã bị chủ sở hữu thu hồi hoặc vô hiệu hóa', 410);
    }

    // Ngoại lệ 2: Mã QR đã hết hạn (TTL Expired)
    if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date()) {
      throw new AppError('Mã QR đã hết hạn chia sẻ', 410);
    }

    // Ngoại lệ 3: Tài liệu gốc đã bị xóa
    if (!targetDoc.isActive) {
      throw new AppError('Tài liệu gốc không còn tồn tại trên hệ thống', 404);
    }

    // Ngoại lệ 4: Tác giả tự quét tài liệu của chính mình
    if (targetDoc.authorId === userId) {
      return {
        isAlreadySaved: false,
        isAuthor: true,
        message: 'Đây là tài liệu do chính bạn tải lên, đã sẵn sàng trong hồ sơ của bạn',
        document: targetDoc
      };
    }

    // Ngoại lệ 5: Kiểm tra xem sinh viên đã lưu tài liệu này trước đó chưa (Chống trùng lặp)
    let isAlreadySaved = false;
    try {
      const [savedRows] = (await dbPool.query(
        `SELECT id FROM user_saved_documents WHERE user_id = ? AND document_id = ? LIMIT 1`,
        [userId, targetDoc.id]
      )) as any;
      if (savedRows && savedRows.length > 0) {
        isAlreadySaved = true;
      }
    } catch {
      // Fallback
    }

    if (!isAlreadySaved) {
      isAlreadySaved = this.inMemorySaved.some((s) => s.userId === userId && s.documentId === targetDoc!.id);
    }

    if (isAlreadySaved) {
      return {
        isAlreadySaved: true,
        isAuthor: false,
        message: 'Tài liệu này đã có trong kho cá nhân của bạn',
        document: targetDoc
      };
    }

    // Lưu mới vào kho cá nhân với khóa Idempotency
    const savedId = `saved_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    try {
      await dbPool.query(
        `INSERT INTO user_saved_documents (id, user_id, document_id, saved_via_qr, idempotency_key, saved_at)
         VALUES (?, ?, ?, TRUE, ?, ?)
         ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP`,
        [savedId, userId, targetDoc.id, dto.idempotencyKey || null, new Date()]
      );

      // Tăng số lượt tải của tài liệu và số lượt claim của QR
      await dbPool.query(`UPDATE documents SET downloads_count = downloads_count + 1 WHERE id = ?`, [targetDoc.id]);
      await dbPool.query(`UPDATE document_qr_tokens SET claim_count = claim_count + 1 WHERE qr_token = ?`, [qrToken]);
    } catch {
      // Fallback
    }

    targetDoc.downloadsCount += 1;
    tokenRecord.claimCount += 1;
    this.inMemorySaved.unshift({
      id: savedId,
      userId,
      documentId: targetDoc.id,
      savedViaQr: true,
      idempotencyKey: dto.idempotencyKey,
      savedAt: nowIso,
      document: targetDoc
    });

    return {
      isAlreadySaved: false,
      isAuthor: false,
      message: 'Quét mã QR thành công! Đã lưu tài liệu vào kho cá nhân của bạn',
      document: targetDoc,
      savedAt: nowIso
    };
  }

  /**
   * 9. Lấy danh sách tài liệu đã lưu ("Tài liệu của tôi") - US-06, US-19
   */
  public async getSavedDocuments(userId: string, filter?: { savedViaQr?: boolean }): Promise<SavedDocumentRecord[]> {
    try {
      let sql = `
        SELECT s.id as saved_id, s.user_id, s.document_id, s.saved_via_qr, s.saved_at,
               d.title, d.description, d.course_code, d.category, d.file_url, d.file_type,
               d.file_size_bytes, d.author_id, d.author_name, d.downloads_count, d.created_at as doc_created_at
        FROM user_saved_documents s
        JOIN documents d ON s.document_id = d.id
        WHERE (s.user_id = ? OR d.author_id = ?) AND d.is_active = TRUE
      `;
      const params: any[] = [userId, userId];

      if (filter?.savedViaQr !== undefined) {
        sql += ' AND s.saved_via_qr = ?';
        params.push(filter.savedViaQr);
      }

      sql += ' ORDER BY s.saved_at DESC';
      const [rows] = (await dbPool.query(sql, params)) as any;

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.saved_id,
          userId: r.user_id,
          documentId: r.document_id,
          savedViaQr: Boolean(r.saved_via_qr),
          savedAt: new Date(r.saved_at).toISOString(),
          document: {
            id: r.document_id,
            title: r.title,
            description: r.description || '',
            courseCode: r.course_code,
            courseName: this.resolveCourseName(r.course_code),
            category: r.category as DocumentCategory,
            fileUrl: this.normalizeFileUrl(r.file_url),
            fileType: r.file_type,
            fileSizeBytes: Number(r.file_size_bytes) || 0,
            authorId: r.author_id,
            authorName: r.author_name,
            downloadsCount: Number(r.downloads_count) || 0,
            isActive: true,
            createdAt: new Date(r.doc_created_at).toISOString()
          }
        }));
      }
    } catch {
      // Fallback
    }

    const authored = this.inMemoryDocs
      .filter((d) => d.authorId === userId && d.isActive)
      .map((d) => ({
        id: `authored_${d.id}`,
        userId,
        documentId: d.id,
        savedViaQr: false,
        savedAt: d.createdAt,
        document: d
      }));

    const combined = [...this.inMemorySaved.filter((s) => s.userId === userId), ...authored];
    const unique = Array.from(new Map(combined.map((item) => [item.documentId, item])).values());

    return unique
      .filter((s) => filter?.savedViaQr === undefined || s.savedViaQr === filter.savedViaQr)
      .map((s) => ({
        ...s,
        document: s.document || this.inMemoryDocs.find((d) => d.id === s.documentId && d.isActive)
      }))
      .filter((s) => s.document !== undefined);
  }

  /**
   * 10. Bỏ lưu tài liệu khỏi kho cá nhân - US-06
   */
  public async removeSavedDocument(userId: string, targetId: string): Promise<boolean> {
    try {
      await dbPool.query(
        `DELETE FROM user_saved_documents WHERE user_id = ? AND (id = ? OR document_id = ?)`,
        [userId, targetId, targetId]
      );
    } catch {
      // Fallback
    }

    this.inMemorySaved = this.inMemorySaved.filter(
      (s) => !(s.userId === userId && (s.id === targetId || s.documentId === targetId))
    );
    return true;
  }



  /**
   * Tính toán dung lượng lưu trữ Cloudinary của sinh viên (Hạn mức: 1 GB)
   */
  public async getUserStorageUsage(userId: string = 'usr_01'): Promise<{
    usedBytes: number;
    totalBytes: number;
    usedMb: number;
    totalMb: number;
    usedPercentage: number;
    documentsCount: number;
  }> {
    const TOTAL_BYTES_LIMIT = 1024 * 1024 * 1024; // 1 GB (1,073,741,824 bytes)
    let usedBytes = 0;
    let documentsCount = 0;

    try {
      const [rows]: any = await dbPool.query(
        `SELECT SUM(file_size_bytes) as total_used, COUNT(*) as doc_count 
         FROM documents 
         WHERE (author_id = ? OR author_id = 'usr_01') AND is_active = TRUE`,
        [userId]
      );
      if (rows && rows.length > 0 && Number(rows[0].doc_count) > 0) {
        usedBytes = Number(rows[0].total_used) || 0;
        documentsCount = Number(rows[0].doc_count) || 0;
      } else {
        const userDocs = this.inMemoryDocs.filter((d) => (d.authorId === userId || d.authorId === 'usr_01') && d.isActive);
        usedBytes = userDocs.reduce((acc, d) => acc + (d.fileSizeBytes || 0), 0);
        documentsCount = userDocs.length;
      }
    } catch {
      const userDocs = this.inMemoryDocs.filter((d) => (d.authorId === userId || d.authorId === 'usr_01') && d.isActive);
      usedBytes = userDocs.reduce((acc, d) => acc + (d.fileSizeBytes || 0), 0);
      documentsCount = userDocs.length;
    }

    const usedMb = usedBytes / (1024 * 1024);
    const totalMb = 1024;
    const usedPercentage = Math.min(100, (usedBytes / TOTAL_BYTES_LIMIT) * 100);

    return {
      usedBytes,
      totalBytes: TOTAL_BYTES_LIMIT,
      usedMb: Number(usedMb.toFixed(2)),
      totalMb,
      usedPercentage: Number(usedPercentage.toFixed(2)),
      documentsCount
    };
  }

  /**
   * Upload tệp tài liệu trực tiếp lên Cloudinary có kiểm soát hạn mức 1 GB
   */
  public async uploadDocumentFile(
    author: { id: string },
    fileData: string,
    fileName: string = 'document.pdf'
  ): Promise<{ fileUrl: string; fileSizeBytes: number; isCloudinary: boolean }> {
    const storage = await this.getUserStorageUsage(author.id);
    if (storage.usedBytes >= storage.totalBytes) {
      throw new AppError(
        `Kho lưu trữ 1 GB của bạn đã đầy (${storage.usedMb} MB / 1024 MB). Vui lòng xóa bớt tài liệu cũ để tiếp tục tải lên.`,
        400
      );
    }

    const uploadRes = await cloudinaryService.uploadDocument(fileData, fileName, author.id);
    if (storage.usedBytes + uploadRes.bytes > storage.totalBytes) {
      throw new AppError(
        `Tệp này có dung lượng ${(uploadRes.bytes / (1024 * 1024)).toFixed(1)} MB sẽ vượt quá giới hạn 1 GB được cấp. Vui lòng chọn tệp nhỏ hơn.`,
        400
      );
    }

    return {
      fileUrl: uploadRes.url,
      fileSizeBytes: uploadRes.bytes,
      isCloudinary: uploadRes.isCloudinary
    };
  }

}

export const documentService = new DocumentService();
