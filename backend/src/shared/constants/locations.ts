export interface CampusLocation {
  id: string;
  name: string;
  description: string;
  building: string;
  floor?: number;
  closingHour?: number; // e.g., 21 for 21:00
  isSystemPreset?: boolean;
}

export const VKU_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc_lib_f2',
    name: 'Thư viện - Tầng 2',
    description: 'Khu vực bàn học nhóm và máy tính tra cứu',
    building: 'Thư viện',
    floor: 2,
    closingHour: 21,
    isSystemPreset: true
  },
  {
    id: 'loc_lib_f3',
    name: 'Thư viện - Tầng 3',
    description: 'Khu vực yên tĩnh tự học và đọc sách',
    building: 'Thư viện',
    floor: 3,
    closingHour: 21,
    isSystemPreset: true
  },
  {
    id: 'loc_v_self_study',
    name: 'Khu tự học Tòa V',
    description: 'Không gian mở tự do cho sinh viên',
    building: 'Tòa V',
    floor: 1,
    closingHour: 22,
    isSystemPreset: true
  },
  {
    id: 'loc_k_hall',
    name: 'Sảnh Tòa K',
    description: 'Khu vực ghế đá & bàn học ngoài trời thoáng mát',
    building: 'Tòa K',
    floor: 1,
    isSystemPreset: true
  },
  {
    id: 'loc_canteen',
    name: 'Căn tin trường',
    description: 'Khu vực ăn uống, nghỉ trưa và ôn bài nhẹ',
    building: 'Căn tin',
    floor: 1,
    closingHour: 19,
    isSystemPreset: true
  },
  {
    id: 'loc_coffee_shop',
    name: 'Quán Cà phê Sinh viên',
    description: 'Khuôn viên cà phê tự học có ổ cắm điện & wifi mạnh',
    building: 'Khu dịch vụ',
    floor: 1,
    closingHour: 22,
    isSystemPreset: true
  },
  {
    id: 'loc_other',
    name: 'Vị trí khác / Xung quanh trường',
    description: 'Khuôn viên mở hoặc quán cà phê lân cận trường VKU',
    building: 'Khu vực mở rộng',
    floor: 1,
    isSystemPreset: false
  }
];


