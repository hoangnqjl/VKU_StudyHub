# VKU StudyHub — Dynamic Risk Register

**Project:** VKU StudyHub Mobile (`VKU-STUDYHUB`)  
**Owners:** Nguyễn Quang Hoàng (PM), Tạ Kim Hương (BA), Đoàn Hữu Khánh (Backend/QA)  
**Review cadence:** Đánh giá tại mỗi phiên Sprint Review và khi chuyển giao giai đoạn phát triển  
**Scoring:** Xác suất (Probability) và Tác động (Impact) theo mức Low / Medium / High. Mức High × High bắt buộc có kế hoạch phản ứng chủ động.

---

## 1. Risk Identification Linked to User Stories & Sprints

| ID | Rủi ro & Tác nhân kích hoạt | User Stories liên kết / Painpoints | Xác suất | Tác động | Chiến lược phản ứng (Response) | Người phụ trách | Giai đoạn trọng tâm | Trạng thái ban đầu |
|:---:|---|---|:---:|:---:|---|---|:---:|:---:|
| **R-01** | Quyền Camera bị từ chối hoặc quét QR thất bại trên các dòng máy Android khác nhau | US-19, US-20; P9, P14 | Medium | High | **Mitigate:** Dùng thư viện expo-camera, hiển thị màn hình xin cấp quyền thân thiện, test ma trận tối thiểu 3 phiên bản Android, hỗ trợ fallback | Phạm Nguyễn Phú Trọng | **Sprint 2** (Kiểm thử Frontend #38) | Open — Chờ ma trận test |
| **R-02** | Phạm vi Radar bị phình to (yêu cầu GPS/bản đồ) gây trễ tiến độ | US-07–US-12; P4–P6 | Medium | High | **Avoid / Mitigate:** Giữ nguyên thiết kế chọn địa điểm VKU cố định qua dropdown; từ chối GPS, bản đồ map thực địa và chat media | Nguyễn Quang Hoàng | **Sprint 1 & 2** | Controlled — Đã chốt vị trí cố định |
| **R-03** | Kết nối mạng chập chờn, CSDL Cloud hoặc xung đột schema khi tích hợp FE-BE gây trùng lặp dữ liệu | TS-03, US-08, US-15–US-19, US-32 | Medium | High | **Mitigate:** Sử dụng mã idempotency key khi lưu tài liệu, xác thực payload chặt chẽ bằng Zod, bắt lỗi và tự động retry an toàn | Đoàn Hữu Khánh | **Sprint 2** (Kết nối FE-BE #40) | Open — Đang xử lý khi ghép API |
| **R-04** | Đồng bộ nhịp đếm Pomodoro giữa nhiều máy gặp độ trễ hoặc lệch giây | US-23–US-27; P1 | Medium | High | **Mitigate:** Sử dụng mốc thời gian máy chủ (Server Timestamp) làm căn cứ chuẩn thay vì đếm giờ cục bộ trên từng client | Nguyễn Thị Diễm Quỳnh | **Sprint 2** (Kết nối FE-BE Module 4) | Open — Chuyển giao sang Sprint 2 |
| **R-05** | Đóng gói Android APK qua EAS Build thất bại hoặc cấu hình sai dependencies | TS-08; Charter Risk 1 | Medium | High | **Transfer / Mitigate:** Sử dụng dịch vụ Expo EAS Cloud Build thay vì build local; ghim cứng phiên bản dependencies trong package.json | Đoàn Hữu Khánh | **Sprint 2** (Đóng gói phát hành) | Open — Chờ tích hợp hoàn tất |
| **R-06** | Hiển thị thông tin sinh viên trên Radar làm lộ quyền riêng tư | US-13; P8 | Low | High | **Mitigate:** Chỉ hiển thị tên hiển thị/biệt danh và nhãn địa điểm chung trong trường, không lộ số điện thoại hay thông tin cá nhân | Tạ Kim Hương | **Sprint 2** (Kiểm thử Frontend #38) | Open — Kiểm tra trong UI test |
| **R-07** | Thành viên nhóm bị quá tải khi vừa kết nối API vừa sửa lỗi giao diện | Toàn bộ dự án | Medium | Medium | **Mitigate:** Phân công nhiệm vụ song song rõ ràng: Quỳnh & Hương kiểm thử FE (#38), Khánh & Trọng phụ trách API & Build, Hoàng điều phối tích hợp (#40) | Nguyễn Quang Hoàng | **Sprint 2** | Controlled — Bảng Scrum phân chia rõ |
| **R-08** | Yêu cầu mở rộng tính năng ngoài phạm vi (nhắn tin real-time, gọi video, bản iOS) | Out-of-scope boundaries | Medium | Medium | **Avoid:** Giữ vững ranh giới phạm vi cam kết trong Project Charter; ghi nhận các yêu cầu mới vào Backlog tương lai | Nguyễn Quang Hoàng | **Sprint 1 & 2** | Closed — Giữ vững phạm vi |

---

## 2. Dynamic Update at Sprint Transition (Chuyển giao Sprint 1 sang Sprint 2 — 02/11/2026)

| ID | Diễn biến thực tế sau Sprint 1 & Đầu Sprint 2 | Xác suất mới | Tác động mới | Kế hoạch hành động tại Sprint 2 | Trạng thái ghi nhận ngày 02/11/2026 |
|:---:|---|:---:|:---:|---|---|
| **R-01** | Các module giao diện Camera (#36) đã hoàn thành, chuẩn bị bước vào kiểm thử trên thiết bị thật | Medium | High | Thực hiện kiểm thử toàn diện trong thẻ việc **#38 (Kiểm thử Frontend)**: test trên Android 11, 12, 13, 14 với trường hợp từ chối quyền và cấp lại quyền. | **In Progress — Đang kiểm thử trong thẻ #38** |
| **R-02** | Mô hình chọn địa điểm VKU cố định (Thư viện tầng 2, Khu tự học tòa V, Căn tin...) đã lập trình xong ở cả FE và BE | Low | High | Tiếp tục duy trì danh mục cố định, không tích hợp thêm Google Maps hay toạ độ GPS. | **Controlled — Hoàn thành kiểm soát phạm vi** |
| **R-03** | Đã hoàn thành cấu trúc CSDL và API độc lập; bắt đầu bước vào giai đoạn kết nối gọi API trực tiếp | High | High | Kích hoạt thẻ **#40 (Hoàn tất tích hợp & Xác minh FE-BE cho Module 1)** ở trạng thái Ready; thêm interceptor xử lý retry và hiển thị banner mất mạng. | **Materialized / Action Required — Trọng tâm Sprint 2** |
| **R-04** | Wireframe và logic đếm giờ cơ bản đã xong ở Sprint 1; cần giải thuật đồng bộ thời gian thực cho Sprint 2 | High | High | Triển khai module đồng bộ countdown dựa trên `server_started_at` và `duration` lưu tại database máy chủ trong Sprint 2. | **Materialized — Ưu tiên cao trong Sprint 2** |
| **R-05** | Đã cấu hình tệp `eas.json` và kiểm tra cấu trúc build Expo SDK 52 | Low | High | Thực hiện lệnh chạy thử nghiệm EAS build bản Preview APK ngay sau khi hoàn thành kết nối Module 1 (#40). | **Open — Sẵn sàng chạy build khi tích hợp xong** |
| **R-06** | Màn hình Hồ sơ và Cài đặt đã bổ sung trường Nickname và hiển thị ẩn danh | Low | High | Kiểm tra tính năng ẩn danh và hiển thị biệt danh trong quá trình kiểm thử Frontend (#38). | **Controlled — Đang thẩm định trong Sprint 2** |
| **R-07** | Nhóm thống nhất chuyển toàn bộ việc kết nối FE-BE và kiểm thử hệ thống sang Sprint 2 để tập trung cao độ | Low | Medium | Duy trì họp Standup định kỳ, cập nhật trạng thái thẻ việc trên bảng GitHub Projects Scrum Board. | **Controlled — Vận hành ổn định** |
| **R-08** | Không có phát sinh yêu cầu thêm tính năng phức tạp từ các bên liên quan | Low | Low | Bảo vệ nghiêm ngặt phạm vi cho đợt đóng gói APK Android và UAT với 5–8 sinh viên VKU. | **Closed — Phạm vi dự án được bảo vệ vững chắc** |

---

## 3. Review Rules & Escalation Protocol

1. **Nguyên tắc chuyển Sprint:** Toàn bộ công tác tích hợp kết nối Frontend - Backend và kiểm thử hệ thống phải có thẻ việc (Issue) theo dõi trên GitHub Projects và được review nghiêm túc qua Pull Request.
2. **Xử lý rủi ro trọng điểm Sprint 2:** Các rủi ro R-01 (Camera), R-03 (Kết nối API/Mạng) và R-04 (Đồng bộ Pomodoro) được gán trực tiếp vào các phiên làm việc của Sprint 2, có video/ảnh chụp minh chứng đi kèm.
3. **Tiêu chí đóng rủi ro:** Rủi ro chỉ được xem là Closed khi tính năng liên quan đã vượt qua kiểm thử trên điện thoại thật và được ký xác nhận trong biên bản UAT (Objective 2).
