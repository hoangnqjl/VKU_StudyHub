export interface StudyBuddyCheckIn {
  id: string;
  userId: string;
  studentName: string;
  studentId: string;
  avatarUrl?: string;
  locationId: string;
  locationName: string;
  courseCode: string;
  courseName: string;
  studyNote?: string;
  isActive: boolean;
  checkedInAt: string;
}

export interface CheckInDto {
  locationId: string;
  courseCode: string;
  courseName?: string;
  studyNote?: string;
}

export interface JoinTableRequestDto {
  targetUserId: string;
  message?: string;
  senderSeatNote?: string;
}

export interface JoinTableRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderStudentId: string;
  targetUserId: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

