# 🚀 VKU StudyHub - Backend API Service

Dịch vụ Backend API cho ứng dụng di động **VKU StudyHub Mobile** (Nhóm 05 - Quản lý dự án phần mềm).  
Hệ thống được thiết kế theo kiến trúc **Modular Architecture (Feature-based)** nhằm tối ưu tính mở rộng, bảo trì và phân công công việc độc lập giữa các lập trình viên.

---

## 🛠️ Công nghệ cốt lõi

- **Ngôn ngữ:** TypeScript (Strict Mode)
- **Runtime:** Node.js (v18+)
- **Web Framework:** Express.js
- **Data Validation:** Zod Schema Validation
- **Authentication:** JSON Web Token (JWT)
- **Database Interop:** MySQL2 Connection Pool / Supabase BaaS ready
- **CORS & Environment:** cors, dotenv

---

## 📂 Cấu trúc thư mục (Modular Architecture)

```text
backend/
├── src/
│   ├── app.ts                  # Cấu hình Express App, Middlewares, Health Check & Error Handling
│   ├── index.ts                # Entry Point khởi động Server & kiểm tra DB
│   │
│   ├── config/                 # Cấu hình hệ thống & môi trường
│   │   ├── env.ts              # Quản lý biến môi trường an toàn kiểu dữ liệu
│   │   └── database.ts         # Khởi tạo kết nối MySQL Pool & cơ chế Fallback Mock
│   │
│   ├── middlewares/            # Middlewares dùng chung
│   │   ├── auth.middleware.ts  # Xác thực JWT Bearer Token (kèm optionalAuth)
│   │   ├── error.middleware.ts # Bắt lỗi toàn cục & định dạng response chuẩn
│   │   ├── logger.middleware.ts# Ghi log HTTP requests (Method, URL, Status, Latency)
│   │   └── validate.middleware.ts # Kiểm tra dữ liệu đầu vào qua Zod schema
│   │
│   ├── shared/                 # Thành phần dùng chung toàn hệ thống
│   │   ├── constants/
│   │   │   ├── locations.ts    # Danh sách địa điểm trong khuôn viên trường VKU
│   │   │   └── courses.ts      # Danh sách môn học mẫu tại VKU
│   │   ├── types/
│   │   │   └── api.types.ts    # Chuẩn ApiResponse<T>, PaginatedResult<T>
│   │   └── utils/
│   │       └── response.util.ts# Helper sendSuccess, sendError
│   │
│   ├── modules/                # CÁC MODULE NGHIỆP VỤ (Feature-based Modules)
│   │   ├── auth/               # Module 1: Tài khoản & Hồ sơ môn học
│   │   │   ├── auth.types.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── radar/              # Module 2: Study Buddy Radar (Tìm bạn học tức thì)
│   │   │   ├── radar.types.ts
│   │   │   ├── radar.schema.ts
│   │   │   ├── radar.service.ts
│   │   │   ├── radar.controller.ts
│   │   │   └── radar.routes.ts
│   │   │
│   │   ├── documents/          # Module 3: Chia sẻ tài liệu qua mã QR
│   │   │   ├── document.types.ts
│   │   │   ├── document.schema.ts
│   │   │   ├── document.service.ts
│   │   │   ├── document.controller.ts
│   │   │   └── document.routes.ts
│   │   │
│   │   └── pomodoro/           # Module 4: Đồng hồ Pomodoro học nhóm
│   │       ├── pomodoro.types.ts
│   │       ├── pomodoro.schema.ts
│   │       ├── pomodoro.service.ts
│   │       ├── pomodoro.controller.ts
│   │       └── pomodoro.routes.ts
│   │
│   └── routes/
│       └── index.ts            # Gom toàn bộ route của các module vào prefix /api
│
├── .env.example                # File mẫu cấu hình biến môi trường
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📡 Danh sách Endpoints API chính

### 1. Health Check
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra trạng thái hoạt động của server & uptime |

### 2. Module 1: Authentication & Profile (`/api/auth`)
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản sinh viên VKU (Email / MSSV) |
| `POST` | `/api/auth/register` | Đăng ký tài khoản sinh viên mới |
| `GET` | `/api/auth/profile` | Xem thông tin hồ sơ & mục tiêu học tập |
| `PUT` | `/api/auth/profile` | Cập nhật hồ sơ, danh sách môn học theo kỳ |
| `GET` | `/api/auth/courses` | Danh sách các môn học mẫu tại trường VKU |

### 3. Module 2: Study Buddy Radar (`/api/radar`)
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/radar/locations` | Danh sách địa điểm trong khuôn viên VKU (Thư viện tầng 2, Khu tự học V, Tòa K...) |
| `GET` | `/api/radar/buddies` | Lấy danh sách bạn học đang "sáng đèn" (hỗ trợ lọc theo `locationId`, `courseCode`) |
| `POST` | `/api/radar/checkin` | Bật trạng thái tìm bạn học tại vị trí trường |
| `POST` | `/api/radar/checkout` | Tắt trạng thái tìm bạn học |
| `POST` | `/api/radar/join-request` | Gửi lời mời / xin ghép bàn học đến bạn học gần đó |
| `GET` | `/api/radar/join-requests` | Lấy danh sách yêu cầu ghép bàn gửi đến tài khoản |
| `PATCH` | `/api/radar/join-requests/:requestId` | Chấp nhận hoặc từ chối yêu cầu ghép bàn |

### 4. Module 3: Fast QR Document Sharing (`/api/documents`)
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/documents` | Lấy danh mục tài liệu ôn tập (lọc theo môn, từ khóa, loại file) |
| `GET` | `/api/documents/:id` | Xem chi tiết thông tin tài liệu |
| `POST` | `/api/documents` | Đăng tải / tạo tài liệu học tập mới |
| `GET` | `/api/documents/qr/generate/:id` | Sinh dynamic token mã QR cho tài liệu |
| `POST` | `/api/documents/qr/claim/:qrToken` | Quét mã QR để nhận & lưu ngay tài liệu vào kho cá nhân |
| `GET` | `/api/documents/saved` | Xem danh sách "Tài liệu của tôi" đã lưu |

### 5. Module 4: Shared Study Timer / Pomodoro (`/api/pomodoro`)
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/pomodoro/rooms` | Danh sách phòng Pomodoro học nhóm đang hoạt động |
| `GET` | `/api/pomodoro/rooms/:id` | Chi tiết phòng & trạng thái đếm ngược đồng bộ |
| `POST` | `/api/pomodoro/rooms` | Tạo phòng Pomodoro học nhóm mới (25p học / 5p nghỉ) |
| `POST` | `/api/pomodoro/rooms/:id/join` | Tham gia vào phòng học nhóm |
| `POST` | `/api/pomodoro/rooms/:id/leave` | Rời khỏi phòng học nhóm |
| `PATCH` | `/api/pomodoro/rooms/:id/timer` | Điều khiển đồng hồ (START, PAUSE, RESET, NEXT_PHASE) |

---

## ⚡ Hướng dẫn cài đặt & Khởi chạy

### 1. Di chuyển vào thư mục backend
```bash
cd backend
```

### 2. Cài đặt các gói thư viện
```bash
npm install
```

### 3. Thiết lập biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
*(Tùy chỉnh thông số cổng PORT hoặc tài khoản CSDL nếu cần).*

### 4. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```

### 5. Biên dịch và chạy Production
```bash
npm run build
npm start
```

