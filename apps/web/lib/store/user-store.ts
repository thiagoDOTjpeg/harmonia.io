import { AuthResponse, ServiceConnectionDTO, UserPlaylistDTO, UserSummaryDTO } from '@harmonia/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: AuthResponse["user"] | null;
  serviceConnections: ServiceConnectionDTO[] | null,
  summary: UserSummaryDTO | null;
  playlists: UserPlaylistDTO[] | null;
  _hasHydrated: boolean;
  setUser: (user: AuthResponse["user"]) => void;
  setServiceConnections: (serviceConnections: ServiceConnectionDTO[] | null) => void;
  setSummary: (summary: UserSummaryDTO | null) => void;
  setPlaylists: (playlists: UserPlaylistDTO[] | null) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      serviceConnections: null,
      summary: null,
      playlists: null,
      _hasHydrated: false,

      setUser: (user: AuthResponse["user"]) => {
        set({ user });
      },

      setServiceConnections: (serviceConnections: ServiceConnectionDTO[] | null) => {
        set({ serviceConnections })
      },

      setSummary: (summary: UserSummaryDTO | null) => {
        set({ summary });
      },

      setPlaylists: (playlists: UserPlaylistDTO[] | null) => {
        set({ playlists })
      },

      clearUser: () => {
        set({ user: null, serviceConnections: null, summary: null, playlists: null });
      },

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        serviceConnections: state.serviceConnections,
        summary: state.summary,
        playlists: state.playlists,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);