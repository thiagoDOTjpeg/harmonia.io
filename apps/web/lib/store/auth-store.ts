import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '../types/auth';

interface AuthState {
  // State
  user: AuthResponse['user'] | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setAuth: (data) =>
        set({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          error: null,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);