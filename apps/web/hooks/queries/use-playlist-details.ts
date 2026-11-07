import { userService } from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface UsePlaylistDetailsOptions {
  enabled?: boolean;
}

export function usePlaylistDetails(
  playlistId: string,
  options?: UsePlaylistDetailsOptions
) {
  return useQuery({
    queryKey: queryKeys.user.playlistDetails(playlistId),
    queryFn: () => userService.getPlaylistDetails(playlistId),
    enabled: Boolean(playlistId) && (options?.enabled ?? true),
  });
}

