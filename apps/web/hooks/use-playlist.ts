import { syncService } from "@/lib/services/sync-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboard } from "./use-dashboard";
import { toast } from "./use-toast";

export function usePlaylist() {
  const router = useRouter()
  const { clearDashboard } = useDashboard();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const postSyncPlaylist = async (data: { youtubePlaylistId: string }) => {
    if (!token) {
      toast({ variant: "destructive", title: "Não autenticado" });
      router.push("/");
      return null
    }

    setIsLoading(true)
    try {
      await syncService.postSyncPlaylists(token, data);

      toast({ title: "Playlist adicionada para sincronizazção", description: "Ela estará disponível em breve" })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido"
      toast({ variant: "destructive", title: "Erro", description: message })
      return null
    } finally {
      clearDashboard();
      setIsLoading(false);
    }
  }

  return { isLoading, postSyncPlaylist }
}