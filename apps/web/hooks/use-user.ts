import { userService } from "@/lib/services/user-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUserStore } from "@/lib/store/user-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./use-toast";

export function useUser() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { setServiceConnections, setPlaylists, setSummary, summary, setHasHydrated, _hasHydrated, playlists, serviceConnections, clearUser, setUser } = useUserStore();
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

  const getServiceConnections = async () => {
    if (!token) {
      toast({ variant: "destructive", title: "Não autenticado" });
      router.push("/")
      return null;
    }

    setIsLoading(true)
    try {
      const data = await userService.getServiceConnections(token);
      setServiceConnections(data)

    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ variant: "destructive", title: "Erro", description: message });
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { getSummary, getPlaylists, getServiceConnections, isLoading, _hasHydrated, summary, playlists, serviceConnections, setHasHydrated, setServiceConnections, setPlaylists, setUser, setSummary, clearUser };
}