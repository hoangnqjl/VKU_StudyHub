const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  // Authentication
  login: async (studentId: string, email?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, email })
    });
    return res.json();
  },

  // Study Radar
  getActiveBuddies: async (courseCode?: string) => {
    const query = courseCode ? `?courseCode=${encodeURIComponent(courseCode)}` : '';
    const res = await fetch(`${API_BASE_URL}/radar/buddies${query}`);
    return res.json();
  },

  checkInRadar: async (data: {
    userId: string;
    studentId: string;
    fullName: string;
    courseCode: string;
    courseName: string;
    location: string;
    note?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/radar/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Documents
  getDocuments: async (courseCode?: string) => {
    const query = courseCode ? `?courseCode=${encodeURIComponent(courseCode)}` : '';
    const res = await fetch(`${API_BASE_URL}/documents${query}`);
    return res.json();
  },

  fetchDocByQR: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/documents/qr/${encodeURIComponent(token)}`);
    return res.json();
  },

  // Pomodoro
  getPomodoroRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/pomodoro/rooms`);
    return res.json();
  }
};
