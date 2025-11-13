import { UserPlaylist, UserSummary } from "@harmonia/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardState {
  summary: UserSummary | null;
  playlists: UserPlaylist[] | null;
  _hasHydrated: boolean;
  setSummary: (summary: UserSummary) => void;
  setPlaylists: (playlists: UserPlaylist[]) => void;
  clearDashboard: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      summary: null,
      playlists: null,
      _hasHydrated: false,

      setSummary: (summary: UserSummary) => {
        set({ summary });
      },

      setPlaylists: (playlists: UserPlaylist[]) => {
        set({ playlists })
      },

      clearDashboard: () => {
        set({ summary: null });
      },

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({
        summary: state.summary,
        playlists: state.playlists,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)