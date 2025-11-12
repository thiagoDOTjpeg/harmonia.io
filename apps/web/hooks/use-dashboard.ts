import { userService } from "@/lib/services/use-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./use-toast";

export function useDashboard() {
  const router = useRouter();
  const { setSummary } = useDashboardStore();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const dashboard = async () => {
    if (!token) {
      toast({ variant: "destructive", title: "Não autenticado" });
      return null;
    }

    setIsLoading(true);
    try {
      const data = await userService.getSummary(token);
      setSummary(data)

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