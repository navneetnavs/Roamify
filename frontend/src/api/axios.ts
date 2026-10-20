import axios from 'axios';
import { toast } from '../components/ui/toastService';
import { extractErrorMessage } from '../utils/errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Always send cookies (required for refreshToken cookie)
});

// ─── Request interceptor: attach Bearer token ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: auto-refresh on 401 ────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    const body: unknown = response.data;
    if (
      body !== null &&
      typeof body === 'object' &&
      'timeStamp' in body &&
      'data' in body &&
      'error' in body
    ) {
      response.data = body.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying and not a refresh/login/signup request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/signup')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // POST /auth/refresh — sends refreshToken cookie automatically
        const resp = await api.post<{ accessToken: string }>(
          '/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newToken = resp.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      !originalRequest?.url?.includes('/auth/login') &&
      !originalRequest?.url?.includes('/auth/signup')
    ) {
      toast.error(extractErrorMessage(error));
    }
    return Promise.reject(error);
  }
);

export default api;
