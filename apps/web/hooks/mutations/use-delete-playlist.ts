import { queryKeys } from "@/hooks/queries/query-keys";
import { toast } from "@harmonia/ui/hooks/use-toast";
import { ApiError } from "@/lib/services/api";
import { userService } from "@/lib/services/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeletePlaylistMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (playlistId: string) => userService.deletePlaylist(playlistId),
    onSuccess: () => {
      toast({
        title: "Playlist removida",
        description: "O vínculo de sincronização foi excluído com sucesso.",
      });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) {
        toast({ variant: "destructive", title: "Não autenticado" });
        router.push("/login");
        return;
      }
      const message =
        err instanceof Error ? err.message : "Erro ao excluir playlist";
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

