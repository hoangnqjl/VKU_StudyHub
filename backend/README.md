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

### 2. Module 1: Authentication & Study Profile (`/api/auth` & aliases)
| Phương thức | Endpoint | Alias Endpoint | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | | Đăng nhập tài khoản sinh viên VKU (Email / MSSV + Mật khẩu) |
| `POST` | `/api/auth/signup` | `/api/auth/register` | Đăng ký tài khoản sinh viên mới (MSSV, Họ tên, Email, Mật khẩu, Môn học, Mục tiêu) |
| `GET` | `/api/auth/profile` | `/api/profile` | Xem thông tin hồ sơ sinh viên, khoa, ngành & danh sách môn học đăng ký |
| `PUT` | `/api/auth/profile` | `/api/edit-profile` | Chỉnh sửa hồ sơ sinh viên, cập nhật mục tiêu học tập & thêm/bớt môn học |
| `GET` | `/api/auth/home` | `/api/home` | Dữ liệu tổng hợp Trang chủ (Thống kê radar, tài liệu, pomodoro, môn học, mẹo học tập) |
| `GET` | `/api/auth/courses` | | Danh sách các môn học mẫu tại trường VKU |

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

### 5. Module 4: Shared Study Timer / Pomodoro (`/api/pomodoro` & Realtime Socket.IO)

#### 🔹 RESTful API Endpoints
| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/pomodoro/rooms` | Danh sách phòng Pomodoro học nhóm đang hoạt động |
| `GET` | `/api/pomodoro/rooms/:id` | Chi tiết phòng & trạng thái đếm ngược đồng bộ |
| `POST` | `/api/pomodoro/rooms` | Tạo phòng Pomodoro học nhóm mới (25p học / 5p nghỉ) |
| `POST` | `/api/pomodoro/rooms/:id/join` | Tham gia vào phòng học nhóm |
| `POST` | `/api/pomodoro/rooms/:id/leave` | Rời khỏi phòng học nhóm |
| `PATCH` | `/api/pomodoro/rooms/:id/timer` | Điều khiển đồng hồ (`START`, `PAUSE`, `RESET`, `NEXT_PHASE`, `SWITCH_MODE`) |
| `GET` | `/api/pomodoro/rooms/:id/messages` | Lấy lịch sử tin nhắn trao đổi trong phòng học |
| `POST` | `/api/pomodoro/rooms/:id/messages` | Gửi tin nhắn động viên vào phòng học |
| `POST` | `/api/pomodoro/rooms/:id/reactions` | Thả biểu cảm cổ vũ (🔥, 👏, ☕, 💪) |

#### ⚡ Realtime WebSocket Events (Socket.IO `ws://localhost:5000`)
| Hướng | Tên Sự kiện | Payload mẫu | Ý nghĩa / Hành vi |
| :--- | :--- | :--- | :--- |
| **Client $\rightarrow$ Server** | `pomodoro:join` | `{ "roomId": "room_xxx", "user": { ... } }` | Tham gia vào phòng đếm ngược Realtime |
| **Server $\rightarrow$ Client** | `pomodoro:room_state` | `{ "room": { ... }, "serverTime": "..." }` | Gửi toàn bộ dữ liệu & tin nhắn phòng cho thành viên vừa vào |
| **Server $\rightarrow$ Client** | `pomodoro:user_joined` | `{ "roomId": "...", "user": { ... }, "participants": [...] }` | Thông báo tới tất cả thành viên trong phòng khi có bạn mới vào |
| **Client $\rightarrow$ Server** | `pomodoro:timer_action` | `{ "roomId": "...", "action": "START" }` | Host bấm Bắt đầu / Tạm dừng / Đặt lại / Chuyển pha đếm ngược |
| **Server $\rightarrow$ Client** | `pomodoro:timer_state` | `{ "status": "RUNNING", "remainingSeconds": 1500, ... }` | Phát trạng thái đồng hồ cập nhật tới mọi client |
| **Server $\rightarrow$ Client** | `pomodoro:tick` | `{ "remainingSeconds": 1499, "currentMode": "FOCUS" }` | Phát sóng thời gian đếm ngược chính xác mỗi giây từ server |
| **Server $\rightarrow$ Client** | `pomodoro:phase_changed` | `{ "previousMode": "FOCUS", "currentMode": "SHORT_BREAK", "message": "..." }` | Thông báo khi chuyển pha (Tập trung $\leftrightarrow$ Nghỉ giải lao) |
| **Client $\rightarrow$ Server** | `pomodoro:send_message` | `{ "roomId": "...", "message": "Cùng cố gắng nhé!" }` | Gửi tin nhắn trao đổi realtime trong phòng |
| **Server $\rightarrow$ Client** | `pomodoro:new_message` | `{ "id": "...", "userName": "...", "message": "..." }` | Phát tin nhắn mới tức thì tới tất cả thành viên |
| **Client $\rightarrow$ Server** | `pomodoro:send_reaction` | `{ "roomId": "...", "emoji": "🔥" }` | Thả biểu cảm cảm xúc cổ vũ realtime |
| **Server $\rightarrow$ Client** | `pomodoro:new_reaction` | `{ "userName": "...", "emoji": "🔥", "timestamp": "..." }` | Hiệu ứng biểu cảm hiển thị tức thì trên màn hình |
| **Client $\rightarrow$ Server** | `pomodoro:leave` | `{ "roomId": "...", "userId": "..." }` | Rời khỏi phòng học |
| **Server $\rightarrow$ Client** | `pomodoro:user_left` | `{ "userId": "...", "userName": "...", "participants": [...] }` | Thông báo khi có thành viên rời phòng hoặc mất kết nối |

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

