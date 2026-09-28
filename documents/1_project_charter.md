# SOFTWARE PROJECT CHARTER

**Course:** Software Project Management  
**Academic Supervisor / Instructor:** TS. Nguyễn Thành Tuấn  
**Submission Deadline:** End of Week 2 (Milestone M1)  
**Document Version:** Version 1.0 
**Recommended Length:** 3 – 5 pages (Concise, actionable, and bounded – not an exhaustive SRS)

---

## 1. PROJECT GENERAL INFORMATION

| Item | Details |
| :--- | :--- |
| **Project Name** | VKU StudyHub Mobile – Ứng dụng di động kết nối bạn học & chia sẻ tài liệu thông minh |
| **Project Acronym / Key** | VKU-STUDYHUB |
| **Course Cohort** | Quản lý dự án phần mềm |
| **Team Name / Identifier** | Nhóm 05 - StudyHub |
| **Creation Date** | 25/09/2026 |
| **Document Version** | Version 1.0 |
| **Primary GitHub Repository** | https://github.com/hoangnqjl/VKU_StudyHub.git |
| **GitHub Project Board URL** | https://github.com/users/hoangnqjl/projects/1/views/1 |

---

## 2. PROJECT SOURCING & REAL-WORLD CONTEXT
- Pathway 3: Real Campus / Department / Student Organization Need at VKU**  
  *(Giải quyết nhu cầu thực tế của sinh viên VKU: Cần tìm bạn học cùng môn ngay tại thư viện/khu tự học trường và quét mã QR chia sẻ nhanh tài liệu ôn thi trực tiếp trên smartphone).*

---

## 3. EXECUTIVE SUMMARY & BUSINESS CASE

- **Operational Background (Bối cảnh thực tế):** Sinh viên VKU thường tự học tại Thư viện, khu tự học hoặc các quán cà phê quanh trường. Khi gặp bài tập khó hoặc ôn thi cuối kỳ, việc nhắn tin lên các hội nhóm mạng xã hội lớn để tìm người học cùng thường bị trôi tin và không kịp thời. Việc truyền tay nhau tài liệu PDF/đề cương trên điện thoại cũng gặp khó khăn do thiếu ứng dụng di động chuyên biệt.
- **Core Problem Statement (Vấn đề cốt lõi):** Sinh viên thiếu động lực tự học một mình, khó tìm bạn có cùng lịch học/môn học đang có mặt cùng địa điểm, và quy trình chia sẻ tài liệu ôn thi trên thiết bị di động còn rườm rà.
- **Proposed Software Solution (Giải pháp phần mềm đề xuất):** Phát triển ứng dụng di động VKU StudyHub bằng React Native (Expo) với 3 trụ cột đơn giản nhưng độc đáo:
  1. **Study Buddy Radar:** Check-in môn học & vị trí trong trường (Thư viện tầng 2, Căn tin, Tòa K...) để tìm bạn ghép bàn học tức thì.
  2. **Smart QR Document Share:** Tạo và quét mã QR để nhận nhanh bộ tài liệu ôn tập/đề thi mẫu chỉ trong 2 giây.
  3. **Group Study Timer (Pomodoro đồng bộ):** Cùng đếm ngược thời gian tự học nhóm tạo động lực mà không cần gọi video tốn băng thông.

---

## 4. SMART PROJECT OBJECTIVES

