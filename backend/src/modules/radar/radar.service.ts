import {
  StudyBuddyCheckIn,
  CheckInDto,
  ExtendCheckInDto,
  JoinTableRequestDto,
  JoinTableRequest,
  BuddyFilterParams,
  LocationWithBuddyCount,
  RADAR_CONFIG
} from './radar.types';
import { VKU_CAMPUS_LOCATIONS } from '../../shared/constants/locations';
import { VKU_SAMPLE_COURSES } from '../../shared/constants/courses';
import { AppError } from '../../middlewares/error.middleware';

class RadarService {
  // In-memory active check-ins with initial mock data
  private checkIns: StudyBuddyCheckIn[] = [];

  // In-memory table join requests
  private joinRequests: JoinTableRequest[] = [];

  /**
   * Tính toán thời gian hết hạn của phiên học (Mặc định 4 tiếng, capped bởi giờ đóng cửa của địa điểm)
   */
  private calculateExpiresAt(locationId: string): string {
    const now = new Date();
    const defaultExpiry = new Date(now.getTime() + RADAR_CONFIG.CHECKIN_TTL_MS);

    const location = VKU_CAMPUS_LOCATIONS.find((l) => l.id === locationId);
    if (location?.closingHour !== undefined) {
      const closingToday = new Date();
      closingToday.setHours(location.closingHour, 0, 0, 0);

      // Nếu giờ hết hạn vượt quá giờ đóng cửa của địa điểm hôm nay -> Chặn trần tại giờ đóng cửa
      if (now < closingToday && defaultExpiry > closingToday) {
        return closingToday.toISOString();
      }
    }

    return defaultExpiry.toISOString();
  }

  /**
   * Dọn dẹp thụ động (Passive cleanup) các check-in quá 4 tiếng và các join requests quá 5 phút
   */
  private cleanExpiredRecords() {
    const now = new Date();

    // Tắt các check-in đã quá hạn
    this.checkIns.forEach((c) => {
      if (c.isActive && new Date(c.expiresAt) <= now) {
        c.isActive = false;
      }
    });

    // Đánh dấu EXPIRED cho các lời mời ghép bàn quá 5 phút chưa phản hồi
    this.joinRequests.forEach((r) => {
      if (r.status === 'PENDING' && new Date(r.expiresAt) <= now) {
        r.status = 'EXPIRED';
      }
    });
  }

  /**
   * 1. Lấy danh mục địa điểm kèm số lượng bạn học đang có mặt (Heatmap)
   */
  public getLocations(): LocationWithBuddyCount[] {
    this.cleanExpiredRecords();
    const now = new Date();

    return VKU_CAMPUS_LOCATIONS.map((loc) => {
      const count = this.checkIns.filter(
        (c) => c.locationId === loc.id && c.isActive && new Date(c.expiresAt) > now
      ).length;

      return {
        ...loc,
        activeBuddiesCount: count
      };
    });
  }

  /**
   * 2. Lấy danh sách bạn học đang online (loại bỏ người hết hạn 4h, loại trừ người gọi API)
   */
  public getActiveBuddies(currentUserId?: string, filters?: BuddyFilterParams) {
    this.cleanExpiredRecords();
    const now = new Date();

    return this.checkIns.filter((item) => {
      // 1. Phải đang active và chưa hết hạn 4h
      if (!item.isActive || new Date(item.expiresAt) <= now) return false;

      // 2. Không hiển thị chính mình trên danh sách cần ghép bàn
      if (currentUserId && item.userId === currentUserId) return false;

      // 3. Lọc theo địa điểm
      if (filters?.locationId && item.locationId !== filters.locationId) return false;

      // 4. Lọc theo môn học
      if (filters?.courseCode) {
        const queryCode = filters.courseCode.toLowerCase();
        const isExact = item.courseCode.toLowerCase() === queryCode;
        const isFreeStudy = item.courseCode === RADAR_CONFIG.FREE_STUDY_COURSE_CODE;
        if (!isExact && !isFreeStudy) return false;
      }

      // 5. Tìm kiếm từ khóa (tên, MSSV, tên môn, ghi chú)
      if (filters?.search) {
        const query = filters.search.toLowerCase().trim();
        const matchName = item.studentName.toLowerCase().includes(query);
        const matchStudentId = item.studentId.toLowerCase().includes(query);
        const matchCourse = item.courseName.toLowerCase().includes(query);
        const matchNote = item.studyNote?.toLowerCase().includes(query) || false;
        if (!matchName && !matchStudentId && !matchCourse && !matchNote) return false;
      }

      return true;
    });
  }

