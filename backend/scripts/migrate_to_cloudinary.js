const { v2: cloudinary } = require('cloudinary');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  console.log('Testing Cloudinary config...');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Check upload permission
  try {
    const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const test = await cloudinary.uploader.upload(png, { folder: 'vku_studyhub/test' });
    console.log('✅ Cloudinary Upload Permission OK! URL:', test.secure_url);
  } catch (err) {
    console.error('❌ Cloudinary key still missing upload permission:', err.message);
    await conn.end();
    return;
  }

  // Upload local documents
  const docsDir = path.join(__dirname, '../uploads/documents');
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);
    for (const f of files) {
      const fPath = path.join(docsDir, f);
      console.log('Uploading document:', f);
      const res = await cloudinary.uploader.upload(fPath, {
        folder: 'vku_studyhub/documents',
        resource_type: 'auto'
      });
      console.log('Uploaded ->', res.secure_url);
      await conn.query('UPDATE documents SET file_url = ? WHERE file_url LIKE ?', [
        res.secure_url,
        `%${f}%`
      ]);
    }
  }

  // Upload local avatars
  const avatarsDir = path.join(__dirname, '../uploads/avatars');
  if (fs.existsSync(avatarsDir)) {
    const files = fs.readdirSync(avatarsDir);
    for (const f of files) {
      const fPath = path.join(avatarsDir, f);
      console.log('Uploading avatar:', f);
      const res = await cloudinary.uploader.upload(fPath, {
        folder: 'vku_studyhub/avatars',
        resource_type: 'image'
      });
      console.log('Uploaded ->', res.secure_url);
      await conn.query('UPDATE users SET avatar_url = ? WHERE avatar_url LIKE ?', [
        res.secure_url,
        `%${f}%`
      ]);
    }
  }

  console.log('🎉 Migration completed successfully!');
  await conn.end();
}

run().catch(console.error);

