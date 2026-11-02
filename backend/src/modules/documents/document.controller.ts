import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { documentService } from './document.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class DocumentController {
  /**
   * 1. Duyệt và lọc danh mục tài liệu - US-16
   */
  public getDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const documents = await documentService.getDocuments(req.query as any);
      return sendSuccess(res, documents, 'Lấy danh mục tài liệu thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 2. Lấy chi tiết tài liệu theo ID - US-21
   */
  public getDocumentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);
      return sendSuccess(res, document, 'Chi tiết tài liệu');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 3. Tải lên và đăng ký tài liệu mới - US-15
   */
  public createDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const author = req.user || {
        id: 'usr_01',
        fullName: 'Nguyễn Quang Hoàng'
      };
      const newDoc = await documentService.createDocument(author, req.body);
      return sendSuccess(res, newDoc, 'Tạo tài liệu mới thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 4. Cập nhật thông tin hoặc thay file tài liệu mới - US-22
   */
  public updateDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 'usr_01';
      const updated = await documentService.updateDocument(id, userId, req.body);
      return sendSuccess(res, updated, 'Cập nhật tài liệu thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 5. Xóa mềm tài liệu khỏi kho chung - US-06
   */
  public deleteDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 'usr_01';
      await documentService.deleteDocument(id, userId);
      return sendSuccess(res, null, 'Xóa tài liệu thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 6. Tạo mã QR động cho tài liệu - US-17
   */
  public generateQrToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 'usr_01';
      const qrData = await documentService.generateQrToken(id, userId, req.body);
      return sendSuccess(res, qrData, 'Tạo mã QR động cho tài liệu thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 7. Thu hồi / Vô hiệu hóa mã QR - US-22
   */
  public revokeQrToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { qrToken } = req.params;
      const userId = req.user?.id || 'usr_01';
      await documentService.revokeQrToken(qrToken, userId);
      return sendSuccess(res, null, 'Thu hồi và vô hiệu hóa mã QR thành công');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 7.1. Tra cứu xem trước thông tin tài liệu từ mã QR (Preview Scanner)
   */
  public getDocumentByQrToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { qrToken } = req.params;
      const document = await documentService.getDocumentByQrToken(qrToken);
      return sendSuccess(res, document, 'Thông tin tài liệu từ mã QR');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 8. Quét nhận tài liệu bằng mã QR - US-19, R-03
   */
  public claimDocumentByQr = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const result = await documentService.claimDocumentByQr(userId, req.body);
      const statusCode = result.isAlreadySaved ? 200 : 201;
      return sendSuccess(res, result, result.message, statusCode);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 9. Lấy danh sách "Tài liệu của tôi" - US-06, US-19
   */
  public getSavedDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const { savedViaQr } = req.query;
      const filter = savedViaQr !== undefined ? { savedViaQr: savedViaQr === 'true' } : undefined;
      const savedList = await documentService.getSavedDocuments(userId, filter);
      return sendSuccess(res, savedList, 'Kho tài liệu đã lưu của bạn');
    } catch (error) {
      next(error);
    }
  };

  /**
   * 10. Bỏ lưu tài liệu khỏi kho cá nhân - US-06
   */
  public removeSavedDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 'usr_01';
      await documentService.removeSavedDocument(userId, id);
      return sendSuccess(res, null, 'Đã bỏ lưu tài liệu khỏi kho cá nhân');
    } catch (error) {
      next(error);
    }
  };
}

export const documentController = new DocumentController();