  /**
   * 3. Check-in bật trạng thái học (Có lưu Client IP, thời hạn 4 tiếng)
   */
  public checkIn(
    user: { id: string; fullName?: string; studentId?: string; avatarUrl?: string },
    dto: CheckInDto,
    clientIp: string
  ): StudyBuddyCheckIn {
    const now = new Date();

    // Xác định địa điểm
    let locationName = 'Khuôn viên VKU';
    let isCustomLocation = false;

    if (dto.locationId === 'loc_other') {
      locationName = dto.customLocationName?.trim() || 'Vị trí khác xung quanh trường VKU';
      isCustomLocation = true;
    } else {
      const location = VKU_CAMPUS_LOCATIONS.find((l) => l.id === dto.locationId);
      if (!location) {
        throw new AppError('Địa điểm check-in không tồn tại trong danh mục trường VKU', 400);
      }
      locationName = location.name;

      // Kiểm tra nếu địa điểm đã đóng cửa hôm nay
      if (location.closingHour !== undefined) {
        const closingToday = new Date();
        closingToday.setHours(location.closingHour, 0, 0, 0);
        if (now >= closingToday) {
          throw new AppError(
            `Địa điểm ${location.name} đã đóng cửa (sau ${location.closingHour}:00). Bạn vui lòng chọn địa điểm khác!`,
            400
          );
        }
      }
    }

    // Xác định môn học
    let courseName = dto.courseCode;
    let isCustomCourse = false;

    if (dto.courseCode === 'CUSTOM') {
      courseName = dto.customCourseName?.trim() || 'Tự học môn tự do';
      isCustomCourse = true;
    } else if (dto.courseCode === RADAR_CONFIG.FREE_STUDY_COURSE_CODE) {
      courseName = 'Tự học tự do (Môn bất kỳ)';
    } else {
      const course = VKU_SAMPLE_COURSES.find(
        (c) => c.code.toLowerCase() === dto.courseCode.toLowerCase()
      );
      courseName = course ? course.name : (dto.customCourseName || dto.courseCode);
    }

    // Tự động tắt bất kỳ phiên check-in nào trước đó của sinh viên này
    this.checkIns.forEach((item) => {
      if (item.userId === user.id && item.isActive) {
        item.isActive = false;
      }
    });

    const expiresAt = this.calculateExpiresAt(dto.locationId);

    const newCheckIn: StudyBuddyCheckIn = {
      id: `chk_${Date.now()}`,
      userId: user.id,
      studentName: user.fullName || 'Sinh viên VKU',
      studentId: user.studentId || '23IT.XXX',
      avatarUrl: user.avatarUrl,
      locationId: dto.locationId,
      locationName,
      isCustomLocation,
      courseCode: dto.courseCode,
      courseName,
      isCustomCourse,
      studyNote: dto.studyNote?.trim() || 'Đang tự học, hoan nghênh bạn học cùng!',
      clientIp: clientIp || '127.0.0.1',
      isActive: true,
      checkedInAt: now.toISOString(),
      expiresAt,
      renewCount: 0
    };

    this.checkIns.unshift(newCheckIn);
    return newCheckIn;
  }

