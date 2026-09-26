export interface CampusLocation {
  id: string;
  name: string;
  zone: string;
}

export const VKU_CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 'lib_f1', name: 'Thư viện Tầng 1 (Khu đọc sách)', zone: 'Khu Thư Viện' },
  { id: 'lib_f2', name: 'Thư viện Tầng 2 (Khu tự học yên tĩnh)', zone: 'Khu Thư Viện' },
  { id: 'hall_v', name: 'Khu tự học Tòa V (Tầng 2 & 3)', zone: 'Tòa V' },
  { id: 'hall_k', name: 'Khu tự học Tòa K', zone: 'Tòa K' },
  { id: 'canteen', name: 'Căn tin sinh viên VKU', zone: 'Khu Dịch Vụ' },
  { id: 'sports_hall', name: 'Nhà thi đấu thể thao đa năng', zone: 'Khu Thể Thao' }
];

export const VKU_DEFAULT_COURSES = [
  { code: 'IT001', name: 'Quản lý dự án phần mềm' },
  { code: 'IT002', name: 'Lập trình ứng dụng di động' },
  { code: 'IT003', name: 'Cơ sở dữ liệu nâng cao' },
  { code: 'IT004', name: 'Trí tuệ nhân tạo' },
  { code: 'IT005', name: 'Mạng máy tính & An toàn thông tin' }
];
