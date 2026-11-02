# VKU StudyHub — Burndown, Burnup & EVM Tracking Report

**Project:** VKU StudyHub Mobile (`VKU-STUDYHUB`)  
**Repository:** `https://github.com/hoangnqjl/VKU_StudyHub`  
**GitHub Project Board:** `https://github.com/users/hoangnqjl/projects/1/views/1`  
**Document Version:** Version 2.0 (Khớp dữ liệu thực tế từ GitHub Insights & Scrum Board ngày 02/11/2026)

---

## 1. Tổng quan Tiến độ Thực tế từ GitHub Projects

Dựa trên bảng Scrum và biểu đồ theo dõi trên GitHub Projects (Ảnh chụp ngày 02/11/2026), dự án được phân chia thành 2 giai đoạn Sprint rõ ràng:

### 1.1. Sprint 1 — Xây dựng Nền tảng, Thiết kế UI/UX & Lập trình Phân hệ Độc lập (15/10/2026 – 31/10/2026)
* **Phạm vi hoàn tất (Done):**
  * Nghiên cứu bài toán: Phân tích painpoints (#7), Viết User stories (#9), Đọc Project Charter (#4), Lập WBS v1.0 (#2).
  * Thiết kế UI/UX: Wireframe Module 1 (#10), Study Radar (#19), Pomodoro (#16), QR tài liệu (#17).
  * Khởi tạo kiến trúc: Cấu trúc thư mục Frontend React Native/Expo (#27), Cấu trúc Backend & CSDL (#14), Luồng CI & Quy tắc Git (#5).
  * Lập trình độc lập Module 1: Frontend (#21), Backend API (#22), Kiểm thử sơ bộ (#23).
  * Lập trình độc lập Module 2: Backend API (#25 - PR #30 đã merge).
  * Lập trình độc lập Module 3: Backend API (#34 - PR #39 đã merge).
  * Thử nghiệm sơ bộ: Kiểm thử Prototype lần 1 và khảo sát người dùng (#11).
* **Phạm vi hoàn thành code đang trong trạng thái Review (In Review):**
  * Lập trình Frontend Module 2 (Study Radar) (#33 - Assignee: Quỳnh).
  * Lập trình Frontend Module 3 (Fast QR Sharing) (#36 - Assignee: Quỳnh).
  * Lập trình Frontend Module 4 (Pomodoro Timer) (#37 - Assignee: Quỳnh).
  * Lập trình Backend Module 4 (Pomodoro Engine) (#35 - Assignee: Trọng).

### 1.2. Sprint 2 — Kết nối Frontend - Backend, Kiểm thử Chuyên sâu & Nghiệm thu Phát hành (02/11/2026 – 16/11/2026)
Theo quyết định điều chỉnh kế hoạch dự án, toàn bộ các hạng mục sau được tập trung thực hiện trong Sprint 2:
1. **Kết nối tích hợp Frontend - Backend (FE-BE Integration):**
   * Kích hoạt thẻ việc **#40: Hoàn tất tích hợp & Xác minh FE-BE cho Module 1** (Trạng thái: *Ready*).
   * Tiếp tục tích hợp API live cho Module 2 (Study Radar), Module 3 (Fast QR Sharing) và Module 4 (Pomodoro Timer).
2. **Kiểm thử Frontend chuyên sâu (#38):**
   * Kích hoạt thẻ việc **#38: Kiểm thử Frontend** (Trạng thái: *In Progress*, Hạn: 02/11/2026 – Assignee: Hương).
   * Kiểm thử độ tương thích giao diện trên nhiều dòng máy Android, kiểm tra form nhập liệu, điều hướng và hiển thị tiếng Việt.
3. **Mọi kế hoạch sau (Kiểm thử hệ thống, Đóng gói APK & Nghiệm thu UAT):**
   * Kiểm thử tích hợp hệ thống toàn diện (TS-07): Kiểm tra quyền Camera (R-01), kiểm tra chịu lỗi mất mạng có retry (US-32, R-03), audit bảo mật không lộ API keys (US-33).
   * Đóng gói bản cài đặt Android APK qua Expo EAS Cloud Build (TS-08, REL-01).
   * Thử nghiệm người dùng thực tế (UAT) với 5–8 sinh viên VKU (US-34, Objective 2).
   * Triển khai hạ tầng Production Cloud và bàn giao Hướng dẫn vận hành (User & Admin Guide).
   * Hoàn thiện bộ hồ sơ bằng chứng kỹ thuật (Audit Evidence Package) cho các mốc M8 và bảo vệ đồ án M9.

---

## 2. Phân tích Biểu đồ Burn Up (GitHub Insights)

Biểu đồ Burn Up trích xuất từ GitHub Insights (`github.com/users/hoangnqjl/projects/1/insights`, bộ lọc `is:issue`) trong khoảng thời gian từ **19/10/2026 đến 02/11/2026** ghi nhận các diễn biến:

```text
Số Issues
  14 ┤                                                       ╭── Total Scope (12)
  12 ┤                                           ╭───────────╯
  10 ┤                               ╭───────────╯
   8 ┤                               │
   6 ┤                               │                       ╭── Completed (6)
   4 ┤   ╭───────────────────────────╯           ╶ ╶ ╶ ╶ ╶ ╶ ╯
   2 ┤   │
   0 ┼───┴───────────┴───────────────┴───────────┴───────────┴────
       Oct 19      Oct 23          Oct 26      Oct 30      Nov 02
```

### 2.1. Diễn giải các giai đoạn trên biểu đồ:
* **Giai đoạn 1 (19/10 – 24/10):**
  * Đường Total Scope duy trì ở mức 5 issues (tập trung vào các tài liệu khởi tạo dự án và Module 1).
  * Đường Completed ở mức 0 vì các issue đang trong quá trình lập trình và chưa hoàn tất review.
* **Giai đoạn 2 (25/10 – 26/10):**
  * Đường Total Scope tăng vọt từ 5 lên 11 issues: Nhóm tiến hành phân rã chi tiết các User Stories thành các Issue kỹ thuật độc lập cho Frontend và Backend của Module 2, 3, 4.
  * Đường Completed tăng từ 0 lên 5 issues: Đóng các thẻ việc đã hoàn tất (Module 1 FE #21, Module 1 BE #22, WBS #2, Userstory #9, Prototype #11).
* **Giai đoạn 3 (27/10 – 31/10):**
  * Toàn đội tập trung lập trình cao độ cho 4 module; các thẻ Frontend (#33, #36, #37) và Backend (#35) lần lượt hoàn thành code và chuyển vào cột `In Review` kèm Pull Request.
* **Giai đoạn 4 (01/11 – 02/11 — Chuyển giao sang Sprint 2):**
  * Thẻ việc #34 (Backend Module 3) merge thành công, nâng số lượng Completed lên 6 issues.
  * Đường Total Scope tăng lên 12 issues khi nhóm mở các thẻ việc trọng tâm của Sprint 2: **#40 (Tích hợp FE-BE Module 1)** ở trạng thái Ready và **#38 (Kiểm thử Frontend)** ở trạng thái In Progress.

---

## 3. Tính toán Giá trị Thu được (Earned Value Management - EVM)

Đánh giá chỉ số hiệu suất tại thời điểm kết thúc Sprint 1 và chuyển giao sang Sprint 2 (Ngày 02/11/2026):

### 3.1. Các thông số đầu vào:
* **Kế hoạch Sprint 1:** 81 Story Points dự kiến hoàn thành trong 10 ngày làm việc (tương đương 50 công người - person-days của cả nhóm 5 người).
* **Kết quả thực tế kết thúc Sprint 1:**
  * Các Story Points đã hoàn thành (Done): 58 Story Points.
  * Các Story Points đang trong giai đoạn In Review (sắp hoàn tất merge): 23 Story Points.
* **Công sức thực tế đã bỏ ra (Actual Cost - AC):** 46 person-days (ghi nhận qua commit log và thảo luận nhóm).

### 3.2. Bảng chỉ số EVM tại mốc chuyển giao:

| Chỉ số EVM | Công thức tính | Giá trị thực tế | Ý nghĩa quản trị |
| :--- | :--- | :---: | :--- |
| **Planned Value (PV)** | Tổng Story Points theo kế hoạch Sprint 1 | **81 points** | Khối lượng công việc dự kiến hoàn thành trước ngày 31/10 |
| **Earned Value (EV)** | Điểm Story Points đã nghiệm thu hoàn thành (Done) | **58 points** | Giá trị thực tế đã đóng gói (chưa tính các PR đang In Review) |
| **Actual Cost (AC)** | Công sức người-ngày thực tế bỏ ra | **46 person-days** | Mức tiêu hao nguồn lực của 5 thành viên trong Sprint 1 |
| **Schedule Variance (SV)** | $SV = EV - PV$ | **−23 points** | Độ lệch tiến độ tạm thời do 4 thẻ module đang ở pha Review |
| **Schedule Performance Index (SPI)** | $SPI = \frac{EV}{PV}$ | **0.72** | Khi 4 PR (#33, #35, #36, #37) hoàn tất merge, SPI điều chỉnh về **1.00** |
| **Cost Variance (CV - nỗ lực)** | $CV = \frac{EV \times AC_{planned}}{PV} - AC$ | **−10.2 person-days** | Nhóm dành thêm thời gian hoàn thiện code Frontend chỉn chu |
| **Cost Performance Index (CPI)** | $CPI = \frac{EV \times AC_{planned}}{PV \times AC}$ | **0.78** | Hiệu suất chi phí / nỗ lực ghi nhận được |

### 3.3. Quyết định Quản trị (Corrective & Strategic Actions):
1. **Duy trì tính minh bạch Agile:** Nhóm không vội vã chuyển các thẻ công việc đang `In Review` sang `Done` để làm đẹp báo cáo. Chỉ công nhận Earned Value khi code đã qua review nghiêm túc và merge vào `main`.
2. **Chiến lược chuyển dịch toàn diện sang Sprint 2:** 
   * Đưa toàn bộ các công tác kết nối Frontend - Backend (bắt đầu bằng Issue #40) và kiểm thử Frontend độc lập (#38) vào Sprint 2.
   * Tập trung giải quyết dứt điểm các rủi ro tích hợp (R-01: Quyền Camera, R-03: Xử lý mạng & CSDL Cloud, R-04: Đồng bộ Pomodoro).
   * Đảm bảo tiến độ xuất bản file APK (EAS Build) và kiểm thử UAT sinh viên đúng hạn cam kết trước Tuần 13.

---

## 4. Hướng dẫn Minh chứng Kiểm toán (Audit Evidence Checklist)

* [x] Ảnh chụp màn hình bảng Scrum GitHub Projects thể hiện đầy đủ trạng thái các cột và phân bổ Sprint 1 / Sprint 2.
* [x] Ảnh chụp biểu đồ GitHub Insights Burn Up Chart thể hiện rõ đường Total Scope và Completed.
* [x] Danh sách Pull Requests và mã commit tuân thủ Conventional Commits liên kết với các Issue #21, #22, #25, #34, #39, #40.
* [ ] Biên bản nghiệm thu kiểm thử Frontend (#38) và video ghi hình trải nghiệm tính năng trên điện thoại thật.
* [ ] File cài đặt Android APK xuất từ Expo EAS Build và biên bản đánh giá người dùng thực tế (UAT Form).
