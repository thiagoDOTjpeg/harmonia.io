import { userService } from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface UseServiceConnectionsOptions {
  enabled?: boolean;
}

export function useServiceConnections(options?: UseServiceConnectionsOptions) {
  return useQuery({
    queryKey: queryKeys.user.connections(),
    queryFn: () => userService.getServiceConnections(),
    enabled: options?.enabled ?? true,
  });
}
