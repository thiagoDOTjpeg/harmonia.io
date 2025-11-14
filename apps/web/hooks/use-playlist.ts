import { syncService } from "@/lib/services/sync-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "./use-toast";
import { useUser } from "./use-user";

export function usePlaylist() {
  const router = useRouter()
  const { setPlaylists, setSummary } = useUser();
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
      setPlaylists(null);
      setSummary(null);
      setIsLoading(false);
    }
  }

  return { isLoading, postSyncPlaylist }
}