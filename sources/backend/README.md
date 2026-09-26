# VKU StudyHub - Backend Service 🚀

Dịch vụ Backend API cho ứng dụng di động **VKU StudyHub Mobile** (Nhóm 05 - Quản lý dự án phần mềm).

## 📌 Công nghệ sử dụng
- **Runtime:** Node.js & TypeScript
- **Framework:** Express.js
- **Database:** Aiven Free Tier (MySQL) / Supabase BaaS
- **Validation & Utility:** Zod, CORS, Dotenv, JWT

## 📂 Cấu trúc thư mục
```
backend/
├── src/
│   ├── config/          # Cấu hình kết nối CSDL MySQL (Aiven)
│   ├── controllers/     # Xử lý logic nghiệp vụ từng module (Auth, Radar, Documents, Pomodoro)
│   ├── routes/          # Khai báo các endpoint RESTful API
│   ├── types/           # Định nghĩa kiểu dữ liệu TypeScript
│   └── index.ts         # Khởi động Express Server
├── .env.example         # Mẫu khai báo biến môi trường
├── package.json
└── tsconfig.json
```

## 🛠️ Cài đặt & Khởi chạy

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình môi trường:**
   Tạo file `.env` từ file `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Chạy ở môi trường Development:**
   ```bash
   npm run dev
   ```

4. **Build Production:**
   ```bash
   npm run build
   npm start
   ```

## 🌐 Các Endpoint chính
- `GET /api/health`: Kiểm tra trạng thái máy chủ
- `POST /api/auth/login`: Xác thực đăng nhập sinh viên VKU
- `GET /api/radar/buddies`: Lấy danh sách bạn học đang check-in
- `POST /api/radar/checkin`: Bật trạng thái tìm bạn học tại vị trí trường
- `GET /api/documents`: Lấy danh mục tài liệu học tập
- `GET /api/documents/qr/:token`: Quét mã QR nhận nhanh tài liệu
- `GET /api/pomodoro/rooms`: Danh sách phòng Pomodoro học nhóm
