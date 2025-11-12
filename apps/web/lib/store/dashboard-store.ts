import { UserSummary } from "@harmonia/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardState {
  summary: UserSummary | null;
  _hasHydrated: boolean;
  setSummary: (summary: UserSummary) => void;
  clearDashboard: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      summary: null,
      _hasHydrated: false,

      setSummary: (summary: UserSummary) => {
        set({ summary });
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
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)