  /**
   * 4. GIA HẠN PHIÊN HỌC (SO SÁNH ĐỊA CHỈ IP - TỪ CHỐI NẾU KHÁC IP)
   */
  public extendCheckIn(userId: string, currentClientIp: string, dto?: ExtendCheckInDto): StudyBuddyCheckIn {
    this.cleanExpiredRecords();
    const now = new Date();

    const activeCheckIn = this.checkIns.find((item) => item.userId === userId && item.isActive);
    if (!activeCheckIn) {
      throw new AppError('Bạn chưa bật trạng thái tìm bạn học hoặc phiên học của bạn đã kết thúc', 404);
    }

    // 🔒 SO SÁNH ĐỊA CHỈ IP: Nếu IP hiện tại khác IP check-in ban đầu -> TỪ CHỐI NGAY
    if (activeCheckIn.clientIp !== currentClientIp) {
      throw new AppError(
        `Địa chỉ IP mạng hiện tại (${currentClientIp}) không khớp với mạng tại vị trí check-in ban đầu (${activeCheckIn.clientIp}). Bạn có vẻ đã di chuyển ra khỏi khu vực tự học của trường. Yêu cầu gia hạn bị từ chối.`,
        403
      );
    }

    // Kiểm tra giờ đóng cửa của địa điểm
    const location = VKU_CAMPUS_LOCATIONS.find((l) => l.id === activeCheckIn.locationId);
    if (location?.closingHour !== undefined) {
      const closingToday = new Date();
      closingToday.setHours(location.closingHour, 0, 0, 0);

      if (now >= closingToday) {
        activeCheckIn.isActive = false;
        throw new AppError(
          `Địa điểm ${location.name} đã đến giờ đóng cửa (${location.closingHour}:00). Hệ thống đã tự động kết thúc phiên tự học của bạn.`,
          400
        );
      }
    }

    // Hợp lệ: Gia hạn thêm 4 tiếng
    activeCheckIn.expiresAt = this.calculateExpiresAt(activeCheckIn.locationId);
    activeCheckIn.lastRenewedAt = now.toISOString();
    activeCheckIn.renewCount += 1;
    if (dto?.note) {
      activeCheckIn.studyNote = dto.note;
    }

    return activeCheckIn;
  }

  /**
   * 5. Checkout chủ động tắt trạng thái tìm bạn học
   */
  public checkOut(userId: string) {
    let found = false;
    this.checkIns.forEach((item) => {
      if (item.userId === userId && item.isActive) {
        item.isActive = false;
        found = true;
      }
    });

    // Tự động hủy các lời mời ghép bàn đang chờ của sinh viên này
    this.joinRequests.forEach((req) => {
      if (req.status === 'PENDING' && (req.senderId === userId || req.targetUserId === userId)) {
        req.status = 'CANCELLED';
      }
    });

    return {
      success: true,
      message: found ? 'Đã tắt trạng thái tìm bạn học thành công' : 'Bạn chưa bật trạng thái trước đó'
    };
  }

  /**
   * 6. Gửi lời mời ghép bàn (Có thời hạn đúng 5 phút, chống spam duplicate, chống tự gửi)
   */
  public sendJoinRequest(
    sender: { id: string; fullName?: string; studentId?: string; avatarUrl?: string },
    dto: JoinTableRequestDto
  ): JoinTableRequest {
    this.cleanExpiredRecords();
    const now = new Date();

    // 1. Không tự gửi cho chính mình
    if (sender.id === dto.targetUserId) {
      throw new AppError('Bạn không thể tự gửi yêu cầu ghép bàn cho chính mình', 400);
    }

    // 2. Kiểm tra bạn học đối phương có đang active và chưa hết hạn không
    const targetBuddy = this.checkIns.find(
      (c) => c.userId === dto.targetUserId && c.isActive && new Date(c.expiresAt) > now
    );
    if (!targetBuddy) {
      throw new AppError('Bạn học này hiện không còn hoạt động hoặc đã rời khỏi khu vực học', 400);
    }

    // 3. Chống gửi trùng lặp (nếu đã có lời mời PENDING còn hạn giữa 2 người)
    const existingPending = this.joinRequests.find(
      (r) =>
        r.senderId === sender.id &&
        r.targetUserId === dto.targetUserId &&
        r.status === 'PENDING' &&
        new Date(r.expiresAt) > now
    );
    if (existingPending) {
      throw new AppError('Bạn đã gửi lời mời cho bạn này rồi. Vui lòng chờ phản hồi trong vòng 5 phút!', 409);
    }

    // 4. Chống quấy rối nếu từng bị đối phương từ chối gần đây (trong 2 tiếng)
    const recentlyRejected = this.joinRequests.find(
      (r) =>
        r.senderId === sender.id &&
        r.targetUserId === dto.targetUserId &&
        r.status === 'REJECTED' &&
        now.getTime() - new Date(r.respondedAt || r.createdAt).getTime() < RADAR_CONFIG.REJECTION_COOLDOWN_MS
    );
    if (recentlyRejected) {
      throw new AppError(
        'Bạn học này đã từ chối lời mời trước đó. Vui lòng thử lại sau 2 tiếng hoặc chọn bạn học khác.',
        403
      );
    }

    const defaultMsg = `Chào bạn ${targetBuddy.studentName}, mình thấy bạn đang học môn ${targetBuddy.courseName}, mình xin phép ghép bàn cùng học nhé!`;

    const newRequest: JoinTableRequest = {
      id: `req_${Date.now()}`,
      senderId: sender.id,
      senderName: sender.fullName || 'Bạn học VKU',
      senderStudentId: sender.studentId || '23IT.XXX',
      senderAvatarUrl: sender.avatarUrl,
      targetUserId: dto.targetUserId,
      targetName: targetBuddy.studentName,
      message: dto.message?.trim() || defaultMsg,
      senderSeatNote: dto.senderSeatNote,
      status: 'PENDING',
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + RADAR_CONFIG.JOIN_REQUEST_TIMEOUT_MS).toISOString() // Hết hạn sau 5 phút
    };

