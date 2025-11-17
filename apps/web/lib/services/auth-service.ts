import type { AuthResponse, LoginInput, RegisterInput, RequestResetPasswordInput, ResetPasswordInput } from '@harmonia/shared';
import { fetchApi } from './api';

export const authService = {
  requestResetPassword: async (data: RequestResetPasswordInput) => {
    return fetchApi<void>("/auth/request-reset", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  resetPassword: async (data: ResetPasswordInput) => {
    return fetchApi<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

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