import { Request, Response } from 'express';
import { StudyDocument } from '../types';

const documentsStore: StudyDocument[] = [
  {
    id: 'doc_01',
    title: 'Đề cương ôn tập & Bài tập lớn Quản lý dự án phần mềm',
    courseCode: 'IT001',
    courseName: 'Quản lý dự án phần mềm',
    category: 'exam',
    description: 'Tổng hợp câu hỏi ôn tập M1 - M5, biểu mẫu WBS và bài giảng TS. Nguyễn Thành Tuấn',
    fileUrl: 'https://vku-studyhub.storage/docs/it001-decuong.pdf',
    qrCodeToken: 'VKU-DOC-IT001-DECUONG-2026',
    uploaderId: 'usr_01',
    uploaderName: 'Nguyễn Quang Hoàng',
    downloadsCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'doc_02',
    title: 'Cheat Sheet React Native Expo & TypeScript',
    courseCode: 'IT002',
    courseName: 'Lập trình di động',
    category: 'summary',
    description: 'Cẩm nang tra cứu cú pháp Hooks, Navigation và Expo Camera',
    fileUrl: 'https://vku-studyhub.storage/docs/it002-reactnative-cheatsheet.pdf',
    qrCodeToken: 'VKU-DOC-IT002-RN-CHEATSHEET',
    uploaderId: 'usr_03',
    uploaderName: 'Nguyễn Thị Diễm Quỳnh',
    downloadsCount: 28,
    createdAt: new Date().toISOString()
  }
];

export const getDocuments = async (req: Request, res: Response) => {
  const { courseCode, category } = req.query;
  let results = [...documentsStore];

  if (courseCode) {
    results = results.filter(d => d.courseCode.toLowerCase() === String(courseCode).toLowerCase());
  }

  if (category) {
    results = results.filter(d => d.category === category);
  }

  return res.status(200).json({
    success: true,
    total: results.length,
    data: results
  });
};

export const getDocumentByQRToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  const doc = documentsStore.find(d => d.qrCodeToken === token);

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'Mã QR không hợp lệ hoặc tài liệu đã bị xóa.'
    });
  }

  doc.downloadsCount += 1;

  return res.status(200).json({
    success: true,
    message: 'Quét mã QR nhận tài liệu thành công!',
    data: doc
  });
};

export const uploadDocument = async (req: Request, res: Response) => {
  const { title, courseCode, courseName, category, description, fileUrl, uploaderName } = req.body;

  if (!title || !courseCode || !fileUrl) {
    return res.status(400).json({
      success: false,
      message: 'Tiêu đề, mã môn học và đường dẫn tài liệu là bắt buộc.'
    });
  }

  const newDoc: StudyDocument = {
    id: `doc_${Date.now()}`,
    title,
    courseCode,
    courseName: courseName || courseCode,
    category: category || 'summary',
    description,
    fileUrl,
    qrCodeToken: `VKU-DOC-${courseCode}-${Date.now().toString(36).toUpperCase()}`,
    uploaderId: 'usr_01',
    uploaderName: uploaderName || 'Thành viên VKU',
    downloadsCount: 0,
    createdAt: new Date().toISOString()
  };

  documentsStore.unshift(newDoc);

  return res.status(201).json({
    success: true,
    message: 'Tải lên tài liệu và tạo mã QR thành công!',
    data: newDoc
  });
};
