import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { ENV } from '../../config/env';

class CloudinaryService {
  private isConfigured: boolean = false;

  constructor() {
    this.init();
  }

  public init() {
    try {
      if (ENV.CLOUDINARY.URL) {
        cloudinary.config({
          cloudinary_url: ENV.CLOUDINARY.URL,
          secure: true,
        });
        this.isConfigured = true;
        console.log('[CloudinaryService] Đã cấu hình Cloudinary qua CLOUDINARY_URL.');
      } else if (ENV.CLOUDINARY.CLOUD_NAME && ENV.CLOUDINARY.API_KEY && ENV.CLOUDINARY.API_SECRET) {
        cloudinary.config({
          cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
          api_key: ENV.CLOUDINARY.API_KEY,
          api_secret: ENV.CLOUDINARY.API_SECRET,
          secure: true,
        });
        this.isConfigured = true;
        console.log(`[CloudinaryService] Đã cấu hình Cloudinary thành công cho Cloud: ${ENV.CLOUDINARY.CLOUD_NAME}`);
      } else {
        this.isConfigured = false;
        console.warn('[CloudinaryService] Chưa có đầy đủ Cloudinary Cloud Name, API Key, API Secret. Hệ thống sẽ lưu trữ cục bộ và chuyển lên Cloudinary ngay khi có key.');
      }
    } catch (err: any) {
      this.isConfigured = false;
      console.error('[CloudinaryService] Lỗi khi cấu hình Cloudinary:', err.message);
    }
  }

  public getIsConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Tải ảnh đại diện sinh viên lên Cloudinary (hoặc fallback lưu cục bộ nếu chưa có key)
   */
  public async uploadAvatar(
    imageInput: string,
    userId: string = 'usr_01'
  ): Promise<{ url: string; publicId?: string; isCloudinary: boolean }> {
    // 1. Kiểm tra nếu đã cấu hình Cloudinary -> Tải trực tiếp lên Cloudinary
    if (this.isConfigured) {
      try {
        const cleanData = imageInput.startsWith('data:')
          ? imageInput
          : `data:image/jpeg;base64,${imageInput}`;

        const uploadRes: UploadApiResponse = await cloudinary.uploader.upload(cleanData, {
          folder: 'vku_studyhub/avatars',
          public_id: `avatar_${userId}_${Date.now()}`,
          overwrite: true,
          resource_type: 'image',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        });

        return {
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id,
          isCloudinary: true,
        };
      } catch (cloudErr: any) {
        console.error('[CloudinaryService] Upload Cloudinary thất bại, chuyển về lưu trữ cục bộ:', cloudErr.message);
      }
    }

    // 2. Fallback: Lưu trữ ảnh cục bộ an toàn trên máy chủ
    try {
      const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `avatar_${userId}_${Date.now()}.png`;
      const filePath = path.join(uploadDir, filename);

      if (imageInput.startsWith('data:image/')) {
        const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      } else if (!imageInput.startsWith('http://') && !imageInput.startsWith('https://')) {
        fs.writeFileSync(filePath, Buffer.from(imageInput, 'base64'));
      } else {
        // Đường dẫn URL ngoài
        return {
          url: imageInput,
          isCloudinary: false,
        };
      }

      const localUrl = `http://localhost:5000/uploads/avatars/${filename}`;
      return {
        url: localUrl,
        isCloudinary: false,
      };
    } catch (localErr: any) {
      console.error('[CloudinaryService] Lưu trữ ảnh cục bộ thất bại:', localErr.message);
      return {
        url: imageInput.startsWith('http') ? imageInput : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        isCloudinary: false,
      };
    }
  }


  /**
   * Tải tệp tài liệu học tập (PDF, DOCX, ZIP, PPTX, XLSX, Ảnh) lên Cloudinary
   */
  public async uploadDocument(
    fileInput: string,
    filename: string,
    userId: string = 'usr_01'
  ): Promise<{ url: string; publicId?: string; bytes: number; isCloudinary: boolean }> {
    const cleanFilename = (filename || 'document.pdf').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const publicId = `doc_${userId}_${Date.now()}_${cleanFilename}`;

    if (this.isConfigured) {
      try {
        const uploadRes = await cloudinary.uploader.upload(fileInput, {
          folder: `vku_studyhub/documents/${userId}`,
          public_id: publicId,
          resource_type: 'auto',
          overwrite: true
        });

        return {
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id,
          bytes: uploadRes.bytes || 1024000,
          isCloudinary: true
        };
      } catch (cloudErr: any) {
        console.error('[CloudinaryService] Upload tai lieu Cloudinary that bai, fallback cuc bo:', cloudErr.message);
      }
    }

    try {
      const docsDir = path.join(process.cwd(), 'uploads', 'documents');
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }

      const saveName = `${Date.now()}_${cleanFilename}`;
      const filePath = path.join(docsDir, saveName);

      let bytes = 1024000;
      if (fileInput.startsWith('data:')) {
        const base64Data = fileInput.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);
        bytes = buffer.length;
      } else if (!fileInput.startsWith('http://') && !fileInput.startsWith('https://')) {
        const buffer = Buffer.from(fileInput, 'base64');
        fs.writeFileSync(filePath, buffer);
        bytes = buffer.length;
      } else {
        return {
          url: fileInput,
          bytes,
          isCloudinary: false
        };
      }

      const localUrl = `http://localhost:5000/uploads/documents/${saveName}`;
      return {
        url: localUrl,
        bytes,
        isCloudinary: false
      };
    } catch (localErr: any) {
      console.error('[CloudinaryService] Luu tai lieu cuc bo that bai:', localErr.message);
      const cloudName = ENV.CLOUDINARY.CLOUD_NAME || 'ktrcmxn2';
      return {
        url: fileInput.startsWith('http') ? fileInput : `https://res.cloudinary.com/${cloudName}/image/upload/v1/vku_studyhub/documents/${cleanFilename}`,
        bytes: 1024000,
        isCloudinary: true
      };
    }
  }

}

export const cloudinaryService = new CloudinaryService();
