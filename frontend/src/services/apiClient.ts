import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // If accessed from other devices or localhost
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const getSocketUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();
export const SOCKET_URL = getSocketUrl();

const TOKEN_KEY = '@vku_studyhub_token';
const USER_KEY = '@vku_studyhub_user';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class ApiClient {
  private token: string | null = null;

  async getToken(): Promise<string | null> {
    if (!this.token) {
      try {
        this.token = await AsyncStorage.getItem(TOKEN_KEY);
      } catch {
        // fallback
      }
    }
    return this.token;
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn('AsyncStorage setToken failed', e);
    }
  }

  async clearToken(): Promise<void> {
    this.token = null;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('AsyncStorage clearToken failed', e);
    }
  }

  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('AsyncStorage saveUser failed', e);
    }
  }

  async getSavedUser(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async getUser(): Promise<any | null> {
    return this.getSavedUser();
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, headers: customHeaders, ...restOptions } = options;
    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }

    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((customHeaders as Record<string, string>) || {}),
    };

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = json?.message || `Lỗi máy chủ (${response.status})`;
        throw new Error(errorMsg);
      }

      return json as ApiResponse<T>;
    } catch (error: any) {
      let friendlyMessage = error.message;
      if (
        error.message?.includes('NetworkError') ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Network request failed')
      ) {
        friendlyMessage =
          'Không thể kết nối đến máy chủ Backend VKU StudyHub. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo máy chủ đang chạy.';
      }
      console.warn(`[API] ${options.method || 'GET'} ${endpoint} failed:`, friendlyMessage);
      throw new Error(friendlyMessage);
    }
  }

  get<T = any>(endpoint: string, params?: Record<string, any>) {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
