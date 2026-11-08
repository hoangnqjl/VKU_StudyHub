export interface Course {
  code: string;
  name: string;
  faculty: string;
  credits: number;
}

export const VKU_SAMPLE_COURSES: Course[] = [
  {
    code: 'IT001',
    name: 'Quản lý dự án phần mềm',
    faculty: 'Khoa Công nghệ Thông tin',
    credits: 3
  },
  {
    code: 'IT002',
    name: 'Lập trình di động đa nền tảng',
    faculty: 'Khoa Công nghệ Thông tin',
    credits: 3
  },
  {
    code: 'IT003',
    name: 'Cơ sở dữ liệu nâng cao',
    faculty: 'Khoa Công nghệ Thông tin',
    credits: 3
  },
  {
    code: 'IT004',
    name: 'Kiến trúc máy tính & Hệ điều hành',
    faculty: 'Khoa Kỹ thuật Máy tính',
    credits: 3
  },
  {
    code: 'IT005',
    name: 'Trí tuệ nhân tạo căn bản',
    faculty: 'Khoa Trí tuệ Nhân tạo',
    credits: 3
  },
  {
    code: 'MATH001',
    name: 'Xác suất thống kê',
    faculty: 'Bộ môn Khoa học Cơ bản',
    credits: 3
  },
  {
    code: 'ANY',
    name: 'Tự học tự do (Môn bất kỳ)',
    faculty: 'Toàn trường',
    credits: 0
  }
];



export interface Cohort {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
}

export const VKU_COHORTS: Cohort[] = [
  { id: 'K19', name: 'Khóa 2019 (K19)', startYear: 2019, endYear: 2023, description: 'Niên khóa 2019 - 2023' },
  { id: 'K20', name: 'Khóa 2020 (K20)', startYear: 2020, endYear: 2024, description: 'Niên khóa 2020 - 2024' },
  { id: 'K21', name: 'Khóa 2021 (K21)', startYear: 2021, endYear: 2025, description: 'Niên khóa 2021 - 2025' },
  { id: 'K22', name: 'Khóa 2022 (K22)', startYear: 2022, endYear: 2026, description: 'Niên khóa 2022 - 2026' },
  { id: 'K23', name: 'Khóa 2023 (K23)', startYear: 2023, endYear: 2027, description: 'Niên khóa 2023 - 2027' },
  { id: 'K24', name: 'Khóa 2024 (K24)', startYear: 2024, endYear: 2028, description: 'Niên khóa 2024 - 2028' },
  { id: 'K25', name: 'Khóa 2025 (K25)', startYear: 2025, endYear: 2029, description: 'Niên khóa 2025 - 2029' },
  { id: 'K26', name: 'Khóa 2026 (K26)', startYear: 2026, endYear: 2030, description: 'Niên khóa 2026 - 2030' },
  { id: 'K27', name: 'Khóa 2027 (K27)', startYear: 2027, endYear: 2031, description: 'Niên khóa 2027 - 2031' },
  { id: 'K28', name: 'Khóa 2028 (K28)', startYear: 2028, endYear: 2032, description: 'Niên khóa 2028 - 2032' },
];