1. **Objective 1 (Core Mobile App & Performance):** Xây dựng và xuất bản gói cài đặt Android APK (thông qua Expo EAS / Local Build) với thời gian khởi động ứng dụng dưới 3 giây và thời gian phản hồi/tải dữ liệu dưới 1.5 giây trong điều kiện mạng thông thường trước Tuần 9.
2. **Objective 2 (Operational & User Validation):** Cài đặt ứng dụng thử nghiệm cho ít nhất 5 – 8 sinh viên VKU thông qua Expo Go / file APK; thực hiện thành công tối thiểu 10 lượt quét mã QR nhận tài liệu và 5 phiên ghép bạn/nhóm học trong đợt thử nghiệm tại Tuần 12.
3. **Objective 3 (Engineering Rigor & Quality Gate):** Đạt tối thiểu 90% commit tuân thủ chuẩn Conventional Commits, thiết lập GitHub Actions tự động kiểm tra cú pháp (Lint/Build) trên mỗi PR, 100% PR phải được ít nhất 1 thành viên review trước khi merge vào nhánh main.
4. **Objective 4 (Production Deployment & Acceptance):** Triển khai Backend/Database lên dịch vụ đám mây miễn phí và bàn giao file cài đặt APK hoàn chỉnh cùng tài liệu hướng dẫn sử dụng cho Giảng viên hướng dẫn trước Tuần 13.

---

## 5. PROJECT SCOPE & BOUNDARIES

### 5.1. In-Scope (Committed Deliverables & Features)
- **Module 1: Authentication & Study Profile (Tài khoản & Hồ sơ môn học)**
  - Đăng nhập/Đăng ký tài khoản (hỗ trợ xác thực sinh viên qua Email/Google Auth).
  - Chọn danh sách các môn học đang theo học trong kỳ và mục tiêu học tập (ví dụ: Ôn thi giữa kỳ, Làm đồ án).
  - Cho phép quản lý tài liệu của chính mình
- **Module 2: "Study Radar" – Tìm bạn học tức thì (Tính năng trọng tâm)**
  - Bật trạng thái học: Chọn môn + Địa điểm trong trường (Thư viện, Khu tự học tòa V, Căn tin...).
  - Xem danh sách bạn học đang "sáng đèn" gần đó có cùng môn học để bấm nút "Xin ghép bàn học".
- **Module 3: Fast QR Document Sharing (Chia sẻ tài liệu qua mã QR)**
  - Kho tài liệu phân loại gọn gàng theo môn học.
  - Tạo mã QR động cho tài liệu; sinh viên mở camera app quét QR là lưu ngay tài liệu vào mục "Tài liệu của tôi" mà không cần gõ tìm kiếm.
- **Module 4: Shared Study Timer (Đồng hồ Pomodoro học nhóm)**
  - Tạo phòng đếm ngược Pomodoro (25 phút tập trung - 5 phút nghỉ - Hoặc có thể điều chỉnh thời gian); hiển thị danh sách thành viên đang cùng tập trung để giữ kỷ luật học tập.
- **Engineering & Governance Deliverables:**
  - Kho mã nguồn React Native (Expo) trên GitHub có commit log minh bạch.
  - Bảng Scrum trên GitHub Projects quản lý Sprint.
  - Bản cài đặt APK Android demo thực tế và video demo trải nghiệm trên thiết bị thật.

### 5.2. Explicitly Out-of-Scope (Phạm vi loại trừ để giữ dự án đơn giản)
- Không làm tính năng gọi video/audio call trực tiếp trong app (đơn giản hóa bằng cách để link phòng học online nếu học từ xa).
- Không làm hệ thống nhắn tin chat thời gian thực phức tạp nhiều media (chỉ cho phép gửi tin nhắn ghép bàn học dạng thông báo nhanh).
- Không đưa ứng dụng lên Apple App Store (yêu cầu tài khoản Apple Developer 99$/năm; dự án gói gọn trong Android APK và chạy thử qua Expo Go).
- Không tích hợp GPS bản đồ thực địa ngoài đời (chỉ dùng danh sách chọn vị trí cố định trong khuôn viên VKU để tiết kiệm pin và đơn giản hóa code).

---

## 6. STAKEHOLDER REGISTER & ENGAGEMENT MATRIX

### 6.1. Stakeholder Register

