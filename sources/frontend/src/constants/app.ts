export const SUBJECTS = [
  { id: 'toan-cao-cap', name: 'Toán cao cấp', code: 'MATH101', icon: '📐' },
  { id: 'vat-ly', name: 'Vật lý đại cương', code: 'PHYS101', icon: '⚡' },
  { id: 'lap-trinh-c', name: 'Lập trình C/C++', code: 'CS101', icon: '💻' },
  { id: 'co-so-dl', name: 'Cơ sở dữ liệu', code: 'CS201', icon: '🗃️' },
  { id: 'mang-may-tinh', name: 'Mạng máy tính', code: 'CS301', icon: '🌐' },
  { id: 'giai-tich', name: 'Giải tích', code: 'MATH201', icon: '📊' },
  { id: 'ktmt', name: 'Kiến trúc máy tính', code: 'CS202', icon: '🖥️' },
  { id: 'os', name: 'Hệ điều hành', code: 'CS302', icon: '⚙️' },
  { id: 'ai', name: 'Trí tuệ nhân tạo', code: 'CS401', icon: '🤖' },
  { id: 'mobile', name: 'Lập trình Mobile', code: 'CS402', icon: '📱' },
  { id: 'web', name: 'Phát triển Web', code: 'CS403', icon: '🌍' },
  { id: 'bao-mat', name: 'An toàn thông tin', code: 'CS404', icon: '🔒' },
] as const;

export const LOCATIONS = [
  { id: 'thu-vien', name: 'Thư viện', icon: '📚' },
  { id: 'canteen', name: 'Căn tin', icon: '☕' },
  { id: 'a1', name: 'Tòa A1', icon: '🏢' },
  { id: 'a2', name: 'Tòa A2', icon: '🏢' },
  { id: 'lab-tin', name: 'Phòng Lab Tin', icon: '💻' },
  { id: 'san-truong', name: 'Sân trường', icon: '🌳' },
  { id: 'phong-hoc', name: 'Phòng học tự quản', icon: '🏫' },
] as const;

export const STUDY_GOALS = [
  { id: 'midterm', name: 'Ôn thi giữa kỳ', icon: '📝' },
  { id: 'final', name: 'Ôn thi cuối kỳ', icon: '🎯' },
  { id: 'project', name: 'Làm đồ án', icon: '🔧' },
  { id: 'homework', name: 'Làm bài tập', icon: '✏️' },
  { id: 'selflearn', name: 'Tự học nâng cao', icon: '🚀' },
  { id: 'group', name: 'Thảo luận nhóm', icon: '👥' },
] as const;

export const POMODORO_PRESETS = [
  { work: 25, rest: 5, label: 'Chuẩn (25/5)' },
  { work: 50, rest: 10, label: 'Dài (50/10)' },
  { work: 15, rest: 3, label: 'Ngắn (15/3)' },
  { work: 90, rest: 20, label: 'Deep Work (90/20)' },
] as const;

export const RADAR_AUTO_OFF_MINUTES = [30, 60, 90, 120] as const;
