# VKU StudyHub — Work Breakdown Structure (WBS)

**Project:** VKU StudyHub Mobile (VKU-STUDYHUB)  
**Document Version:** Version 2.0 (Aligned with 2-Sprint Execution Strategy)  
**Lifecycle Model:** Agile / Scrum (2 Sprints)

---

## 1. WBS Tree Structure

`	ext
Project: VKU StudyHub App (VKU-STUDYHUB)
│
├── 1. Project Management & Governance
│   ├── 1.1 Project Charter & Stakeholder Matrix [Sprint 1]
│   ├── 1.2 GitHub Projects Scrum Board & User Stories Setup [Sprint 1]
│   ├── 1.3 Requirements Traceability Matrix (RTM) [Sprint 1]
│   ├── 1.4 Dynamic Risk Register & Tracking Reports [Sprint 1 & Sprint 2]
│   └── 1.5 Audit Evidence Package & Final Presentation [Sprint 2]
│
├── 2. System Architecture & Cloud Infrastructure [Sprint 1]
│   ├── 2.1 Expo / React Native TypeScript Client Scaffold (#27)
│   ├── 2.2 GitHub Actions CI Pipeline & Conventional Commits (#5)
│   ├── 2.3 Branch Protection Rules & Secrets Management
│   ├── 2.4 Cloud Database Schema & Relations (Aiven MySQL) (#14)
│   └── 2.5 Cloud Storage Bucket & API Service Configuration
│
├── 3. Module 1: Authentication & Study Profile (Standalone Dev) [Sprint 1]
│   ├── 3.1 Frontend: Sign-in / Sign-up & Profile Screens (#21)
│   ├── 3.2 Frontend: Course Selector & Study Goals View (#21)
│   ├── 3.3 Frontend: Personal Document Repository Screen (#21)
│   ├── 3.4 Backend: Auth, User Profile & Course Management APIs (#22)
│   └── 3.5 Component & Unit Verification for Module 1 (#23)
│
├── 4. Module 2: Study Radar (Standalone Dev) [Sprint 1]
│   ├── 4.1 Frontend: Study Status Toggle & Campus Location Selector (#33)
│   ├── 4.2 Frontend: Active Buddy List Interface (#33)
│   ├── 4.3 Frontend: Table-Join Request & Notification UI (#33)
│   └── 4.4 Backend: Presence State, Matching & Join Request APIs (#25)
│
├── 5. Module 3: Fast QR Document Sharing (Standalone Dev) [Sprint 1]
│   ├── 5.1 Frontend: Course-Based Document Catalog View (#36)
│   ├── 5.2 Frontend: In-App Camera QR Scanner Screen (expo-camera) (#36)
│   ├── 5.3 Frontend: Dynamic QR Code Rendering Component (#36)
│   └── 5.4 Backend: Document Metadata & Storage Upload APIs (#34)
│
├── 6. Module 4: Shared Study Timer (Pomodoro) (Standalone Dev) [Sprint 1]
│   ├── 6.1 Frontend: Group Pomodoro Room Creation View (#37)
│   ├── 6.2 Frontend: Countdown Timer & Active Member Panel (#37)
│   ├── 6.3 Backend: Pomodoro Room Creation & State Management APIs (#35)
│   └── 6.4 Prototype Testing Round 1 & User Feedback (#11)
│
└── 7. Verification, Integration, Packaging & Deployment [Sprint 2]
    ├── 7.1 Frontend - Backend Integration (Kết nối FE - BE)
    │   ├── 7.1.1 FE-BE Integration & Session Persistence for Module 1 (#40)
    │   ├── 7.1.2 FE-BE Integration for Study Radar (Presence & Invitations)
    │   ├── 7.1.3 FE-BE Integration for Fast QR Document Sharing (Upload & Scan)
    │   └── 7.1.4 FE-BE Integration for Pomodoro Room & Synchronized Countdown
    ├── 7.2 Frontend Dedicated Testing (Kiểm thử Frontend #38)
    │   ├── 7.2.1 Responsive UI & Form Validation Testing across Screen Sizes
    │   ├── 7.2.2 Vietnamese Localization, Theme Consistency & Navigation Flows
    │   └── 7.2.3 Client-side Error Boundary & Form Feedback Verification
    ├── 7.3 System & Integration Test Suite (TS-07)
    │   ├── 7.3.1 Hardware Camera & QR Scanner Integration Verification
    │   ├── 7.3.2 Network Instability, Offline Retry & Idempotency Testing
    │   └── 7.3.3 Security Audit: Client Sanitization & Secrets Verification
    ├── 7.4 Performance Benchmark & Optimization
    │   ├── 7.4.1 App Cold Startup Time Benchmark (< 3s)
    │   └── 7.4.2 API Data Fetch & Response Latency Benchmark (< 1.5s)
    ├── 7.5 Mobile Application Packaging & Distribution
    │   ├── 7.5.1 Android Production APK Generation via Expo EAS Cloud Build
    │   └── 7.5.2 Real Device APK Installation & Execution Verification
    ├── 7.6 Production Cloud Cutover & Live Services Verification
    ├── 7.7 User Acceptance Testing (UAT Execution & Sign-off)
    │   ├── 7.7.1 Real-world UAT with 5–8 VKU Students (10+ QR scans, 5+ sessions)
    │   └── 7.7.2 UAT Feedback Form Collection & Acceptance Report
    └── 7.8 Project Handover & Closeout
        ├── 7.8.1 User & Admin Operational Guide
        └── 7.8.2 Final Audit Evidence Package (Milestone M8 & M9)
`

---

## 2. Sprint Allocation Summary

| Sprint | Scope & Objective | Key Deliverables & Milestones |
| :--- | :--- | :--- |
| **Sprint 1** | **Xây dựng Nền tảng, Thiết kế UI/UX & Lập trình Phân hệ Độc lập**<br>Tập trung hoàn thành toàn bộ thiết kế wireframe, khởi tạo kiến trúc dự án (Frontend Expo & Backend Node/Express + CSDL), lập trình độc lập tất cả màn hình Frontend và dịch vụ API Backend cho cả 4 module, kèm kiểm thử prototype sơ bộ. | • WBS 1.1, 1.2, 1.3, 2.1–2.5<br>• WBS 3.1–3.5 (Module 1 FE & BE)<br>• WBS 4.1–4.4 (Module 2 FE & BE)<br>• WBS 5.1–5.4 (Module 3 FE & BE)<br>• WBS 6.1–6.4 (Module 4 FE & BE)<br>• Prototype testing lần 1 (M4) |
| **Sprint 2** | **Kết nối Frontend - Backend, Kiểm thử Chuyên sâu & Nghiệm thu Phát hành**<br>Tập trung toàn lực vào việc kết nối tích hợp dữ liệu giữa Frontend và Backend cho cả 4 phân hệ, triển khai kiểm thử Frontend độc lập (#38), kiểm thử hệ thống toàn diện, đóng gói APK thực tế qua EAS, thử nghiệm người dùng UAT và hoàn thiện hồ sơ nghiệm thu cuối kỳ. | • WBS 7.1 (Kết nối FE - BE Module 1–4, #40)<br>• WBS 7.2 (Kiểm thử Frontend #38)<br>• WBS 7.3 (Kiểm thử hệ thống TS-07)<br>• WBS 7.4 (Benchmark hiệu năng)<br>• WBS 7.5 (Đóng gói APK qua EAS Build)<br>• WBS 7.6 (Triển khai Production Cloud)<br>• WBS 7.7 (UAT với sinh viên VKU)<br>• WBS 7.8 (Tài liệu HDSD & Audit Package M8, M9) |
