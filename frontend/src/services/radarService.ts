import { apiClient } from './apiClient';

export interface StudyBuddy {
  id: string;
  userId: string;
  fullName?: string;
  studentName?: string;
  studentId: string;
  faculty?: string;
  major?: string;
  tableNumber?: string;
  floor?: number;
  locationId?: string;
  locationName?: string;
  courseCode?: string;
  courseName?: string;
  studyNote?: string;
  activity?: string;
  status?: 'online' | 'busy' | 'away';
  isLookingForBuddy?: boolean;
  avatarUrl?: string;
  checkInTime?: string;
}

export interface JoinRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderStudentId: string;
  targetUserId: string;
  targetUserName?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  message?: string;
  senderSeatNote?: string;
  createdAt: string;
  expiresAt: string;
}

export const radarService = {
  async getBuddies(params?: { locationId?: string; courseCode?: string; search?: string }) {
    const res = await apiClient.get<StudyBuddy[]>('/radar/buddies', params);
    return res.data;
  },

  async getLocations() {
    const res = await apiClient.get<any[]>('/radar/locations');
    return res.data;
  },

  async checkIn(data: {
    locationId: string;
    courseCode: string;
    customLocationName?: string;
    customCourseName?: string;
    studyNote?: string;
  }) {
    const res = await apiClient.post('/radar/checkin', data);
    return res.data;
  },

  async checkOut() {
    const res = await apiClient.post('/radar/checkout');
    return res.data;
  },

  async sendJoinRequest(targetUserId: string, message?: string, senderSeatNote?: string) {
    const res = await apiClient.post('/radar/join-request', {
      targetUserId,
      message,
      senderSeatNote,
    });
    return res.data;
  },

  async getJoinRequests() {
    const res = await apiClient.get<any>('/radar/join-requests');
    if (res.data && Array.isArray(res.data.inbox)) {
      return res.data.inbox as JoinRequest[];
    }
    if (Array.isArray(res.data)) {
      return res.data as JoinRequest[];
    }
    return [] as JoinRequest[];
  },

  async getBadgeCount(): Promise<{ pendingCount: number }> {
    const res = await apiClient.get<{ pendingCount: number }>('/radar/join-requests/badge');
    return res.data;
  },

  async respondJoinRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    const res = await apiClient.patch(`/radar/join-requests/${requestId}/respond`, { status });
    return res.data;
  },
};
