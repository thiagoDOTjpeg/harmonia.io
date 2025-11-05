import { AuthResponse } from '@/lib/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: AuthResponse['user'] | null;
  _hasHydrated: boolean;
  setUser: (user: AuthResponse['user']) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setUser: (user: AuthResponse['user']) => {
        set({ user });
      },

      clearUser: () => {
        set({ user: null });
      },

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);