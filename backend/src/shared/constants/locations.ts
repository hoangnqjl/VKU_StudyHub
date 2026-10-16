export interface CampusLocation {
  id: string;
  name: string;
  description: string;
  building: string;
  floor?: number;
}

export const VKU_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc_lib_f2',
    name: 'Thư viện - Tầng 2',
    description: 'Khu vực bàn học nhóm và máy tính tra cứu',
    building: 'Thư viện',
    floor: 2
  },
  {
    id: 'loc_lib_f3',
    name: 'Thư viện - Tầng 3',
    description: 'Khu vực yên tĩnh tự học và đọc sách',
    building: 'Thư viện',
    floor: 3
  },
  {
    id: 'loc_v_self_study',
    name: 'Khu tự học Tòa V',
    description: 'Không gian mở tự do cho sinh viên',
    building: 'Tòa V',
    floor: 1
  },
  {
    id: 'loc_k_hall',
    name: 'Sảnh Tòa K',
    description: 'Khu vực ghế đá & bàn học ngoài trời thoáng mát',
    building: 'Tòa K',
    floor: 1
  },
  {
    id: 'loc_canteen',
    name: 'Căn tin trường',
    description: 'Khu vực ăn uống, nghỉ trưa và ôn bài nhẹ',
    building: 'Căn tin',
    floor: 1
  },
  {
    id: 'loc_coffee_shop',
    name: 'Quán Cà phê Sinh viên',
    description: 'Khuôn viên cà phê tự học có ổ cắm điện & wifi mạnh',
    building: 'Khu dịch vụ',
    floor: 1
  }
];

