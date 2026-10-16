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
  }
];

