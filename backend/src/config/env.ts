import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'vku_studyhub_super_secret_jwt_key_2026',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'vku_studyhub',
    SSL: process.env.DB_SSL === 'true'
  },
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDIARY_CLOUD_NAME || '',
    API_KEY: process.env.CLOUDINARY_API_KEY || process.env.CLOUDIARY_API_KEY || '',
    API_SECRET: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDIARY_API_SECRET || process.env.CLOUDIARY_SECRET || '',
    URL: process.env.CLOUDINARY_URL || ''
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '404919884065-kgl77t0ilvu9034lie0grgqhqs17hmlq.apps.googleusercontent.com',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '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',
    ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID || '404919884065-680jmn2q6vel0fj9i18hhpfrt0f5tdus.apps.googleusercontent.com'
  }
};
