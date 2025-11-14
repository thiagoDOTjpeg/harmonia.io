import { AuthSuccess, ServiceConnection, UserPlaylist, UserSummary } from '@harmonia/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: AuthSuccess["user"] | null;
  serviceConnections: ServiceConnection[] | null,
  summary: UserSummary | null;
  playlists: UserPlaylist[] | null;
  _hasHydrated: boolean;
  setUser: (user: AuthSuccess["user"]) => void;
  setServiceConnections: (serviceConnections: ServiceConnection[] | null) => void;
  setSummary: (summary: UserSummary | null) => void;
  setPlaylists: (playlists: UserPlaylist[] | null) => void;
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

      setUser: (user: AuthSuccess["user"]) => {
        set({ user });
      },

      setServiceConnections: (serviceConnections: ServiceConnection[] | null) => {
        set({ serviceConnections })
      },

      setSummary: (summary: UserSummary | null) => {
        set({ summary });
      },

      setPlaylists: (playlists: UserPlaylist[] | null) => {
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