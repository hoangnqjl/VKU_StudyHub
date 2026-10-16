import { StudyBuddyCheckIn, CheckInDto, JoinTableRequestDto, JoinTableRequest } from './radar.types';
import { VKU_CAMPUS_LOCATIONS } from '../../shared/constants/locations';
import { AppError } from '../../middlewares/error.middleware';

class RadarService {
  // In-memory active check-ins
  private checkIns: StudyBuddyCheckIn[] = [
    {
      id: 'chk_01',
      userId: 'usr_02',
      studentName: 'Phạm Nguyễn Phú Trọng',
      studentId: '23CE.B025',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
      locationId: 'loc_lib_f2',
      locationName: 'Thư viện - Tầng 2',
      courseCode: 'IT001',
      courseName: 'Quản lý dự án phần mềm',
      studyNote: 'Bàn số 4 gần cửa sổ, ôn WBS & Project Charter',
      isActive: true,
      checkedInAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: 'chk_02',
      userId: 'usr_03',
      studentName: 'Nguyễn Thị Diễm Quỳnh',
      studentId: '23IT.B196',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      locationId: 'loc_lib_f2',
      locationName: 'Thư viện - Tầng 2',
      courseCode: 'IT001',
      courseName: 'Quản lý dự án phần mềm',
      studyNote: 'Đang làm Wireframe Figma, cần bạn thảo luận cùng',
      isActive: true,
      checkedInAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
    },
    {
      id: 'chk_03',
      userId: 'usr_04',
      studentName: 'Tạ Kim Hương',
      studentId: '23IT.B088',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      locationId: 'loc_v_self_study',
      locationName: 'Khu tự học Tòa V',
      courseCode: 'IT002',
      courseName: 'Lập trình di động đa nền tảng',
      studyNote: 'Ôn bài thi trắc nghiệm React Native',
      isActive: true,
      checkedInAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ];

  // In-memory table join requests
  private joinRequests: JoinTableRequest[] = [];

  public getLocations() {
    return VKU_CAMPUS_LOCATIONS;
  }

  public getActiveBuddies(filters?: { locationId?: string; courseCode?: string }) {
    return this.checkIns.filter((item) => {
      if (!item.isActive) return false;
      if (filters?.locationId && item.locationId !== filters.locationId) return false;
      if (filters?.courseCode && item.courseCode.toLowerCase() !== filters.courseCode.toLowerCase()) return false;
      return true;
    });
  }

  public checkIn(user: { id: string; fullName?: string; studentId?: string }, dto: CheckInDto) {
    const location = VKU_CAMPUS_LOCATIONS.find((l) => l.id === dto.locationId);
    const locationName = location ? location.name : 'Khuôn viên VKU';

    // Deactivate previous active check-in of this user if exists
    this.checkIns.forEach((item) => {
      if (item.userId === user.id) {
        item.isActive = false;
      }
    });

    const newCheckIn: StudyBuddyCheckIn = {
      id: `chk_${Date.now()}`,
      userId: user.id,
      studentName: user.fullName || 'Sinh viên VKU',
      studentId: user.studentId || '23IT.XXX',
      locationId: dto.locationId,
      locationName,
      courseCode: dto.courseCode,
      courseName: dto.courseName || dto.courseCode,
      studyNote: dto.studyNote || 'Đang tự học, hoan nghênh bạn học cùng!',
      isActive: true,
      checkedInAt: new Date().toISOString()
    };

    this.checkIns.unshift(newCheckIn);
    return newCheckIn;
  }

  public checkOut(userId: string) {
    let found = false;
    this.checkIns.forEach((item) => {
      if (item.userId === userId && item.isActive) {
        item.isActive = false;
        found = true;
      }
    });
    return { success: true, message: found ? 'Đã tắt trạng thái tìm bạn học' : 'Bạn chưa bật trạng thái trước đó' };
  }

  public sendJoinRequest(sender: { id: string; fullName?: string; studentId?: string }, dto: JoinTableRequestDto) {
    if (sender.id === dto.targetUserId) {
      throw new AppError('Bạn không thể tự gửi yêu cầu ghép bàn cho chính mình', 400);
    }

    const request: JoinTableRequest = {
      id: `req_${Date.now()}`,
      senderId: sender.id,
      senderName: sender.fullName || 'Bạn học VKU',
      senderStudentId: sender.studentId || '23IT.XXX',
      targetUserId: dto.targetUserId,
      message: dto.message || 'Chào bạn, mình thấy bạn đang học cùng môn, mình xin phép ghép bàn học cùng nhé!',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.joinRequests.unshift(request);
    return request;
  }

  public getJoinRequestsForUser(userId: string) {
    return this.joinRequests.filter((r) => r.targetUserId === userId);
  }

  public updateJoinRequestStatus(requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    const request = this.joinRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new AppError('Không tìm thấy yêu cầu ghép bàn', 404);
    }
    request.status = status;
    return request;
  }
}

export const radarService = new RadarService();

