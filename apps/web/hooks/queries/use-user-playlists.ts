import { userService } from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface UseUserPlaylistsOptions {
  enabled?: boolean;
}

export function useUserPlaylists(options?: UseUserPlaylistsOptions) {
  return useQuery({
    queryKey: queryKeys.user.playlists(),
    queryFn: () => userService.getPlaylists(),
    enabled: options?.enabled ?? true,
  });
}
