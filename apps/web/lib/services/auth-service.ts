import type { AuthResponse, LoginInput, RegisterInput } from '@harmonia/shared';
import { fetchApi } from './api';

export const authService = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (token: string): Promise<AuthResponse['user']> => {
    return fetchApi<AuthResponse['user']>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};