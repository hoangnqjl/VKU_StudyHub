import { CampusLocation } from '../../shared/constants/locations';

export const RADAR_CONFIG = {
  // Chu kỳ phiên học: 4 tiếng (14.400.000 ms)
  CHECKIN_TTL_MS: 4 * 60 * 60 * 1000,

  // Thời gian chờ phản hồi lời mời ghép bàn: 5 phút (300.000 ms)
  JOIN_REQUEST_TIMEOUT_MS: 5 * 60 * 1000,

  // Giờ đóng cửa mặc định nếu địa điểm có quy định đóng cửa (Thư viện: 21h)
  DEFAULT_LIBRARY_CLOSING_HOUR: 21,

  // Thời gian khóa gửi lại khi bị từ chối: 2 tiếng
  REJECTION_COOLDOWN_MS: 2 * 60 * 60 * 1000,

  // Giới hạn chống spam: Tối đa 3 lời mời trong vòng 5 phút
  MAX_REQUESTS_PER_WINDOW: 3,
  SPAM_WINDOW_MS: 5 * 60 * 1000,

  // Mã môn học học tự do
  FREE_STUDY_COURSE_CODE: 'ANY'
};

export type JoinTableRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';

export interface StudyBuddyCheckIn {
  id: string;
  userId: string;
  studentName: string;
  studentId: string;
  avatarUrl?: string;
  locationId: string;
  locationName: string;
  isCustomLocation?: boolean;
  courseCode: string;
  courseName: string;
  isCustomCourse?: boolean;
  studyNote?: string;
  clientIp: string;               // Lưu địa chỉ IP khi check-in để so sánh khi gia hạn
  isActive: boolean;
  checkedInAt: string;
  expiresAt: string;              // Tự động hết hạn sau 4 tiếng (hoặc trần giờ đóng cửa)
  lastRenewedAt?: string;
  renewCount: number;
}

export interface CheckInDto {
  locationId: string;
  customLocationName?: string;
  courseCode: string;
  customCourseName?: string;
  studyNote?: string;
}

export interface ExtendCheckInDto {
  note?: string;
}

export interface JoinTableRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderStudentId: string;
  senderAvatarUrl?: string;
  targetUserId: string;
  targetName?: string;
  message: string;
  senderSeatNote?: string;
  status: JoinTableRequestStatus;
  createdAt: string;
  expiresAt: string;              // Tự động hết hạn sau đúng 5 phút
  respondedAt?: string;
}

export interface JoinTableRequestDto {
  targetUserId: string;
  message?: string;
  senderSeatNote?: string;
}

export interface UpdateJoinRequestDto {
  status: 'ACCEPTED' | 'REJECTED';
}

export interface BuddyFilterParams {
  locationId?: string;
  courseCode?: string;
  search?: string;
}

export interface LocationWithBuddyCount extends CampusLocation {
  activeBuddiesCount: number;
}