| Stakeholder / Entity | Role in Project | Power | Interest | Engagement Strategy |
| :--- | :--- | :---: | :---: | :--- |
| **TS. Nguyễn Thành Tuấn** | Academic Supervisor & Đánh giá môn học | High | High | **Manage Closely:** Báo cáo kiểm soát tiến độ định kỳ (M1–M9), demo trực tiếp app trên điện thoại. |
| **Sinh viên VKU (End Users)** | Đối tượng trải nghiệm ứng dụng di động | Low | High | **Keep Informed / Engage:** Cài đặt thử nghiệm qua Expo Go / APK, phản hồi về độ tiện dụng của tính năng Radar & QR. |
| **Project Engineering Team (Nhóm 05)** | Phân tích, thiết kế UI mobile, code React Native | High | High | **Collaborate Daily:** Quản lý task trên GitHub Projects, họp Standup nhanh và review Pull Request chéo. |
| **Quản trị viên hạ tầng (Backend/Cloud)** | Quản lý Database | High | Low | **Keep Satisfied:** Đảm bảo hạn mức cơ sở dữ liệu miễn phí, bảo mật API keys trong file .env. |

### 6.2. Power-Interest Matrix

| Mức độ | Low Interest (Quan tâm thấp) | High Interest (Quan tâm cao) |
| :--- | :--- | :--- |
| **High Power** (Quyền hạn cao) | **KEEP SATISFIED (Làm hài lòng):** Giảng viên và sinh viên trải nghiệm | **MANAGE CLOSELY (Quản lý chặt chẽ):** Giảng viên hướng dẫn (TS. Nguyễn Thành Tuấn), Project Manager (Nguyễn Quang Hoàng) |
| **Low Power** (Quyền hạn thấp) | **MONITOR (Giám sát):** Các nhóm dự án đồng môn, Cộng đồng mã nguồn mở Expo | **KEEP INFORMED (Cập nhật thường xuyên):** Sinh viên VKU trải nghiệm ứng dụng, Đội ngũ Tester cài đặt bản APK |

---

## 7. PROJECT MANAGEMENT STACK & GITHUB ECOSYSTEM

| Project Management Domain | GitHub Tool / Feature | Governance Standard |
| :--- | :--- | :--- |
| **Source Code Repository** | GitHub Repository | Quản lý mã nguồn React Native; bảo vệ nhánh main; 100% commit tuân thủ Conventional Commits (feat:, fix:, docs:, chore:). |
| **Project Tracking & Board** | GitHub Projects (Scrum) | Các cột: Backlog, Ready, In Progress, In Review, Done, Sprint (Iteration). Phân bổ thẻ công việc theo từng Sprint 2 tuần. |
| **Task Management** | GitHub Issues | Mỗi màn hình UI hoặc chức năng là một Issue riêng có gắn tag (mobile, backend, ui), độ ưu tiên và checklist. |
| **Code Review & Quality Control** | GitHub Pull Requests | Bắt buộc tạo PR cho mỗi tính năng mới; yêu cầu tối thiểu 1 lập trình viên khác review code trước khi gộp vào main. |
| **Milestone Tracking** | GitHub Milestones | Khởi tạo đầy đủ 10 mốc theo đề cương môn học (M1: Charter, M2: WBS, M5: Prototype Demo...). |
| **CI Automation** | GitHub Actions | Tự động chạy TypeScript check (tsc) và ESLint mỗi khi có PR mới. |

---

## 8. HIGH-LEVEL MILESTONES & SCHEDULE

| Milestone | Target Week | Major Deliverables | Responsible Role |
| :---: | :---: | :--- | :--- |
| **M1** | Week 2 | Hoàn thiện Project Charter và WBS cho Mobile App & Khởi tạo GitHub Projects | PM & Cả nhóm |
| **M2** | Weeks 3–4 | cấu trúc WBS & Ma trận RTM | BA (Tạ Kim Hương) & PM |
| **M3** | Week 5 | Sprint 1: Khởi tạo project React Native (Expo), thiết lập Auth & CSDL | Toàn bộ nhóm |
| **M4** | Weeks 6–7 | Sprint 1 Review: Xong kho tài liệu & Module tạo/quét mã QR; Báo cáo rủi ro #1 | Dev Team & PM |
| **M5** | Weeks 8–9 | **Midterm Milestone:** Demo ứng dụng trực tiếp trên điện thoại (Tính năng Radar + QR Share) | Toàn bộ nhóm |
| **M6** | Weeks 10–12 | Sprint 2 Review: Hoàn thiện đồng hồ Pomodoro nhóm & Quản lý phạm vi rủi ro #2 | Toàn bộ nhóm |
| **M7** | Week 13 | Đóng gói bản phát hành Android APK & Hoàn tất thử nghiệm người dùng (UAT) | Toàn bộ nhóm |
| **M8** | Week 14 | Hoàn thiện toàn bộ hồ sơ bằng chứng kỹ thuật (Audit Evidence Package) | Toàn bộ nhóm |
| **M9** | Week 15 | **Bảo vệ đồ án cuối kỳ & Trình bày trực tiếp ứng dụng di động trước Hội đồng** | Toàn bộ nhóm |

