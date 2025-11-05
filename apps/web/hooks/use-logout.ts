import { useAuthStore } from "@/lib/store/auth-store";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useUserStore } from "@/lib/store/user-store";
import { useRouter } from "next/navigation";

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const { clearUser } = useUserStore();
  const { clearDashboardData } = useDashboardStore();
  const router = useRouter();

  const logout = () => {
    clearAuth();
    clearUser();
    clearDashboardData();
    router.push("/login");
  };

  return { logout };
}