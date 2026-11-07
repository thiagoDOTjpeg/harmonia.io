import { queryKeys } from "@/hooks/queries/query-keys";
import { toast } from "@harmonia/ui/hooks/use-toast";
import { ApiError } from "@/lib/services/api";
import { userService } from "@/lib/services/user-service";
import { MatchTrackRequestDTO } from "@harmonia/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface MatchTrackVariables {
  playlistId: string;
  trackId: string;
  data: MatchTrackRequestDTO;
}

export function useMatchTrackMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ playlistId, trackId, data }: MatchTrackVariables) =>
      userService.matchTrack(playlistId, trackId, data),
    onSuccess: (response) => {
      toast({
        title: response.syncedToSpotify
          ? "Música vinculada e sincronizada!"
          : "Música vinculada no banco de dados!",
        description: response.syncedToSpotify
          ? "A faixa foi adicionada à playlist do Spotify e salva para próximos syncs."
          : "O vínculo foi salvo e será usado automaticamente na próxima sincronização.",
      });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) {
        toast({ variant: "destructive", title: "Não autenticado" });
        router.push("/login");
        return;
      }
      const message =
        err instanceof Error ? err.message : "Erro ao vincular música";
      toast({
        variant: "destructive",
        title: "Erro ao salvar match",
        description: message,
      });
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.playlistDetails(variables.playlistId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.playlists() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.summary() }),
      ]);
    },
  });
}

