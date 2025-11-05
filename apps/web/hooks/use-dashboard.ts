import { userService } from "@/lib/services/use-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { UserDashboardData } from "@/lib/types/user";
import { useState } from "react";
import { toast } from "./use-toast";

export function useDashboard() {
  const { token } = useAuthStore();
  const { setDashboardData } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);

  const dashboard = async (): Promise<UserDashboardData | null> => {
    if (!token) {
      toast({ variant: "destructive", title: "Não autenticado" });
      return null;
    }

    setIsLoading(true);
    try {
      const data = await userService.getDashboardSummary(token);
      setDashboardData(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ variant: "destructive", title: "Erro", description: message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { dashboard, isLoading };
}