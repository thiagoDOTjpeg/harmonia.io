import { authService } from "@/lib/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface UseCurrentUserOptions {
  enabled?: boolean;
}

export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getMe(),
    enabled: options?.enabled ?? true,
    retry: false,
  });
}

