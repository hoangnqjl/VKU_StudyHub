# VKU StudyHub Mobile App 📱

Ứng dụng di động kết nối bạn học & chia sẻ tài liệu thông minh cho sinh viên Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU).

Dự án thuộc học phần **Quản lý dự án phần mềm** - Nhóm 05 (Giảng viên hướng dẫn: **TS. Nguyễn Thành Tuấn**).

---

## 🚀 Tính năng chính (Theo Project Charter)
1. **Module 1 - Authentication & Study Profile:** Quản lý hồ sơ môn học và xác thực sinh viên VKU.
2. **Module 2 - Study Buddy Radar:** Check-in môn học và vị trí thực tế trong trường (Thư viện Tầng 2, Căn tin, Tòa K, Tòa V...) để ghép bàn học tức thì.
3. **Module 3 - Smart QR Document Share:** Quét và tạo mã QR chia sẻ đề cương ôn thi / bài giảng chỉ trong 2 giây bằng Camera điện thoại.
4. **Module 4 - Group Study Timer:** Đồng hồ đếm ngược Pomodoro đồng bộ cho nhóm học tập trung.

---

## 🛠️ Công nghệ sử dụng
- **Framework:** React Native (Expo SDK 51)
- **Language:** TypeScript
- **Modules tích hợp:** `expo-camera`, `expo-barcode-scanner`, `react-native-safe-area-context`
- **Build tool:** Expo Go & EAS Build (Android APK)

---

## 📂 Cấu trúc thư mục
```
frontend/
├── assets/              # Icon, hình ảnh splash
├── src/
│   ├── constants/       # Danh sách địa điểm khuôn viên VKU & môn học
│   ├── screens/         # Các màn hình chính (Radar, QR Document, Pomodoro, Profile)
│   ├── services/        # Kết nối API Backend / BaaS
│   └── types/           # Kiểu dữ liệu TypeScript
├── App.tsx              # Component gốc và điều hướng tab
├── app.json             # Cấu hình Expo và quyền Camera
├── package.json
└── tsconfig.json
```

---

## 📲 Hướng dẫn chạy ứng dụng

1. **Cài đặt thư viện phụ thuộc:**
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng:**
   ```bash
   npm start
   ```

3. **Chạy trên điện thoại thật:**
   - Cài đặt ứng dụng **Expo Go** từ Google Play Store (Android) hoặc Apple App Store (iOS).
   - Mở camera hoặc Expo Go quét mã QR hiển thị trên Terminal để trải nghiệm trực tiếp.
