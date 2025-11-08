import { AuthSuccess, UserSummary } from '@harmonia/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: AuthSuccess["user"] | null;
  summary: UserSummary | null;
  _hasHydrated: boolean;
  setUser: (user: AuthSuccess["user"]) => void;
  setSummary: (summary: UserSummary) => void;
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

      setSummary: (summary: UserSummary) => {
        set({ summary })
      },

      clearUser: () => {
        set({ user: null, summary: null });
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