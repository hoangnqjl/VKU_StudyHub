# VKU StudyHub — Planning Poker & Sprint Plan

**Project:** VKU StudyHub Mobile (`VKU-STUDYHUB`)  
**Team:** Nhóm 05 — StudyHub  
**Estimation scale:** Modified Fibonacci — 1, 2, 3, 5, 8, 13  
**Basis:** User stories trong `0_Painpoints and UserStory.docx`, cấu trúc WBS v2.0 và bảng Scrum thực tế trên GitHub Projects.

---

## 1. Estimation Assumptions & Sprint Strategy

* **Định nghĩa Story Point:** 1 Story Point đại diện cho nỗ lực tương đối, độ phức tạp logic, công việc tích hợp và kiểm thử; không quy đổi cứng nhắc thành số giờ làm việc.
* **Quy mô nhóm & Nhịp độ phát triển:** Nhóm gồm 5 thành viên, thực hiện dự án theo mô hình Scrum với 2 Sprint chính (mỗi Sprint kéo dài khoảng 2 tuần).
* **Chiến lược phân bổ 2 Sprint (Theo định hướng thực tế dự án):**
  * **Sprint 1 (Hoàn thành cuối tháng 10/2026):** Khởi tạo kiến trúc hạ tầng (Frontend Expo, Backend Node.js, CSDL Cloud), thiết kế toàn bộ Wireframe UX/UI, lập trình độc lập các màn hình Frontend và các API Backend cho cả 4 phân hệ (Module 1: Auth & Profile, Module 2: Study Radar, Module 3: Fast QR Sharing, Module 4: Pomodoro timer), cùng kiểm thử Prototype lần 1.
  * **Sprint 2 (Khởi động từ 02/11/2026):** Toàn bộ công tác **kết nối tích hợp Frontend - Backend**, **kiểm thử Frontend chuyên sâu (#38)**, kiểm thử tích hợp hệ thống, tối ưu hiệu năng, đóng gói Android APK (EAS Build), thực nghiệm UAT với sinh viên và hoàn thiện hồ sơ nghiệm thu kỹ thuật.
* **Definition of Done (DoD):** Một đầu việc chỉ được xem là hoàn tất (Done) khi đã được kiểm thử xác nhận trên môi trường thực tế, vượt qua quy trình Code Review (ít nhất 1 Approve) và merge thành công vào nhánh main mà không phát sinh lỗi crash.

---

## 2. Planning Poker Results

| ID | User Story / Kỹ thuật / Kiểm thử | GitHub Issue | Độ ưu tiên | Story Points | Sprint | Tiêu chí nghiệm thu & Phạm vi trọng tâm |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **TS-01** | Khởi tạo cấu trúc thư mục Frontend React Native (Expo) | #27 | High | 3 | **1** | Cấu trúc phân tách module rõ ràng, Expo chạy thành công |
| **TS-02** | Thiết lập CI, Branch Protection, PR template & Conventional Commits | #5 | High | 3 | **1** | Tự động chạy ESLint và kiểm tra kiểu TypeScript trên PR |
| **TS-03** | Khởi tạo Backend Node.js, cấu trúc CSDL Cloud (Aiven MySQL) & Auth config | #14 | High | 5 | **1** | Kết nối CSDL thành công; quản lý secrets qua file .env |
| **DES-01** | Thiết kế UX/UI Wireframe cho cả 4 Phân hệ (Dựa trên UserStory) | #10, #16, #17, #19 | High | 5 | **1** | Wireframe đầy đủ luồng người dùng cho 4 module |
| **US-01** | Lập trình FE & BE: Đăng ký tài khoản sinh viên qua email | #21, #22 | High | 3 | **1** | Form đăng ký có validation, mã hóa mật khẩu phía BE |
| **US-03** | Lập trình FE & BE: Đăng nhập, đăng xuất và quản lý phiên người dùng | #21, #22 | High | 3 | **1** | Cơ chế sinh JWT token và lưu trữ phiên đăng nhập |
| **US-04** | Lập trình FE & BE: Chọn danh sách môn học trong kỳ | #21, #22 | High | 3 | **1** | Lưu danh sách môn học vào hồ sơ sinh viên |
| **US-06** | Lập trình FE & BE: Quản lý kho tài liệu cá nhân | #21, #22 | High | 3 | **1** | Xem và phân loại danh sách tài liệu cá nhân |
| **US-07** | Lập trình FE & BE: Bật/tắt trạng thái học (Chọn môn + Vị trí tại VKU) | #25, #33 | High | 5 | **1** | Toggle bật trạng thái trong tối đa 3 chạm; vị trí cố định |
| **US-08** | Lập trình FE & BE: Tự động tắt trạng thái học khi hết hạn | #25, #33 | High | 3 | **1** | Logic hết hạn trạng thái để tránh hiển thị thông tin sai |
| **US-09** | Lập trình FE & BE: Xem danh sách bạn học đang sáng đèn cùng môn | #25, #33 | High | 5 | **1** | Lọc và hiển thị danh sách bạn học theo môn & địa điểm |
| **US-11** | Lập trình FE & BE: Gửi và nhận lời xin ghép bàn học | #25, #33 | High | 3 | **1** | Gửi thông báo yêu cầu ghép bàn giữa 2 sinh viên |
| **US-15** | Lập trình FE & BE: Tải lên và phân loại tài liệu theo môn | #34, #36 | High | 5 | **1** | Lưu trữ metadata và tệp tài liệu đính kèm môn học |
| **US-16** | Lập trình FE & BE: Duyệt danh mục tài liệu theo từng môn học | #34, #36 | High | 3 | **1** | Danh sách tài liệu phân loại rõ ràng, có trạng thái loading/empty |
| **US-17** | Lập trình FE & BE: Tạo mã QR động cho tài liệu | #34, #36 | High | 3 | **1** | Render mã QR chứa mã định danh tài liệu |
| **US-19** | Lập trình FE: Mở Camera và quét mã QR tài liệu (expo-camera) | #36 | High | 5 | **1** | Đọc dữ liệu từ mã QR qua camera điện thoại |
| **US-20** | Lập trình FE: Xử lý thông báo xin cấp quyền Camera thân thiện | #36 | High | 2 | **1** | Giải thích quyền camera rõ ràng, không làm crash app khi từ chối |
| **US-23** | Lập trình FE & BE: Tạo phòng đếm ngược Pomodoro nhóm | #35, #37 | High | 3 | **1** | Tạo phòng với mã tham gia (Room Code) |
| **US-24** | Lập trình FE & BE: Tham gia phòng Pomodoro qua mã hoặc QR | #35, #37 | High | 3 | **1** | Xử lý tham gia phòng, bắt lỗi mã phòng không hợp lệ |
| **US-26** | Lập trình FE & BE: Bắt đầu, tạm dừng và kết thúc phiên Pomodoro | #35, #37 | High | 5 | **1** | Quyền điều khiển phiên học dành riêng cho chủ phòng |
| **US-27** | Lập trình FE & BE: Hiển thị bảng thành viên đang cùng tập trung | #35, #37 | High | 3 | **1** | Hiển thị danh sách và trạng thái (Focus / Short Break) |
| **TEST-00** | Kiểm thử Prototype lần 1 & Kiểm thử đơn vị Module 1 cơ bản | #11, #23 | High | 5 | **1** | Báo cáo phản hồi người dùng ban đầu và unit test Auth |
| **INT-01** | Hoàn tất tích hợp & Xác minh FE-BE cho Module 1 (Auth, Profile & Course) | #40 | High | 5 | **2** | Đăng ký/đăng nhập luồng thật, gọi API live, lưu token AsyncStorage |
| **INT-02** | Hoàn tất tích hợp & Xác minh FE-BE cho Module 2 (Study Radar) | — | High | 5 | **2** | Kết nối API live: Bật radar thật, nhận danh sách peer thời gian thực |
| **INT-03** | Hoàn tất tích hợp & Xác minh FE-BE cho Module 3 (Fast QR Document Sharing) | — | High | 5 | **2** | Quét QR lưu thẳng tài liệu vào DB cá nhân qua API Backend |
| **INT-04** | Hoàn tất tích hợp & Đồng bộ FE-BE cho Module 4 (Pomodoro Countdown Sync) | — | High | 8 | **2** | Đồng bộ nhịp đếm ngược giữa các máy qua Server Timestamp (US-25) |
| **TEST-01** | Kiểm thử Frontend chuyên sâu (#38): Responsive, Forms, Navigation, Dark/Light | #38 | High | 5 | **2** | Giao diện chuẩn trên nhiều kích cỡ màn hình Android, tiếng Việt (US-31) |
| **TEST-02** | Kiểm thử tích hợp hệ thống, quyền Camera & Khả năng chịu lỗi mất mạng | — | High | 5 | **2** | Test ma trận thiết bị, xử lý mất mạng có Retry an toàn (US-32, TS-07) |
| **TEST-03** | Kiểm tra an toàn bảo mật, loại bỏ hoàn toàn Secret Keys khỏi Client bundle | — | High | 3 | **2** | Audit mã nguồn, không lộ API keys/Service keys trong app APK (US-33) |
| **TEST-04** | Đo đạc và tối ưu hiệu năng vận hành ứng dụng (Khởi động < 3s, API < 1.5s) | — | High | 3 | **2** | Đạt tiêu chuẩn Objective 1 đã cam kết trong Charter (US-30) |
| **REL-01** | Đóng gói bản phát hành Android APK chính thức qua Expo EAS Cloud Build | — | High | 5 | **2** | Xuất file APK độc lập chạy được trên mọi thiết bị Android (TS-08) |
| **REL-02** | Kiểm tra cài đặt và trải nghiệm thực tế file APK trên điện thoại thật | — | High | 3 | **2** | Cài đặt trực tiếp trên smartphone sinh viên không phát sinh lỗi |
| **UAT-01** | Tổ chức thử nghiệm chấp nhận người dùng thực tế với 5–8 sinh viên VKU | — | High | 5 | **2** | Đạt tối thiểu 10 lượt quét QR thành công & 5 phiên ghép bàn (US-34) |
| **OPS-01** | Triển khai hạ tầng Production Cloud & Bàn giao Hướng dẫn vận hành | — | Medium | 3 | **2** | Database Cloud ổn định, bàn giao tài liệu User/Admin Operational Guide |
| **AUD-01** | Hoàn thiện toàn bộ hồ sơ bằng chứng kỹ thuật (Audit Evidence Package) | — | High | 5 | **2** | Đầy đủ minh chứng commit, PR, CI, Burnup chart phục vụ bảo vệ (M8, M9) |

---

## 3. Sprint Commitment Breakdown

### Sprint 1 — Xây dựng Nền tảng, Thiết kế UI/UX & Lập trình Phân hệ Độc lập
* **Các đầu việc cam kết:** `TS-01`, `TS-02`, `TS-03`, `DES-01`, `US-01`, `US-03`, `US-04`, `US-06`, `US-07`, `US-08`, `US-09`, `US-11`, `US-15`, `US-16`, `US-17`, `US-19`, `US-20`, `US-23`, `US-24`, `US-26`, `US-27`, `TEST-00`.
* **Tổng điểm Story Points:** **81 points**.
* **Mục tiêu Sprint 1 (Sprint Goal):** Hoàn thiện khảo sát nhu cầu, thiết kế bộ Wireframe UX/UI chuẩn hóa, dựng kiến trúc khung cho Frontend Expo và Backend Node/Express + CSDL Cloud; hoàn thành lập trình độc lập các màn hình Frontend và các API dịch vụ Backend cho cả 4 phân hệ cốt lõi (Module 1, 2, 3, 4); xác nhận luồng trải nghiệm sơ bộ thông qua đợt kiểm thử prototype lần 1.
* **Kết quả thực tế (Đến ngày 31/10/2026):** Toàn bộ các issue lập trình Frontend và Backend đã hoàn thành hoặc chuyển sang trạng thái In Review; sẵn sàng bước vào giai đoạn kết nối tích hợp dữ liệu.

### Sprint 2 — Kết nối Frontend - Backend, Kiểm thử Chuyên sâu & Nghiệm thu Phát hành
* **Các đầu việc cam kết:** `INT-01` (#40), `INT-02`, `INT-03`, `INT-04`, `TEST-01` (#38), `TEST-02`, `TEST-03`, `TEST-04`, `REL-01`, `REL-02`, `UAT-01`, `OPS-01`, `AUD-01`.
* **Tổng điểm Story Points:** **60 points**.
* **Mục tiêu Sprint 2 (Sprint Goal):** 
  1. Kết nối toàn diện Frontend và Backend cho toàn bộ 4 phân hệ (Bắt đầu với Issue #40: Hoàn tất tích hợp & Xác minh FE-BE cho Module 1).
  2. Thực hiện kiểm thử Frontend độc lập (#38) và kiểm thử hệ thống tích hợp (xử lý ngoại lệ, camera, an toàn thông tin).
  3. Đóng gói thành công file cài đặt Android APK qua Expo EAS Build.
  4. Tổ chức UAT thực tế với 5–8 sinh viên VKU nhằm xác nhận chỉ tiêu 10 lượt quét QR và 5 phiên ghép bàn.
  5. Đạt các chỉ số hiệu năng (Khởi động < 3s, API < 1.5s) và hoàn thiện hồ sơ Audit Evidence Package phục vụ bảo vệ đồ án cuối kỳ.

---

## 4. Estimation Review & Tracking Record

| Mốc đánh giá | Quyết định điều chỉnh | Căn cứ & Minh chứng đính kèm |
| :--- | :--- | :--- |
| **Khởi động Sprint 1** | Giới hạn điểm story point tối đa là 5 cho mỗi tác vụ độc lập; tách riêng việc lập trình UI và logic API để các thành viên triển khai song song. | Biên bản họp Planning Poker, danh sách Issues ban đầu trên GitHub Projects. |
| **Kết thúc Sprint 1 (31/10/2026)** | Ghi nhận hoàn thành giai đoạn lập trình độc lập các module; chuyển giao toàn bộ công tác kết nối dữ liệu FE-BE và kiểm thử giao diện sang Sprint 2 để đảm bảo độ tập trung. | Snapshot bảng Scrum: Các PR lập trình module Frontend (#21, #33, #36, #37) và Backend (#22, #25, #34, #35). |
| **Khởi động Sprint 2 (02/11/2026)** | Kích hoạt thẻ công việc #40 (Tích hợp FE-BE Module 1) ở trạng thái Ready; đưa thẻ #38 (Kiểm thử Frontend) vào trạng thái In Progress; xác lập kế hoạch đóng gói APK và UAT. | Giao diện GitHub Projects Scrum Board và biểu đồ GitHub Insights Burn Up Chart. |