    this.joinRequests.unshift(newRequest);
    return newRequest;
  }

  /**
   * 7. Lấy danh sách lời mời ghép bàn của sinh viên (Hộp thư đến & Danh sách đã gửi)
   */
  public getJoinRequestsForUser(userId: string) {
    this.cleanExpiredRecords();

    const inbox = this.joinRequests.filter((r) => r.targetUserId === userId);
    const sent = this.joinRequests.filter((r) => r.senderId === userId);

    return { inbox, sent };
  }

  /**
   * 8. Đếm số lượng lời mời đang chờ phản hồi (để hiện chấm đỏ Badge trên app)
   */
  public getUnreadBadgeCount(userId: string): { pendingCount: number } {
    this.cleanExpiredRecords();
    const now = new Date();

    const count = this.joinRequests.filter(
      (r) => r.targetUserId === userId && r.status === 'PENDING' && new Date(r.expiresAt) > now
    ).length;

    return { pendingCount: count };
  }

  /**
   * 9. Người nhận phản hồi lời mời ghép bàn (ACCEPTED / REJECTED)
   */
  public respondJoinRequest(targetUserId: string, requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    this.cleanExpiredRecords();
    const now = new Date();

    const request = this.joinRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new AppError('Không tìm thấy yêu cầu ghép bàn học', 404);
    }

    if (request.targetUserId !== targetUserId) {
      throw new AppError('Bạn không có quyền xử lý lời mời ghép bàn này', 403);
    }

    if (request.status !== 'PENDING') {
      throw new AppError(`Lời mời này đã được xử lý trước đó (${request.status})`, 400);
    }

    if (new Date(request.expiresAt) <= now) {
      request.status = 'EXPIRED';
      throw new AppError('Lời mời này đã quá thời hạn 5 phút và không còn hiệu lực', 400);
    }

    request.status = status;
    request.respondedAt = now.toISOString();

    return request;
  }

  /**
   * 10. Người gửi chủ động hủy lời mời đã gửi (CANCELLED)
   */
  public cancelJoinRequest(senderId: string, requestId: string) {
    const request = this.joinRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new AppError('Không tìm thấy yêu cầu ghép bàn học', 404);
    }

    if (request.senderId !== senderId) {
      throw new AppError('Bạn không có quyền hủy lời mời ghép bàn này', 403);
    }

    if (request.status !== 'PENDING') {
      throw new AppError(`Không thể hủy vì lời mời này đã ở trạng thái: ${request.status}`, 400);
    }

    request.status = 'CANCELLED';
    request.respondedAt = new Date().toISOString();

    return request;
  }
}

export const radarService = new RadarService();
