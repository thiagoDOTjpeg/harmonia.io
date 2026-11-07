import { userService } from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface UseTrackCandidatesOptions {
  enabled?: boolean;
}

export function useTrackCandidates(
  playlistId: string,
  trackId: string,
  query?: string,
  options?: UseTrackCandidatesOptions
) {
  return useQuery({
    queryKey: queryKeys.user.trackCandidates(playlistId, trackId, query),
    queryFn: () => userService.getTrackCandidates(playlistId, trackId, query),
    enabled:
      Boolean(playlistId) && Boolean(trackId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}

