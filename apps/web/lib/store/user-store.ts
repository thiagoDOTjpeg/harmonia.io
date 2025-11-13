import { AuthSuccess } from '@harmonia/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: AuthSuccess["user"] | null;
  _hasHydrated: boolean;
  setUser: (user: AuthSuccess["user"]) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      summary: null,

      setUser: (user: AuthSuccess["user"]) => {
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