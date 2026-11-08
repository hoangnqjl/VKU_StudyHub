const fs = require('fs');

let code = fs.readFileSync('frontend/src/app/profile.tsx', 'utf8');

// Danh sách môn học gợi ý của VKU
const VKU_SUGGESTED_COURSES = [
  'Lập trình Java',
  'Cơ sở dữ liệu & SQL',
  'An toàn mạng & Bảo mật',
  'Phát triển ứng dụng di động',
  'Thiết kế giao diện UI/UX',
  'Hệ điều hành Linux',
  'Kiến trúc máy tính',
  'Phân tích & Thiết kế hệ thống',
];

// Danh sách mục tiêu học tập gợi ý
const VKU_SUGGESTED_GOALS = [
  { title: 'Luyện thi TOEIC VKU', sub: 'Mục tiêu 650+ chuẩn đầu ra ngoại ngữ VKU', iconType: 'target' },
  { title: 'Nghiên cứu khoa học SV', sub: 'Tìm bạn cùng viết bài báo NCKH và nộp đề tài', iconType: 'cap' },
  { title: 'Luyện thuật toán ICPC / Olympic', sub: 'Giải bài tập LeetCode / Codeforces mỗi tối', iconType: 'trophy' },
  { title: 'Làm bài tập lớn & Đồ án kỳ', sub: 'Tìm thành viên hoàn thiện đồ án chuyên ngành', iconType: 'layers' },
];

// Kiểm tra và thay thế modal của profile.tsx để đưa ra ngoài ScrollView và bổ sung Quick Suggestions
fs.writeFileSync('temp_profile_ref.txt', 'check');

