import api from './axios';
import type { UserDto, LoginResponseDto, SignUpRequest } from '../types';

export const authApi = {
  /**
   * POST /auth/signup
   * Returns UserDto after the shared API client unwraps ApiResponse.
   * Status 201 on success, 400 if email exists
   */
  signup: async (data: SignUpRequest): Promise<UserDto> => {
    const res = await api.post<UserDto>('/auth/signup', data);
    return res.data;
  },

  /**
   * POST /auth/login
   * Returns LoginResponseDto { accessToken } after the shared API client unwraps ApiResponse.
   * Sets HttpOnly refreshToken cookie automatically
   */
  login: async (data: { email: string; password: string }): Promise<LoginResponseDto> => {
    const res = await api.post<LoginResponseDto>('/auth/login', data, {
      withCredentials: true, // needed for the refreshToken cookie
    });
    return res.data;
  },

  /**
   * POST /auth/refresh
   * Sends the refreshToken cookie back to get a new accessToken
   * Returns LoginResponseDto { accessToken } after the shared API client unwraps ApiResponse.
   */
  refresh: async (): Promise<LoginResponseDto> => {
    const res = await api.post<LoginResponseDto>('/auth/refresh', {}, {
      withCredentials: true,
    });
    return res.data;
  },
};