---

## 9. DEVELOPMENT METHODOLOGY & CADENCE

### 9.1. Chosen Development Methodology
- **Iterative & Incremental Development (Scrum Framework):** Chu kỳ 2 tuần/Sprint, tập trung release bản build app kiểm thử được liên tục.

### 9.2. Methodology Justification
- **Trải nghiệm ứng dụng di động đòi hỏi phản hồi nhanh:** Việc phát triển app trên di động cần liên tục kiểm tra thực tế trên màn hình smartphone (cảm ứng, bố cục nút bấm, camera quét QR). Chu kỳ Sprint ngắn giúp nhóm kịp thời tối ưu giao diện UI/UX.
- **Giảm thiểu rủi ro tích hợp:** Xây dựng tính năng theo từng gói nhỏ (Auth → QR Scan → Radar) giúp nhóm luôn có sẵn một phiên bản app chạy được ổn định để báo cáo qua từng mốc M1–M9.

---

## 10. TEAM ORGANIZATION & GOVERNANCE ROLES

| # | Thành viên | MSSV | GitHub Username | Vai trò dự án | Trách nhiệm chính trong App React Native |
| :-: | :--- | :---: | :---: | :--- | :--- |
| 1 | **Nguyễn Quang Hoàng** | 23IT.B063 | @hoangnq | **Project Manager (PM)** | Điều phối tiến độ Sprint, quản lý GitHub Projects, kiểm soát phạm vi và đại diện làm việc với Giảng viên. |
| 2 | **Tạ Kim Hương** | 23IT.B088 | @huongtk | **Business Analyst (BA)** | Thiết kế luồng trải nghiệm người dùng, viết User Stories và điều phối thử nghiệm thực tế với sinh viên. |
| 3 | **Nguyễn Thị Diễm Quỳnh** | 23IT.B196 | @quynhntd | **Mobile Developer (UI Lead)** | Lập trình các màn hình chính bằng React Native / Expo: Trang chủ, Hồ sơ môn học, Giao diện Radar tìm bạn học. |
| 4 | **Phạm Nguyễn Phú Trọng** | 23CE.B025 | @trongpnp | **Mobile Developer (Feature Lead)** | Lập trình module tích hợp Camera / Quét mã QR (expo-camera, expo-barcode-scanner) và đồng hồ Pomodoro nhóm. |
| 5 | **Đoàn Hữu Khánh** | 23IT.B096 | @khanhdh | **Backend & Cloud Engineer (QA)** | Cấu hình Supabase (MySQL, Auth, Storage), viết API/Trigger và thiết lập luồng CI GitHub Actions. |

---

## 11. CONSTRAINTS, ASSUMPTIONS & INITIAL RISKS

### 11.1. Project Constraints (Ràng buộc dự án)
- **Schedule:** 15 tuần học kỳ; bắt buộc có file APK chạy mượt mà trước Tuần 14.
- **Budget & Infrastructure:** 0 VNĐ. Dùng nền tảng mã nguồn mở miễn phí: React Native (Expo), Aiven Free Tier & Google console (Auth & Database & Storage), GitHub Free.
- **Technology Stack:**
  - Framework: React Native (Expo SDK).
  - Backend as a Service (BaaS): Aiven Free Tier (MySQL).
  - Ngôn ngữ: TypeScript

