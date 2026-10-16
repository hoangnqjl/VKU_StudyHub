import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { documentService } from './document.service';
import { sendSuccess } from '../../shared/utils/response.util';

export class DocumentController {
  public getDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { courseCode, search, fileType } = req.query;
      const documents = documentService.getDocuments({
        courseCode: courseCode as string,
        search: search as string,
        fileType: fileType as string
      });
      return sendSuccess(res, documents, 'Lấy danh mục tài liệu thành công');
    } catch (error) {
      next(error);
    }
  };

  public getDocumentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = documentService.getDocumentById(id);
      return sendSuccess(res, document, 'Chi tiết tài liệu');
    } catch (error) {
      next(error);
    }
  };

  public createDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const author = req.user || { id: 'usr_01', fullName: 'Nguyễn Quang Hoàng' };
      const newDoc = documentService.createDocument(author as any, req.body);
      return sendSuccess(res, newDoc, 'Tạo tài liệu mới thành công', 201);
    } catch (error) {
      next(error);
    }
  };

  public generateQrToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const qrData = documentService.generateQrToken(id);
      return sendSuccess(res, qrData, 'Tạo mã QR động cho tài liệu thành công');
    } catch (error) {
      next(error);
    }
  };

  public claimDocumentByQr = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const { qrToken } = req.params;
      const result = documentService.claimDocumentByQr(userId, qrToken);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  public getSavedDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'usr_01';
      const savedList = documentService.getSavedDocuments(userId);
      return sendSuccess(res, savedList, 'Kho tài liệu đã lưu của bạn');
    } catch (error) {
      next(error);
    }
  };
}

export const documentController = new DocumentController();

