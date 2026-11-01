import { Router } from 'express';
import { documentController } from './document.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentQuerySchema,
  generateQrSchema,
  claimQrSchema,
  revokeQrSchema,
  deleteDocumentSchema
} from './document.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// 1. Danh mục tài liệu chung & Tìm kiếm (US-16, US-15)
router.get('/', optionalAuth, validate(documentQuerySchema), documentController.getDocuments);
router.post('/', optionalAuth, validate(createDocumentSchema), documentController.createDocument);

// 2. Kho "Tài liệu của tôi" (US-06, US-19)
router.get('/saved', optionalAuth, documentController.getSavedDocuments);
router.delete('/saved/:id', optionalAuth, documentController.removeSavedDocument);

// 3. Quét claim & xem trước mã QR (US-19, R-03)
router.get('/qr/info/:qrToken', optionalAuth, validate(revokeQrSchema), documentController.getDocumentByQrToken);
router.post('/qr/claim', optionalAuth, validate(claimQrSchema), documentController.claimDocumentByQr);

// 4. Quản lý vòng đời mã QR (US-17, US-22)
router.post('/:id/qr', optionalAuth, validate(generateQrSchema), documentController.generateQrToken);
router.delete('/qr/:qrToken', optionalAuth, validate(revokeQrSchema), documentController.revokeQrToken);

// 5. Chi tiết, Cập nhật và Xóa tài liệu (US-21, US-22, US-06)
router.get('/:id', optionalAuth, documentController.getDocumentById);
router.put('/:id', optionalAuth, validate(updateDocumentSchema), documentController.updateDocument);
router.delete('/:id', optionalAuth, validate(deleteDocumentSchema), documentController.deleteDocument);

export default router;
