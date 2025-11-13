import { userService } from "@/lib/services/use-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./use-toast";

export function useDashboard() {
  const router = useRouter();
  const { setSummary, setPlaylists, _hasHydrated, clearDashboard, summary, playlists, setHasHydrated } = useDashboardStore();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const getPlaylists = async () => {
    if (!token) {
      toast({ variant: "destructive", title: "Não autenticado" });
      router.push("/")
      return null;
    }

    setIsLoading(true)
    try {
      const data = await userService.getPlaylists(token);
      setPlaylists(data);

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      toast({ variant: "destructive", title: "Erro", description: message })
      return null
    } finally {
      setIsLoading(false);
    }
  }

  const getSummary = async () => {
    if (!token) {
      toast({ variant: "destructive", title: "Não autenticado" });
      router.push("/")
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

  return { getSummary, getPlaylists, isLoading, _hasHydrated, clearDashboard, summary, playlists, setHasHydrated };
}