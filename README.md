# VKU StudyHub Mobile

> **Ứng dụng di động kết nối bạn học & chia sẻ tài liệu thông minh**  
> Học phần: **Quản lý dự án phần mềm**  
> Giảng viên hướng dẫn: **TS. Nguyễn Thành Tuấn**  
> Đơn vị: Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU), ĐHĐN  
> Nhóm thực hiện: **Nhóm 05 - StudyHub**

---

## 🎯 Giới thiệu dự án

VKU StudyHub Mobile giải quyết nhu cầu thực tế của sinh viên VKU: Cần tìm bạn học cùng môn ngay tại thư viện/khu tự học trường và quét mã QR chia sẻ nhanh tài liệu ôn thi trực tiếp trên smartphone.

### 🌟 4 Trụ cột tính năng cốt lõi (Theo Project Charter)
1. **Module 1: Authentication & Study Profile** – Đăng nhập sinh viên VKU & quản lý hồ sơ các môn học trong kỳ.
2. **Module 2: Study Buddy Radar** – Check-in môn học & vị trí trong trường (Thư viện tầng 2, Căn tin, Tòa K, Tòa V...) để ghép bàn học tức thì.
3. **Module 3: Fast QR Document Sharing** – Tạo và quét mã QR để nhận nhanh bộ tài liệu ôn tập/đề thi mẫu chỉ trong 2 giây qua Camera điện thoại.
4. **Module 4: Shared Study Timer (Pomodoro)** – Đếm ngược thời gian tự học nhóm đồng bộ giúp giữ kỷ luật và tập trung.

---

## 📁 Cấu trúc thư mục dự án

```text
VKU_StudyHub/
├── documents/                  # Tài liệu quản lý dự án môn học
│   ├── 1_project_charter.md    # Bản Project Charter hoàn chỉnh (M1)
│   └── 2_WBS_decomposition.md  # Kế hoạch phân rã công việc WBS (M2)
└── sources/                    # Mã nguồn hệ thống
    ├── backend/                # Dịch vụ Backend API (Node.js, Express, TypeScript, MySQL/Aiven)
    │   ├── src/
    │   │   ├── config/         # Cấu hình Database
    │   │   ├── controllers/    # Xử lý logic API (Auth, Radar, Documents, Pomodoro)
    │   │   ├── routes/         # Endpoints REST API
    │   │   └── types/          # TypeScript interfaces
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── .env.example
    └── frontend/               # Ứng dụng di động React Native (Expo SDK, TypeScript)
        ├── src/
        │   ├── constants/      # Danh mục địa điểm VKU & môn học
        │   ├── screens/        # Màn hình Radar, QR Document, Pomodoro, Profile
        │   ├── services/       # Kết nối API Backend
        │   └── types/          # TypeScript interfaces
        ├── App.tsx             # Giao diện chính & thanh điều hướng tab
        ├── app.json            # Cấu hình Expo và quyền Camera
        ├── package.json
        └── tsconfig.json
```

---

## 👥 Thành viên nhóm 05 & Phân công vai trò

| # | Thành viên | MSSV | GitHub Username | Vai trò |
| :-: | :--- | :---: | :---: | :--- |
| 1 | **Nguyễn Quang Hoàng** | 23IT.B063 | [@hoangnqjl](https://github.com/hoangnqjl) | **Project Manager (PM)** |
| 2 | **Tạ Kim Hương** | 23IT.B088 | [@huongtk](https://github.com/huongtk) | **Business Analyst (BA)** |
| 3 | **Nguyễn Thị Diễm Quỳnh** | 23IT.B196 | [@quynhntd](https://github.com/quynhntd) | **Mobile Developer (UI Lead)** |
| 4 | **Phạm Nguyễn Phú Trọng** | 23CE.B025 | [@trongpnp](https://github.com/trongpnp) | **Mobile Developer (Feature Lead)** |
| 5 | **Đoàn Hữu Khánh** | 23IT.B096 | [@khanhdh](https://github.com/khanhdh) | **Backend & Cloud Engineer (QA)** |

---

## 🚀 Hướng dẫn bắt đầu nhanh

### 1. Backend Service
```bash
cd sources/backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Mobile App (Expo)
```bash
cd sources/frontend
npm install
npm start
```
*Quét mã QR bằng ứng dụng **Expo Go** trên thiết bị Android hoặc iOS để chạy app.*
