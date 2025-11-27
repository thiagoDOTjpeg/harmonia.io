import type { AuthResponse, LoginDTO, RegisterDTO, RequestAccessDTO, RequestResetPasswordDTO, ResetPasswordDTO, SetPasswordDTO } from '@harmonia/shared';
import { fetchApi } from './api';

export const authService = {
  requestAccess: async (data: RequestAccessDTO) => {
    return fetchApi<void>("/auth/request-access", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  setPassword: async (data: SetPasswordDTO, token: string) => {
    return fetchApi<void>("/auth/set-password", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  },

  requestResetPassword: async (data: RequestResetPasswordDTO) => {
    return fetchApi<void>("/auth/request-reset", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  resetPassword: async (data: ResetPasswordDTO) => {
    return fetchApi<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
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