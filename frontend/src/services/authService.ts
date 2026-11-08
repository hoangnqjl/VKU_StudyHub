import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

export interface User {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  class?: string;
  avatarUrl?: string;
  major?: string;
  academicYear?: string;
  faculty?: string;
  studyGoals?: string;
  enrolledCourses?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(studentIdOrEmail: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', {
      studentIdOrEmail,
      password,
    });
    if (res.data?.token) {
      await apiClient.setToken(res.data.token);
      await apiClient.saveUser(res.data.user);
    }
    return res.data;
  },

  async loginWithGoogle(data: {
    email: string;
    idToken?: string;
    fullName?: string;
    avatarUrl?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/google', data);
    if (res.data?.token) {
      await apiClient.setToken(res.data.token);
      await apiClient.saveUser(res.data.user);
      if (res.data.user?.avatarUrl) {
        await AsyncStorage.setItem('@vku_user_avatar', res.data.user.avatarUrl).catch(() => {});
      }
      await AsyncStorage.setItem('@vku_google_linked', 'true').catch(() => {});
    }
    return res.data;
  },

  
  async getCohorts(): Promise<any[]> {
    try {
      const res = await apiClient.get<any[]>('/auth/cohorts');
      return res.data || [];
    } catch {
      return [];
    }
  },
  async register(data: {
    studentId: string;
    fullName: string;
    email: string;
    password: string;
    class?: string;
    major?: string;
    academicYear?: string;
    faculty?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.data?.token) {
      await apiClient.setToken(res.data.token);
      await apiClient.saveUser(res.data.user);
    }
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    if (res.data) {
      await apiClient.saveUser(res.data);
      if (res.data.avatarUrl) {
        await AsyncStorage.setItem('@vku_user_avatar', res.data.avatarUrl).catch(() => {});
      }
    }
    return res.data;
  },

  async getHomeDashboard() {
    const res = await apiClient.get('/home');
    return res.data;
  },

  async updateProfile(data: Partial<User>) {
    const res = await apiClient.put<User>('/auth/profile', data);
    if (res.data) {
      await apiClient.saveUser(res.data);
      if (res.data.avatarUrl) {
        await AsyncStorage.setItem('@vku_user_avatar', res.data.avatarUrl).catch(() => {});
      }
    }
    return res.data;
  },

  async uploadAvatar(imageData: string): Promise<{ avatarUrl: string; user?: User; isCloudinary?: boolean }> {
    try {
      const res = await apiClient.post<any>('/auth/avatar', {
        image: imageData,
      });
      if (res.data?.avatarUrl) {
        await AsyncStorage.setItem('@vku_user_avatar', res.data.avatarUrl).catch(() => {});
        const cached = await apiClient.getUser();
        if (cached) {
          cached.avatarUrl = res.data.avatarUrl;
          await apiClient.saveUser(cached);
        }
      }
      return res.data;
    } catch {
      await AsyncStorage.setItem('@vku_user_avatar', imageData).catch(() => {});
      return {
        avatarUrl: imageData,
        isCloudinary: false,
      };
    }
  },

  async getGoogleLinkStatus(): Promise<{ isLinked: boolean; googleEmail?: string }> {
    try {
      const res = await apiClient.get<any>('/auth/google/status');
      if (res.data?.isLinked) {
        await AsyncStorage.setItem('@vku_google_linked', 'true').catch(() => {});
      } else {
        await AsyncStorage.removeItem('@vku_google_linked').catch(() => {});
      }
      return res.data;
    } catch {
      const cached = await AsyncStorage.getItem('@vku_google_linked');
      return { isLinked: cached === 'true' };
    }
  },

  async linkGoogle(googleEmail: string): Promise<{ success: boolean; isLinked: boolean; googleEmail: string; message?: string }> {
    const res = await apiClient.post<any>('/auth/google/link', { email: googleEmail });
    if (res.data?.isLinked) {
      await AsyncStorage.setItem('@vku_google_linked', 'true').catch(() => {});
    }
    return res.data;
  },

  async unlinkGoogle(): Promise<{ success: boolean; isLinked: boolean; message?: string }> {
    const res = await apiClient.post<any>('/auth/google/unlink');
    await AsyncStorage.removeItem('@vku_google_linked').catch(() => {});
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.clearToken();
  },
};
