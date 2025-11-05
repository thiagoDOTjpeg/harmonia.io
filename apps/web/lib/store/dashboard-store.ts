import { UserDashboardData } from '@/lib/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardState {
  dashboardData: UserDashboardData | null;
  _hasHydrated: boolean;
  setDashboardData: (data: UserDashboardData) => void;
  clearDashboardData: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      dashboardData: null,
      _hasHydrated: false,

      setDashboardData: (data: UserDashboardData) => {
        set({ dashboardData: data });
      },

      clearDashboardData: () => {
        set({ dashboardData: null });
      },

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        dashboardData: state.dashboardData,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);