### 11.2. Key Assumptions
- Thiết bị di động của các thành viên và người dùng thử nghiệm có camera hoạt động tốt để quét mã QR.
- Dịch vụ Supabase duy trì kết nối ổn định cho các gói miễn phí trong suốt thời gian học phần.
- Toàn bộ 5 thành viên cài đặt thành công môi trường Expo trên máy tính và ứng dụng Expo Go trên điện thoại.

### 11.3. Top 3 Initial Project Risks

| Initial Risk | Probability | Impact | Proactive Response & Mitigation Plan |
| :--- | :---: | :---: | :--- |
| 1. Khó khăn khi đóng gói file APK trên máy tính yếu | Medium | High | Sử dụng dịch vụ build đám mây miễn phí của Expo (Expo Application Services - EAS Build) thay vì build local tốn RAM. |
| 2. Phức tạp hóa tính năng Radar dẫn đến trễ tiến độ | Medium | High | Giữ logic Radar ở mức đơn giản nhất: Sinh viên chọn vị trí bằng menu danh sách (Dropdown) thay vì vẽ bản đồ GPS toạ độ phức tạp. |
| 3. Lỗi quyền truy cập Camera khi quét QR trên các dòng máy Android khác nhau | Low | Medium | Sử dụng thư viện tiêu chuẩn expo-camera và viết sẵn giao diện thông báo yêu cầu cấp quyền rõ ràng, thân thiện cho người dùng. |

---

## 12. SUCCESS CRITERIA & DEFINITION OF DONE (DoD)

### 12.1. Project Success Criteria
1. **Functional Completeness:** Đóng gói thành công ứng dụng Android (.apk) cài đặt được trên điện thoại thật; hoạt động mượt mà đầy đủ các tính năng: Đăng nhập, Radar tìm bạn, Quét QR lấy tài liệu, Đồng hồ học nhóm.
2. **Authentic Validation:** Tối thiểu 5 - 8 sinh viên VKU cài đặt trải nghiệm thử và cho đánh giá tốt về sự tiện lợi của tính năng quét QR và ghép nhóm.
3. **Engineering Rigor:** Bảng GitHub Projects phản ánh chân thực các đầu việc của từng Sprint; có minh chứng rõ ràng việc dùng AI hỗ trợ viết code/giao diện.

### 12.2. Engineering Definition of Done (DoD) cho ứng dụng Mobile
*Một Issue chỉ được đóng và đưa vào cột Done khi:*
- [ ] Giao diện màn hình hiển thị chuẩn, không bị vỡ bố cục trên cả màn hình nhỏ và màn hình lớn.
- [ ] Đã test chức năng chạy tốt trực tiếp trên điện thoại thật thông qua ứng dụng Expo Go.
- [ ] Code được định dạng sạch sẽ, không có cảnh báo vàng (Warning) hoặc lỗi TypeScript.
- [ ] Tạo Pull Request, gắn link Issue (ví dụ: Closes #15), vượt qua kiểm tra GitHub Actions CI và được ít nhất 1 thành viên Approve.
- [ ] Không lưu cứng (hardcode) URL hay Supabase Service Keys trong code client.
- [ ] Đã merge vào nhánh main và kiểm tra không gây crash app.

---

## 13. FORMAL APPROVALS & SIGN-OFF

| Project Lead / Team Representative | Project Sponsor / Client Stakeholder | Academic Supervisor / Course Instructor |
| :---: | :---: | :---: |
| *(Ký & Ghi rõ họ tên)* | *(Ký & Ghi rõ họ tên)* | *(Ký & Ghi rõ họ tên)* |
| | | |
| | | |
| | | |
| **Nguyễn Quang Hoàng** | **Đại diện Sinh viên VKU (Client Rep)** | **TS. Nguyễn Thành Tuấn** |
| Ngày: ...... / ...... / 2026 | Ngày: ...... / ...... / 2026 | Ngày: ...... / ...... / 2026 |
