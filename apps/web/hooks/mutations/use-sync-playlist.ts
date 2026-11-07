import { queryKeys } from "@/hooks/queries/query-keys";
import { toast } from "@harmonia/ui/hooks/use-toast";
import { ApiError } from "@/lib/services/api";
import { syncService } from "@/lib/services/sync-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useSyncPlaylistMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { youtubePlaylistId: string }) =>
      syncService.postSyncPlaylists(data),
    onSuccess: () => {
      toast({
        title: "Playlist adicionada para sincronização",
        description: "Ela estará disponível em breve",
      });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) {
        toast({ variant: "destructive", title: "Não autenticado" });
        router.push("/login");
        return;
      }
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ variant: "destructive", title: "Erro", description: message });
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.user.playlists() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.summary() }),
      ]);
    },
  });
}
