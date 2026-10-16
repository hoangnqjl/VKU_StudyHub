import { Router } from 'express';
import { documentController } from './document.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createDocumentSchema, claimQrSchema } from './document.schema';
import { optionalAuth } from '../../middlewares/auth.middleware';

const router = Router();

// Document catalog
router.get('/', documentController.getDocuments);
router.post('/', optionalAuth, validate(createDocumentSchema), documentController.createDocument);

// User saved documents repository ("Tài liệu của tôi")
router.get('/saved', optionalAuth, documentController.getSavedDocuments);

// QR generation and claim endpoints
router.get('/qr/generate/:id', optionalAuth, documentController.generateQrToken);
router.post('/qr/claim/:qrToken', optionalAuth, validate(claimQrSchema), documentController.claimDocumentByQr);

// Single document detail
router.get('/:id', documentController.getDocumentById);

export default router;

