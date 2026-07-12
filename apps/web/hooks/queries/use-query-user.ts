import { userService } from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";

function useQueryUser(token: string) {
  return {
    userPlaylist: () => {
      return useQuery({
        queryKey: ["user", "playlist", token],
        queryFn: async () => userService.getPlaylists(token),
        enabled: !!token
      })
    },
    userSummary: () => {
      return useQuery({
        queryKey: ["user", "summary", token],
        queryFn: async () => userService.getSummary(token),
        enabled: !!token
      })
    }
  }
}

export default useQueryUser;