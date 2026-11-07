import { userService } from "@/lib/services/user-service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface UseUserSummaryOptions {
  enabled?: boolean;
}

export function useUserSummary(options?: UseUserSummaryOptions) {
  return useQuery({
    queryKey: queryKeys.user.summary(),
    queryFn: () => userService.getSummary(),
    enabled: options?.enabled ?? true,
  });
}
