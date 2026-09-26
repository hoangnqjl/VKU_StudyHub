import { Router } from 'express';
import { getDocuments, getDocumentByQRToken, uploadDocument } from '../controllers/document.controller';

const router = Router();

router.get('/', getDocuments);
router.get('/qr/:token', getDocumentByQRToken);
router.post('/upload', uploadDocument);

export default router;
